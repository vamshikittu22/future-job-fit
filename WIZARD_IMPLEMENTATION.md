# 🏗️ Resume Wizard - Technical Implementation

This project follows a **Feature-Sliced Design (FSD)** inspired architecture, focusing on modularity, scalability, and type safety.

## 📁 Architecture Overview

```
src/
├── features/
│   └── resume-builder/      # Core feature domain
│       ├── components/      # Editor, Layout, Preview, Steps
│       └── pages/           # Wizard entry points
├── shared/
│   ├── api/                 # AI Service (resumeAI.ts)
│   ├── contexts/            # Global State (Resume & Wizard)
│   ├── lib/                 # Export logic (pdf, docx)
│   └── ui/                  # Reusable shadcn/ui primitives
```

## 🧠 State Management

The application uses two primary React Contexts:

1.  **ResumeContext**: Manages the core resume data (`personal`, `history`, `skills`, etc.) with a built-in **Undo/Redo** stack and a 2-second debounced persistence to `LocalStorage`.
2.  **WizardContext**: Manages the wizard's UI state, including current step navigation, step validation (via Zod), and overall completion percentage.

## 🤖 AI Enhancement Engine

The `ResumeAIService` (`src/shared/api/resumeAI.ts`) is a provider-agnostic engine that supports:
- **OpenAI (GPT-4o-mini)**
- **Google Gemini (1.5 Flash)**
- **Groq (Llama 3.3 70B)**

It handles two main tasks:
- **Enhancement**: Rewriting sections into 3-5 variants based on strategies (ATS, Concise, Impact).
- **Analysis**: Scoring sections from 0-100 and generating actionable improvement tips.

## 📑 Export Engine

Exports are handled entirely on the client-side to ensure privacy:
- **PDF**: Uses `jsPDF` for layout and `html2canvas` for high-fidelity template rendering.
- **DOCX**: Uses `docx.js` to build structured Word documents from JSON data.
- **JSON**: Simple serialization of the `ResumeData` object.

## 🎨 Layout Design

The **Three-Panel Layout** is implemented in `WizardLayout.tsx`:
- Uses **Tailwind CSS Grid** for responsive positioning.
- **Framer Motion** handles smooth transitions between steps and collapsing/expanding panels.
- **Media Queries** switch between the three-panel desktop view and a stacked/modal-driven mobile experience.

## ✅ Current Features & Status

| Feature | Status | Technology |
| :--- | :--- | :--- |
| **Multi-step Forms** | ✅ Complete | React Hook Form & Zod |
| **Live Preview** | ✅ Complete | React Template Components |
| **AI Integration** | ✅ Complete | Multi-provider Service |
| **ATS Scoring** | ✅ Complete | Rule-based & AI-assisted |
| **PDF Export** | ✅ Complete | jsPDF / Canvas |
| **DOCX Export** | ✅ Complete | docx.js |
| **Undo / Redo** | ✅ Complete | Context-based Stack |
| **Drag & Drop** | 🚧 Partial | Sections reordering is visual only |

## 🛠️ Implementation Details

### Validation
Each wizard step is backed by a Zod schema. Navigation is blocked unless the current step passes validation, ensuring high-quality data.

### Auto-save
A custom hook monitors the `ResumeData` state and triggers a debounced save to `LocalStorage` under the key `resume-wizard-autosave`.
