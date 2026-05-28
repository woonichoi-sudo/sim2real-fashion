# sim2real-fashion

Gemini API(Nano Banana)를 사용한 의류 이미지 실사화(2D → photorealistic) 및 마스킹 기반 편집 작업 정리.

> **사용 환경:** 현재 **Gemini API만 사용 가능**합니다. Vertex AI Imagen은 사용하지 않습니다.
> 따라서 마스킹·재질 이식은 **파라미터가 아니라 프롬프트 + reference 이미지(대화형)** 로 처리합니다.

---

## 1. 모델

| 모델 ID | 별칭 | 비고 |
|---|---|---|
| `gemini-2.5-flash-image` | Nano Banana | 빠른 기본 편집 |
| `gemini-3.1-flash-image-preview` | Nano Banana 2 | 속도/품질 균형 |
| `gemini-3-pro-image-preview` | Nano Banana Pro | 고품질 실사화·복잡 합성 권장 |

실사화처럼 디테일·물리적 일관성이 중요한 작업은 **Nano Banana Pro** 권장.

---

## 2. 설정 가능한 파라미터

이미지 전용 엔드포인트가 없습니다. 일반 `generateContent` 호출의 `generationConfig` 안에 이미지 설정을 얹습니다.

| 파라미터 | 위치 | 값 / 타입 | 기능 |
|---|---|---|---|
| `responseModalities` | generationConfig | `["TEXT", "IMAGE"]` | 이미지 응답을 받도록 지정 (필수) |
| `aspectRatio` | generationConfig.imageConfig | `1:1`, `2:3`, `3:2`, `3:4`, `4:3`, `4:5`, `5:4`, `9:16`, `16:9`, `21:9`, `1:4`, `4:1`, `1:8`, `8:1` | 생성 이미지 종횡비 |
| `imageSize` | generationConfig.imageConfig | `512`, `1K`, `2K`, `4K` | 출력 해상도 |
| `thinkingLevel` | generationConfig.thinkingConfig | `minimal`, `high` | 추론(thinking) 강도 |
| `includeThoughts` | generationConfig.thinkingConfig | boolean | 사고 과정 포함 여부 |
| `temperature` / `topP` / `topK` | generationConfig | number | 샘플링 제어 |
| `candidateCount` | generationConfig | int | 생성 후보 개수 |
| `seed` | generationConfig | int | 재현성용 난수 시드 |

> **주의:** `editMode`, `mask`, `negativePrompt`, `guidanceScale`, `referenceImages`, `referenceType`, `personGeneration`, `sampleCount` 는 **Gemini API에 존재하지 않습니다.** (→ 4. 참고 섹션)

---

## 3. 마스킹 · 재질 이식 방법 (프롬프트 기반)

Gemini API에는 마스크 파라미터가 없으므로, **편집 영역은 프롬프트로 지시**하고 **reference 이미지는 `contents` 배열에 함께 넣습니다.**

### 핵심 기법

| 목적 | 방법 |
|---|---|
| 특정 영역만 편집 (마스킹 대체) | 프롬프트로 영역 명시 — *"자켓만 ~로 바꾸고 포즈·배경·얼굴은 그대로 유지"* |
| 재질/원단 이식 | 원본 + 원단 reference 이미지를 함께 투입, 프롬프트에서 *"두 번째 이미지의 원단 질감 적용"* 으로 앵커링 |
| 만화→실사 질감 | `negativePrompt`가 없으므로 긍정 프롬프트에 `photorealistic, realistic skin/fabric texture, studio lighting` 등을 명시 |
| 구도 유지 | *"keep the same pose, composition, and background"* 를 프롬프트에 명시 |
| 일관성 비교 | `seed` 고정 후 프롬프트만 미세 조정 |

### 요청 예시

```jsonc
// generateContent 요청 개념
{
  "contents": [{
    "role": "user",
    "parts": [
      { "inlineData": { "mimeType": "image/png", "data": "<원본 캐릭터 base64>" } },
      { "inlineData": { "mimeType": "image/png", "data": "<원단 reference base64>" } },
      { "text": "Make the jacket photorealistic using the fabric texture and color from the second image. Keep the pose, composition, and background exactly the same. Realistic fabric weave, studio lighting." }
    ]
  }],
  "generationConfig": {
    "responseModalities": ["TEXT", "IMAGE"],
    "imageConfig": { "aspectRatio": "3:4", "imageSize": "2K" }
  }
}
```

> **팁:** 원단 reference는 옷 전체 사진보다 **질감·색이 잘 드러나는 패브릭 영역만 타이트하게 크롭**해서 넣으면 모델이 노이즈 없이 질감을 파악합니다.

---

## 4. 참고 — Vertex AI Imagen (현재 사용 불가)

> 아래는 **향후 Vertex AI 권한 확보 시** 참고용. 현재 환경에서는 사용하지 않습니다.

Imagen(`imagen-3.0-capability-001`)은 마스크/reference 이미지로 편집 영역을 **파라미터로 정밀 격리**할 수 있습니다. 프롬프트 기반인 Gemini와 가장 큰 차이점입니다.

| 파라미터 | 값 / 타입 | 기능 |
|---|---|---|
| `referenceType` | `REFERENCE_TYPE_RAW`, `REFERENCE_TYPE_MASK` | reference 이미지 역할 지정 (원본/마스크) |
| `maskMode` | `MASK_MODE_USER_PROVIDED`, `background`, `foreground`, `semantic` | 마스크 직접 제공 / 자동 검출 |
| `editMode` | `inpainting-insert`, `inpainting-remove`, `outpainting` | 삽입 / 제거 / 캔버스 확장 |
| `guidanceScale` | int (0–9 약 / 10–20 중 / 21+ 강) | 프롬프트 반영 강도 (실사화 21+ 권장) |
| `negativePrompt` | string | 제외 요소 (`anime, cartoon, 2d, blurry`) |
| `baseSteps` | int (35~75) | 디노이징 스텝 수 |
| `seed` / `sampleCount` | int / 1–4 | 재현성 / 생성 개수 |
| `personGeneration` | `dont_allow`, `allow_adult`, `allow_all` | 인물 생성 허용 범위 |

---

## 출처

- [Nano Banana image generation 가이드 — ai.google.dev](https://ai.google.dev/gemini-api/docs/image-generation)
- [Generating content (GenerationConfig 레퍼런스) — ai.google.dev](https://ai.google.dev/api/generate-content)
- [Edit images — Imagen API (Vertex AI, 참고용)](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/model-reference/imagen-api-edit)
