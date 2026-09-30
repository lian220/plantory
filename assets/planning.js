'use strict';
(() => {
  const $ = selector => document.querySelector(selector);
  const $$ = selector => Array.from(document.querySelectorAll(selector));
  const state = { idea: 'care' };
  const ideas = {
    care: { code: 'A', title: '이미 가진 식물을 더 보기 좋게', quote: '“몬스테라가 너무 퍼졌는데, 자르기 전에 어떻게 할지 알고 싶어요.”', facts: [['고객과 계기', '기존 식물의 수형·크기·분갈이 때문에 결정을 미루는 사람.'], ['현재의 대안', '검색·영상·카페 질문·판매자 문의·가게 방문.'], ['제안할 가치', '현재 상태와 원하는 모습을 보고, 방법·준비물·전문가를 연결.'], ['돈이 발생할 수 있는 지점', '건별 상담, 작업 매칭, 화분·지지대·용토 구매 연결.'], ['핵심 운영 부담', '전문가 조율 시간, 사진으로 확인할 수 없는 상태, 작업 결과와 사후 문의.'], ['먼저 검증할 질문', '무료 정보를 본 뒤에도 구체적인 상담이나 작업에 비용을 지불하는가?']], extension: '직접 하기 / 사진 상담 / 가게에 맡기기를 같은 고민에서 선택하게 합니다. 자주 필요한 준비물은 이후 자체 키트 후보가 됩니다.' },
    space: { code: 'B', title: '우리집에 맞는 식물·화분과 구매비용 비교', quote: '“이 선반에 맞는 식물과 화분을, 신품·중고 중 어떤 조건으로 살지 비교하고 싶어요.”', facts: [['고객과 계기', '공간에 맞는 식물·화분을 고르며 규격, 상태와 실제 구매비용을 함께 따지는 사람.'], ['현재의 대안', '쇼핑몰 가격 비교, 중고거래 게시물 검색, SNS·식물가게 추천.'], ['제안할 가치', '집 환경·취향·예산에 맞는 후보를 찾고, 신품·중고의 조건과 필수옵션·배송비 포함 총액 비교.'], ['돈이 발생할 수 있는 지점', '상품 구매 연결, 공간 상담, 제휴 스타일링. 수익 방식과 제휴 조건은 검증 대상.'], ['핵심 운영 부담', '동일 상품 식별, 식물 개체 차이, 중고 상태·구성품, 가격·재고·배송비의 출처와 확인 시간 관리.'], ['먼저 검증할 질문', '규격·상태와 총비용을 함께 보면 탐색 부담이 줄고 실제 구매 선택으로 이어지는가?']], extension: '보유 식물·빈 화분을 먼저 활용합니다. 동일 상품의 가격 비교와 비슷한 식물의 조건 대안을 구분하고, 식물 판매 유형·생물 상태와 미확인 비용을 표시합니다. 이번 개선 시안은 가상 상품·매물 비교와 입양 연결을 다룹니다. 실제 가격·재고·거래는 데이터와 운영 준비 후 검토합니다.' },
    terrarium: { code: 'C', title: '참고 사진을 실제 작은 정원으로', quote: '“이런 테라리움을 만들고 싶은데, 뭘 사야 할지 모르겠어요.”', facts: [['고객과 계기', '참고 작품을 보고 직접 제작·클래스·완성품 주문을 고민하는 사람.'], ['현재의 대안', '제작 영상, 재료 검색, 공방 수업, 완성품 구매.'], ['제안할 가치', '참고 모습·크기·경험·예산을 실제 제작 방법과 공급처로 연결.'], ['돈이 발생할 수 있는 지점', '재료·키트 구매, 클래스 매칭, 제작 의뢰.'], ['핵심 운영 부담', '레시피 검토, 재료 대체·조달, 생물 상태, 배송 파손, 수업 일정.'], ['먼저 검증할 질문', '고객이 원하는 것은 레시피인가, 수업인가, 완성된 작품인가?']], extension: '초기에는 공방·판매자를 연결하고, 반복 요청으로 확인한 구성부터 자체 키트를 검토합니다. 완성 후 관리와 사진 기록을 이어갈 수 있습니다.' }
  };
  const journeys = {
    full: {"type": "이번 개선 시안 · 가상 체험", "title": "고르기부터 경과와 재문의까지", "context": "오늘·내 정원·구매 비교·도움·사례의 다섯 메뉴에서 같은 식물의 맥락을 이어갑니다.", "steps": [["조건과 총액", "가상 상품·매물에서 동일 규격과 식물 대안, 상태·배송비·미확인 항목을 비교합니다.", "구매 비교 ↔ 분갈이·테라리움 준비물 예산"], ["가상 수령·입양", "받은 경로·상태·모르는 점·질문을 정리합니다. 선물·분양으로도 시작할 수 있습니다.", "실제 주문·수령·환불 접수 없음"], ["같은 식물 관찰", "이름을 몰라도 등록하고 재배 방식에 맞게 관찰한 뒤 기록을 확인·정정합니다.", "내 정원 → 오늘"], ["도움과 개인 계획", "대상·이력을 유지해 요청을 미리 보고 개인 확인 항목과 재확인 시점을 정합니다.", "전문가가 안내하거나 상담한 결과가 아님"], ["경과·재문의", "변화와 실제 바꾼 것을 정리하고 같은 식물의 재문의 내용을 준비합니다.", "외부 전송·무료 재상담 보장 없음"]], "idea": "사례를 읽다가 관찰·도움으로, 내 정원에서 판매·분양 카드로 이어집니다. 실제 상담은 공급자 검토 → 범위·가격·답변 시간 → 고객 수락 → 진행 → 경과 순서로 별도 운영합니다."},
    budget: {"type": "이번 개선 시안 · 가상 예산", "title": "필요한 양과 가진 물품부터", "context": "분갈이·테라리움 준비물에서 개별 최저가와 실제 준비 비용을 구분합니다.", "steps": [["목적·목록", "필수와 선택 품목을 나누고 실제 필요한 양을 살펴봅니다.", "도움 → 준비물 예산"], ["보유품 제외", "이미 가진 물품을 제외하고 남은 구매 목록을 확인합니다.", "제외한 품목은 구매 합계에 넣지 않음"], ["수량·소포장 비교", "단위가격과 이번에 필요한 양·구매 후 잔량을 함께 봅니다.", "L·kg은 근거 없이 환산하지 않음"], ["판매처별 배송", "같은 판매처의 예시 배송 규칙으로 합산하고 미확인 비용을 남깁니다.", "실제 합배송·무료배송 보장 없음"]], "idea": "확인된 총액과 미확인 비용을 구분해 구매 비교로 돌아갑니다. 실제 구성 적합성은 전문가, 옵션·배송 조건은 판매처 확인이 필요합니다."},
    adoption: {"type": "사용자 선택 · 이번 개선 시안", "title": "새 식물 입양 체크", "context": "구입·선물·분양으로 받은 식물의 설명과 지금 상태를 정리합니다.", "steps": [["받은 경로", "구입·선물·분양과 알고 있는 설명을 남깁니다.", "모르는 이름·설명 허용"], ["상태와 질문", "다른 점·모르는 점·더 물을 내용을 구분합니다.", "검수·해충 진단·환불 신청 아님"], ["같은 식물 등록", "별명·장소·재배 방식을 정리하고 첫 관찰로 이어갑니다.", "입양 맥락을 내 식물에 연결"]], "idea": "받은 사람이 현재 상태를 확인하고 판매·분양자는 원래 설명을 확인해야 합니다. 실제 거래 문의나 사진 전송은 이 시안에서 수행하지 않습니다."},
    followup: {"type": "사용자 선택 · 이번 개선 시안", "title": "상담·분갈이 후 경과 관리", "context": "개인 확인 계획과 실제 변화를 같은 식물의 다음 질문으로 연결합니다.", "steps": [["확인 계획", "살펴볼 항목과 다시 볼 시점을 적습니다.", "시안은 이용자의 개인 계획"], ["변화 기록", "달라진 상태와 실제 바꾼 것을 구분합니다.", "미기록을 변화 없음으로 판단하지 않음"], ["다음 질문", "같은 대상과 경과로 도움 요청 미리보기를 다시 준비합니다.", "재문의 전송 없음"]], "idea": "실제 전문가는 확인 항목·시점·응답 범위를 합의해야 합니다. 무료 재상담·지속 모니터링·즉시 답변을 기본 약속으로 두지 않습니다."},
    cases: {"type": "사용자 선택 · 가상 사례", "title": "내 환경과 비슷한 관리 사례", "context": "같은 증상이라는 이유만으로 관리 방법을 그대로 복사하지 않도록 맥락을 봅니다.", "steps": [["조건으로 찾기", "식물·빛·재배 방식·증상으로 가상 사례를 좁힙니다.", "일치 사례 없음은 조건 수정"], ["시도·결과 읽기", "무엇을 바꿨고 어떤 변화가 있었는지, 내 환경과 다른 점을 확인합니다.", "사례 결과는 진단·효과 보장 아님"], ["내 식물로 연결", "더 확인할 관찰이나 도움 요청을 정리합니다.", "사례 → 관찰 또는 도움"]], "idea": "실제 사례는 공개 동의·출처·검토 상태를 확보한 뒤 사용합니다. 초기 자체 게시판보다 맥락 있는 사례의 유용성을 먼저 확인합니다."},
    transfer: {"type": "이번 개선 시안 · 개인 카드", "title": "판매·분양·자재 나눔 정보 카드", "context": "식물이나 남은 자재를 전달할 때 필요한 조건을 한 번 정리합니다.", "steps": [["대상·모드", "식물 판매·분양 또는 자재 나눔을 고릅니다.", "내 정원·관련 자재 조건에서 시작"], ["조건 정리", "규격·상태·구성·수령 조건, 자재 잔량·개봉·보관을 적습니다.", "모르는 항목은 미확인"], ["미리보기·수정", "다른 사람에게 보여줄 내용을 읽고 고칩니다.", "개인 메모 일괄 공개 없음"]], "idea": "현재는 카드 미리보기이며 실제 게시·공유·소유권 이전·거래는 없습니다. 공개·수정·분쟁 규칙은 실제 운영 전에 정합니다."},
    materials: {"type": "사용자 B안 · 예시 탐색", "title": "소포장과 개인 잔량 구매·나눔", "context": "필요한 양은 적고 대용량 자재는 남는 상황을 함께 다룹니다.", "steps": [["판매 유형 구분", "소포장 상품과 개인 잔량·무료 나눔을 구분합니다.", "가격만으로 같은 상품 취급 금지"], ["상태·수령 확인", "잔량·개봉·보관·지역·수령 조건과 모르는 점을 살펴봅니다.", "무료 나눔도 배송·이동 조건 확인"], ["질문과 다음 연결", "확인할 질문을 정리하고 예산 또는 자재 나눔 카드로 이동합니다.", "실제 신청·검수·물류 없음"]], "idea": "개봉 자재의 사용 가능성은 화면만으로 판정하지 않습니다. 실제 운영은 허용 품목·상태·수령·분쟁 책임이 준비된 뒤 검증합니다."},
    outlet: {"type": "종합 요청에 따른 설계 채택", "title": "상태를 알고 선택하는 식물 아웃렛", "context": "공개된 상태와 관리 부담을 이해한 뒤 입양 여부를 판단하는 예시입니다.", "steps": [["공개 상태 읽기", "외관 차이·생육 상태·알 수 없는 부분을 구분합니다.", "가상 개체·상태 예시"], ["부담과 질문", "추가 관리가 필요한지 내가 감당할 수 있는지 보고 질문을 정리합니다.", "낮은 가격은 건강·회복 보장 아님"], ["가상 입양", "받은 상태 확인과 같은 식물의 관찰로 이어갑니다.", "실제 공급·검수·구매 없음"]], "idea": "아웃렛은 사용자의 개별 선택 답변이 아니라 전체 기획을 맡긴 요청에 따른 설계 판단입니다. 실제 상태·지원·교환·배송 조건은 공급자 확보 후 검증합니다."},
    care: { type: '매칭 사업 가설', title: '원하는 수형으로 가꾸기', context: '너무 커지거나 퍼진 식물을 손대기 전에 도움을 구합니다.', steps: [['현재 상태', '정면·측면·줄기 사진과 최근 분갈이·손상 여부를 확인합니다.', '고객: 사진과 이력 선택'], ['원하는 변화', '높이·폭·목표 수형을 정하고 해당 식물에서 가능한 방향을 확인합니다.', '서비스: 조건과 미확인 사항 설명'], ['도움 방식', '직접 하기, 사진 상담, 가게·전문가에게 맡기기 중 선택합니다.', '고객: 실행 방식 결정'], ['조건과 실행', '작업 범위·견적·운반 조건을 확인한 뒤 실행합니다.', '제휴처: 가능한 범위와 비용 제시'], ['변화 관찰', '작업 사진과 이후 새순·형태 변화를 남깁니다.', '서비스: 다음 관찰로 연결']], idea: '잘라낸 가지를 삽목 기록으로 연결하면 모체부터 새 식물의 성장·분양까지 이어집니다.' },
    space: { type: '구매비용 비교·연결 기획', title: '공간에 맞는 조합과 구매비용 비교', context: '이번 개선 시안에서 식물·화분·자재의 가상 신품·중고 조건을 비교합니다. 실제 판매처·가격·재고 연동은 없습니다.', steps: [['상품 검색', '필요한 식물·화분·용토·자재·장비를 찾습니다. 이미 가진 물품도 먼저 살펴봅니다.', '고객: 필요한 물품과 보유 물품 확인'], ['조건 선택', '공간·빛·취향·예산과 상품 규격·수량·상태, 배송 또는 직거래 지역을 고릅니다.', '서비스: 생육 조건과 취향 구분'], ['신품·중고 비교', '동일 상품의 가격을 비교하고, 크기·수형·생육 상태가 다른 식물은 조건 대안으로 살펴봅니다.', '고객: 가격과 상태·구성 차이 판단'], ['총구매비용 확인', '상품 가격·필수옵션·배송비를 합산하고, 직거래 이동 부담과 미확인 비용을 별도로 확인합니다.', '서비스: 출처·확인 시간·미확인 항목 표시'], ['가상 수령과 입양', '시안에서는 받은 것으로 가정한 상태와 질문을 정리합니다. 실제 서비스에서는 판매처의 최종 조건 확인과 구매가 별도로 필요합니다.', '가상 수령은 실제 주문·거래 완료가 아님'], ['내 식물 관리', '입양 체크에서 정리한 개체를 같은 식물로 등록하고 새 환경에서 관찰합니다.', '서비스: 가상 구매·입양·관찰 연결']], idea: '구매비용 비교는 일상 관리·수형과 분갈이·공간과 화분·테라리움에 공통으로 연결합니다. 가격이 빠진 항목은 총액 미확인으로 표시하고 확인된 조건 안에서 비교합니다.' },
    terrarium: { type: '제작·클래스 연결 가설', title: '나만의 작은 정원 만들기', context: '사진 속 작품을 보고 내 예산과 경험에 맞는 제작 방식을 찾습니다.', steps: [['원하는 작품', '참고 사진·용기 크기·예산·경험을 확인합니다.', '고객: 목표와 제약 공유'], ['진행 방식', '재료·레시피, 공방 클래스, 완성품 의뢰를 비교합니다.', '서비스: 세 가지 방법 연결'], ['구성과 견적', '식물·배지·조명·장비·포함 재료를 확인합니다.', '제휴처: 가능한 구성 제시'], ['제작과 등록', '제작일·구성품·초기 사진을 용기 단위로 남깁니다.', '고객·공방: 완성 작품 등록'], ['용기 관리', '유형에 따라 결로·환기·수분·수위·장비를 관찰합니다.', '서비스: 일반 화분 일정과 구분']], idea: '공방 QR로 수업 구성과 관리법을 가져오고, 반복 요청으로 자체 키트 후보를 찾습니다. 동물 사육 안내는 별도 분야입니다.' },
    beginner: { type: '관리 기반 경험', title: '이름을 몰라도 시작하기', context: '선물받거나 산 식물의 이름과 관리법을 모릅니다.', steps: [['등록', '사진 없이도 부를 이름과 관리 대상 종류로 시작합니다. 이름 미상을 허용합니다.', '사진 인식은 이후 검토'], ['공간 선택', '놓을 위치와 기본 빛 조건을 남깁니다.', '모르는 정보는 나중에 보충'], ['현재 확인', '마지막 물주기 미상도 허용하고 관찰부터 시작합니다.', '물주기 명령보다 상태 확인'], ['관찰과 기록', '젖음·마름·모름과 실제 물주기를 구분합니다.', '잘 모르겠으면 확인 방법 안내'], ['기록 확인', '같은 식물의 첫 관찰을 찾고 잘못된 선택을 수정·취소합니다.', '시안 기록은 새로고침하면 초기화']], idea: '첫 검토는 초보 지인과 비용 없이 진행합니다. 이름·장소를 몰라도 시작하고, 관찰과 물주기를 구분할 수 있는지 봅니다.' },
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
    if (event.target.closest('.skip-link')) {
      event.preventDefault();
      const main = $('#main');
      main.focus({ preventScroll: true });
      main.scrollIntoView({ block: 'start', behavior: 'instant' });
      return;
    }
    const button = event.target.closest('button'); if (!button) return;
    if (button.dataset.page) showPage(button.dataset.page);
    if (button.dataset.idea) renderIdea(button.dataset.idea);
    if (button.dataset.openIdea) { renderIdea(button.dataset.openIdea); showPage('ideas'); }
    if (button.dataset.openJourney) { renderJourney(button.dataset.openJourney); showPage('journey'); }
    if (button.id === 'idea-journey') { renderJourney(state.idea); showPage('journey'); }
  });
  $('#journey-select').addEventListener('change', event => renderJourney(event.target.value));
  $$('.calculator input').forEach(el => el.addEventListener('input', calculate));
  window.addEventListener('hashchange', () => showPage(location.hash.slice(1)));
  renderIdea('care'); renderJourney('full'); calculate(); showPage(location.hash.slice(1), false);
})();
