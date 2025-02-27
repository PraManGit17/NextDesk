import React from 'react';

const ResumeAnalysis = ({ analysis }) => {
  return (
    <div>
      <h3>Analysis Results</h3>

      <p><strong>Resume Score:</strong> {analysis.resume_score}</p>
      <p><strong>Industry Ranking:</strong> {analysis["industry ranking"]}</p>
      <p><strong>Overall Feedback:</strong> {analysis.overall_feedback}</p>

      <h4>Key Insights</h4>
      <p><strong>Skills Acquired:</strong> {analysis.key_insights.Skills_Accquired}%</p>
      <p><strong>Experience:</strong> {analysis.key_insights.Experience}%</p>
      <p><strong>Education Relevance:</strong> {analysis.key_insights.Education_relevance}%</p>

      <h4>Resume Gaps</h4>
      <p><strong>Missing Skills:</strong> {analysis.Resume_Gap_Resume.missing_skills.join(", ") || "None"}</p>
      <p><strong>Recommended Courses:</strong> {analysis.Resume_Gap_Resume.recommended_courses.join(", ") || "None"}</p>
      <p><strong>Experience Required:</strong> {analysis.Resume_Gap_Resume.experience_required}</p>

      <h4>Recommended Job Roles</h4>
      <ul>
        {analysis.Recommendations.best_job_roles.map((job, index) => (
          <li key={index}>
            {job.role} - {job.match_percentage}%
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResumeAnalysis;
