# 🚀 AI Resume Evaluator & Builder

> **Empowering professionals to bridge the gap between their experience and their dream career with a state-of-the-art, AI-driven recruitment intelligence platform.**

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/frontend-React%20%2B%20Vite-blue)
![AI](https://img.shields.io/badge/AI-Multi--Model-purple)

---

## 📖 Platform Briefing

The **AI Resume Evaluator & Builder** is not just a document editor; it is a high-performance career companion designed for the modern job market. In an era where 75% of resumes are rejected by Applicant Tracking Systems (ATS) before a human ever sees them, our platform provides users with the tools to **fight back**.

By combining **Swiss-inspired minimalist design** with **multi-model AI intelligence**, we've created a seamless, three-panel workflow that lets you build, optimize, and preview your professional brand in real-time. Whether you are a fresh graduate or a C-suite executive, this platform handles the complexity of formatting and keyword optimization so you can focus on your story.

---

## 🎯 Use Cases & Workflows

### 1. The "Fast Creator" (Speed & Efficiency)
*   **Problem**: You've found a job posting with a deadline in 10 minutes.
*   **The Workflow**:
    *   Launch the **Resume Wizard**.
    *   Use **`Ctrl + K` (Quick Add)** to rapidly fire off your last three roles without leaving your flow.
    *   Click **"Load Sample Data"** to instantly populate common fields and see a high-standard example.
    *   **Achievement Templates**: One-click selection of professional structures like "Led a team..." or "Increased revenue by..." to avoid writer's block.
*   **Outcome**: A professional, formatted resume ready for submission in under 5 minutes.

### 2. The "High-Impact Hunter" (ATS Optimization)
*   **Problem**: You are applying for a highly competitive role and need a perfect ATS score.
*   **The Workflow**:
    *   Monitor the **Real-time ATS Dashboard** in the left sidebar as you type.
    *   **AI Content Score**: Click your score (e.g., 75/100) to see a detailed breakdown of Keyword Density, Metric Usage, and Readability.
    *   **AI Bullet Enhancer**: Use the "Enhance with AI" button on any work experience to transform passive duties into quantified achievements.
    *   **Skill Breakdown**: Our engine automatically categorizes your skills into Languages, Frameworks, and Tools, ensuring recruiters can scan your tech stack instantly.
*   **Outcome**: A document optimized for both the machine (ATS) and the human (Recruiter).

### 3. The "Networker" (Social Brand Sync)
*   **Problem**: Your resume looks great, but your LinkedIn profile is outdated and inconsistent.
*   **The Workflow**:
    *   Navigate to the **Review & Export** step.
    *   Launch the **LinkedIn Profile Optimizer**.
    *   **Headline Generator**: AI-crafted headlines that use your latest stats to catch recruiters' eyes in search results.
    *   **Social Summary**: Get an AI-optimized "About" section that narratives your resume summary.
    *   **One-Click Buffers**: Copy formatted experience snippets designed specifically for LinkedIn's bullet-point display.
*   **Outcome**: A unified professional brand across all platforms.

---

## 🔬 Case Study: Hybrid AI Intelligence

In our V2.0.0 release, we transitioned from a **Cloud-Only** AI architecture to a **Hybrid AI Strategy** to solve for latency and cost.

### The Challenge
As users built resumes, the system performed ATS scoring and keyword density analysis on every keystroke. Using Cloud LLMs (Gemini/GPT-4) for these deterministic tasks resulted in:
- **Latency**: 1.5s - 3s per analysis.
- **Cost**: High token consumption for repetative extraction.
- **Privacy**: Unnecessary transmission of PII for simple pattern matching.

### The Solution: Offline NLP Parser
We engineered a dedicated **Python FastAPI service** that lives alongside the frontend.
1. **Local Processing**: ATS scoring, structural parsing, and keyword matching are handled in <50ms.
2. **Deterministic Engine**: Uses a high-performance regex-based NLP engine optimized for Python 3.14.
3. **Smart Fallback**: Creative tasks like "Bullet Point Rewriting" are still routed to Gemini, but only when requested.

### The Result
- **80% Cost Reduction**: Token usage dropped significantly as 4/5 AI tasks moved offline.
- **Instant UX**: Scoring updates are now invisible to the user's perception of time.
- **Privacy First**: Sensitive contact info extraction happens locally.

---

## �️ Advanced Features

### 🤖 Hybrid AI Intelligence
*   **Offline NLP Parser**: A dedicated Python FastAPI service that handles deterministic tasks like resume parsing, keyword matching, and ATS scoring locally. This reduces LLM token usage by ~60-80% and provides near-instant scoring.
*   **Cloud LLM Integration**: Uses Google Gemini (1.5 Flash) via Supabase Edge Functions for creative tasks like content enhancement and bullet point optimization.
*   **Transparent Connectivity**: Built-in status indicators show if you are in **Offline Mode**, **Demo Mode**, or **Live Connected**.
*   **Safety First**: Encourages users to use their own API keys for maximum privacy and cost control.

### 🎨 Premium Design & UX
*   **Three-Panel Workflow**: Sidebar (Analysis), Center (Editor), and Right (Live Preview) allow for zero-context-switching productivity.
*   **Safe-Deletions**: Integrated **Undo** functionality with 5-second toast notifications prevents accidental data loss.
*   **Auto-Save Engine**: 2-second debounced persistence to LocalStorage with a visual "Last Saved" indicator.
*   **Responsive Excellence**: A custom Drawer system for mobile users ensures the wizard is fully functional on any device.

### 📑 Multi-Format Export Suite
*   **PDF**: High-fidelity, print-ready documents.
*   **DOCX**: Fully editable Word files for final manual tweaks.
*   **LaTeX**: Clean, academic-grade source files.
*   **JSON/Markdown**: Portable data versions for developers and backups.

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

2. **Automated AI Setup**
   The platform uses a dedicated power-script to handle all backend configurations. Run this in PowerShell (Windows) or your terminal:
   ```powershell
   ./scripts/setup_ai_backend.ps1
   ```
   *This script handles Supabase login, API key configuration, and Edge Function deployment.*

3. **Offline NLP Parser (Optional but Recommended)**
   For high-speed ATS scoring and substantial token savings:
   ```bash
   cd offline-parser
   # Windows
   .\venv\Scripts\python main.py
   # UX/Linux
   source venv/bin/activate
   python main.py
   ```
   *The parser will run on `http://localhost:8000`.*

4. **Launch Application**
   ```bash
   npm run dev
   ```
   Open `http://localhost:8080` and start your journey!

### 🌎 Cloud Deployment (Optional)
The offline parser can be deployed to Google Cloud Run using the provided scripts:
- **Windows**: `./offline-parser/deploy.ps1`
- **Linux/macOS**: `./offline-parser/deploy.sh`

---

## 🤝 Roadmap & Contribution
We are constantly evolving. Our current priorities include:
- [x] **Job-to-Resume Mapping**: Powered by the new Offline NLP engine.
- [ ] **Import from PDF**: Advanced parsing using the local NLP suite.
- [ ] **Tailored Cover Letter Generator**.

**Want to contribute?** We love PRs! Check out our [Contributing Guidelines](CONTRIBUTING.md) to get started.

---

## 📄 License
MIT License - Developed with ❤️ for the high-performance career seeker.
