# 인증기준 현장가이드

급성기병원 4주기 인증기준 현장 Q&A PWA 앱

## 기능
- 인증기준 키워드/상황 검색
- 음성 질문 지원 (크롬)
- 모바일 최적화
- PWA - 폰 홈화면에 설치 가능
- 다크모드 자동 지원

## 로컬 실행

```bash
npm install
npm run dev
```

## 배포 (Vercel)

### 1. GitHub에 올리기
```bash
git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/YOUR_USERNAME/cert-guide.git
git push -u origin main
```

### 2. Vercel 연결
- vercel.com 접속 → "Add New Project"
- GitHub 저장소 선택
- **Environment Variables** 설정 필수:
  - `ANTHROPIC_API_KEY` = sk-ant-xxxxxx

### 3. 배포 완료
- Vercel이 자동으로 URL 생성
- 예) https://cert-guide-삼선병원.vercel.app

### 4. 폰 홈화면에 설치
- 크롬으로 URL 접속
- 주소창 옆 "설치" 버튼 또는
- 메뉴 → "홈 화면에 추가"

### 5. QR코드 만들기
- qr.io 또는 구글 "QR코드 생성기" 검색
- Vercel URL 입력 → QR 생성 → 출력 → 병동 부착

## 기준 내용 수정
`pages/index.js` 파일의 `CERT` 객체를 수정하면 됩니다.
5주기로 변경되거나 규정이 개정될 때 해당 기준만 수정 후
GitHub에 push하면 Vercel이 자동으로 재배포합니다.

```javascript
const CERT = {
  "1.1": {
    t: "기준명",
    g: "가이드 내용",
    i: ["ME1...", "ME2..."]
  },
  // 기준 추가/수정
}
```
