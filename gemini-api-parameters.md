# Gemini API 파라미터 (실사화 작업용)

Vertex AI 제외, **Gemini API에서 실제 사용되는 파라미터만** 공식 문서를 직접 접속해 검증·정리. (작성 2026-05-29)

**접속·검증한 문서**
- [generate-content 레퍼런스](https://ai.google.dev/api/generate-content) — GenerationConfig·요청/응답 구조
- [image generation 가이드](https://ai.google.dev/gemini-api/docs/image-generation) — imageConfig·thinking·grounding·reference
- [media-resolution](https://ai.google.dev/gemini-api/docs/media-resolution) — mediaResolution
- [Gemini 3 가이드](https://ai.google.dev/gemini-api/docs/gemini-3) — thinkingLevel·temperature 권고·thoughtSignature
- [모델: gemini-3-pro-image-preview](https://ai.google.dev/gemini-api/docs/models/gemini-3-pro-image-preview), [모델: gemini-2.5-flash-image](https://ai.google.dev/gemini-api/docs/models/gemini-2.5-flash-image)
- (인덱스 페이지 [ai.google.dev/api](https://ai.google.dev/api), [docs 홈](https://ai.google.dev/gemini-api/docs)은 네비게이션 전용 — 파라미터 없음)

---

## A. 이미지 출력 (`generationConfig.imageConfig`) — ★실사화 핵심

| 파라미터 | 타입 | 허용값 | 비고 |
|---|---|---|---|
| `aspectRatio` | string | `1:1`,`2:3`,`3:2`,`3:4`,`4:3`,`4:5`,`5:4`,`9:16`,`16:9`,`21:9` (+ 3.1-flash 전용 `1:4`,`4:1`,`1:8`,`8:1`) | 종횡비 |
| `imageSize` | string | Pro: `1K`,`2K`,`4K` / 3.1-flash: `512`,`1K`,`2K`,`4K` / 2.5-flash: **고정 1024(설정 불가)** | 출력 해상도 |

`responseModalities` (generationConfig): `["TEXT","IMAGE"]` 또는 `["IMAGE"]` — 이미지 응답 받기(필수).

---

## B. 추론 / 입력 디테일 — ★실사화 도움

| 파라미터 | 위치 | 타입 | 허용값 | 비고 |
|---|---|---|---|---|
| `thinkingLevel` | thinkingConfig | string | 이미지 모델: `minimal`,`high` (텍스트 Gemini3는 `minimal`/`low`/`medium`/`high`) | **2.5-flash 미지원** |
| `includeThoughts` | thinkingConfig | bool | true/false | 사고 과정 반환(품질 무관) |
| `mediaResolution` | generationConfig | enum | `MEDIA_RESOLUTION_LOW`/`MEDIUM`/`HIGH`/`ULTRA_HIGH` (기본 `UNSPECIFIED`) | 입력 이미지 인식 토큰↑ → 원단 결 정확히 인식. global=전 모델, per-part=Gemini3 |

---

## C. GenerationConfig 일반 필드

| 파라미터 | 타입 | 비고 | 이미지 영향 |
|---|---|---|---|
| `temperature` | float | **Gemini 3: 기본 1.0 유지 권고** (낮추면 looping/품질저하) | △ (문서 미확인, 변경 비권장) |
| `topP` / `topK` | float / int | 샘플링 | △ 미확인 |
| `candidateCount` | int | 후보 개수 (여러 장 비교) | ○ 개수 제어 |
| `seed` | int | 재현성 | △ 미확인 |
| `maxOutputTokens` | int | 텍스트 길이 | ✕ 텍스트용 |
| `stopSequences` | string[] | 중단 시퀀스 | ✕ 텍스트용 |
| `presencePenalty`/`frequencyPenalty` | float | 반복 패널티 | ✕ 텍스트용 |
| `responseMimeType`/`responseSchema` | string/Schema | JSON 구조 출력 | ✕ 텍스트용 |
| `speechConfig` | object | TTS 오디오 | ✕ 오디오용 |

---

## D. 요청 최상위 (generationConfig 밖)

| 파라미터 | 타입 | 비고 |
|---|---|---|
| `contents` | Content[] | 이미지+텍스트 parts (reference 이미지 다중 투입) |
| `tools` | Tool[] | `[{ "google_search": {} }]` 검색 그라운딩 (2.5-flash 미지원). `searchTypes`(webSearch/imageSearch)는 3.1-flash 전용 ※JSON 위치 미확정 |
| `safetySettings` | SafetySetting[] | category: `HARM_CATEGORY_HARASSMENT`/`HATE_SPEECH`/`SEXUALLY_EXPLICIT`/`DANGEROUS_CONTENT`/`CIVIC_INTEGRITY`, threshold: `BLOCK_NONE`/`BLOCK_ONLY_HIGH`/`BLOCK_MEDIUM_AND_ABOVE`/`BLOCK_LOW_AND_ABOVE` |
| `systemInstruction` | Content | 지속 지시(텍스트 전용) |
| `toolConfig` / `cachedContent` | object/string | 툴 설정 / 컨텍스트 캐싱 |

---

## E. reference 이미지 입력 한도 (파라미터 아님 · 제약)

| 모델 | 오브젝트(원단 등) | 캐릭터(인물) |
|---|---|---|
| gemini-3.1-flash-image | 최대 10 | 최대 4 |
| gemini-3-pro-image | 최대 6 | 최대 5 |
| gemini-2.5-flash-image | 최대 3 (합산) | — |

---

## 주의 / 정정 사항

- **temperature**: Gemini 3 모델은 1.0 유지 권고. (이전 0.3 제안은 철회 — Gemini 3엔 부적합)
- **thoughtSignature**: 응답 parts에 들어오는 암호화된 추론 컨텍스트. **멀티턴 이미지 편집 시 다음 요청에 그대로 돌려줘야** 추론 일관성 유지 (이미지 생성은 strict 검증).
- **JSON 표기**: REST 전송은 camelCase(`inlineData`,`mimeType`,`responseModalities`) 사용. 레퍼런스 정의 페이지의 snake_case는 proto 이름 표기.
- `searchTypes`의 정확한 JSON 중첩 위치는 문서에서 확정 못 함(미검증).
- ★ = 실사화에 직접 유효, △ = GenerationConfig엔 있으나 이미지 출력 영향 문서 미확인, ✕ = 텍스트/오디오 전용.

## 실사화 권장 세팅 (Pro 모델)

```jsonc
{
  "generationConfig": {
    "responseModalities": ["IMAGE"],
    "imageConfig": { "aspectRatio": "1:1", "imageSize": "4K" },
    "mediaResolution": "MEDIA_RESOLUTION_HIGH",
    "thinkingConfig": { "thinkingLevel": "high" }
    // temperature는 설정하지 않음 (기본 1.0 유지)
  }
}
```
