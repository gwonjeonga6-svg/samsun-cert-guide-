import { useState, useEffect, useRef } from 'react'
import styles from '../styles/Home.module.css'

const CERT = {
  "1.1": {
    t: "환자를 정확하게 확인한다.",
    g: "◯ 조사장소: 의약품·혈액제제 투여 장소, 검사실, 외래, 처치·시술 수행 장소\n◯ 조사대상: 의약품 투여, 검사 시행, 처치·시술 수행 관련 직원\n\n★ 두 가지 지표 + 개방형 질문으로 확인 ★\n예) \"성함이 어떻게 되세요?\" + 등록번호 확인\n\n• 병실번호는 환자확인 지표 불가\n• 의식없는 환자: 별도 확인방법 (팔찌+보호자)\n• 모든 상황·장소에서 일관된 방법 적용",
    i: ["ME1[필수] 규정이 있다.", "ME2[필수] 의약품 투여 전 확인", "ME3[필수] 혈액제제 투여 전 확인", "ME4[필수] 검사 시행 전 확인", "ME5[필수] 진료·처치·시술 전 확인"]
  },
  "1.2": {
    t: "의료진은 정확하게 의사소통한다.",
    g: "◯ 조사장소: 병동, 중환자실, 응급실, 외래\n\n[구두처방 허용상황]\n• 수술·시술 중, 응급상황 등 서면처방 불가 시만\n• 절차: 처방→읽기(Read-back)→확인→의무기록 기재\n\n[PRN처방]\n• 목록 관리, 사용기준, 투여 후 기록 필수\n• 신체보호대는 PRN 불가\n\n[LASA/SALA 약품]\n• 혼동약품 목록 부서 비치 필수",
    i: ["ME1[필수] 규정 있다 (prn금지 명시)", "ME2[필수] 구두처방 수행", "ME3[필수] PRN처방 관리", "ME4[필수] PRN처방 안전하게 수행", "ME5[필수] 혼동처방 대처"]
  },
  "1.3": {
    t: "수술/시술 전 정확하게 확인한다.",
    g: "◯ 조사장소: 수술장, 시술실\n\n[수술부위 표시]\n• 환자 참여 필수 (불가 시 보호자)\n\n[Sign-In] 마취 유도 전\n• 환자확인·수술명·부위·마취방법 확인\n\n★ [Time-Out] 피부절개 직전 ★\n• 팀원 전체 일시중지 후 구두 확인\n• 환자확인·수술명·부위·마취방법·Implant\n\n[Sign-Out] 수술 종료 후\n• 기구·거즈 카운트, 표본 라벨 확인",
    i: ["ME1[필수] 규정 있다", "ME2[필수] 수술부위 표시에 환자 참여", "ME3[필수] 수술부위 표시", "ME4[필수] Sign-In 수행", "ME5[필수] Time-Out 수행"]
  },
  "1.4": {
    t: "낙상 예방활동을 수행한다.",
    g: "◯ 조사장소: 병동, 외래, 중환자실, 응급실, 검사실, 이송경로\n◯ 조사대상: 간호사, 환자, 의료기사\n\n[평가도구]\n• 성인: Morse Fall Scale\n• 소아: Humpty Dumpty Fall Scale\n\n[평가 시기]\n• 초기: 입원 24시간 이내\n• 재평가: 수술 후, 진정 후, 낙상관련 약물 후, 의식저하, 낙상 발생 후\n\n★ [고위험 환자 관리] ★\n• 노란 표식 (팔찌·침대표식) 부착\n• 침대 난간 올리기\n• 미끄럼방지 양말 착용\n• 낙상예방 교육 (환자·보호자)\n• 화장실 동행 또는 보조",
    i: ["ME1[필수] 규정 있다", "ME2[필수] 초기평가 수행", "ME3[필수] 고위험환자 예방활동 수행", "ME4[필수] 상태변화 시 재평가", "ME5[필수] 낙상 발생 가능 장소 예방활동"]
  },
  "1.5": {
    t: "손위생을 철저히 수행한다.",
    g: "◯ 조사장소: 병동, 중환자실, 외래, 처치실, 수술장\n\n★ WHO 5가지 손위생 시점 ★\n1. 환자 접촉 전\n2. 청결·무균 처치 전\n3. 체액 노출 위험 후\n4. 환자 접촉 후\n5. 환자 주변 환경 접촉 후\n\n[방법]\n• 비누+물: 30초 이상\n• 알코올 손소독: 20~30초 건조될 때까지\n• 눈에 보이는 오염: 반드시 비누+물",
    i: ["ME1[필수] 규정 있다", "ME2[필수] 손위생 수행 (WHO 5시점)", "ME3[필수] 수행률 모니터링 및 공유"]
  },
  "7.2": {
    t: "위험관리체계가 있다.",
    g: "◯ 조사장소: PSQI팀\n\n[위험등록부]\n• 위험범주→유형→요인 체계\n• 연 1회 업데이트\n\n[위험평가]\n• 발생가능성(1~5) × 심각성(1~5) = 위험도값\n• 1~3: 낮음 / 4~6: 중간 / 8~12: 높음 / 15~25: 매우높음\n• 연 1회 위원회에서 우선순위 선정\n\n[개선활동]\n• FMEA 분석 → 개선 → 3개월 모니터링",
    i: ["ME1[정규] 위험관리체계 있다", "ME2[정규] 위험요인 확인", "ME3[정규] 위험평가 및 우선순위 선정", "ME4[정규] 분석 및 개선활동", "ME5[정규] 모니터링·평가", "ME6[정규] 경영진 보고·직원 공유"]
  },
  "7.3": {
    t: "환자안전사고를 관리한다.",
    g: "◯ 조사장소: PSQI팀\n\n[사건 종류]\n• 근접오류: 환자 미도달\n• 무해사건: 도달했으나 피해 없음\n• 위해사건: 환자에게 손상\n• 적신호사건: 사망·심각한 손상\n\n[보고]\n• 누구나 보고 가능 (전산 원칙)\n• 적신호사건: 24시간 이내\n• 기타: 72시간 이내\n\n[분석]\n• 적신호사건: 45일 이내 RCA\n• 기타: 매월 분석, 연 1회 FMEA",
    i: ["ME1[필수] 관리절차 있다", "ME2[필수] 직원이 정의 알고 보고", "ME3[필수] 분석 수행 (적신호→RCA)", "ME4[필수] 개선활동 수행", "ME5[필수] 결과 경영진 보고·공유", "ME6[정규] 적신호 시 환자·보호자 정보 제공", "ME7[정규] 주의경보 발령 시 직원 공유"]
  },
  "4.4": {
    t: "고위험 의약품을 관리한다.",
    g: "◯ 조사장소: 약제부, 병동, 중환자실\n\n[고위험 의약품 종류]\n• 인슐린, 헤파린, 항응고제\n• 농축 전해질 (KCl, NaCl 23.4%)\n• 항암제, 마약성 진통제, 신경근차단제\n\n★ 관리 원칙 ★\n• 별도 보관 + 표식 부착\n• 농축 전해질: 일반병동 보관 금지\n• 이중확인 (Double Check) 수행\n• 투여 후 모니터링 강화",
    i: ["ME1[정규] 규정 있다", "ME2[정규] 고위험약품 식별·관리", "ME3[정규] 안전하게 보관", "ME4[정규] 안전하게 처방·조제·투여"]
  },
  "13.1": {
    t: "환자안전 지표를 관리한다.",
    g: "◯ 조사장소: PSQI팀\n\n[의무 관리 지표 6가지]\n1. 환자 확인 관련\n2. 의사소통 관련\n3. 수술·시술 관련\n4. 낙상 관련\n5. 손위생 관련\n6. 욕창 관련\n\n[관리 방법]\n• 지표 정의서 작성 (목표치 포함)\n• 분기별 이상 모니터링\n• 결과 경영진 보고 및 직원 공유",
    i: ["ME1[의무] 환자확인 지표 관리", "ME2[의무] 의사소통 관련 지표", "ME3[의무] 수술·시술 관련 지표", "ME4[의무] 낙상 관련 지표", "ME5[의무] 손위생 관련 지표", "ME6[의무] 욕창 관련 지표"]
  },
  "10.7": {
    t: "직원 안전 관리활동을 수행한다.",
    g: "◯ 조사장소: 전 부서\n◯ 조사대상: 전 직원\n\n[전파경로별 개인보호구]\n• 혈액·체액: 장갑·가운 / 안면 튈 위험 시 안면보호구 추가\n• 공기주의: N95 마스크\n• 비말주의: 수술용 마스크\n• 접촉주의: 가운·장갑\n\n[직원 안전사고 보고]\n• 발생 즉시 부서장에게 보고\n• 전산보고 (자인컴)\n• 감염 노출 사고: 감염관리실 연락\n\n★ 주사침 찔림 사고 시 ★\n1. 즉시 흐르는 물에 씻기\n2. 감염관리실 또는 응급실 방문\n3. 보고서 작성",
    i: ["ME1[정규] 직원 안전 관리 규정이 있다.", "ME2[정규] 직원 안전사고를 보고한다.", "ME3[정규] 개인보호구를 올바르게 착용한다.", "ME4[정규] 직원 안전교육을 수행한다."]
  },
  "11.6": {
    t: "화재 안전 관리활동을 수행한다.",
    g: "◯ 조사장소: 의료기관 전체\n◯ 조사대상: 전 직원\n\n★ RACE 원칙 ★\nR - Rescue (구조): 위험지역 환자 대피\nA - Alarm (경보): 화재경보 발령, 119 신고\nC - Confine (차단): 문 닫아 연기 차단\nE - Extinguish/Evacuate (소화/대피)\n\n[소화기 사용법 PASS]\nP - Pull (안전핀 뽑기)\nA - Aim (노즐을 불 쪽으로)\nS - Squeeze (손잡이 누르기)\nS - Sweep (좌우로 쓸듯이)\n\n[금연관리]\n• 병원 전체 금연구역\n• 원내 어디서도 흡연 금지\n• 꽁초 발견되면 안 됨",
    i: ["ME1[정규] 화재안전 관리 규정이 있다.", "ME2[정규] 화재 발생 시 대응절차를 알고 수행한다.", "ME3[정규] 소화기 사용법을 알고 수행한다.", "ME4[정규] 화재 예방활동을 수행한다.", "ME5[정규] 금연관리를 수행한다."]
  },
  "8.8": {
    t: "감염성질환자 및 면역저하 환자를 관리한다.",
    g: "◯ 조사장소: 음압격리병실, 응급실, 외래\n◯ 조사대상: 의사, 간호사\n\n[전파경로별 격리 및 개인보호구]\n• 공기주의: 활동성 폐결핵·홍역·수두 등\n  → 음압격리실 + N95 마스크\n• 비말주의: 인플루엔자·코로나·백일해 등\n  → 1인실 또는 코호트격리 + 수술용 마스크\n• 접촉주의: MRSA·VRE·노로바이러스 등\n  → 1인실 또는 코호트격리 + 장갑·가운\n\n★ 격리 해제는 반드시 의사 지시 후 ★\n\n[면역저하 환자 보호격리]\n• 역격리(보호격리): 조혈모세포이식 등\n• 방문자 마스크 착용 필수",
    i: ["ME1[정규] 격리 절차가 있다.", "ME2[정규] 전파경로별 격리를 수행한다.", "ME3[정규] 격리 시 개인보호구를 착용한다.", "ME4[정규] 면역저하 환자 보호격리를 수행한다."]
  }
}

// 가이드북 전직원 숙지 필수항목 기준
const QUICK_BTNS = [
  // 1장 환자안전보장활동 (전직원 필수)
  { label: '✅ 1.1 환자확인', q: '환자확인 두 가지 지표와 개방형 질문 방법' },
  { label: '📞 1.2 의사소통', q: '구두처방 절차와 PRN처방 관리 방법' },
  { label: '⚕️ 1.3 수술확인', q: '수술 전 Sign-In Time-Out Sign-Out 방법' },
  { label: '🏥 1.4 낙상예방', q: '낙상 위험평가와 고위험환자 관리 방법' },
  { label: '🧴 1.5 손위생', q: '손위생 5가지 시점과 수행 방법' },
  // 7장 환자안전사고
  { label: '📝 7.3 사고보고', q: '환자안전사고 종류와 보고 절차' },
  // 8장 감염관리
  { label: '🦠 8.8 감염·격리', q: '전파경로별 격리 기준과 개인보호구 착용 방법' },
  // 10장 직원안전
  { label: '🦺 10.7 직원안전', q: '직원 안전사고 보고 절차와 개인보호구 착용 기준' },
  // 11장 화재안전
  { label: '🔥 11.6 화재안전', q: '화재 발생 시 RACE 원칙과 소화기 PASS 사용법' },
]

function findRelevant(query) {
  const q = query.toLowerCase()
  const map = {
    '환자확인': ['1.1'], '두가지': ['1.1'], '지표확인': ['1.1'],
    '구두처방': ['1.2'], 'prn': ['1.2'], 'lasa': ['1.2'], '의사소통': ['1.2'],
    '수술': ['1.3'], '시술': ['1.3'], '타임아웃': ['1.3'], '부위표시': ['1.3'],
    '낙상': ['1.4'], 'morse': ['1.4'], '고위험환자': ['1.4'],
    '손위생': ['1.5'], '손씻기': ['1.5'], '5가지': ['1.5'],
    '위험관리': ['7.2'], '위험등록': ['7.2'], 'fmea': ['7.2', '7.3'],
    '사고보고': ['7.3'], '안전사고': ['7.3'], 'rca': ['7.3'], '적신호': ['7.3'],
    '고위험약': ['4.4'], '의약품': ['4.4'], '인슐린': ['4.4'], '헤파린': ['4.4'],
    '지표': ['13.1'], '욕창': ['13.1'],
    '직원안전': ['10.7'], '주사침': ['10.7'], '찔림': ['10.7'], '개인보호구': ['10.7'], '보호구': ['10.7'],
    '화재': ['11.6'], 'race': ['11.6'], 'pass': ['11.6'], '소화기': ['11.6'], '대피': ['11.6'], '금연': ['11.6'],
  }
  const found = new Set()
  const numMatch = query.match(/\d+\.\d+(?:\.\d+)?/g)
  if (numMatch) numMatch.forEach(k => { if (CERT[k]) found.add(k) })
  for (const [kw, keys] of Object.entries(map)) {
    if (q.includes(kw)) keys.forEach(k => found.add(k))
  }
  if (found.size === 0) {
    for (const [k, v] of Object.entries(CERT)) {
      const c = (v.t + v.g + v.i.join(' ')).toLowerCase()
      if (query.split(/\s+/).some(w => w.length > 1 && c.includes(w))) found.add(k)
    }
  }
  return [...found].slice(0, 3)
}

export default function Home() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [voiceStatus, setVoiceStatus] = useState('')
  const [isListening, setIsListening] = useState(false)
  const msgsRef = useRef(null)
  const recognitionRef = useRef(null)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error)
    }
  }, [])

  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight
    }
  }, [messages, loading])

  async function sendMessage(text) {
    if (!text.trim() || loading) return
    setInput('')

    const userMsg = { role: 'user', content: text }
    const newMsgs = [...messages, userMsg]
    setMessages(newMsgs)
    setLoading(true)

    const keys = findRelevant(text)
    let ctx = ''
    keys.forEach(k => {
      const d = CERT[k]
      if (d) ctx += `\n\n=== 기준 ${k}: ${d.t} ===\n${d.g}\n조사항목: ${d.i.join(' | ')}\n`
    })

    const systemPrompt = `당신은 급성기병원 4주기 인증기준 현장가이드 어시스턴트입니다.
바쁜 현장 직원이 스마트폰으로 빠르게 확인하는 용도입니다.

답변 규칙:
- 3~5줄 이내로 핵심만
- 번호나 불릿으로 간결하게
- 기준번호 앞에 표시
- ★로 가장 중요한 것 강조
- 구어체 사용 (딱딱하지 않게)${ctx ? '\n\n참조 기준:' + ctx : ''}`

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMsgs.slice(-6),
          systemPrompt,
        }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer || '오류가 발생했습니다.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '네트워크 오류가 발생했습니다. 다시 시도해주세요.' }])
    } finally {
      setLoading(false)
    }
  }

  function toggleVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      setVoiceStatus('⚠ 음성인식은 크롬에서만 지원됩니다')
      setTimeout(() => setVoiceStatus(''), 3000)
      return
    }
    if (isListening) {
      recognitionRef.current?.stop()
      return
    }
    const rec = new SR()
    rec.lang = 'ko-KR'
    rec.interimResults = true
    rec.continuous = false
    recognitionRef.current = rec

    rec.onstart = () => { setIsListening(true); setVoiceStatus('🎤 듣는 중... 말씀하세요') }
    rec.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join('')
      setInput(t)
      if (e.results[e.results.length - 1].isFinal) {
        setVoiceStatus('')
        sendMessage(t)
      }
    }
    rec.onerror = (e) => {
      setVoiceStatus('오류: ' + e.error)
      setTimeout(() => setVoiceStatus(''), 3000)
    }
    rec.onend = () => { setIsListening(false); setVoiceStatus('') }
    rec.start()
  }

  return (
    <div className={styles.app}>
      {/* 헤더 */}
      <div className={styles.header}>
        <div className={styles.headerIcon}>📋</div>
        <div className={styles.headerInfo}>
          <div className={styles.headerTitle}>인증기준 현장가이드</div>
          <div className={styles.headerSub}>급성기병원 4주기</div>
        </div>
        <div className={styles.badge}>4주기</div>
      </div>

      {/* 빠른 버튼 */}
      <div className={styles.quickWrap}>
        {QUICK_BTNS.map((b, i) => (
          <button key={i} className={styles.qb} onClick={() => sendMessage(b.q)}>
            {b.label}
          </button>
        ))}
      </div>

      {/* 메시지 영역 */}
      <div className={styles.msgs} ref={msgsRef}>
        {/* 웰컴 메시지 */}
        {messages.length === 0 && (
          <div className={`${styles.msg} ${styles.bot}`}>
            <div className={`${styles.av} ${styles.botAv}`}>AI</div>
            <div className={styles.welcomeCard}>
              <strong>인증기준 현장가이드입니다 👋</strong>
              <p>궁금한 상황을 자연어로 물어보세요.</p>
              <div className={styles.egList}>
                {[
                  '"낙상 고위험 표식 어디 붙여?"',
                  '"구두처방 언제 할 수 있어?"',
                  '"기준 1.4 설명해줘"',
                ].map((eg, i) => (
                  <div key={i} className={styles.eg}
                    onClick={() => sendMessage(eg.replace(/"/g, ''))}>
                    💬 {eg}
                  </div>
                ))}
              </div>
              <p className={styles.voiceHint}>🎤 마이크 버튼으로 음성 질문 가능 (크롬)</p>
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`${styles.msg} ${m.role === 'user' ? styles.user : styles.bot}`}>
            <div className={`${styles.av} ${m.role === 'user' ? styles.userAv : styles.botAv}`}>
              {m.role === 'user' ? '나' : 'AI'}
            </div>
            <div className={styles.bub}>{m.content}</div>
          </div>
        ))}

        {loading && (
          <div className={`${styles.msg} ${styles.bot}`}>
            <div className={`${styles.av} ${styles.botAv}`}>AI</div>
            <div className={styles.bub}>
              <span className={styles.dots}>
                <span>●</span><span>●</span><span>●</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 입력 영역 */}
      <div className={styles.bottom}>
        {voiceStatus && <div className={styles.voiceBar}>{voiceStatus}</div>}
        <div className={styles.inputRow}>
          <button
            className={`${styles.micBtn} ${isListening ? styles.micOn : ''}`}
            onClick={toggleVoice}
            aria-label="음성입력"
          >
            🎤
          </button>
          <input
            className={styles.textInput}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            placeholder="상황이나 키워드로 물어보세요..."
          />
          <button
            className={styles.sendBtn}
            onClick={() => sendMessage(input)}
            aria-label="전송"
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  )
}
