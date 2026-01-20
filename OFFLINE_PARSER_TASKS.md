# Offline NLP Parser - Implementation Task List

> **Status**: Phase 1 Complete  
> **Next**: Phase 2 (UI Integration)

---

## ✅ Phase 1: Offline Parser Service (COMPLETE)
- [x] Create `offline-parser/` directory structure
- [x] Build FastAPI service with spaCy (`main.py`)
- [x] Add `requirements.txt` with dependencies
- [x] Create Dockerfile for containerization
- [x] Add `docker-compose.yml` for local dev
- [x] Implement `/parse-resume` endpoint
- [x] Implement `/match-keywords` endpoint
- [x] Implement `/score-ats` endpoint
- [x] Add `/health` endpoint
- [x] Integrate offline mode into `ResumeAIService`
- [x] Update `.env.example` with offline parser config
- [x] Verify build passes

---

## 🔲 Phase 2: UI Integration
- [ ] Add offline mode toggle in `APIKeySettingsModal.tsx`
- [ ] Store offline parser preference in localStorage
- [ ] Add "Offline Mode" badge in `WizardSidebar.tsx`
- [ ] Show parser health status indicator
- [ ] Display token savings estimate

---

## 🔲 Phase 3: Testing & Verification
- [ ] Test Docker container startup
- [ ] Test `/parse-resume` with sample resume
- [ ] Test `/match-keywords` with resume + JD
- [ ] Test `/score-ats` scoring accuracy
- [ ] Test frontend routing to offline parser
- [ ] Test fallback when parser is unavailable

---

## 🔲 Phase 4: Deployment Options
- [ ] Cloud Run deployment script (optional)
- [ ] Supabase Edge Function wrapper (optional)
- [ ] Production environment variable documentation
- [ ] Usage monitoring/analytics

---

## 🔲 Phase 5: Polish & Documentation
- [ ] Update project README with offline parser section
- [ ] Add error handling improvements
- [ ] Performance optimization
- [ ] Final testing and QA

---

## Quick Start

```bash
# Start offline parser
docker-compose up --build

# Enable in frontend (.env.local)
VITE_OFFLINE_PARSER=true
VITE_OFFLINE_PARSER_URL=http://localhost:8000

# Run frontend
npm run dev
```
