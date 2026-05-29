# Gemini API 파라미터 문서 링크 모음

> 최종 업데이트: 2026-05-29  
> 기준: Gemini API v1beta / Google AI Studio

---

## 목차

1. [generateContent 핵심 레퍼런스](#1-generatecontent-핵심-레퍼런스)
2. [이미지 생성 — Gemini 네이티브](#2-이미지-생성--gemini-네이티브)
3. [이미지 생성 — Imagen 4 (Gemini API)](#3-이미지-생성--imagen-4-gemini-api)
4. [thinkingConfig](#4-thinkingconfig)
5. [mediaResolution](#5-mediaresolution)
6. [Google Search 그라운딩](#6-google-search-그라운딩)
7. [safetySettings](#7-safetysettings)
8. [systemInstruction / 텍스트 생성](#8-systeminstruction--텍스트-생성)
9. [temperature · topP · topK · seed · candidateCount](#9-temperature--topp--topk--seed--candidatecount)
10. [모델 목록](#10-모델-목록)
11. [Vertex AI Imagen — 이미지 편집](#11-vertex-ai-imagen--이미지-편집-현재-사용-불가)
12. [File API / inlineData / 멀티모달](#12-file-api--inlinedata--멀티모달)
13. [Streaming (streamGenerateContent)](#13-streaming-streamgeneratecontent)
14. [Batch API](#14-batch-api)
15. [Function Calling / Tools](#15-function-calling--tools)
16. [Context Caching](#16-context-caching)
17. [Live API (WebSocket)](#17-live-api-websocket)
18. [Tokens · Embeddings](#18-tokens--embeddings)
19. [API 버전 · 릴리즈 노트](#19-api-버전--릴리즈-노트)

---

## 1. generateContent 핵심 레퍼런스

| 문서 | URL | 핵심 파라미터 |
|------|-----|--------------|
| Generating content REST 레퍼런스 | https://ai.google.dev/api/generate-content | `contents`, `systemInstruction`, `safetySettings`, `tools`, `toolConfig`, `generationConfig` 전체 필드, `responseModalities`, `imageConfig`, `thinkingConfig`, `mediaResolution`, `temperature`, `topP`, `topK`, `candidateCount`, `maxOutputTokens`, `seed`, `stopSequences`, `responseMimeType`, `responseSchema` |
| Gemini API Reference 전체 개요 | https://ai.google.dev/api | v1/v1beta 엔드포인트 목록, 인증, SDK 링크 |
| All Methods Reference | https://ai.google.dev/api/all-methods | generateContent, streamGenerateContent, batchGenerateContent, countTokens, embedContent, models.list, files.* 전체 목록 |

**Base URL:** `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`

---

## 2. 이미지 생성 — Gemini 네이티브

이 프로젝트에서 직접 사용하는 모델(Nano Banana 계열)의 문서입니다.

| 문서 | URL | 핵심 파라미터 |
|------|-----|--------------|
| Image Generation 가이드 | https://ai.google.dev/gemini-api/docs/image-generation | `responseModalities: ["TEXT","IMAGE"]`, `imageConfig.aspectRatio`, `imageConfig.imageSize` (`512`·`1K`·`2K`·`4K`) |
| gemini-2.5-flash-image 모델 카드 | https://ai.google.dev/gemini-api/docs/models/gemini-2.5-flash-image | 지원 기능, 이미지 해상도 1024 고정 |
| gemini-3.1-flash-image 모델 카드 | https://ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-image | imageSize `512`~`4K`, aspectRatio `1:1`~`21:9` (+극단비 `1:4`·`4:1`·`1:8`·`8:1` 전용) |

### 모델별 파라미터 제약 요약

| 모델 | imageSize | aspectRatio | thinking | google_search |
|------|-----------|-------------|----------|---------------|
| `gemini-2.5-flash-image` | 1024 고정 (설정 불가) | 1:1 ~ 21:9 | ✗ | ✗ |
| `gemini-3.1-flash-image` | 512 / 1K / 2K / 4K | 1:1 ~ 21:9 (+`1:4`·`4:1`·`1:8`·`8:1` 전용) | ✓ | ✓ (searchTypes 포함) |
| `gemini-3-pro-image` | 1K / 2K / 4K | 1:1 ~ 21:9 | ✓ | ✓ |

---

## 3. 이미지 생성 — Imagen 4 (Gemini API)

> 현재 프로젝트는 Gemini API 직접 호출만 사용. Imagen 4는 별도 엔드포인트.

| 문서 | URL | 핵심 파라미터 |
|------|-----|--------------|
| Imagen 4 이미지 생성 가이드 | https://ai.google.dev/gemini-api/docs/imagen | `model` (`imagen-4.0-generate-001` 등), `numberOfImages` (1~4), `aspectRatio`, `imageSize` (`1K`·`2K`), `personGeneration` |
| Imagen 4 모델 카드 | https://ai.google.dev/gemini-api/docs/models/imagen | Imagen 4 / 4 Ultra / 4 Fast 모델 ID 및 스펙 |

---

## 4. thinkingConfig

| 문서 | URL | 핵심 파라미터 |
|------|-----|--------------|
| Thinking 가이드 | https://ai.google.dev/gemini-api/docs/thinking | `thinkingConfig.thinkingLevel` (`minimal`·`low`·`medium`·`high`), `thinkingConfig.includeThoughts` (bool), `thinkingConfig.thinkingBudget` (0~32768, -1=dynamic) |
| Thought Signatures | https://ai.google.dev/gemini-api/docs/thought-signatures | `thoughtSignature` 필드, 멀티턴 대화에서 thought 재전달 방법 |
| Thinking — Interactions API | https://ai.google.dev/gemini-api/docs/interactions/thinking | Gemini 3.x Interactions API에서의 thinkingConfig |

### thinkingLevel 값 정리

| 값 | 의미 |
|----|------|
| `minimal` | 최소 추론 — 빠른 응답 |
| `low` | 낮은 추론 강도 |
| `medium` | 중간 추론 강도 |
| `high` | 최고 품질 추론 — 느리지만 정확 |

---

## 5. mediaResolution

| 문서 | URL | 핵심 파라미터 |
|------|-----|--------------|
| Media Resolution 가이드 | https://ai.google.dev/gemini-api/docs/media-resolution | `mediaResolution` enum (파트별 설정 가능) |

### mediaResolution 값 및 토큰 비용 (Gemini 3 기준)

| 값 | 이미지 토큰 | 비디오 토큰 | PDF 토큰 |
|----|-----------|-----------|---------|
| `MEDIA_RESOLUTION_LOW` | 280 | 70 | 280 |
| `MEDIA_RESOLUTION_MEDIUM` | 560 | 70 | 560 |
| `MEDIA_RESOLUTION_HIGH` | 1120 | 280 | 1120 |
| `MEDIA_RESOLUTION_ULTRA_HIGH` | 2240 | — | — |

> Gemini 3 기준, 기본값(미설정 = `MEDIA_RESOLUTION_UNSPECIFIED`)은 `MEDIA_RESOLUTION_HIGH`(이미지 1120 토큰)와 동일하게 동작. (Gemini 2.5 계열은 토큰 수가 다름)

---

## 6. Google Search 그라운딩

| 문서 | URL | 핵심 파라미터 |
|------|-----|--------------|
| Grounding with Google Search | https://ai.google.dev/gemini-api/docs/google-search | `tools: [{google_search: {}}]`, 응답 `groundingMetadata.webSearchQueries`, `groundingMetadata.groundingChunks`, `groundingMetadata.groundingSupports`, `groundingMetadata.searchEntryPoint` |
| Grounding — Interactions API | https://ai.google.dev/gemini-api/docs/interactions/google-search | Gemini 3 Interactions API에서의 google_search |
| Grounding with Google Maps | https://ai.google.dev/gemini-api/docs/maps-grounding | Google Maps 연동 그라운딩 |

### 요청 예시

```json
{
  "tools": [{ "google_search": {} }]
}
```

> `searchTypes`(webSearch / imageSearch)는 `gemini-3.1-flash-image` 전용 확장이며, JSON 위치가 공식 문서에 아직 미확정.

---

## 7. safetySettings

| 문서 | URL | 핵심 파라미터 |
|------|-----|--------------|
| Safety Settings 가이드 | https://ai.google.dev/gemini-api/docs/safety-settings | `HarmCategory`, `HarmBlockThreshold`, `HarmProbability` |
| SafetySetting REST 타입 | https://ai.google.dev/api/rest/v1/SafetySetting | SafetySetting 객체 스키마 |
| Safety and Factuality Guidance | https://ai.google.dev/gemini-api/docs/safety-guidance | 안전 필터 원리, 확률 기반 블로킹 방식 |

### HarmCategory 목록

| 값 | 설명 |
|----|------|
| `HARM_CATEGORY_HARASSMENT` | 괴롭힘 |
| `HARM_CATEGORY_HATE_SPEECH` | 혐오 발언 |
| `HARM_CATEGORY_SEXUALLY_EXPLICIT` | 성적 명시 콘텐츠 |
| `HARM_CATEGORY_DANGEROUS_CONTENT` | 위험 콘텐츠 |
| `HARM_CATEGORY_CIVIC_INTEGRITY` | 시민 무결성 |

### HarmBlockThreshold 값

| 값 | 설명 |
|----|------|
| `BLOCK_NONE` / `OFF` | 차단 없음 (인물 사진 등에 사용) |
| `BLOCK_ONLY_HIGH` | 높은 확률만 차단 |
| `BLOCK_MEDIUM_AND_ABOVE` | 중간 이상 차단 |
| `BLOCK_LOW_AND_ABOVE` | 낮은 확률 이상 모두 차단 |

> **Gemini 2.5/3 기본값 = `OFF`**

---

## 8. systemInstruction / 텍스트 생성

| 문서 | URL | 핵심 파라미터 |
|------|-----|--------------|
| Text Generation 가이드 | https://ai.google.dev/gemini-api/docs/text-generation | `systemInstruction: {parts: [{text: "..."}]}` |

### 요청 예시

```json
{
  "systemInstruction": {
    "parts": [{ "text": "Always render photorealistic results." }]
  }
}
```

> systemInstruction은 텍스트 전용. 이미지 파트 포함 불가.

---

## 9. temperature · topP · topK · seed · candidateCount

| 문서 | URL |
|------|-----|
| Prompt Design Strategies | https://ai.google.dev/gemini-api/docs/models/generative-models |
| GenerationConfig (Vertex AI REST) | https://docs.cloud.google.com/vertex-ai/generative-ai/docs/reference/rest/v1/GenerationConfig |

### GenerationConfig 파라미터 전체

| 파라미터 | 타입 | 기본값 | 범위 | 설명 |
|---------|------|--------|------|------|
| `temperature` | float | 1.0 | 0.0 ~ 2.0 | 낮을수록 결정론적, 높을수록 창의적 |
| `topP` | float | 0.95 | 0.0 ~ 1.0 | 누적 확률 컷오프 (temperature와 동시 사용 비권장) |
| `topK` | int | — | 1 이상 | 상위 K개 토큰에서 샘플링 |
| `candidateCount` | int | 1 | 1 (이미지 생성은 1 고정) | 생성 후보 개수 |
| `maxOutputTokens` | int | — | 모델별 상한 | 최대 출력 토큰 수 |
| `seed` | int | — | — | 재현성을 위한 난수 시드 |
| `stopSequences` | string[] | — | — | 생성 중단 트리거 문자열 목록 |
| `responseMimeType` | string | `text/plain` | — | `text/plain` · `application/json` · `text/x.enum` |
| `responseSchema` | Schema | — | — | 구조화 출력 JSON 스키마 |

---

## 10. 모델 목록

| 문서 | URL |
|------|-----|
| Gemini 모델 목록 | https://ai.google.dev/gemini-api/docs/models |
| Models REST API Reference | https://ai.google.dev/api/models |
| 릴리즈 노트 / Changelog | https://ai.google.dev/gemini-api/docs/changelog |

---

## 11. Vertex AI Imagen — 이미지 편집 (현재 사용 불가)

> 이 프로젝트에서는 **Vertex AI 권한이 없어 현재 사용 불가**. 향후 참고용.

| 문서 | URL | 핵심 파라미터 |
|------|-----|--------------|
| Edit Images API Reference | https://docs.cloud.google.com/vertex-ai/generative-ai/docs/model-reference/imagen-api-edit | `referenceType`, `maskMode`, `editMode`, `guidanceScale`, `negativePrompt` |
| Imagen API (텍스트→이미지) | https://docs.cloud.google.com/vertex-ai/generative-ai/docs/model-reference/imagen-api | `negativePrompt`, `aspectRatio`, `guidanceScale`, `seed`, `sampleCount`, `safetyFilterLevel`, `personGeneration`, `addWatermark` |
| Imagen 이미지 커스터마이징 | https://docs.cloud.google.com/vertex-ai/generative-ai/docs/model-reference/imagen-api-customization | Subject customization referenceType |
| 인페인팅 코드 샘플 | https://docs.cloud.google.com/vertex-ai/generative-ai/docs/samples/generativeaionvertexai-imagen-edit-image-mask | Python/curl 코드 예제 |

### Vertex AI Imagen 파라미터 요약

| 파라미터 | 값 / 타입 | 기능 |
|---------|----------|------|
| `referenceType` | `REFERENCE_TYPE_RAW` · `REFERENCE_TYPE_MASK` · `REFERENCE_TYPE_SUBJECT` · `REFERENCE_TYPE_CONTROL` · `REFERENCE_TYPE_STYLE` | reference 이미지 역할 지정 |
| `maskMode` | `MASK_MODE_DEFAULT` · `MASK_MODE_USER_PROVIDED` · `MASK_MODE_BACKGROUND` · `MASK_MODE_FOREGROUND` · `MASK_MODE_SEMANTIC` | 마스크 직접 제공 / 자동 검출 |
| `editMode` | `EDIT_MODE_INPAINT_INSERTION` · `EDIT_MODE_INPAINT_REMOVAL` · `EDIT_MODE_OUTPAINT` · `EDIT_MODE_BGSWAP` | 삽입 / 제거 / 캔버스 확장 / 배경 교체 |
| `guidanceScale` | int (0~9 약 / 10~20 중 / 21+ 강) | 프롬프트 반영 강도 (실사화 21+ 권장) |
| `negativePrompt` | string | 제외 요소 지정 (`anime, cartoon, 2d, blurry`) |
| `baseSteps` | int (35~75) | 디노이징 스텝 수 |
| `seed` / `sampleCount` | int / 1~4 | 재현성 / 생성 개수 |
| `personGeneration` | `dont_allow` · `allow_adult` · `allow_all` | 인물 생성 허용 범위 |

---

## 12. File API / inlineData / 멀티모달

| 문서 | URL | 핵심 파라미터 |
|------|-----|--------------|
| Files API Guide | https://ai.google.dev/gemini-api/docs/files | 업로드 엔드포인트, `mimeType`, `display_name`, 최대 2GB, 48시간 만료 |
| File Input Methods | https://ai.google.dev/gemini-api/docs/file-input-methods | `inlineData` (Base64) vs `fileData` (file_uri), 지원 mimeType |
| Files API REST Reference | https://ai.google.dev/api/files | files.list / get / delete / register 엔드포인트 |
| Vision / Image Understanding | https://ai.google.dev/gemini-api/docs/vision | 이미지 입력, 최대 3,600개/요청, 토큰 계산 방식 |

### inlineData vs fileData 선택 기준

| 방식 | 형태 | 권장 크기 | 용도 |
|------|------|---------|------|
| `inlineData` | Base64 문자열 | 이미지 20MB 이하 (요청 전체 ~100MB) | 소용량 이미지, 빠른 테스트 |
| `fileData` | file_uri (Files API) | 20MB ~ 2GB | 대용량 파일, 반복 재사용 |

### 지원 이미지 mimeType

`image/png` · `image/jpeg` · `image/webp` · `image/heic` · `image/heif`

---

## 13. Streaming (streamGenerateContent)

| 문서 | URL |
|------|-----|
| Streaming 가이드 | https://ai.google.dev/gemini-api/docs/interactions |

**엔드포인트:** `POST /v1beta/models/{model}:streamGenerateContent`  
요청 구조는 generateContent와 동일. 응답 형식은 SSE(Server-Sent Events).

---

## 14. Batch API

| 문서 | URL | 핵심 파라미터 |
|------|-----|--------------|
| Batch API REST Reference | https://ai.google.dev/api/batch-api | `displayName`, `inputConfig` (`fileName` / `requests`), `generationConfig`, `systemInstruction`, `tools` |
| Batch Mode 가이드 | https://ai.google.dev/gemini-api/docs/batch-mode | 생성/조회/취소/삭제 엔드포인트, File API 연동으로 결과 다운로드 |
| batchEmbedContents Reference | https://ai.google.dev/api/rest/v1/models/batchEmbedContents | `EmbedContentRequest` 배열 |

> 동기 API 대비 **50% 비용 절감**, 24시간 이내 처리.

---

## 15. Function Calling / Tools

| 문서 | URL | 핵심 파라미터 |
|------|-----|--------------|
| Function Calling 가이드 | https://ai.google.dev/gemini-api/docs/function-calling | `FunctionDeclaration` (name, description, parameters), `toolConfig.functionCallingConfig.mode` (`AUTO`·`ANY`·`VALIDATED`·`NONE`), `allowedFunctionNames` |
| Tools Overview | https://ai.google.dev/gemini-api/docs/tools | 내장 도구(google_search, code_execution, file_search) + 커스텀 함수 조합 |

---

## 16. Context Caching

| 문서 | URL | 핵심 파라미터 |
|------|-----|--------------|
| Context Caching 가이드 | https://ai.google.dev/gemini-api/docs/caching | `CachedContent` (model, contents, systemInstruction, ttl, display_name), `GenerateContentConfig.cached_content` 참조 |
| Caching REST API Reference | https://ai.google.dev/api/caching | cachedContents CRUD 엔드포인트 스키마 |

---

## 17. Live API (WebSocket)

| 문서 | URL | 핵심 파라미터 |
|------|-----|--------------|
| Live API WebSocket Reference | https://ai.google.dev/api/live | `BidiGenerateContentSetup`, `responseModalities`, `sessionConfig` |

**엔드포인트:** `wss://generativelanguage.googleapis.com/ws/.../BidiGenerateContent`

---

## 18. Tokens · Embeddings

| 문서 | URL | 핵심 파라미터 |
|------|-----|--------------|
| countTokens API | https://ai.google.dev/api/tokens | `POST /v1beta/{model}:countTokens`, 응답 `totalTokens` |
| Embeddings API Reference | https://ai.google.dev/api/embeddings | `embedContent` 엔드포인트, `embedContentConfig` (구 top-level `taskType`·`title`·`outputDimensionality`는 deprecated) |

---

## 19. API 버전 · 릴리즈 노트

| 문서 | URL |
|------|-----|
| API Versions (v1 vs v1beta) | https://ai.google.dev/gemini-api/docs/api-versions |
| Changelog / Release Notes | https://ai.google.dev/gemini-api/docs/changelog |

- **v1** — 프로덕션 안정 기능만 포함
- **v1beta** — 실험적 기능 포함 (이미지 생성, thinking 등 대부분이 현재 여기에 위치)

---

## 빠른 참조

| 주제 | URL |
|------|-----|
| generateContent 전체 파라미터 | https://ai.google.dev/api/generate-content |
| 이미지 생성 (Gemini 네이티브) | https://ai.google.dev/gemini-api/docs/image-generation |
| 이미지 생성 (Imagen 4) | https://ai.google.dev/gemini-api/docs/imagen |
| thinkingConfig | https://ai.google.dev/gemini-api/docs/thinking |
| mediaResolution | https://ai.google.dev/gemini-api/docs/media-resolution |
| Google Search 그라운딩 | https://ai.google.dev/gemini-api/docs/google-search |
| safetySettings | https://ai.google.dev/gemini-api/docs/safety-settings |
| 모델 목록 | https://ai.google.dev/gemini-api/docs/models |
| File API | https://ai.google.dev/gemini-api/docs/files |
| Batch API | https://ai.google.dev/api/batch-api |
| Function Calling | https://ai.google.dev/gemini-api/docs/function-calling |
| Context Caching | https://ai.google.dev/gemini-api/docs/caching |
| Live API | https://ai.google.dev/api/live |
| Vertex AI Imagen 편집 | https://docs.cloud.google.com/vertex-ai/generative-ai/docs/model-reference/imagen-api-edit |
| Vertex AI Imagen 생성 | https://docs.cloud.google.com/vertex-ai/generative-ai/docs/model-reference/imagen-api |
| API 버전 (v1/v1beta) | https://ai.google.dev/gemini-api/docs/api-versions |
| 릴리즈 노트 | https://ai.google.dev/gemini-api/docs/changelog |
