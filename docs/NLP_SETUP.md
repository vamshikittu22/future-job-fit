# NLP Setup & Offline Parser

The `offline-parser` is a Python-based microservice that provides high-performance, private, and offline-capable resume analysis.

## 🚀 Why an Offline Parser?
-   **Privacy**: Resume data is processed on your machine, never leaving your network.
-   **Security**: No external API calls are made for scoring and keyword extraction.
-   **Performance**: Sub-50ms latency for ATS checks.
-   **Cost**: Zero operational cost compared to LLM tokens.

## 🛠️ Local Setup

### 1. Requirements
-   Python 3.10 or higher (Optimized for **3.14+**)
-   `pip` (Python package manager)

### 2. Installation
```bash
cd offline-parser

# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\activate      # Windows
source venv/bin/activate    # Mac/Linux

# Install dependencies
pip install -r requirements.txt
```

### 3. Running the Service
```bash
# Start the FastAPI server
python main.py
```
Default URL: `http://localhost:8000`

## 🔗 Frontend Integration

To route requests to the offline parser instead of Cloud AI, update your `.env.local`:

```env
VITE_OFFLINE_PARSER=true
VITE_OFFLINE_PARSER_URL=http://localhost:8000
```

## 🏗️ Architecture

-   **Framework**: FastAPI (for extremely low overhead).
-   **Engine**: Custom regex-based parser.
-   **Models**: Light-weight JSON-based keyword dictionaries (~200KB).
-   **Containerization**: `Dockerfile` included for local or cloud deployment.

## 📂 Key Files
-   `main.py`: Entry point and all logic for keyword matching, parsing, and scoring.
-   `Dockerfile`: Standardized environment for deployment.
-   `requirements.txt`: Minimal dependencies (`fastapi`, `uvicorn`, `pydantic`).

## 🌍 Deployment
Deploy to Google Cloud Run for a high-availability private instance:
-   Windows: `./offline-parser/deploy.ps1`
-   Bash: `./offline-parser/deploy.sh`
