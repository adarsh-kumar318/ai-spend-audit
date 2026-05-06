import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { runAudit } from "../utils/audit";

function AuditReport() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAudit = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/audit/${id}`);
        setReport(res.data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchAudit();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading your report...</div>;
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
        <h2 className="text-2xl font-bold text-red-400 mb-4">Report Not Found</h2>
        <p className="mb-6">We couldn't find the audit report you're looking for.</p>
        <Link to="/" className="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-8 font-sans text-white">
      <div className="max-w-3xl mx-auto bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
        <div className="flex justify-between items-center mb-8 border-b border-slate-700 pb-6">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            AI Spend Audit Report
          </h1>
          <Link to="/" className="text-sm text-slate-400 hover:text-white transition-colors">
            Run New Audit
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700/50">
            <p className="text-slate-400 text-sm mb-1">Total Savings Identified</p>
            <p className="text-4xl font-bold text-green-400">${report.totalSavings}/mo</p>
            <p className="text-sm text-green-500 mt-2">That's ${report.totalSavings * 12}/year!</p>
          </div>
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700/50">
            <p className="text-slate-400 text-sm mb-1">Team Details</p>
            <p className="text-xl font-semibold text-white">{report.teamSize} Member(s)</p>
            <p className="text-sm text-slate-300 mt-2">Primary Use Case: <span className="capitalize">{report.useCase}</span></p>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">Detailed Recommendations</h2>
        <div className="space-y-4 mb-10">
          {runAudit({ tools: report.tools, teamSize: report.teamSize, useCase: report.useCase }).results.map((item, idx) => (
            <div key={idx} className="p-5 bg-slate-900/50 rounded-lg border border-slate-700/50 hover:border-purple-500/30 transition-colors">
              <h4 className="text-lg font-semibold text-white mb-2">
                {item.tool} <span className="text-sm font-normal text-slate-400 ml-2">({item.currentPlan})</span>
              </h4>
              <p className="text-yellow-400 font-medium mb-1">
                👉 {item.recommendation}
              </p>
              <p className="text-green-400 font-medium mb-2">
                💸 Save: ${item.savings}/month
              </p>
              <p className="text-slate-400 text-sm italic">
                {item.reason}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AuditReport;
