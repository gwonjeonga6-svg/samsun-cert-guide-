const GUIDE_CONTENT = `
=== 1.1 정확한 환자확인 (p.1) ===
- 두 가지 지표 + 개방형 질문으로 확인 (이름 + 등록번호)
- 병실번호는 환자확인 지표 불가
- 의식없는 환자: 팔찌+보호자 확인
- 확인 시기: 의약품 투여 전, 혈액제제 투여 전, 검사 전, 처치·시술 전

=== 1.2 정확한 의사소통 (p.3) ===
- 구두처방: 수술·시술 중, 응급상황 등 서면처방 불가 시만
- 절차: 처방→읽기(Read-back)→확인→의무기록 기재
- PRN처방: 목록관리, 사용기준, 투여 후 기록 필수
- 신체보호대는 PRN 불가
- LASA/SALA 약품: 혼동약품 목록 부서 비치 필수

=== 1.3 수술/시술 전 확인 (p.6) ===
- 수술부위 표시: 환자 참여 필수 (불가 시 보호자)
- Sign-In: 마취 유도 전 - 환자확인·수술명·부위·마취방법
- Time-Out: 피부절개 직전 - 팀원 전체 일시중지 후 구두 확인
- Sign-Out: 수술 종료 후 - 기구·거즈 카운트, 표본 라벨 확인

=== 1.4 낙상 예방활동 (p.8) ===
- 평가도구: 성인 Morse Fall Scale, 소아 Humpty Dumpty
- 초기평가: 입원 24시간 이내
- 재평가: 수술 후, 진정 후, 낙상관련 약물 후, 의식저하, 낙상 발생 후
- 고위험 환자: 노란 표식(팔찌·침대표식), 침대난간 올리기, 미끄럼방지 양말, 낙상예방 교육, 화장실 동행

=== 1.5 손위생 (p.10) ===
- WHO 5시점: 환자접촉 전, 청결·무균처치 전, 체액노출 후, 환자접촉 후, 환자주변환경 접촉 후
- 비누+물: 30초 이상
- 알코올 손소독: 20~30초
- 눈에 보이는 오염: 반드시 비누+물

=== 7.3 환자안전사고 관리 (p.55) ===
- 근접오류: 환자 미도달 / 무해사건: 도달했으나 피해 없음
- 위해사건: 환자에게 손상 / 적신호사건: 사망·심각한 손상
- 보고: 적신호 24시간 이내, 기타 72시간 이내
- 적신호사건: 45일 이내 RCA 분석

=== 4.4 고위험 의약품 (p.39) ===
- 종류: 인슐린, 헤파린, 항응고제, 농축전해질(KCl, NaCl 23.4%), 항암제, 마약성 진통제
- 별도 보관 + 표식 부착
- 농축 전해질: 일반병동 보관 금지
- 이중확인(Double Check) 수행

=== 8.8 감염성질환자 관리 (p.71) ===
- 공기주의(결핵·홍역·수두): 음압격리실 + N95 마스크
- 비말주의(인플루엔자·코로나): 1인실 또는 코호트 + 수술용 마스크
- 접촉주의(MRSA·VRE): 1인실 또는 코호트 + 장갑·가운
- 격리 해제: 반드시 의사 지시 후

=== 10.7 직원 안전관리 (p.79) ===
- 혈액·체액: 장갑·가운 / 안면 튈 위험 시 안면보호구
- 공기주의: N95 마스크 / 비말주의: 수술용 마스크
- 접촉주의: 가운·장갑
- 눈에 이물질 들어갔을 때: 즉시 눈 세척기(eye wash station) 사용, 감염관리실 보고
- 주사침 찔림: 즉시 흐르는 물에 씻기 → 감염관리실 또는 응급실 방문 → 보고서 작성
- 직원 안전사고: 발생 즉시 부서장 보고 → 전산보고(자인컴)

=== 11.6 화재안전 (p.91) ===
- RACE: Rescue(구조)→Alarm(경보/119)→Confine(문 닫아 연기차단)→Extinguish/Evacuate
- PASS: Pull(안전핀)→Aim(노즐)→Squeeze(손잡이)→Sweep(좌우로)
- 병원 전체 금연구역

=== 13.1 환자안전 지표 (p.97) ===
- 의무 지표 6가지: 환자확인, 의사소통, 수술·시술, 낙상, 손위생, 욕창
- 분기별 모니터링, 경영진 보고 및 직원 공유
`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, systemPrompt } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  try {
    const fullSystemPrompt = systemPrompt + '\n\n=== 가이드북 전체 내용 ===\n' + GUIDE_CONTENT;
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1000,
        messages: [
          { role: 'system', content: fullSystemPrompt },
          ...messages.slice(-6),
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || '오류 발생' });
    }

    const answer = data.choices?.[0]?.message?.content || '답변을 가져오지 못했습니다.';
    return res.status(200).json({ answer });

  } catch (error) {
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}
