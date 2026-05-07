import { useState } from "react";
import axios from "axios";
import { runAudit } from "../utils/audit";
import { Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Home() {
  const [tools, setTools] = useState([{ name: "", plan: "", cost: "", seats: "" }]);
  const [teamSize, setTeamSize] = useState("");
  const [useCase, setUseCase] = useState("general");
  
  const [result, setResult] = useState(null);
  const [shareId, setShareId] = useState(null);
  
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [aiSummary, setAiSummary] = useState("");

  const handleToolChange = (index, e) => {
    const updatedTools = [...tools];
    updatedTools[index][e.target.name] = e.target.value;
    setTools(updatedTools);
  };

  const addTool = () => {
    setTools([...tools, { name: "", plan: "", cost: "", seats: "" }]);
  };

  const removeTool = (index) => {
    const updatedTools = tools.filter((_, i) => i !== index);
    setTools(updatedTools);
  };

  const generateFallbackSummary = (auditResult, totalSpend) => {
    if (auditResult.totalSavings === 0) {
      return "Your team is running efficiently with no identified wasted spend. Keep up the great work optimizing your AI stack!";
    }
    const highestSaving = auditResult.results.reduce((prev, current) => (prev.savings > current.savings) ? prev : current, {savings: 0});
    return `Your team is overspending by $${auditResult.totalSavings}/month. A significant portion of this comes from your ${highestSaving.tool} plan. By optimizing your licenses and switching plans as recommended, you can achieve a more efficient AI stack without sacrificing productivity.`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format tools correctly (parse numbers)
    const formattedTools = tools.map(t => ({
      ...t,
      cost: parseFloat(t.cost) || 0,
      seats: parseInt(t.seats) || 0
    }));

    const auditResult = runAudit({
      tools: formattedTools,
      teamSize: parseInt(teamSize) || 1,
      useCase
    });

    setResult(auditResult);

    // Generate AI Summary (Fallback logic as requested)
    const totalSpend = formattedTools.reduce((acc, t) => acc + t.cost, 0);
    setAiSummary(generateFallbackSummary(auditResult, totalSpend));

    // Save to backend
    try {
      const res = await axios.post(`${API_URL}/api/audit/create`, {
        tools: formattedTools,
        teamSize: parseInt(teamSize) || 1,
        useCase,
        totalSavings: auditResult.totalSavings
      });
      setShareId(res.data.shareId);
      setEmailSubmitted(false);
    } catch (err) {
      console.error("Error creating audit:", err);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!shareId || !email) return;

    try {
      await axios.post(`${API_URL}/api/audit/email`, {
        shareId,
        email
      });
      setEmailSubmitted(true);
    } catch (err) {
      console.error("Error attaching email:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center py-12 px-4 font-sans">
      
      {!result && (
        <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
              AI Spend Audit
            </h2>
            <p className="text-slate-300">Find out if you're overpaying for your AI tools</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Team Size</label>
                <input 
                  type="number"
                  placeholder="e.g. 5" 
                  value={teamSize}
                  onChange={e => setTeamSize(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Primary Use Case</label>
                <select 
                  value={useCase}
                  onChange={e => setUseCase(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                >
                  <option value="general">General (Writing, Analysis)</option>
                  <option value="coding">Coding / Engineering</option>
                  <option value="design">Design / Creative</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                <h3 className="text-lg font-semibold text-white">Your AI Tools</h3>
                <button type="button" onClick={addTool} className="text-sm text-purple-400 hover:text-purple-300 font-medium">
                  + Add Tool
                </button>
              </div>

              {tools.map((tool, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 items-center bg-slate-900/40 p-4 rounded-lg border border-slate-700/50">
                  <div className="col-span-12 sm:col-span-3">
                    <input name="name" placeholder="Tool Name" value={tool.name} onChange={e => handleToolChange(index, e)} className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-md text-white text-sm" required />
                  </div>
                  <div className="col-span-12 sm:col-span-3">
                    <input name="plan" placeholder="Plan (e.g. Team)" value={tool.plan} onChange={e => handleToolChange(index, e)} className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-md text-white text-sm" required />
                  </div>
                  <div className="col-span-6 sm:col-span-2">
                    <input name="cost" type="number" placeholder="Cost/mo" value={tool.cost} onChange={e => handleToolChange(index, e)} className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-md text-white text-sm" required />
                  </div>
                  <div className="col-span-5 sm:col-span-3">
                    <input name="seats" type="number" placeholder="Seats" value={tool.seats} onChange={e => handleToolChange(index, e)} className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-md text-white text-sm" required />
                  </div>
                  <div className="col-span-1 text-right">
                    {tools.length > 1 && (
                      <button type="button" onClick={() => removeTool(index)} className="text-red-400 hover:text-red-300 font-bold text-xl">&times;</button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-lg rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)] transform transition-all hover:-translate-y-0.5 mt-4"
            >
              Run Audit
            </button>
          </form>
        </div>
      )}

      {result && (
        <div className="max-w-3xl w-full space-y-6">
          {/* Hero Section */}
          <div className="bg-slate-800/90 border border-slate-700 text-white rounded-2xl p-8 shadow-2xl text-center">
            {result.totalSavings > 0 ? (
              <>
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 mb-2">
                  You’re overspending ${result.totalSavings}/month
                </h1>
                <p className="text-xl text-slate-300 font-medium">
                  That’s <span className="text-white font-bold">${result.yearlySavings}/year</span> wasted.
                </p>
              </>
            ) : (
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                You're already spending efficiently!
              </h1>
            )}
          </div>

          {/* AI Summary Block */}
          <div className="bg-slate-800/90 border border-purple-500/30 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-400 to-pink-500"></div>
            <h3 className="text-sm font-bold tracking-wider text-purple-400 uppercase mb-2 flex items-center">
              <span className="mr-2">✨</span> AI Summary
            </h3>
            <p className="text-slate-200 leading-relaxed italic">
              "{aiSummary}"
            </p>
          </div>

          {/* Detailed Recommendations */}
          {result.results.length > 0 && (
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6">Optimization Breakdown</h2>
              
              <div className="space-y-4">
                {result.results.map((item, index) => (
                  <div key={index} className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-lg font-bold text-white">
                        {item.tool} <span className="text-sm font-normal text-slate-400 ml-1">({item.currentPlan})</span>
                      </h4>
                      {item.savings > 0 && (
                        <span className="bg-green-900/50 text-green-400 text-sm font-bold px-3 py-1 rounded-full border border-green-500/30">
                          Save ${item.savings}/mo
                        </span>
                      )}
                    </div>
                    
                    <div className="bg-slate-800/80 p-3 rounded-lg mb-3 border border-slate-700">
                      <p className="text-yellow-400 font-semibold">
                        👉 {item.recommendation}
                      </p>
                    </div>
                    
                    <p className="text-slate-400 text-sm flex items-start">
                      <span className="mr-2">💡</span>
                      {item.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Email Capture Section */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 shadow-xl text-center">
            {!emailSubmitted ? (
              <>
                <h3 className="text-2xl font-bold text-white mb-2">Get your full report</h3>
                <p className="text-slate-400 mb-6">Save these results and get a shareable link sent to your inbox.</p>
                
                <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto space-y-4">
                  <input 
                    type="email" 
                    placeholder="Enter your email address" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 text-white placeholder-slate-500"
                    required
                  />
                  <button 
                    type="submit"
                    className="w-full py-3 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    Get Report
                  </button>
                </form>
              </>
            ) : (
              <div className="py-4">
                <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
                <h3 className="text-2xl font-bold text-white mb-2">Report Sent!</h3>
                <p className="text-slate-400 mb-6">Check your email for the detailed breakdown.</p>
                <div className="p-4 bg-slate-900 rounded-lg border border-slate-700 inline-block">
                  <p className="text-sm text-slate-500 mb-1">Your Shareable Link:</p>
                  <Link to={`/audit/${shareId}`} className="text-purple-400 font-medium hover:text-purple-300 break-all">
                    {window.location.origin}/audit/{shareId}
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          <div className="text-center pb-8">
            <button onClick={() => {setResult(null); setTools([{ name: "", plan: "", cost: "", seats: "" }]);}} className="text-slate-500 hover:text-slate-300 text-sm underline">
              Run another audit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
