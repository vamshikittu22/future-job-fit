# Offline Resume Parser - Development README

## Quick Start

### 1. Run with Docker Compose (Recommended)
```bash
# From project root
docker-compose up --build

# Parser will be available at http://localhost:8000
# View API docs: http://localhost:8000/docs
```

### 2. Run Locally (Development)
```bash
cd offline-parser

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_lg

# Run server
uvicorn main:app --reload --port 8000
```

## API Endpoints

### Health Check
```bash
curl http://localhost:8000/health
```

### Parse Resume
```bash
curl -X POST http://localhost:8000/parse-resume \
  -H "Content-Type: application/json" \
  -d '{"text": "John Doe\njohn@email.com\n\nExperience:\nSoftware Engineer at Acme Inc..."}'
```

### Match Keywords
```bash
curl -X POST http://localhost:8000/match-keywords \
  -H "Content-Type: application/json" \
  -d '{"resumeText": "Python React AWS...", "jobDescription": "Looking for Python developer..."}'
```

### Score ATS
```bash
curl -X POST http://localhost:8000/score-ats \
  -H "Content-Type: application/json" \
  -d '{"resumeText": "...", "jobDescription": "..."}'
```

## Environment Variables

Configure these in `.env.local` for the frontend:

```env
VITE_OFFLINE_PARSER=true
VITE_OFFLINE_PARSER_URL=http://localhost:8000
```

## Model Info

- **spaCy Model**: `en_core_web_lg` (~780MB download, ~1GB RAM at runtime)
- **Fallback**: `en_core_web_sm` if large model unavailable

## Performance

- Parse resume: ~100-300ms
- Match keywords: ~50-100ms
- Score ATS: ~150-400ms
