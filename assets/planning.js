'use strict';
(() => {
  const $ = selector => document.querySelector(selector);
  const $$ = selector => Array.from(document.querySelectorAll(selector));
  const state = { idea: 'care' };
  const ideas = {
    care: { code: 'A', title: '이미 가진 식물을 더 보기 좋게', quote: '“몬스테라가 너무 퍼졌는데, 자르기 전에 어떻게 할지 알고 싶어요.”', facts: [['고객과 계기', '기존 식물의 수형·크기·분갈이 때문에 결정을 미루는 사람.'], ['현재의 대안', '검색·영상·카페 질문·판매자 문의·가게 방문.'], ['제안할 가치', '현재 상태와 원하는 모습을 보고, 방법·준비물·전문가를 연결.'], ['돈이 발생할 수 있는 지점', '건별 상담, 작업 매칭, 화분·지지대·용토 구매 연결.'], ['핵심 운영 부담', '전문가 조율 시간, 사진으로 확인할 수 없는 상태, 작업 결과와 사후 문의.'], ['먼저 검증할 질문', '무료 정보를 본 뒤에도 구체적인 상담이나 작업에 비용을 지불하는가?']], extension: '직접 하기 / 사진 상담 / 가게에 맡기기를 같은 고민에서 선택하게 합니다. 자주 필요한 준비물은 이후 자체 키트 후보가 됩니다.' },
    space: { code: 'B', title: '우리집에 맞는 식물·화분 조합', quote: '“이 선반에 놓을 식물을 사고 싶은데, 크기와 화분을 못 고르겠어요.”', facts: [['고객과 계기', '빈 공간을 꾸미거나 이사·가구 배치 변화·선물을 준비하는 사람.'], ['현재의 대안', '핀터레스트·SNS·쇼핑몰·식물가게의 추천.'], ['제안할 가치', '집 환경·실제 치수·취향·예산을 함께 확인하고 구매 후보를 줄이기.'], ['돈이 발생할 수 있는 지점', '상품 구매 연결, 공간 상담, 제휴 스타일링.'], ['핵심 운영 부담', '상품 규격·재고·배송비 확보, 추천 뒤 외부에서 구매하는 경우, 반품·적합성 문의.'], ['먼저 검증할 질문', '예쁜 결과를 구경하는 데서 끝나는가, 구체적인 구매로 이어지는가?']], extension: '새 물건만 추천하지 않고 보유 식물·빈 화분부터 활용합니다. 이사 후 재배치나 예산별 조합으로 구매 계기를 더 선명하게 만들 수 있습니다.' },
    terrarium: { code: 'C', title: '참고 사진을 실제 작은 정원으로', quote: '“이런 테라리움을 만들고 싶은데, 뭘 사야 할지 모르겠어요.”', facts: [['고객과 계기', '참고 작품을 보고 직접 제작·클래스·완성품 주문을 고민하는 사람.'], ['현재의 대안', '제작 영상, 재료 검색, 공방 수업, 완성품 구매.'], ['제안할 가치', '참고 모습·크기·경험·예산을 실제 제작 방법과 공급처로 연결.'], ['돈이 발생할 수 있는 지점', '재료·키트 구매, 클래스 매칭, 제작 의뢰.'], ['핵심 운영 부담', '레시피 검토, 재료 대체·조달, 생물 상태, 배송 파손, 수업 일정.'], ['먼저 검증할 질문', '고객이 원하는 것은 레시피인가, 수업인가, 완성된 작품인가?']], extension: '초기에는 공방·판매자를 연결하고, 반복 요청으로 확인한 구성부터 자체 키트를 검토합니다. 완성 후 관리와 사진 기록을 이어갈 수 있습니다.' }
  };
  const journeys = {
    care: { type: '매칭 사업 가설', title: '원하는 수형으로 가꾸기', context: '너무 커지거나 퍼진 식물을 손대기 전에 도움을 구합니다.', steps: [['현재 상태', '정면·측면·줄기 사진과 최근 분갈이·손상 여부를 확인합니다.', '고객: 사진과 이력 선택'], ['원하는 변화', '높이·폭·목표 수형을 정하고 해당 식물에서 가능한 방향을 확인합니다.', '서비스: 조건과 미확인 사항 설명'], ['도움 방식', '직접 하기, 사진 상담, 가게·전문가에게 맡기기 중 선택합니다.', '고객: 실행 방식 결정'], ['조건과 실행', '작업 범위·견적·운반 조건을 확인한 뒤 실행합니다.', '제휴처: 가능한 범위와 비용 제시'], ['변화 관찰', '작업 사진과 이후 새순·형태 변화를 남깁니다.', '서비스: 다음 관찰로 연결']], idea: '잘라낸 가지를 삽목 기록으로 연결하면 모체부터 새 식물의 성장·분양까지 이어집니다.' },
    space: { type: '구매 연결 가설', title: '공간에 맞는 조합 고르기', context: '빈 공간이나 이사 후 달라진 집에 맞춰 식물과 화분을 고릅니다.', steps: [['공간과 취향', '사진·놓을 수 있는 치수·참고 취향을 선택합니다.', '고객: 실제 공간 정보 제공'], ['생육 조건', '창 방향·직사광·조명·관리 가능 시간을 확인합니다.', '서비스: 사진만으로 광량 확정 금지'], ['조합 비교', '식물·속화분·겉화분의 규격과 분위기를 비교합니다.', '고객: 취향과 조건을 따로 판단'], ['구매 결정', '식물·화분·받침·배송비와 재고를 확인합니다.', '제휴처: 실제 판매 조건 확인'], ['관리 시작', '구입한 개체와 새 공간으로 관리기록을 시작합니다.', '서비스: 구매 정보 재입력 줄이기']], idea: '이미 가진 화분과 식물을 우선 활용하고 부족한 물건만 구매 목록에 담습니다.' },
    terrarium: { type: '제작·클래스 연결 가설', title: '나만의 작은 정원 만들기', context: '사진 속 작품을 보고 내 예산과 경험에 맞는 제작 방식을 찾습니다.', steps: [['원하는 작품', '참고 사진·용기 크기·예산·경험을 확인합니다.', '고객: 목표와 제약 공유'], ['진행 방식', '재료·레시피, 공방 클래스, 완성품 의뢰를 비교합니다.', '서비스: 세 가지 방법 연결'], ['구성과 견적', '식물·배지·조명·장비·포함 재료를 확인합니다.', '제휴처: 가능한 구성 제시'], ['제작과 등록', '제작일·구성품·초기 사진을 용기 단위로 남깁니다.', '고객·공방: 완성 작품 등록'], ['용기 관리', '유형에 따라 결로·환기·수분·수위·장비를 관찰합니다.', '서비스: 일반 화분 일정과 구분']], idea: '공방 QR로 수업 구성과 관리법을 가져오고, 반복 요청으로 자체 키트 후보를 찾습니다. 동물 사육 안내는 별도 분야입니다.' },
    beginner: { type: '관리 기반 경험', title: '이름을 몰라도 시작하기', context: '선물받거나 산 식물의 이름과 관리법을 모릅니다.', steps: [['등록', '전체와 잎 사진을 찍거나 이름을 직접 입력합니다.', '사진 인식 후보는 사용자 확인'], ['공간 선택', '놓을 위치와 기본 빛 조건을 남깁니다.', '모르는 정보는 나중에 보충'], ['현재 확인', '마지막 물주기 미상도 허용하고 관찰부터 시작합니다.', '물주기 명령보다 상태 확인'], ['관찰과 기록', '젖음·마름·모름과 실제 물주기를 구분합니다.', '잘 모르겠으면 확인 방법 안내'], ['다음 방문', '기록을 근거로 다음 확인과 이유를 안내합니다.', '불충분한 기록으로 최적 주기 단정 금지']], idea: '첫 등록은 사진·이름·장소로 시작하고, 화분과 용토 정보는 필요할 때 보충하게 합니다.' },
    family: { type: '반복 이용 가설', title: '여러 식물을 함께 관리하기', context: '공간마다 식물이 있고 가족이 서로 다른 시간에 돌봅니다.', steps: [['공간별 정리', '거실·베란다·식물장별로 대상을 묶습니다.', '사용자: 목록과 필터 활용'], ['상태 확인', '확인 필요·예정·완료를 구분해 살펴봅니다.', '기록 없는 상태와 완료를 구분'], ['공동 기록', '실제 작업자와 시각을 남기고 기기 간 확인합니다.', '공동관리: 계정·초대·권한 필요'], ['수정과 복귀', '잘못된 기록은 수정·취소하고 최신 상태로 돌아옵니다.', '밀린 알림을 한꺼번에 실행하지 않음']], idea: '출장 후 돌아온 날에는 지난 물주기 알림 대신 지금 확인할 식물부터 정리합니다.' },
    sos: { type: '상담 연결 가설', title: '갑자기 상태가 달라졌을 때', context: '잎이 노래지거나 처졌지만 원인을 알기 어렵습니다.', steps: [['변화 기록', '문제 부위·전체 사진과 시작 시점을 남깁니다.', '고객: 관찰한 변화 제공'], ['이력 모으기', '최근 물주기·분갈이·비료·자리 이동을 확인합니다.', '서비스: 사실과 추정 분리'], ['추가 확인', '부족한 관찰이나 사진을 안내합니다.', '자동으로 원인 확정하지 않음'], ['상담 연결', '선택한 사진과 이력을 SOS 카드로 전달합니다.', '공유 범위를 고객이 선택'], ['경과 기록', '지켜보는 중·해결됨·악화됨을 남깁니다.', '상담 이후 실제 경과 확인']], idea: '같은 설명을 반복하지 않도록 상담 자료를 묶고, 결과가 어땠는지까지 이어서 기록합니다.' },
    handoff: { type: '편의·후속 확장', title: '돌봄을 다른 사람에게 넘기기', context: '여행 중 맡기거나 선물·분양으로 새 주인을 만납니다.', steps: [['범위 선택', '기간과 대상 식물, 필요한 정보만 고릅니다.', '소유자: 공유 범위 결정'], ['돌봄 인계', '기간 안에 필요한 작업과 완료 기록을 전달합니다.', '담당자: 실제 작업 기록'], ['종료 또는 이전', '기간 종료 시 접근을 끝내거나 소유권을 넘깁니다.', '여행 공유와 영구 이전 구분'], ['새 환경 확인', '새 집 조건으로 관리 기준을 다시 잡습니다.', '예전 물주기 간격 그대로 복사 금지']], idea: '식물 여권에 이름·관리법·선택한 성장기록을 담되 집 사진과 개인 메모는 기본 제외합니다.' }
  };
  const panels = ['overview', 'ideas', 'journey', 'validation'];
  function showPage(page, scroll = true) {
    if (!panels.includes(page)) page = 'overview';
    $$('[data-panel]').forEach(el => { el.hidden = el.dataset.panel !== page; });
    $$('[data-page]').forEach(el => { if (el.dataset.page === page) el.setAttribute('aria-current', 'page'); else el.removeAttribute('aria-current'); });
    if (location.hash !== '#' + page) history.replaceState(null, '', '#' + page);
    if (scroll) window.scrollTo({ top: 0, behavior: 'instant' });
  }
  function renderIdea(key) {
    if (!ideas[key]) return;
    state.idea = key;
    const item = ideas[key];
    $('#idea-code').textContent = item.code;
    $('#idea-title').textContent = item.title;
    $('#idea-quote').textContent = item.quote;
    $('#idea-extension').textContent = item.extension;
    $('#idea-facts').replaceChildren();
    item.facts.forEach(([label, value]) => { const wrap = document.createElement('div'); const dt = document.createElement('dt'); const dd = document.createElement('dd'); dt.textContent = label; dd.textContent = value; wrap.append(dt, dd); $('#idea-facts').append(wrap); });
    $$('[data-idea]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.idea === key)));
  }
  function renderJourney(key) {
    const item = journeys[key]; if (!item) return;
    $('#journey-select').value = key;
    $('#journey-type').textContent = item.type;
    $('#journey-subtitle').textContent = item.title;
    $('#journey-context').textContent = item.context;
    $('#journey-idea').textContent = item.idea;
    $('#journey-steps').replaceChildren();
    item.steps.forEach(([title, text, owner]) => { const li = document.createElement('li'); const h = document.createElement('h3'); const p = document.createElement('p'); const span = document.createElement('span'); h.textContent = title; p.textContent = text; span.textContent = owner; span.className = 'step-owner'; li.append(h, p, span); $('#journey-steps').append(li); });
  }
  function calculate() {
    const fields = ['leads', 'conversion', 'ticket', 'rate', 'ops', 'preops', 'acquisition'];
    const values = fields.map(key => { const el = $('#calc-' + key); return { el, value: Number(el.value) }; });
    const invalid = values.some(({ el, value }) => el.value === '' || !Number.isFinite(value) || value < Number(el.min) || value > Number(el.max));
    $('#calc-error').hidden = !invalid; $('#calc-output').hidden = invalid;
    if (invalid) { $('#calc-error').textContent = '0 이상의 숫자를 입력해 주세요. 비율은 0~100% 범위입니다.'; return; }
    const [leads, conversion, ticket, rate, ops, preops, acquisition] = values.map(item => item.value);
    const completed = leads * conversion / 100;
    const gmv = completed * ticket;
    const revenue = gmv * rate / 100;
    const cost = completed * ops + leads * (preops + acquisition);
    const margin = revenue - cost;
    const won = amount => Math.round(amount).toLocaleString('ko-KR') + '원';
    const rows = [['가정상 완료 건수', completed.toLocaleString('ko-KR', { maximumFractionDigits: 1 }) + '건'], ['거래액', won(gmv)], ['플랫폼 수수료 매출', won(revenue)], ['입력한 변동비 합계', won(cost)], ['고정비 차감 전 잔액', won(margin)]];
    $('#calc-output').replaceChildren();
    rows.forEach(([title, value], index) => { const wrap = document.createElement('div'); const dt = document.createElement('dt'); const dd = document.createElement('dd'); dt.textContent = title; dd.textContent = value; if (index === rows.length - 1 && margin < 0) dd.className = 'negative'; wrap.append(dt, dd); $('#calc-output').append(wrap); });
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('button'); if (!button) return;
    if (button.dataset.page) showPage(button.dataset.page);
    if (button.dataset.idea) renderIdea(button.dataset.idea);
    if (button.dataset.openIdea) { renderIdea(button.dataset.openIdea); showPage('ideas'); }
    if (button.id === 'idea-journey') { renderJourney(state.idea); showPage('journey'); }
  });
  $('#journey-select').addEventListener('change', event => renderJourney(event.target.value));
  $$('.calculator input').forEach(el => el.addEventListener('input', calculate));
  window.addEventListener('hashchange', () => showPage(location.hash.slice(1)));
  renderIdea('care'); renderJourney('care'); calculate(); showPage(location.hash.slice(1), false);
})();
