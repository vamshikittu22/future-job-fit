# ATS Engine Unit Tests
# Run with: python -m pytest test_nlp_core.py -v

import pytest
import sys
import os

# Add parent directory to path for import
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from nlp_core import (
    parse_jd,
    parse_resume_canonical,
    match_keywords,
    calculate_ats_score,
    generate_recommendations,
    evaluate_ats
)


# --- Test Data ---

SAMPLE_JD = """
Senior Software Engineer

About Us:
We are a fast-growing tech company building innovative solutions.

Requirements:
- 5+ years of experience with Python and JavaScript
- Strong knowledge of React and Node.js
- Experience with AWS and Docker
- Familiarity with CI/CD pipelines
- PostgreSQL or MySQL database experience

Responsibilities:
- Design and implement scalable backend services
- Lead code reviews and mentor junior developers
- Collaborate with product managers on feature planning

Nice to Have:
- Experience with Kubernetes
- GraphQL API development
- Machine learning background
"""

SAMPLE_RESUME = """
John Doe
john.doe@example.com | 555-123-4567
linkedin.com/in/johndoe | github.com/johndoe

Summary
Experienced software engineer with 7 years of experience building web applications.
Expert in Python and JavaScript with a passion for clean code.

Experience
Senior Developer at TechCorp (2020 - Present)
- Developed and maintained REST APIs using Python and Flask
- Built React frontend components for the company dashboard
- Deployed applications to AWS using Docker and ECS
- Mentored 3 junior developers and led code reviews

Software Engineer at StartupXYZ (2017 - 2020)
- Created Node.js microservices for the payment platform
- Implemented PostgreSQL database schemas and queries
- Integrated third-party APIs and payment gateways

Skills
Python, JavaScript, TypeScript, React, Node.js, Flask, AWS, Docker, PostgreSQL, Git, REST

Education
BS Computer Science, State University (2017)
"""


# --- Parse JD Tests ---

class TestParseJD:
    def test_parse_jd_extracts_sections(self):
        """Verify JD sections are identified correctly."""
        result = parse_jd(SAMPLE_JD)
        
        assert 'sections' in result
        assert 'requirements' in result['sections']
        assert 'responsibilities' in result['sections']
        assert 'about' in result['sections']
        
    def test_parse_jd_extracts_keywords(self):
        """Verify keywords are extracted from JD."""
        result = parse_jd(SAMPLE_JD)
        
        assert 'categorizedKeywords' in result
        keywords = [kw['keyword'] for kw in result['categorizedKeywords']]
        
        # Check that major tech skills are found
        assert 'python' in keywords
        assert 'javascript' in keywords
        assert 'react' in keywords
        assert 'aws' in keywords
        
    def test_parse_jd_categorizes_keywords(self):
        """Verify keywords are assigned to correct categories."""
        result = parse_jd(SAMPLE_JD)
        
        categories = {kw['keyword']: kw['category'] for kw in result['categorizedKeywords']}
        
        # Check categorization
        assert categories.get('python') == 'hard_skill'
        assert categories.get('docker') == 'tool'
        
    def test_parse_jd_assigns_weights(self):
        """Verify keywords in requirements section get higher weights."""
        result = parse_jd(SAMPLE_JD)
        
        # Find a keyword that's in requirements
        python_kw = next((kw for kw in result['categorizedKeywords'] if kw['keyword'] == 'python'), None)
        
        assert python_kw is not None
        assert python_kw['weight'] >= 1.0  # Should have at least base weight
        
    def test_parse_jd_has_id(self):
        """Verify JD model has a unique ID."""
        result = parse_jd(SAMPLE_JD)
        
        assert 'id' in result
        assert len(result['id']) > 0


# --- Resume Parsing Tests ---

class TestParseResumeCanonical:
    def test_extracts_tokens_from_sections(self):
        """Verify tokens are extracted from resume sections."""
        result = parse_resume_canonical(SAMPLE_RESUME)
        
        assert 'tokens' in result
        assert len(result['tokens']) > 0
        
    def test_tokens_have_locations(self):
        """Verify tokens include location strings."""
        result = parse_resume_canonical(SAMPLE_RESUME)
        
        locations = set(t['location'] for t in result['tokens'])
        
        # Should have tokens from multiple sections
        assert any('summary' in loc for loc in locations)
        assert any('experience' in loc for loc in locations)
        
    def test_detects_tech_skills(self):
        """Verify tech skills are detected."""
        result = parse_resume_canonical(SAMPLE_RESUME)
        
        normalized = set(t['normalized'] for t in result['tokens'])
        
        assert 'python' in normalized
        assert 'react' in normalized


# --- Keyword Matching Tests ---

class TestMatchKeywords:
    def test_match_keywords_exact(self):
        """Verify exact keyword matches return 'matched' status."""
        jd_model = parse_jd(SAMPLE_JD)
        resume_model = parse_resume_canonical(SAMPLE_RESUME)
        
        results = match_keywords(jd_model, resume_model)
        
        # Python should be matched
        python_result = next((r for r in results if r['keyword'] == 'python'), None)
        assert python_result is not None
        assert python_result['status'] == 'matched'
        
    def test_match_keywords_missing(self):
        """Verify missing keywords return 'missing' status."""
        jd_model = parse_jd(SAMPLE_JD)
        
        # Create a minimal resume without Kubernetes
        minimal_resume = "John Doe\nSummary\nExperienced developer."
        resume_model = parse_resume_canonical(minimal_resume)
        
        results = match_keywords(jd_model, resume_model)
        
        # Kubernetes should be missing
        k8s_result = next((r for r in results if r['keyword'] == 'kubernetes'), None)
        if k8s_result:  # Only if Kubernetes was in the JD
            assert k8s_result['status'] == 'missing'
            
    def test_match_results_have_locations(self):
        """Verify matched keywords include location information."""
        jd_model = parse_jd(SAMPLE_JD)
        resume_model = parse_resume_canonical(SAMPLE_RESUME)
        
        results = match_keywords(jd_model, resume_model)
        
        matched_results = [r for r in results if r['status'] == 'matched']
        assert len(matched_results) > 0
        
        # At least some should have locations
        with_locations = [r for r in matched_results if len(r['locations']) > 0]
        assert len(with_locations) > 0


# --- Scoring Tests ---

class TestCalculateATSScore:
    def test_score_ats_deterministic(self):
        """Same input should always produce same output."""
        jd_model = parse_jd(SAMPLE_JD)
        resume_model = parse_resume_canonical(SAMPLE_RESUME)
        match_results = match_keywords(jd_model, resume_model)
        
        score1 = calculate_ats_score(jd_model, match_results, SAMPLE_RESUME)
        score2 = calculate_ats_score(jd_model, match_results, SAMPLE_RESUME)
        score3 = calculate_ats_score(jd_model, match_results, SAMPLE_RESUME)
        
        assert score1 == score2 == score3
        
    def test_score_ats_has_breakdown(self):
        """Verify score includes all breakdown components."""
        jd_model = parse_jd(SAMPLE_JD)
        resume_model = parse_resume_canonical(SAMPLE_RESUME)
        match_results = match_keywords(jd_model, resume_model)
        
        score = calculate_ats_score(jd_model, match_results, SAMPLE_RESUME)
        
        assert 'hardSkillScore' in score
        assert 'toolsScore' in score
        assert 'conceptScore' in score
        assert 'roleTitleScore' in score
        assert 'structureScore' in score
        assert 'total' in score
        
    def test_score_ats_formula(self):
        """Verify the scoring formula weights are applied correctly."""
        jd_model = parse_jd(SAMPLE_JD)
        resume_model = parse_resume_canonical(SAMPLE_RESUME)
        match_results = match_keywords(jd_model, resume_model)
        
        score = calculate_ats_score(jd_model, match_results, SAMPLE_RESUME)
        
        # Verify formula: (HardSkill * 0.45) + (Tools * 0.20) + (Concepts * 0.20) + (RoleTitle * 0.10) + (Structure * 0.05)
        expected_total = int(
            score['hardSkillScore'] * 0.45 +
            score['toolsScore'] * 0.20 +
            score['conceptScore'] * 0.20 +
            score['roleTitleScore'] * 0.10 +
            score['structureScore'] * 0.05
        )
        
        assert score['total'] == expected_total
        
    def test_scores_in_valid_range(self):
        """Verify all scores are between 0 and 100."""
        jd_model = parse_jd(SAMPLE_JD)
        resume_model = parse_resume_canonical(SAMPLE_RESUME)
        match_results = match_keywords(jd_model, resume_model)
        
        score = calculate_ats_score(jd_model, match_results, SAMPLE_RESUME)
        
        for key, value in score.items():
            assert 0 <= value <= 100, f"{key} = {value} is out of range"


# --- Recommendation Tests ---

class TestGenerateRecommendations:
    def test_generates_recommendations_for_missing(self):
        """Verify recommendations are generated for missing keywords."""
        jd_model = parse_jd(SAMPLE_JD)
        
        # Create minimal resume missing most skills
        minimal_resume = "John Doe\nSummary\nJunior developer.\nSkills\nHTML, CSS"
        resume_model = parse_resume_canonical(minimal_resume)
        match_results = match_keywords(jd_model, resume_model)
        
        recommendations = generate_recommendations(match_results)
        
        assert len(recommendations) > 0
        
    def test_recommendations_have_required_fields(self):
        """Verify recommendations have all required fields."""
        jd_model = parse_jd(SAMPLE_JD)
        minimal_resume = "John Doe\nSummary\nDeveloper"
        resume_model = parse_resume_canonical(minimal_resume)
        match_results = match_keywords(jd_model, resume_model)
        
        recommendations = generate_recommendations(match_results)
        
        if recommendations:  # Only check if there are recommendations
            rec = recommendations[0]
            assert 'id' in rec
            assert 'message' in rec
            assert 'severity' in rec
            assert rec['severity'] in ['info', 'warning', 'critical']


# --- Full Evaluation Tests ---

class TestEvaluateATS:
    def test_evaluate_ats_returns_complete_response(self):
        """Verify evaluate_ats returns complete ATSEvaluationResponse."""
        result = evaluate_ats(SAMPLE_RESUME, SAMPLE_JD)
        
        assert 'jdModel' in result
        assert 'matchResults' in result
        assert 'scoreBreakdown' in result
        assert 'recommendations' in result
        
    def test_evaluate_ats_score_matches_breakdown_total(self):
        """Verify the score breakdown total is consistent."""
        result = evaluate_ats(SAMPLE_RESUME, SAMPLE_JD)
        
        breakdown = result['scoreBreakdown']
        
        # Total should match the formula calculation
        expected_total = int(
            breakdown['hardSkillScore'] * 0.45 +
            breakdown['toolsScore'] * 0.20 +
            breakdown['conceptScore'] * 0.20 +
            breakdown['roleTitleScore'] * 0.10 +
            breakdown['structureScore'] * 0.05
        )
        
        assert breakdown['total'] == expected_total


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
