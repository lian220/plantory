(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PlantoryCommerceModel = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  function money(value) { return typeof value === 'number' && Number.isFinite(value) && value >= 0; }
  function quantityOf(value) {
    if (!Number.isInteger(value) || value < 1 || value > 99) throw new RangeError('수량은 1~99 사이의 정수여야 합니다.');
    return value;
  }
  function offerTotal(offer, quantity = 1) {
    quantityOf(quantity);
    const unknownCosts = [];
    if (!money(offer.price)) unknownCosts.push('상품 가격 미확인');
    if (!money(offer.optionCost)) unknownCosts.push('필수옵션 비용 미확인');
    const shipping = offer.method === 'pickup' ? 0 : money(offer.shipping) ? offer.shipping : null;
    if (shipping === null) unknownCosts.push('배송비 미확인');
    if (offer.availability && offer.availability !== 'available') unknownCosts.push('구매 가능 여부 미확인');
    const itemSubtotal = ((money(offer.price) ? offer.price : 0) + (money(offer.optionCost) ? offer.optionCost : 0)) * quantity;
    const knownTotal = itemSubtotal + (shipping || 0);
    return { quantity, itemSubtotal, shipping, knownTotal, total: unknownCosts.length ? null : knownTotal, unknownCosts };
  }
  function comparison(offers) {
    if (offers.length < 2) return { mode: 'insufficient', canRank: false };
    if (offers.every(offer => offer.kind === 'plant')) return { mode: 'plant-conditions', canRank: false };
    const sameSpec = offers.every(offer => offer.kind === 'material' && offer.specKey && offer.specKey === offers[0].specKey && offer.conditionGroup === offers[0].conditionGroup);
    return { mode: sameSpec ? 'same-spec' : 'different-conditions', canRank: sameSpec && offers.every(offer => offerTotal(offer).total !== null) };
  }
  function budgetTotal(rows) {
    const lines = [], groups = new Map(), unknownCosts = [];
    let itemSubtotal = 0, excludedOwned = 0;
    rows.forEach(row => {
      if (row.owned) { excludedOwned += 1; return; }
      if (row.optional && !row.included) return;
      const offer = row.offer;
      const cost = offerTotal(offer, row.quantity);
      lines.push({ id: row.id, offerId: offer.id, quantity: row.quantity, itemSubtotal: cost.itemSubtotal });
      itemSubtotal += cost.itemSubtotal;
      cost.unknownCosts.filter(label => !label.includes('배송')).forEach(label => unknownCosts.push(offer.name + ': ' + label));
      // These samples explicitly use a single flat shipment per seller and delivery method.
      const key = (offer.sellerId || offer.id) + '|' + offer.method;
      if (!groups.has(key)) groups.set(key, { key, seller: offer.seller, method: offer.method, shipping: 0, unknown: false });
      const group = groups.get(key);
      if (cost.shipping === null) group.unknown = true;
      else group.shipping = Math.max(group.shipping, cost.shipping);
    });
    let shippingTotal = 0;
    const shippingGroups = Array.from(groups.values()).map(group => {
      if (group.unknown) { unknownCosts.push(group.seller + ': 배송비 미확인'); return { ...group, shipping: null }; }
      shippingTotal += group.shipping;
      return { ...group };
    });
    const knownTotal = itemSubtotal + shippingTotal;
    return { lines, itemSubtotal, shippingTotal, shippingGroups, knownTotal, total: unknownCosts.length ? null : knownTotal, unknownCosts, excludedOwned };
  }
  const shared = { type: 'soil', availability: 'available', optionCost: 0, sourceLabel: '체험용 가상 매물', checkedAt: '2026-09-30 고정 예시', priceNote: '할인 조건 없는 가상 판매 호가' };
  const offers = [
    { ...shared, id: 'plant-shop', kind: 'plant', market: 'new', name: '몬스테라 작은 화분', price: 18000, shipping: 3000, optionCost: 1000, optionLabel: '필수 포장', sellerId: 'green', seller: '가상 초록상점', method: 'delivery', region: '택배 · 도서산간 추가비 미포함', size: '식물 높이 약 30cm · 속화분 12cm', condition: '발근 완료 · 잎 4장 · 새잎 유무 미확인', rooting: '발근 완료', photoType: '대표 사진', components: '식물 + 속화분 · 받침 없음', availability: 'available', unit: '1개체', question: '사진이 실제 보내는 개체인가요? 잎 상태와 화분 포함 범위를 확인하고 싶어요.' },
    { ...shared, id: 'plant-neighbor', kind: 'plant', market: 'sharing', name: '몬스테라 개인 분양', price: 11000, shipping: null, sellerId: 'neighbor', seller: '가상 이웃 봄', method: 'delivery', region: '택배 가능 여부·배송비 확인 필요', size: '식물 높이 약 25cm · 속화분 10cm', condition: '발근 완료 · 잎 3장 · 한 잎에 흠집', rooting: '발근 완료', photoType: '판매 개체 사진', components: '식물 + 속화분 · 장식 화분 없음', unit: '1개체', question: '최근 실제 개체 사진과 흠집 확대 사진, 배송비와 포장 방법을 알려주실 수 있나요?' },
    { ...shared, id: 'plant-cutting', kind: 'plant', market: 'sharing', name: '스킨답서스 삽수', price: 2500, shipping: 0, sellerId: 'cutting', seller: '가상 동네 초록', method: 'pickup', region: '서울 성북구 · 수령 장소 협의', size: '삽수 길이 약 12cm', condition: '미발근 · 화분 없음', rooting: '미발근', photoType: '모주 사진', components: '삽수 1개 · 화분과 흙 없음', availability: 'soldout', unit: '1개', question: '모주가 아닌 받을 삽수 사진과 발근 상태를 확인할 수 있나요?' },
    { ...shared, id: 'soil-green', kind: 'material', market: 'new', name: '샘플 배양토 1L', price: 2500, shipping: 3000, sellerId: 'green', seller: '가상 초록상점', method: 'delivery', region: '택배 · 묶음배송 예시', size: '1L · 최소 주문 1봉', condition: '새 상품 · 미개봉', conditionGroup: 'new', photoType: '대표 사진', components: '배양토 1L × 1봉', unit: '1L/봉', specKey: 'sample-soil-1L-unopened', question: '같은 제품·용량이 맞나요? 필수옵션과 최종 배송비가 더 있나요?' },
    { ...shared, id: 'soil-workshop', kind: 'material', market: 'new', name: '샘플 배양토 1L', price: 2200, shipping: 3500, sellerId: 'workshop', seller: '가상 작은공방', method: 'delivery', region: '택배 · 묶음배송 예시', size: '1L · 최소 주문 1봉', condition: '새 상품 · 미개봉', conditionGroup: 'new', photoType: '대표 사진', components: '배양토 1L × 1봉', unit: '1L/봉', specKey: 'sample-soil-1L-unopened', question: '표시 가격으로 1봉 구매 가능한가요? 배송비를 포함한 결제 금액을 확인하고 싶어요.' },
    { ...shared, id: 'perlite-green', kind: 'material', market: 'new', name: '펄라이트 소포장 0.5L', price: 1500, shipping: 3000, sellerId: 'green', seller: '가상 초록상점', method: 'delivery', region: '택배 · 묶음배송 예시', size: '0.5L · 최소 주문 1봉', condition: '새 상품 · 미개봉', conditionGroup: 'new', photoType: '대표 사진', components: '펄라이트 0.5L × 1봉', unit: '0.5L/봉', specKey: 'sample-perlite-0.5L', question: '입자 크기와 총 용량이 어떻게 되나요? 다른 자재와 배송비를 합칠 수 있나요?' },
    { ...shared, id: 'pot-used', kind: 'material', market: 'used', name: '토분 12cm · 중고', price: 3000, shipping: 0, sellerId: 'pot-neighbor', seller: '가상 이웃 잎', method: 'pickup', region: '서울 마포구 · 직거래만', size: '윗지름 12cm · 높이 11cm', condition: '사용 흔적·백화 있음 · 금 간 곳 미확인', conditionGroup: 'used', photoType: '판매 물품 사진', components: '토분 1개 · 받침 없음', unit: '1개', specKey: 'sample-pot-12cm-used', question: '깨짐·금·배수구 상태와 세척 여부를 확인할 수 있나요? 수령 장소와 시간을 알려주세요.' },
    { ...shared, id: 'jar-workshop', kind: 'material', market: 'new', name: '테라리움 유리 용기 1L', price: 7000, shipping: 3500, sellerId: 'workshop', seller: '가상 작은공방', method: 'delivery', region: '택배 · 묶음배송 예시', size: '1L · 입구 지름 9cm', condition: '새 상품 · 뚜껑 포함', conditionGroup: 'new', photoType: '대표 사진', components: '유리 용기 + 뚜껑 · 식물과 자재 없음', unit: '1개', specKey: 'sample-jar-1L', question: '입구 안쪽 지름과 포함 구성품, 파손 시 확인 절차는 어떻게 되나요?' }
  ];
  offers.push(
    { ...shared, id: 'material-small-unopened', kind: 'material', market: 'personal', name: '배양토 소포장 1L · 개인 판매', price: 1000, shipping: 2500, sellerId: 'small-owner', seller: '가상 이웃 새싹', method: 'delivery', region: '택배 · 최소 수량 1봉', size: '1L 소포장 1봉', condition: '원포장 미개봉 · 유통·보관 상태 확인 필요', conditionGroup: 'personal-unopened', photoType: '판매 물품 사진', components: '미개봉 배양토 1L × 1봉', remaining: '표시 용량 1L · 실제 잔량 확인 필요', opened: '미개봉이라고 표시한 예시', storage: '실내 보관 · 기간·습도 미확인', unit: '1L/봉', specKey: 'personal-soil-1L', question: '밀봉 상태와 제조·구입 시점, 보관 기간을 확인할 수 있나요? 배송비 외 추가 비용이 있나요?' },
    { ...shared, id: 'material-soil-remainder', kind: 'material', market: 'personal', name: '분갈이 후 남은 흙 · 개인 판매', price: 1500, shipping: 0, sellerId: 'soil-owner', seller: '가상 이웃 화분', method: 'pickup', region: '서울 은평구 · 직거래만 / 일정 협의', size: '남은 양 약 2L · 재측정 필요', condition: '개봉 잔량 · 오염·습기 상태 미확인', conditionGroup: 'opened', photoType: '현재 잔량 사진', components: '남은 흙과 보관 봉투 · 원포장 없음', remaining: '약 2L라고 표시 · 실측 아님', opened: '개봉 후 남은 자재', storage: '베란다 보관 4개월 · 밀봉 여부 미확인', unit: '약 2L/묶음', specKey: 'opened-soil-remainder', question: '어떤 흙이고 개봉 후 어떻게 보관했나요? 곰팡이·벌레·젖은 흔적과 실제 잔량을 확인할 수 있나요? 사용 가능 여부는 추가 확인이 필요해요.' },
    { ...shared, id: 'material-free-perlite', kind: 'material', market: 'free', name: '남은 펄라이트 · 무료 나눔', price: 0, shipping: null, sellerId: 'free-owner', seller: '가상 이웃 초록손', method: 'delivery', region: '발송 가능 여부·배송비 협의 필요', size: '잔량 약 0.5L · 재측정 필요', condition: '개봉 잔량 · 세척·오염 상태 미확인', conditionGroup: 'opened', photoType: '현재 잔량 사진', components: '남은 펄라이트 · 용기 제외', remaining: '약 0.5L라고 표시 · 실측 아님', opened: '개봉 후 남은 자재', storage: '실내 보관 · 개봉 시점·밀봉 여부 미확인', unit: '약 0.5L/묶음', specKey: 'free-perlite-remainder', question: '실제 잔량과 보관 상태, 포장 방법을 확인할 수 있나요? 무료 나눔이라도 발송비와 수령 조건을 알려주세요.' },
    { ...shared, id: 'plant-outlet', kind: 'plant', market: 'outlet', name: '몬스테라 · 상태 공개 예시', price: 8500, shipping: 3000, sellerId: 'outlet-example', seller: '가상 상태공개 상점', method: 'delivery', region: '택배 · 추가 관리 지원은 미확인', size: '식물 높이 약 28cm · 속화분 12cm', condition: '잎 찢어짐·처짐 표시 · 회복 필요 여부·원인 미확인', rooting: '뿌리 상태 미확인', photoType: '현재 판매 개체 사진 · 가상 표시', components: '식물 + 속화분 · 추가 상담·보증 미확인', unit: '1개체', question: '최근 전체·잎·뿌리 사진과 달라진 시점을 볼 수 있나요? 확인된 손상과 모르는 상태, 추가 관리·지원 조건을 구분해 알려주세요.' }
  );
  return { offerTotal, comparison, budgetTotal, offers };
});
