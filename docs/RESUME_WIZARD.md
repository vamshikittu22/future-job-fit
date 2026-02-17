# Resume Wizard Architecture

The Resume Wizard is the core feature of the platform, providing a step-by-step guided experience for creating high-performance resumes.

## 🧭 The Wizard Flow

The wizard is divided into 10 logical steps:
1.  **Templates**: Choose from Modern, Professional, Minimal, or Creative.
2.  **Personal Info**: Contact details and social links.
3.  **Summary**: AI-powered professional profile.
4.  **Experience**: Role-based work history with impact optimization.
5.  **Education**: Degrees, certifications, and academic achievements.
6.  **Skills**: Categorized skill sets (Hard/Soft/Tech).
7.  **Projects**: Side projects and portfolio highlights.
8.  **Achievements**: Quantifiable wins and awards.
9.  **Certifications**: Professional licenses and courses.
10. **Review**: Final ATS check, preview, and multi-format export.

## 💾 State Management

-   **`ResumeContext`**: The "source of truth" for the resume data model.
-   **`WizardContext`**: Manages current step index, navigation history, and completion status.
-   **Persistence**: Auto-saves to `localStorage` on every change. Uses `zod` for schema validation to prevent data corruption.

## ✨ Intelligent Features

### 1. Real-time Preview
As you type, the resume preview updates instantly. The preview uses the **exact same CSS** as the final export styles, ensuring what you see is what you get.

### 2. AI Content Enhancement
Available in Summary, Experience, and Projects. The "Enhance" button uses the `ResumeAIService` to rewrite bullet points for higher impact.

### 3. Smart Skills Categorization
Automatically detects skill types (e.g., "React" -> "Frontend") using the local NLP engine to keep the skills section organized without manual input.

## 📤 Export Engine

Supported formats:
-   **PDF (ATS Friendly)**: Generated via standard browser print logic with optimized CSS.
-   **DOCX**: Native Word document generation using `docx.js`.
-   **HTML**: Clean, semantic markup for personal websites.
-   **LaTeX**: Production-grade typesetting for academic/technical roles.
-   **JSON**: Raw data for portability and backup.

## 📂 Implementation Details
-   **Directory**: `src/features/resume-builder/`
-   **Components**: `src/features/resume-builder/components/wizard/`
-   **Logic**: `src/features/resume-builder/hooks/useWizard.ts`
