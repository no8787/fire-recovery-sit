# fire-examples 이미지 슬롯

`/fire-cases` 페이지의 "화재복구 과정 예시" 섹션에서 쓰는 AI 생성 예시 이미지 자리입니다.
**실제 시공사진이 아닙니다.** 실제 시공실적 사진은 `public/images/construction/`에 있습니다.

## 파일 배치 방법

각 예시는 5단계(STEP 1~5)이며, 아래 경로에 `0.jpg` ~ `4.jpg`로 넣으면 됩니다.

- `housing-kitchen-process-example/0.jpg` ~ `4.jpg` — 주택 주방 화재복구 과정
  1. 화재 직후
  2. 철거 및 잔존물 제거
  3. 그을음·냄새 제거
  4. 설비 및 마감 복구
  5. 복구 완료
- `commercial-fire-process-example/0.jpg` ~ `4.jpg` — 상가 화재복구 과정
  1. 화재 직후
  2. 안전조치 및 현장조사
  3. 철거 및 폐기물 처리
  4. 전기·설비 복구
  5. 인테리어 복구 완료

파일을 넣은 뒤 `src/lib/data/fire-recovery-examples.ts`의 각 단계 `src: ""`를
`/images/fire-examples/<slug>/<0~4>.jpg`로 채우면 자동으로 반영됩니다(코드 구조 변경 불필요).

## 오픈 전 체크리스트

- [ ] 실제 화재복구 시공사례가 확보되면 이 예시 콘텐츠(`fire-recovery-examples.ts`, 이 폴더)는
      삭제하거나 최소한 실제 사례보다 아래로 내릴 것
- [ ] 이미지는 특정 실제 주소·인물·브랜드를 특정할 수 없는 일반적인 연출컷으로 생성할 것
