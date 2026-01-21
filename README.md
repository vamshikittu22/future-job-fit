# 🚀 Future Job Fit: AI-Powered Career Intelligence

> **Empowering professionals to bridge the gap between their experience and their dream career with a state-of-the-art, AI-driven recruitment intelligence platform.**

![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/frontend-React%20%2B%20Vite-blue)
![AI](https://img.shields.io/badge/AI-Multi--Model-purple)

---

## 📖 Platform Briefing

**Future Job Fit** is not just a document editor; it is a high-performance career companion designed for the modern job market. In an era where 75% of resumes are rejected by Applicant Tracking Systems (ATS) before a human ever sees them, our platform provides users with the tools to **fight back**.

By combining **Swiss-inspired minimalist design** with **multi-model AI intelligence**, we've created a seamless, three-panel workflow that lets you build, optimize, and preview your professional brand in real-time.

---

## 🔬 Architecture Showcase (About Platform)

We believe in transparency. The platform includes a dedicated **[About Platform](/about)** page that serves as our technical manifesto. It showcases:
- **Vision**: Our philosophy on bridging the "Semantic Decay" in recruitment.
- **Ecosystem**: A deep dive into our three-tier intelligence system (Local NLP, Edge Functions, Cloud LLM).
- **Resilience**: How we handle data persistence and state management.
- **Performance**: Real-world Lighthouse scores and Core Web Vitals.
- **Fidelity**: Our structured data models enforced by Zod.

---

## 🎯 High-Impact Workflows

### ⚡ The "Fast Creator"
*   **Rapid Entry**: Use **`Ctrl + K` (Quick Add)** to fire off roles without leaving your flow.
*   **Sample Data**: Instantly populate common fields to see high-standard professional examples.
*   **Achievement Templates**: One-click selection of professional structures to avoid writer's block.

### 🛡️ The "High-Impact Hunter"
*   **Real-time ATS Dashboard**: Monitor your score and keyword density as you type.
*   **AI Bullet Enhancer**: Transform passive duties into quantified achievements with Gemini 1.5 Flash.
*   **Skill Taxonomy**: Automatically categorize skills into Languages, Frameworks, and Tools.

### 🌐 The "Networker"
*   **LinkedIn Optimizer**: Generate headlines and summaries that match your resume.
*   **Unified Brand**: Copy formatted snippets designed for LinkedIn's specific display logic.

---

## 🛠️ Advanced Features

### 🤖 Hybrid AI Intelligence
*   **Browser-Native NLP (Pyodide)**: Local Python engine running in the browser handles deterministic tasks like keyword matching in <50ms with zero server cost.
*   **Secure Edge Functions**: Supabase Edge Functions act as a secure proxy for LLM calls—no API keys in the browser.
*   **Multi-Model Support**: Ready for Gemini, GPT-4o-mini, and Llama 3.3 via a unified gateway.

### 🎨 Premium Design System
*   **Atomic Components**: Built on Shadcn/ui and Radix primitives for maximum accessibility.
*   **Dark Mode Native**: Full support for system preferences with zero-flash implementation.
*   **Micro-Animations**: Purposeful motion powered by Framer Motion to reduce cognitive load.

### 📑 Universal Export Suite
*   **7+ Formats**: PDF (Selectable text), DOCX (Editable), LaTeX, HTML, Markdown, TXT, and JSON.
*   **Client-Side Generation**: All exports happen in-browser. Your PII never touches our servers.

---

## 📖 Documentation & Guides

Learn more about the platform's core modules:
- [AI Integration Guide](./docs/AI_INTEGRATION.md) — Multi-tier intelligence architecture.
- [Supabase Setup](./docs/SUPABASE_SETUP.md) — Edge Functions and AI gateway config.
- [NLP & Offline Parser](./docs/NLP_SETUP.md) — Private, local resume analysis.
- [Resume Wizard](./docs/RESUME_WIZARD.md) — Guided step-by-step experience.
- [Job Optimizer](./docs/JOB_OPTIMIZER.md) — ATS scoring and keyword matching.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or higher)
- [npm](https://www.npmjs.com/) or [Bun](https://bun.sh/)

### Quick Installation
1. **Clone & Install**
   ```bash
   git clone https://github.com/vamshikittu22/future-job-fit.git
   cd future-job-fit
   npm install
   ```

2. **Backend Configuration**
   The platform uses Supabase for Edge Functions. Use our setup script (Windows):
   ```powershell
   ./scripts/setup_ai_backend.ps1
   ```

3. **Launch Application**
   ```bash
   npm run dev
   ```
   Open `http://localhost:8080` to start building.

---

## 🤝 Roadmap
- [x] **Modular Architecture Refactor**: All major pages componentized for scalability.
- [x] **Secure AI Gateway**: Server-side key management.
- [x] **Browser-Native NLP**: Pyodide integration for offline parsing and scoring.
- [x] **Import from PDF**: Advanced parsing using the local NLP suite.
- [ ] **Tailored Cover Letter Generator**.

---

## 📄 License
MIT License - Developed with ❤️ for the high-performance career seeker.

