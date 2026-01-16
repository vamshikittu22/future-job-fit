# 📋 Resume Wizard - Quick Start Guide

Welcome to the **Resume Builder Wizard**! This guide will help you navigate the three-panel interface and create a professional resume.

## 🚀 Launching the Wizard

1. Start the dev server: `npm run dev`
2. Navigate to: `http://localhost:8080/resume-wizard`
3. Follow the wizard steps in order:

## 🎨 The Interface

The Wizard uses a high-productivity **Three-Panel Layout**:
- **Left Panel (Navigation & ATS)**: Track your progress, switch templates, and see your live ATS score/suggestions.
- **Center Panel (The Editor)**: Your workspace. Fill out forms, use AI enhancement, and navigate between steps.
- **Right Panel (The Preview)**: A live, high-fidelity render of your resume. What you see is exactly what you get.

## 📝 The 8-Step Process

### 1. Template Selection
Start by choosing a foundation. Each template (Modern, Classic, Creative, Minimal) is designed for different industries and ATS compatibility.

### 2. Personal Information
Enter your contact details.
- **Pro Tip**: Use the "LinkedIn" and "Portfolio" fields to improve your ATS score.

### 3. Professional Summary
Write your "elevator pitch."
- **AI Assist**: Click **"Enhance with AI"** in the top bar to get 3-5 professional variations of your summary.

### 4. Work Experience
Detail your professional history.
- **Achievements**: Focus on metrics. Use the **Bullet Enhancer** to turn simple sentences into high-impact achievements.

### 5. Education
Add your academic background. Support for degrees, dates, and GPA.

### 6. Skills
Organize your skills into **Technical**, **Frameworks**, and **Tools**.
- **Quick Add**: Use the "Suggested Skills" to build your list faster.

### 7. Projects
Feature your best work. Link to GitHub or live demos.

### 8. Review & Export
The final check.
- **ATS Dashboard**: Review the detailed breakdown of your resume's performance.
- **Download**: Export as **PDF** (printable), **DOCX** (editable), or **JSON** (data-backup).

## ⚡ Power Features

- **⌨️ Keyboard Shortcuts**: 
  - `Ctrl + S`: Save Draft
  - `Ctrl + Z`: Undo last change
  - `Ctrl + Shift + P`: Toggle Preview Panel
- **📂 Sample Data**: Not sure where to start? Click **"Load Sample"** in the top bar to see a complete engineer's resume.
- **🔄 Auto-Save**: Don't worry about losing progress. The app saves to your browser every 2 seconds.

## 💡 Troubleshooting
- **Input Lag?**: Ensure you aren't in a loop with high-latency AI calls.
- **Preview not updating?**: Sometimes a template switch requires a quick scroll to refresh the render.
- **AI not responding?**: Ensure you have run the setup script: `./scripts/setup_ai_backend.ps1` to configure your keys.
