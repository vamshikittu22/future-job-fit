# Offline Resume Parser - Development README

## Implementation Details

This service uses a lightweight, high-performance regex-based engine to handle resume parsing, keyword matching, and ATS scoring. It is designed to be fully compatible with **Python 3.14+** and requires no large spaCy model downloads, making it ideal for fast local iteration and low-cost cloud deployment.

## Quick Start

### 1. Run Locally (Development)
```bash
cd offline-parser

# Create virtual environment
python -m venv venv
venv\Scripts\activate      # Windows
# source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Run server
python main.py
```

### 2. Run with Docker Compose (Optional)
```bash
# From project root
docker-compose up --build
```

## 🌍 Cloud Deployment

Deploy to **Google Cloud Run** using the provided scripts:

### Windows (PowerShell)
```powershell
./offline-parser/deploy.ps1
```

### Linux/macOS
```bash
chmod +x ./offline-parser/deploy.sh
./offline-parser/deploy.sh
```

## API Endpoints

### Health Check
`GET /health` - Returns service status and model version.

### Parse Resume
`POST /parse-resume` - Extracts name, contact info, and sections from raw text.

### Match Keywords
`POST /match-keywords` - Compares resume text against a job description.

### Score ATS
`POST /score-ats` - Provides a numerical score (0-100) and specific improvement suggestions.

## Frontend Configuration

Configure these in the platform's `.env.local` file:

```env
VITE_OFFLINE_PARSER=true
VITE_OFFLINE_PARSER_URL=http://localhost:8000
```

## Performance

- **Memory Usage**: < 100MB (no heavy ML models loaded)
- **Latency**: All endpoints typically return in **< 50ms**.
- **Python Compatibility**: Verified on **Python 3.14**.
