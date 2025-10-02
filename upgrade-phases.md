# 🚀 Resume Builder Upgrade Phases

## 🎨 UI Settings (Run First)

Swiss-style monochrome design system across the app.

- [x] Light mode → **red monochrome palette** → ✅ implemented with hsl(0 100% 45%) as primary color
- [x] Dark mode → **blue monochrome palette** → ✅ implemented with hsl(210 100% 50%) as primary color
- [ ] Resume Preview → always show **printable version** (white background, black/dark text), never affected by theme toggle
- [x] Typography → Inter (system/Helvetica fallback), left-aligned, no justification. Font sizes/weights chosen automatically. → ✅ implemented with Inter font and proper text alignment
- [ ] Motion → only opacity/translate transitions, smooth and subtle
- [ ] Icons → lucide-react only, consistent stroke width
- [ ] Accessibility → focus-visible outlines, WCAG AA contrast, ARIA-compliant modals with focus trapping & ESC close

## 🟢 Phase 1 — Core Foundation

- [ ] **CreateResumeModal**: Tabs = Blank, Sample, Import (JSON/LinkedIn JSON). Always routes into builder with a template + Swiss theme. Never show an empty preview.
- [ ] **Data Seeds**: Add examples for tech, design, healthcare, finance. Include ATS-friendly bullets + structured skills.
- [ ] **ResumeContext**: Normalize skills into categories (technical, tools, soft, languages). Add undo/redo, Save Draft helper, debounced autosave.
- [ ] **Section Editing**: Standardize section/modals. Validate dates, bullets, links, emails.

## 🟢 Phase 2 — Live Preview & Templates

- [x] **Drag & Drop**: Mouse + keyboard reordering of sections. Persist order in context + localStorage. → ✅ implemented with proper context and persistence
- [ ] **ResumePreview**: Instant updates on typing, memoized for performance. Add toggles to show/hide sections (data not deleted).
- [ ] **Template Gallery**: Live miniature previews of templates. Virtualized smooth scrolling. Filters by style, industry, experience level, ATS-friendly.

## 🟢 Phase 3 — Customization & Themes

- [ ] **Theme Controls**: Font selector (Inter/System/Helvetica). Palette = red (light), blue (dark). Density toggle (compact vs comfortable).
- [ ] **Resume Templates**: Accept theme + density props. Apply via CSS variables. Maintain baseline rhythm.
- [ ] **Responsive Polish**: Collapsible panels on mobile, sticky export controls, large touch targets.

## 🟢 Phase 4 — Export Excellence

- [x] **Exports**:  
  - [x] PDF = selectable text, ATS-compatible → ✅ implemented with jsPDF and html2canvas  
  - [x] DOCX = styled lists/paragraphs → ✅ implemented with docx library  
  - [x] TXT = plain serializer → ✅ implemented with custom text formatter  
  - [ ] ZIP = all formats bundled with metadata
- [ ] **Export Modal**: Format guidance, preview, progress, error states.

## 🟢 Phase 5 — Import Enhancements

- [ ] **LinkedIn Import**: Parse LinkedIn JSON → ResumeData. Show mapping preview. Handle duplicates gracefully.
- [ ] **Paste-to-Import**: Paste raw resume text → structured sections. Show confirmation before commit.

## Progress Log

### 2025-10-01
- Marked Drag & Drop as complete based on existing implementation
- Marked basic export functionality (PDF, DOCX, TXT) as complete based on existing implementation
- Created initial upgrade-phases.md with all planned tasks and structure
