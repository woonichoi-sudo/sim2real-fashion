# 조사한 문서 링크 모음

Gemini API 파라미터 검증 과정에서 조사한 공식 문서 링크. (작성 2026-05-29)

## Gemini API — 사용 대상

### 파라미터 레퍼런스 (직접 fetch 검증)
- [Generating content — generateContent / GenerationConfig 레퍼런스](https://ai.google.dev/api/generate-content) — **파라미터 본체.** generationConfig 전 필드, 요청/응답 구조, safetySettings, systemInstruction
- [Nano Banana image generation 가이드](https://ai.google.dev/gemini-api/docs/image-generation) — imageConfig(aspectRatio·imageSize 모델별), thinking, google_search, reference 이미지
- [Media resolution](https://ai.google.dev/gemini-api/docs/media-resolution) — mediaResolution enum과 토큰 영향

### 검색으로 찾음 (미fetch)
- [Gemini API reference 인덱스](https://ai.google.dev/api) — 모든 REST 타입 목록
- [Gemini API 문서 홈](https://ai.google.dev/gemini-api/docs)
- [Gemini 3 generateContent 가이드](https://ai.google.dev/gemini-api/docs/gemini-3)
- [모델: gemini-3-pro-image-preview](https://ai.google.dev/gemini-api/docs/models/gemini-3-pro-image-preview)
- [모델: gemini-2.5-flash-image](https://ai.google.dev/gemini-api/docs/models/gemini-2.5-flash-image)

## Vertex AI Imagen — 참고용 (현재 사용 불가)
- [Edit images — Imagen API](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/model-reference/imagen-api-edit)
- [Customize images — Imagen API](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/model-reference/imagen-api-customization)
- [Imagen for Editing and Customization (imagen-3.0-capability-001)](https://console.cloud.google.com/vertex-ai/publishers/google/model-garden/imagen-3.0-capability-001)
