# 🤖 AI Integration Guide

The **AI Resume Builder** features a powerful, multi-provider AI engine that helps users optimize their resumes for ATS and professional impact.

## ⚙️ Configuration

The AI engine is configured via your `.env` file. You can choose your provider and model depending on your needs for speed, cost, or quality.

### Provider Settings

Set `VITE_AI_PROVIDER` to one of the following:

| Provider | Model Used | Best For |
| :--- | :--- | :--- |
| `gemini` | `gemini-1.5-flash` | Speed & Free-tier availability |
| `openai` | `gpt-4o-mini` | High quality & consistency |
| `groq` | `llama-3.3-70b` | Performance and ultra-low latency |

### API Keys

Add the corresponding keys to your `.env` file:
```env
VITE_GEMINI_API_KEY=...
VITE_OPENAI_API_KEY=...
VITE_GROQ_API_KEY=...
```

## 🛠️ How it Works

The core logic resides in `src/shared/api/resumeAI.ts`. It uses a centralized `ResumeAIService` class.

### 1. Enhancement Request
When a user clicks "Enhance", the service sends the following context to the AI:
- The **Section Type** (e.g., "Experience")
- The **Original Text**
- The **Quick Preset** (ATS Optimized, Concise, or Maximum Impact)
- **Tone & Style** (Formal, Modern, etc.)
- **Highlights** (Technical, Leadership, etc.)

### 2. Multi-Variant Response
The AI returns a JSON object containing 3 to 5 improved variations. The user can then preview and select the one they like best.

### 3. Section Analysis
The service also provides an `analyzeSection` method. This evaluates the user's current content and returns:
- A numerical score (0-100)
- A list of strengths
- A list of weaknesses
- Actionable suggestions

## 🚨 Security & Efficiency

- **Client-Side Proxy**: Currently, requests are made directly from the client. Ensure your API keys are protected or use a backend proxy for production environments.
- **Optimized Prompting**: We use highly tuned system prompts to ensure the AI remains factual and avoids "hallucinations" (inventing companies or roles).
- **JSON Mode**: Both OpenAI and Gemini are forced into `json_object` or `responseMimeType: "application/json"` mode to ensure reliable parsing.

## 🧪 Testing your Setup

You can verify your AI setup by:
1. Opening the **Professional Summary** step.
2. Typing a few words.
3. Clicking the **"Enhance with AI"** button.
4. If the variants appear, your API key and provider are correctly configured.