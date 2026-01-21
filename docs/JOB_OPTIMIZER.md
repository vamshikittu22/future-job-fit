# Job Optimizer & Keyword Matcher

The Job Optimizer is a tool that analyzes your resume against a specific job description to maximize your chances of passing through Applicant Tracking Systems (ATS).

## 🔄 The Optimization Workflow

1.  **Input**: The user pastes a Job Description (JD) into the `JobInputPage`.
2.  **Extraction**: The system automatically retrieves the current resume data from local storage.
3.  **Analysis**:
    -   Extracts primary and secondary keywords from both JD and Resume.
    -   Calculates the **Match Score** (0-100%).
    -   Identifies **Critical Gaps** (important keywords in JD missing from Resume).
4.  **Result**: Displays a visual dashboard with a breakdown of strengths and weaknesses.

## 📊 Evaluation Metrics

### 1. ATS Matching Score
A weighted average of:
-   **Keyword Density**: 50%
-   **Section Completeness**: 20%
-   **Contact Information**: 10%
-   **Readability/Complexity**: 20%

### 2. Keyword Classification
Keywords are categorized into:
-   **Hard Skills**: Programming languages, tools, methodologies.
-   **Soft Skills**: Leadership, communication, teamwork.
-   **Industry Knowledge**: Domain-specific terminology.

## 💡 AI-Powered Suggestions

If the match score is low, the system provides:
-   **Bullet Point Rewrites**: Contextual changes to existing experience to include missing keywords naturally.
-   **Section Recommendations**: Advice on which parts of the resume need more detail.
-   **Tone Adjustment**: Suggestions to align the resume's tone with the job description (e.g., matching a "start-up" vs. "enterprise" vibe).

## 📂 Implementation Details
-   **Directory**: `src/features/job-optimizer/`
-   **Analysis Logic**: `src/shared/api/resumeAI.ts` (`evaluateResume` method)
-   **Local Processing**: Routes to `offline-parser/` via `/match-keywords` and `/score-ats` endpoints if `VITE_OFFLINE_PARSER` is enabled.
