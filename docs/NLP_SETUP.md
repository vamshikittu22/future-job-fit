# NLP Setup & Browser-Native Parser

The application now uses **Pyodide**, a Python distribution for the browser based on WebAssembly, to provide high-performance, private, and offline-capable resume analysis without requiring any local backend installation.

## 🚀 Why Browser-Native NLP?
-   **Zero Configuration**: No need to install Python, `pip`, or Docker. It works out-of-the-box in any modern browser.
-   **True Privacy**: Resume data is processed entirely in your browser's memory. No network requests are made for parsing or scoring.
-   **Seamless Offline Support**: PWA technology caches the Python engine and NLP scripts, allowing the core intelligence to work without an internet connection.
-   **High Performance**: Leverages WebAssembly for sub-50ms latency in ATS checks and parsing.

## 🛠️ Architecture

-   **Runtime**: [Pyodide](https://pyodide.org/) (Python 3.12+ in the browser).
-   **Core Script**: `public/py-nlp/nlp_core.py` (The brain of our resume analysis).
-   **State Management**: `src/shared/hooks/usePyNLP.ts` (React-friendly interface).
-   **Optimization**: Configured with COOP/COEP headers for multi-threaded performance.

## 📂 Key Files
-   `public/py-nlp/nlp_core.py`: Contains the logic for contact extraction, section identification, keyword matching, and ATS scoring.
-   `src/shared/hooks/usePyNLP.ts`: Manage the Pyodide instance lifecycle and provides asynchronous methods for parsing and scoring.
-   `src/shared/utils/textExtraction.ts`: Handles local text extraction from PDF, DOCX, and TXT using `pdfjs` and `mammoth`.

## 🔗 How it Works

1. **Initialization**: On app load (or on first use), the `usePyNLP` hook downloads the Pyodide runtime (cached by the service worker).
2. **Core Loading**: It fetches and executes `nlp_core.py` within the virtual Python environment.
3. **Execution**: When you import a resume or analyze a job, the JS layer passes text to the Python engine and receives structured JSON in return.

## 🏗️ Performance Tips
For the best performance, the application is deployed with specific security headers in `vercel.json`:
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp`

These headers enable **SharedArrayBuffer**, allowing Pyodide to use multiple threads and significantly speeding up complex NLP operations.
