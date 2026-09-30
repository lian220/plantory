const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const modelPath = path.join(__dirname, '../assets/prototype-commerce-model.js');
const model = fs.existsSync(modelPath) ? require(modelPath) : {};
const base = { id: 'soil-a', kind: 'material', name: '배양토 1L', specKey: 'soil-example-1L-new', conditionGroup: 'new', price: 2500, optionCost: 500, shipping: 3000, sellerId: 'shop-a', seller: '가상 상점 A', method: 'delivery', availability: 'available' };

// Removing any unknown-cost handling would incorrectly turn the unconfirmed total into a price.
test('배송비 미확인은 알려진 금액만 합산하고 총액을 확정하지 않는다', () => {
  assert.equal(typeof model.offerTotal, 'function');
  const result = model.offerTotal({ ...base, shipping: null }, 2);
  assert.equal(result.knownTotal, 6000);
  assert.equal(result.total, null);
  assert.ok(result.unknownCosts.some(item => item.includes('배송')));
});

test('상품 수량과 필수옵션은 함께 늘고 배송비는 한 번 붙는다', () => {
  const result = model.offerTotal(base, 3);
  assert.equal(result.total, 12000);
  assert.equal(result.itemSubtotal, 9000);
});

test('직거래는 배송비를 붙이지 않고 이동비를 포함하지 않는다', () => {
  const result = model.offerTotal({ ...base, method: 'pickup', shipping: null }, 1);
  assert.equal(result.total, 3000);
  assert.equal(result.shipping, 0);
});

test('같은 이름의 식물은 동일 상품 최저가 대상으로 묶지 않는다', () => {
  assert.equal(typeof model.comparison, 'function');
  const result = model.comparison([{ ...base, kind: 'plant' }, { ...base, id: 'plant-b', kind: 'plant', price: 1000 }]);
  assert.equal(result.mode, 'plant-conditions');
  assert.equal(result.canRank, false);
});

test('동일 규격 자재도 배송비 미확인이나 다른 상태가 있으면 최저가 순위를 만들지 않는다', () => {
  assert.equal(model.comparison([base, { ...base, id: 'b', shipping: null }]).canRank, false);
  assert.equal(model.comparison([base, { ...base, id: 'b', conditionGroup: 'used' }]).canRank, false);
  assert.equal(model.comparison([base, { ...base, id: 'b', price: 2000 }]).canRank, true);
});

test('비교는 두 개 이상이어야 하며 품절 매물은 가격 순위에서 제외한다', () => {
  assert.equal(model.comparison([base]).mode, 'insufficient');
  assert.equal(model.comparison([base, { ...base, id: 'b', availability: 'soldout' }]).canRank, false);
});

test('준비물은 판매처별 배송비를 한 번 계산한다', () => {
  assert.equal(typeof model.budgetTotal, 'function');
  const result = model.budgetTotal([
    { id: 'one', offer: base, quantity: 2 },
    { id: 'two', offer: { ...base, id: 'perlite', price: 1000, optionCost: 0 }, quantity: 1 },
    { id: 'three', offer: { ...base, id: 'pot', sellerId: 'shop-b', price: 4000, optionCost: 0, shipping: 2000 }, quantity: 1 }
  ]);
  assert.equal(result.itemSubtotal, 11000);
  assert.equal(result.shippingTotal, 5000);
  assert.equal(result.total, 16000);
  assert.equal(result.shippingGroups.length, 2);
});

test('보유품과 미선택 선택품은 상품비와 배송비에서 모두 제외한다', () => {
  const result = model.budgetTotal([
    { id: 'owned', offer: base, quantity: 2, owned: true },
    { id: 'optional', offer: { ...base, sellerId: 'shop-b' }, quantity: 1, optional: true, included: false },
    { id: 'needed', offer: { ...base, price: 1000, optionCost: 0 }, quantity: 1 }
  ]);
  assert.equal(result.total, 4000);
  assert.equal(result.excludedOwned, 1);
  assert.equal(result.lines.length, 1);
});

test('같은 판매처의 일부 배송비 또는 필수 준비물 가격이 없으면 예산이 미확정이다', () => {
  const result = model.budgetTotal([
    { id: 'known', offer: base, quantity: 1 },
    { id: 'unknown-shipping', offer: { ...base, id: 'b', shipping: null }, quantity: 1 },
    { id: 'unknown-price', offer: { ...base, id: 'c', sellerId: 'unknown', price: null, optionCost: 0, shipping: null }, quantity: 1 }
  ]);
  assert.equal(result.total, null);
  assert.equal(result.knownTotal, 6000);
  assert.ok(result.unknownCosts.length >= 2);
});

test('수량 0·음수·소수는 계산에 조용히 반영하지 않는다', () => {
  for (const quantity of [0, -1, 1.5, NaN]) assert.throws(() => model.offerTotal(base, quantity), RangeError);
});

test('무료 나눔 예시도 배송비가 미확인이면 0원 완료로 표시하지 않는다', () => {
  const offer = model.offers.find(item => item.id === 'material-free-perlite');
  assert.ok(offer, '무료 나눔 체험 매물이 있어야 한다');
  const result = model.offerTotal(offer);
  assert.equal(offer.price, 0);
  assert.equal(result.knownTotal, 0);
  assert.equal(result.total, null);
  assert.ok(result.unknownCosts.some(item => item.includes('배송')));
});

test('소량 판매·무료 나눔은 예산에 넣을 수 있는 자재이며 상태 공개 식물은 별도 개체다', () => {
  const personal = model.offers.filter(item => ['personal', 'free'].includes(item.market));
  assert.equal(personal.length, 3);
  assert.ok(personal.every(item => item.kind === 'material' && item.remaining && item.opened && item.storage));
  const outlet = model.offers.find(item => item.market === 'outlet');
  assert.ok(outlet && outlet.kind === 'plant');
  assert.equal(model.comparison([outlet, model.offers[0]]).canRank, false);
});
