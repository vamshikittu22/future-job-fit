# 🚀 AI Resume Evaluator & Builder

A professional, high-performance resume building platform powered by advanced AI and a sleek, Swiss-inspired design system. Create ATS-optimized resumes in minutes with real-time feedback and premium export options.

## 🌟 Key Features

- **📊 Real-time ATS Scoring**: Get instant feedback on your resume's compatibility with Applicant Tracking Systems (ATS), with a detailed score breakdown (Keywords, Metrics, Readability).
- **🚀 Productivity Power-ups**: 
  - **Quick Add**: Add work experience in seconds with `Ctrl+K`.
  - **Achievement Templates**: One-click professional achievement structures (e.g., "Led team of X", "Reduced costs by Y%").
  - **LinkedIn Profile Optimizer**: Instantly generate professional headlines, AI-optimized "About" sections, and formatted experience snippets for your social presence.
- **📝 Intelligent Wizard**: A guided, multi-step experience that handles Personal Info, Summary, Experience, Education, Skills, Projects, and Certifications with real-time visual validation indicators.
- **👁️ Live Preview**: See your changes instantly in a high-fidelity, printable preview panel with responsive sidebar/drawer support.
- **📑 Premium Exports**: Download your resume in professional PDF, DOCX, LaTeX, and JSON formats.
- **💾 Advanced Persistence**: Automatic debounced saving to LocalStorage with full Undo support and visible saving indicators.
- **🎨 Swiss Design System**: A clean, monochrome aesthetic with smooth Framer Motion animations and full Dark Mode support.

## 🛠️ Tech Stack

- **Core**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn/UI
- **Animations**: Framer Motion
- **Forms & Validation**: React Hook Form, Zod
- **AI Integration**: Google Generative AI SDK, OpenAI/Groq API
- **Exports**: jsPDF, docx.js, html2canvas

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or bun

### Local Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd future-job-fit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment & AI**
   
   We have automated the entire backend setup. Run this script to configure Supabase and deploy the AI backend:
   ```powershell
   ./scripts/setup_ai_backend.ps1
   ```
   *This script handles login, setting API keys, and deploying the Edge Function.*

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📖 Documentation

- **[Wizard Quick Start](WIZARD_QUICKSTART.md)**: A guide for users on how to build their first resume.
- **[Technical Implementation](WIZARD_IMPLEMENTATION.md)**: Deep dive into the architecture and data flow.
- **[AI Integration Guide](GPT_INTEGRATION.md)**: Details on how the AI engine works and how to switch providers.

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details. (Note: Ensure you have a LICENSE file if publishing)
