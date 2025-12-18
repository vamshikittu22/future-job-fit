# Resume Export Fixes Tasklist

## 1. Fix Download Reliability (Chrome)
- [ ] Update `downloadFile` helper in `ExportResumeModal.tsx` to ensure `URL.revokeObjectURL` doesn't interrupt the download.
- [ ] Add a small delay (100ms) before revoking the URL.

## 2. Fix DOCX Export
- [ ] Verify `Packer.toBlob` is working correctly in `src/shared/lib/export/docx.ts`.
- [ ] Check for any remaining `Buffer` or Node-specific calls in the conversion logic.
- [ ] Test DOCX export with different templates.

## 3. Unify Template Styling (Focus on Classic)
- [ ] Analyze the "cool" HTML styling in `src/shared/lib/export/formats.ts`.
- [ ] Update `generateHTML` to match the "Classic" design tokens used in `ResumePreview.tsx`.
- [ ] Ensure `ResumePreview.tsx` (used by PDF) and `generateHTML` (used by HTML export) have consistent margins, fonts, and colors.
- [ ] Make "Classic" the flagship high-quality style.

## 4. Final Verification
- [ ] Run browser verification for all 3 formats (PDF, DOCX, HTML).
- [ ] Verify download success in Chrome.
