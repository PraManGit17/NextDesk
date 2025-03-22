// ResumeAnalysis.jsx
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

const ResumeAnalysis = ({ analysis }) => {
  if (!analysis) return <p>No analysis available.</p>;

  // Destructure analysis data
  const {
    resume_score,
    industry_ranking,
    overall_feedback,
    key_insights,
    resume_gap,
    recommendations,
  } = analysis;

  // Utility function to prepare data for a pie chart
  const prepareChartData = (percentage, label) => ({
    labels: [label, 'Remaining'],
    datasets: [
      {
        data: [parseInt(percentage, 10), 100 - parseInt(percentage, 10)],
        backgroundColor: ['#36A2EB', '#E0E0E0'],
        hoverBackgroundColor: ['#36A2EB', '#E0E0E0'],
      },
    ],
  });

  return (
    <div className="resume-analysis p-6 bg-gray-800 text-white rounded-xl shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-4">Resume Analysis Summary</h2>

      <div className="mb-6">
        <p><strong>Overall Resume Score:</strong> {resume_score}</p>
        <p><strong>Industry Ranking:</strong> {industry_ranking}</p>
        <p><strong>Feedback:</strong> {overall_feedback}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-2">Skills Acquired</h3>
          <Pie data={prepareChartData(key_insights.Skills_Acquired, "Skills Acquired")} />
          <p className="mt-2 text-center">{key_insights.Skills_Acquired}</p>
        </div>
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-2">Experience</h3>
          <Pie data={prepareChartData(key_insights.Experience, "Experience")} />
          <p className="mt-2 text-center">{key_insights.Experience}</p>
        </div>
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-2">Education Relevance</h3>
          <Pie data={prepareChartData(key_insights.Education_relevance, "Education Relevance")} />
          <p className="mt-2 text-center">{key_insights.Education_relevance}

          </p>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-2">Resume Gaps</h3>
        <p><strong>Missing Skills:</strong> {resume_gap.missing_skills.join(", ")}</p>
        <p><strong>Recommended Courses:</strong> {resume_gap.recommended_courses.join(", ")}</p>
        <p><strong>Experience Required:</strong> {resume_gap.experience_required}</p>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-2">Job Recommendations</h3>
        {recommendations.best_job_roles.map((job, idx) => (
          <div key={idx} className="mb-2">
            <p><strong>Role:</strong> {job.role} - <strong>Match:</strong> {job.match_percentage}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeAnalysis;
