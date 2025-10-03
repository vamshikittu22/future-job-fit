# Resume Wizard - Quick Start Guide

## 🚀 Getting Started

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Navigate to the Wizard
Open your browser and go to:
```
http://localhost:5173/resume-wizard
```

## 📋 Wizard Flow

### Step 1: Template Selection
- Choose from 4 templates: Modern, Classic, Creative, or Minimal
- Each template shows ATS compatibility score
- Click a template card to select it
- Click "Next" to proceed

### Step 2: Personal Information
- Fill in required fields (marked with *)
  - Full Name
  - Email
  - Phone
- Optional fields:
  - Professional Title
  - Location
  - Website, LinkedIn, GitHub
- Phone numbers auto-format as you type
- URLs auto-add https:// prefix
- Click "Next" when complete

### Step 3: Professional Summary
- Write 100-150 words about your professional background
- Word counter shows optimal range (green when 100-150)
- Character limit: 800 characters
- Click "Tips for a Great Summary" for guidance
- "Enhance with AI" button (placeholder for now)
- Click "Next" when complete

### Step 4: Work Experience
- Click "Add Work Experience" to open dialog
- Fill in:
  - Job Title (required)
  - Company (required)
  - Location (optional)
  - Start Date (required)
  - End Date (or check "I currently work here")
  - Description with bullet points (required)
- Click "Add Experience" to save
- Edit or delete existing entries
- Add multiple experiences
- Click "Next" when complete (at least 1 required)

### Step 5: Education
- Placeholder step (coming soon)
- Click "Skip" to continue

### Step 6: Skills
- Add skills in three categories:
  - Programming Languages
  - Frameworks & Libraries
  - Tools & Technologies
- Type skill name and press Enter or comma
- Click suggested skills to add quickly
- Remove skills by clicking X on badge
- Minimum 5 total skills required
- Click "Next" when complete

### Step 7: Projects
- Placeholder step (coming soon)
- Click "Skip" to continue

### Step 8: Review & Export
- View ATS score and section summary
- Export options:
  - Download PDF (placeholder)
  - Download DOCX (placeholder)

## 🎨 UI Features

### Left Sidebar
- **Step Navigation**: Click any completed step to jump to it
- **ATS Score**: Real-time score out of 100
- **Suggestions**: Expandable list of improvements
- **Template Switcher**: Change template anytime
- **Auto-Save Status**: Shows when changes are saved

### Center Panel
- **Progress Stepper**: Visual timeline of steps at top
- **Form Content**: Current step's form
- **Navigation Bar**: Previous/Next/Skip buttons at bottom
- **Save Draft**: Manual save button

### Right Panel (Desktop)
- **Preview**: Live resume preview
- **Zoom Controls**: 75%, 100%, 125%, 150%
- **Template Selector**: Quick template switch
- **Export Button**: Quick PDF export

### Mobile
- **Hamburger Menu**: Access sidebar
- **FAB (Floating Action Button)**: View preview
- **Full-Screen Preview**: Tap FAB to open

## 🔑 Key Features

### Auto-Save
- Automatically saves every 2 seconds
- Status shown in sidebar
- Data persists in browser LocalStorage

### Validation
- Required fields marked with *
- Real-time validation on blur
- Error messages show below fields
- Can't proceed to next step with errors

### Navigation
- Can go back to any completed step
- Can't skip ahead to incomplete required steps
- Optional steps show "Skip" button
- URL updates with current step

### ATS Scoring
- Updates automatically as you fill data
- Shows score breakdown by section
- Provides actionable suggestions
- Color-coded: Green (70+), Yellow (50-69), Red (<50)

## 🎯 Tips for Best Results

### Personal Info
- Use professional email address
- Include LinkedIn profile
- Add portfolio/GitHub if relevant

### Summary
- Start with years of experience
- Include 2-3 key skills
- Mention 1-2 major achievements with numbers
- Use industry keywords

### Experience
- Use bullet points (• character)
- Start each bullet with action verb
- Include quantifiable results
- Focus on achievements, not just duties

### Skills
- List most relevant skills first
- Include both technical and soft skills
- Match skills to job descriptions
- Add at least 5-10 skills

## 🐛 Troubleshooting

### Wizard Won't Load
- Check console for errors
- Clear browser cache
- Check that all dependencies are installed: `npm install`

### Auto-Save Not Working
- Check browser console for LocalStorage errors
- Ensure LocalStorage is not full
- Try clearing old drafts

### Preview Not Updating
- Preview updates with 2-second delay
- Check that template is selected
- Refresh page if stuck

### Can't Proceed to Next Step
- Check for validation errors (red text)
- Ensure all required fields are filled
- Look for error messages at top of form

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
  - Sidebar hidden (hamburger menu)
  - Preview via FAB
  - Single-column forms

- **Tablet**: 768px - 1024px
  - Collapsible sidebar
  - Visible preview
  - Two-column forms

- **Desktop**: > 1024px
  - All three panels visible
  - Full features
  - Optimal experience

## 💾 Data Storage

### LocalStorage Keys
- `resume-wizard-state` - Wizard progress
- `resume-wizard-autosave` - Auto-saved data
- `resumeBuilderDraft` - Resume data

### Clearing Data
```javascript
// In browser console
localStorage.removeItem('resume-wizard-state');
localStorage.removeItem('resume-wizard-autosave');
localStorage.removeItem('resumeBuilderDraft');
```

## 🔄 Workflow Example

1. **Start**: Navigate to `/resume-wizard`
2. **Select Template**: Choose "Modern" template
3. **Personal Info**: Fill name, email, phone
4. **Summary**: Write 120-word summary
5. **Experience**: Add 2-3 work experiences
6. **Skip Education**: Click "Skip" button
7. **Skills**: Add 10+ skills across categories
8. **Skip Projects**: Click "Skip" button
9. **Review**: Check ATS score (should be 70+)
10. **Export**: Download PDF (when implemented)

## 🎓 Learning Resources

### Code Structure
- `src/config/wizardSteps.ts` - Step definitions
- `src/contexts/WizardContext.tsx` - State management
- `src/pages/wizard/WizardLayout.tsx` - Main layout
- `src/components/wizard/` - Reusable components

### Key Concepts
- **Wizard Context**: Manages navigation and validation
- **Resume Context**: Stores resume data
- **Step Container**: Wraps each step with navigation
- **Progress Stepper**: Shows visual progress

## 🚧 Known Limitations

1. **AI Enhancement**: Buttons present but not functional
2. **Export**: PDF/DOCX export not implemented yet
3. **Drag-and-Drop**: Visual handles but no reordering
4. **Education/Projects**: Placeholder implementations
5. **Template Rendering**: Simplified preview only

## 📞 Support

For issues or questions:
1. Check `WIZARD_IMPLEMENTATION.md` for technical details
2. Review console for error messages
3. Check browser DevTools Network tab
4. Verify all dependencies are installed

## ✨ Next Features (Coming Soon)

- [ ] Full Education step
- [ ] Full Projects step
- [ ] AI enhancement integration
- [ ] PDF/DOCX export
- [ ] Drag-and-drop reordering
- [ ] Draft management UI
- [ ] Import from JSON/PDF
- [ ] Multiple resume templates
- [ ] Print optimization

---

**Happy Resume Building! 🎉**
