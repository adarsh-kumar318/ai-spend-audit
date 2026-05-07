import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function AuditReport() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const fetchAudit = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/audit/${id}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchAudit();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied!");
  };

  const handleSendReport = async () => {
    if (!email) return;
    try {
      await axios.post(`http://localhost:5000/api/audit/email`, { shareId: id, email });
      setEmailSent(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-white flex items-center justify-center text-gray-900">Loading your report...</div>;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-gray-900 p-4">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Report Not Found</h2>
        <p className="mb-6">We couldn't find the audit report you're looking for.</p>
        <Link to="/" className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8 font-sans text-gray-900">
      <div className="max-w-2xl mx-auto py-10">
        
        {/* STEP 2 — HERO SECTION */}
        <div className="mb-8 border-b pb-8">
          <h1 className="text-3xl font-bold">
            You’re overspending ${data.totalSavings}/month
          </h1>
          <p className="text-gray-600 mt-2">
            That’s ${data.totalSavings * 12}/year in avoidable AI spend.
          </p>
        </div>

        {/* STEP 3 — BREAKDOWN CARDS */}
        <div className="mt-6 space-y-4">
          {data.auditBreakdown && data.auditBreakdown.map((tool, idx) => (
            <div key={idx} className="border p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <h2 className="font-semibold text-lg">
                {tool.tool}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {tool.reason}
              </p>
              <p className="mt-2 font-medium">
                Savings: <span className="text-green-600">${tool.savings}/month</span>
              </p>
              <p className="text-sm text-blue-600 mt-1 font-medium">
                {tool.recommendation}
              </p>
            </div>
          ))}
        </div>

        {/* STEP 4 — AI SUMMARY */}
        <div className="mt-8 bg-gray-50 border p-5 rounded-xl">
          <h3 className="font-semibold text-lg">AI Summary</h3>
          <p className="text-sm mt-2 text-gray-700 leading-relaxed">
            {data.aiSummary || "Your AI stack shows moderate inefficiencies mainly due to over-provisioned team plans. Optimization opportunities exist in license reduction rather than tool replacement."}
          </p>
        </div>

        {/* STEP 5 — EMAIL CAPTURE */}
        <div className="mt-10 border-t pt-8">
          <h3 className="font-semibold text-lg mb-2">Get full report</h3>
          {emailSent ? (
            <div className="bg-green-50 text-green-700 p-3 rounded border border-green-200 text-sm font-medium">
              ✓ Report sent to {email}!
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 mt-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="border p-3 w-full rounded flex-1 focus:outline-none focus:ring-2 focus:ring-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button 
                onClick={handleSendReport}
                className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors font-medium whitespace-nowrap"
              >
                Send Report
              </button>
            </div>
          )}
        </div>

        {/* STEP 6 — SHARE BUTTON */}
        <div className="mt-10 text-center">
          <button
            onClick={handleShare}
            className="text-gray-600 hover:text-black font-semibold underline underline-offset-4 transition-colors"
          >
            Share Report
          </button>
        </div>

        <div className="mt-12 text-center pt-8 border-t border-gray-100">
          <Link to="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
            ← Run another audit
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AuditReport;
