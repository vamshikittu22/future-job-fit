# 🚀 AI Resume Evaluator & Builder

A professional, high-performance resume building platform powered by advanced AI and a sleek, Swiss-inspired design system. Create ATS-optimized resumes in minutes with real-time feedback and premium export options.

## 🌟 Key Features

- **🤖 Multi-Model AI Engine**: Connect to OpenAI (GPT-4o), Google Gemini (1.5 Flash), or Groq (Llama 3) for high-speed resume enhancements.
- **📊 Real-time ATS Scoring**: Get instant feedback on your resume's compatibility with Applicant Tracking Systems (ATS).
- **📝 Intelligent Wizard**: A guided, multi-step experience that handles Personal Info, Summary, Experience, Education, Skills, Projects, and Certifications.
- **👁️ Live Preview**: See your changes instantly in a high-fidelity, printable preview panel.
- **📑 Premium Exports**: Download your resume in professional PDF, DOCX, and JSON formats.
- **💾 Advanced Persistence**: Automatic 2-second debounced saving to LocalStorage with full Undo/Redo support.
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

3. **Configure Environment Variables**
   Create a `.env` file in the root:
   ```env
   # Client-side (public)
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   VITE_AI_PROVIDER=gemini # 'openai', 'gemini', or 'groq'
   
   # Server-side (secret - for local Edge Function dev)
   GEMINI_API_KEY=your_gemini_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   GROQ_API_KEY=your_groq_api_key_here
   ```
   
   **Production**: Set secrets via Supabase Dashboard or CLI:
   ```bash
   supabase secrets set GEMINI_API_KEY=your_key
   supabase secrets set OPENAI_API_KEY=your_key
   supabase secrets set GROQ_API_KEY=your_key
   ```

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
