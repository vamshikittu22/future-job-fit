# 🚀 Future Job Fit: AI-Powered Career Intelligence

> **Empowering professionals to bridge the gap between their experience and their dream career with a state-of-the-art, AI-driven recruitment intelligence platform.**

![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/frontend-React%20%2B%20Vite-blue)
![AI](https://img.shields.io/badge/AI-Multi--Model-purple)

---

## 📖 Platform Briefing

**Future Job Fit** is not just a document editor; it is a high-performance career companion designed for the modern job market. In an era where 75% of resumes are rejected by Applicant Tracking Systems (ATS) before a human ever sees them, our platform provides users with the tools to **fight back**.

By combining **Swiss-inspired minimalist design** with **multi-model AI intelligence**, we've created a seamless workflow that lets you build, optimize, and preview your professional brand in real-time.

---

## 🧭 Complete Application Walkthrough

### 🏠 Home Page (`/`)
The landing page showcases the platform's capabilities with:
- **Hero Section**: Introduction to the platform with CTAs to start building or optimizing
- **Feature Grid**: Quick overview of key capabilities (Resume Wizard, Job Optimizer, AI Enhancement)
- **Workflow Preview**: Visual guide to usage patterns
- **Navigation**: Direct access to Resume Wizard and Job Optimizer

### 📝 Resume Wizard (`/resume-wizard`)
A comprehensive 10-step guided experience for building professional resumes:

| Step | Route | Description |
|------|-------|-------------|
| 1. Template | `/resume-wizard/template` | Choose from Modern, Professional, Minimal, or Creative templates |
| 2. Personal Info | `/resume-wizard/personal` | Contact details, location, and social links (LinkedIn, GitHub, Portfolio) |
| 3. Summary | `/resume-wizard/summary` | Professional profile with AI enhancement presets |
| 4. Experience | `/resume-wizard/experience` | Work history with impact-focused bullet points and AI rewriting |
| 5. Education | `/resume-wizard/education` | Degrees, institutions, and academic achievements |
| 6. Skills | `/resume-wizard/skills` | Categorized skill sets (Technical, Soft Skills, Tools/Frameworks) |
| 7. Projects | `/resume-wizard/projects` | Portfolio projects with technology stacks |
| 8. Achievements | `/resume-wizard/achievements` | Quantifiable wins, awards, and recognitions |
| 9. Certifications | `/resume-wizard/certifications` | Professional licenses and courses |
| 10. Review | `/resume-wizard/review` | Final ATS check, live preview, and multi-format export |

**Key Features in the Wizard:**
- ✅ **Real-time Preview**: See changes instantly in the side panel
- ✅ **Auto-Save**: Changes persist automatically to browser storage
- ✅ **Undo/Redo**: Full history navigation (last 100 changes)
- ✅ **AI Enhancement**: One-click content improvement at each step
- ✅ **Custom Sections**: Create unlimited custom sections via `/resume-wizard/custom/:id`

### 💼 Job Optimizer (`/input` → `/results`)

**Step 1: Job Input** (`/input`)
- Paste a job description into the text area
- The system automatically retrieves your current resume from local storage
- Click "Analyze" to start the evaluation

**Step 2: Analysis Results** (`/results`)
- **ATS Score Dashboard**: Overall compatibility score (0-100%)
- **Keyword Match Breakdown**: Visual representation of matching vs. missing keywords
- **Gap Analysis**: Critical keywords in the JD missing from your resume
- **AI-Powered Suggestions**: Contextual rewrites for experience bullets
- **Optimized Resume**: Download an AI-rewritten version tailored to the job

### ℹ️ About Platform (`/about-platform`)
Technical showcase page featuring:
- Platform vision and philosophy
- Intelligence architecture breakdown
- Performance metrics and Lighthouse scores
- Data models and privacy practices

---

## 🌐 Online vs. Offline: How It Works

The platform is designed with a **hybrid intelligence architecture** that works both online and offline:

### 🔌 Online Mode (Full Features)

When connected to the internet:

| Feature | How It Works | Provider |
|---------|--------------|----------|
| **AI Enhancement** | Rewrites bullet points with contextual improvements | Gemini 1.5 Flash / GPT-4o-mini / Llama 3.3 |
| **Summary Generation** | Creates professional summaries from your data | Cloud LLM via Supabase Edge Function |
| **Full Resume Rewrite** | Generates a complete optimized resume for a specific job | Cloud LLM |
| **Pyodide Initialization** | Downloads Python/WebAssembly runtime from CDN | jsdelivr CDN |

**Architecture Flow:**
```
User Input → Frontend → Supabase Edge Function → AI Provider API → Response
```

### 📴 Offline Mode (Core Features)

When disconnected or API is unavailable:

| Feature | How It Works | Technology |
|---------|--------------|------------|
| **Resume Building** | Full wizard functionality, all steps work offline | React + localStorage |
| **Real-time Preview** | Live preview updates without network | Client-side rendering |
| **Auto-Save** | All changes saved to browser storage | localStorage with Zod validation |
| **ATS Scoring** | Local keyword matching and scoring | Pyodide (Python in WebAssembly) |
| **Resume Parsing** | Extract contact info and skills from PDFs | pdfjs + local NLP |
| **Keyword Extraction** | Identify skills and keywords from text | Regex + pattern matching |
| **Export (All Formats)** | PDF, DOCX, HTML, LaTeX, JSON, Markdown, TXT | Client-side generation |

**Architecture Flow (Offline):**
```
User Input → Local NLP (Pyodide) → Structured JSON → UI Update
```

### 🔄 Hybrid Intelligence System

The platform uses a three-tier intelligence system:

1. **Tier 1: Local Pattern Matching** (Always Available)
   - Regex-based keyword extraction
   - Real-time skill categorization
   - Latency: < 10ms

2. **Tier 2: Pyodide NLP Engine** (Offline Capable)
   - Python running in WebAssembly
   - ATS scoring and keyword matching
   - Resume parsing and section identification
   - Latency: < 50ms
   - **Service Worker Cached** for offline use

3. **Tier 3: Cloud LLM** (Online Only)
   - Complex content rewriting
   - Summary generation
   - Contextual improvements
   - Latency: 1-3 seconds

### 📱 Progressive Web App (PWA)

The application is a **fully installable PWA** with:
- ✅ **Offline Support**: Core features work without internet
- ✅ **Install Prompt**: Add to home screen on mobile/desktop
- ✅ **Asset Caching**: JavaScript, CSS, and NLP scripts cached
- ✅ **Pyodide Caching**: WebAssembly runtime cached for 1 year

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

2. **Environment Setup**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your settings in `.env.local`:
   ```env
   # Supabase (Required for AI features)
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   
   # AI Provider Selection
   VITE_AI_PROVIDER=gemini
   
   # Offline-first mode (recommended for testing)
   VITE_PREFER_OFFLINE_ATS=true
   ```

3. **Launch Application**
   ```bash
   npm run dev
   ```
   Open `http://localhost:8080` to start building.

### Backend Configuration (Optional)

For full AI features, deploy the Supabase Edge Function:

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   supabase login
   ```

2. **Set Secrets**
   ```bash
   supabase secrets set GOOGLE_AI_API_KEY=your_gemini_key
   supabase secrets set OPENAI_API_KEY=your_openai_key  # Optional
   supabase secrets set GROQ_API_KEY=your_groq_key      # Optional
   ```

3. **Deploy Edge Function**
   ```bash
   supabase functions deploy resume-ai --no-verify-jwt
   ```

For Windows users, use the setup script:
```powershell
./scripts/setup_ai_backend.ps1
```

---

## 📤 Export Formats

The platform supports 7+ export formats, all generated client-side:

| Format | Description | Use Case |
|--------|-------------|----------|
| **PDF** | Selectable text, styled layout | Standard job applications |
| **ATS-PDF** | Pure text, no images | Maximum ATS compatibility |
| **DOCX** | Editable Word document | When employers request editable formats |
| **HTML** | Standalone web page | Portfolio websites |
| **LaTeX** | Academic typesetting | Technical/academic roles |
| **Markdown** | Plain text with formatting | Developer portfolios |
| **JSON** | Raw structured data | Backup and portability |
| **TXT** | Plain text | Copy-paste applications |

---

## 🛡️ Privacy & Security

- **No Data Collection**: Your resume data never leaves your browser
- **Local Storage Only**: All data persists in browser localStorage
- **Server-Side AI Keys**: API keys for LLM providers are stored securely in Supabase Secrets
- **Client-Side Exports**: All document generation happens in-browser
- **Optional API Key**: Users can provide their own API keys (stored in sessionStorage only)

---

## 📖 Documentation & Guides

Learn more about the platform's core modules:
- [AI Integration Guide](./docs/AI_INTEGRATION.md) — Multi-tier intelligence architecture
- [Supabase Setup](./docs/SUPABASE_SETUP.md) — Edge Functions and AI gateway config
- [NLP & Offline Parser](./docs/NLP_SETUP.md) — Private, local resume analysis
- [Resume Wizard](./docs/RESUME_WIZARD.md) — Guided step-by-step experience
- [Job Optimizer](./docs/JOB_OPTIMIZER.md) — ATS scoring and keyword matching
- [Architecture](./ARCHITECTURE.md) — Full technical documentation

---

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 8080 |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint with strict settings |
| `npm run test` | Run unit tests with Vitest |
| `npm run test:watch` | Run tests in watch mode |

---

## 🧰 Technology Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | React 18, TypeScript 5, Vite 5 |
| **Styling** | Tailwind CSS 3, Shadcn/UI, Radix Primitives |
| **Animation** | Framer Motion 10 |
| **State** | React Context, TanStack Query |
| **Forms** | react-hook-form + Zod validation |
| **AI** | Google Gemini, OpenAI, Groq (via Supabase Edge) |
| **Offline NLP** | Pyodide (Python in WebAssembly) |
| **Export** | jsPDF, docx, html2canvas, file-saver |
| **File Parsing** | pdfjs-dist, mammoth |

---

## 🤝 Roadmap

- [x] **Modular Architecture Refactor**: All major pages componentized for scalability
- [x] **Secure AI Gateway**: Server-side key management via Supabase
- [x] **Browser-Native NLP**: Pyodide integration for offline parsing and scoring
- [x] **Import from PDF**: Advanced parsing using the local NLP suite
- [x] **PWA Support**: Installable app with offline capabilities
- [x] **Multi-Format Export**: 7+ formats with template support
- [ ] **Tailored Cover Letter Generator**
- [ ] **LinkedIn Profile Sync**
- [ ] **Interview Prep Module**

---

## 📄 License

MIT License - Developed with ❤️ for the high-performance career seeker.
