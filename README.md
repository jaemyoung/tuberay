# 📺 튜브레이 (TubeRay)

YouTube 영상을 검색하고 채널 구독자 수, 조회수 등의 통계를 확인할 수 있는 웹 애플리케이션입니다.

## 🌟 주요 기능

- 🔍 키워드로 YouTube 영상 검색
- 📊 영상별 상세 통계 표시
  - 조회수
  - 좋아요 수
  - 댓글 수
- 📺 채널 정보 표시
  - 구독자 수
  - 채널의 전체 영상 수
- 🎨 반응형 디자인 (모바일/태블릿/PC 지원)
- ⚡ 빠른 검색 및 실시간 로딩 상태 표시

## 🛠️ 기술 스택

- **React 18** - UI 프레임워크
- **Vite** - 빌드 도구
- **YouTube Data API v3** - 영상 검색 및 통계
- **Axios** - HTTP 클라이언트
- **CSS3** - 스타일링

## 📋 사전 준비

### YouTube Data API 키 발급

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. "API 및 서비스" > "라이브러리" 이동
4. "YouTube Data API v3" 검색 및 사용 설정
5. "사용자 인증 정보" > "사용자 인증 정보 만들기" > "API 키" 선택
6. 생성된 API 키 복사

## 🚀 설치 및 실행

### 1. 의존성 설치

```bash
cd 개인/튜브레이_copy
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 열고 YouTube API 키를 입력하세요:

```env
VITE_YOUTUBE_API_KEY=여기에_발급받은_API_키_입력
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저가 자동으로 열리고 `http://localhost:3000`에서 애플리케이션이 실행됩니다.

### 4. 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

## 📖 사용 방법

1. 검색창에 원하는 키워드 입력 (예: "리액트 강의", "요리 레시피" 등)
2. 🔍 검색 버튼 클릭
3. 검색 결과 확인
   - 영상 카드 클릭 시 YouTube에서 영상 재생
   - 채널 정보 클릭 시 해당 채널로 이동

## 📁 프로젝트 구조

```
튜브레이_copy/
├── index.html              # HTML 템플릿
├── package.json            # 의존성 관리
├── vite.config.js          # Vite 설정
├── .env                    # 환경 변수 (API 키)
├── .gitignore             # Git 무시 파일
└── src/
    ├── main.jsx           # 앱 진입점
    ├── App.jsx            # 메인 앱 컴포넌트
    ├── App.css            # 앱 스타일
    ├── index.css          # 전역 스타일
    ├── components/        # React 컴포넌트
    │   ├── SearchBar.jsx  # 검색 바
    │   ├── SearchBar.css
    │   ├── VideoList.jsx  # 영상 리스트
    │   ├── VideoList.css
    │   ├── VideoCard.jsx  # 영상 카드
    │   ├── VideoCard.css
    │   ├── Loading.jsx    # 로딩 컴포넌트
    │   └── Loading.css
    └── utils/
        └── youtube.js     # YouTube API 유틸리티
```

## 🔧 API 기능 설명

### `searchVideos(keyword, maxResults)`

YouTube에서 키워드로 영상을 검색하고 상세 정보를 가져옵니다.

**파라미터:**
- `keyword` (string): 검색할 키워드
- `maxResults` (number): 검색 결과 수 (기본값: 10)

**반환값:**
```javascript
[
  {
    id: "영상 ID",
    title: "영상 제목",
    description: "영상 설명",
    thumbnail: "썸네일 URL",
    channelTitle: "채널 이름",
    channelId: "채널 ID",
    publishedAt: "게시일",
    viewCount: 조회수,
    likeCount: 좋아요수,
    commentCount: 댓글수,
    subscriberCount: 구독자수,
    videoCount: 채널_영상수
  }
]
```

### 유틸리티 함수

- `formatNumber(num)`: 숫자를 한국어 단위로 포맷팅 (만, 억)
- `formatDate(isoDate)`: ISO 날짜를 상대 시간으로 변환 (오늘, 어제, N일 전 등)

## ⚠️ 주의사항

- YouTube Data API는 일일 할당량이 제한되어 있습니다 (기본 10,000 units/day)
- API 키는 절대 공개 저장소에 커밋하지 마세요
- `.env` 파일은 `.gitignore`에 포함되어 있습니다

## 🎨 커스터마이징

### 검색 결과 수 변경

`src/App.jsx` 파일에서 `handleSearch` 함수 내 `searchVideos`의 두 번째 파라미터를 수정하세요:

```javascript
const results = await searchVideos(keyword, 20); // 20개로 변경
```

### 스타일 수정

각 컴포넌트의 CSS 파일을 수정하여 원하는 디자인으로 변경할 수 있습니다.

## 📄 라이선스

MIT License

## 🤝 기여

이슈 제보 및 기여는 언제든 환영합니다!
