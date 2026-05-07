const Audit = require('../models/Audit');
const { nanoid } = require('nanoid');
const { Resend } = require('resend');

const createAudit = async (req, res) => {
  try {
    const { tools, teamSize, useCase } = req.body;

    if (!tools || !Array.isArray(tools)) {
      return res.status(400).json({ error: "Invalid tools data" });
    }

    const shareId = nanoid(10);

    const { runAuditEngine } = require('../utils/auditEngine');
    const engineResult = runAuditEngine({ tools, teamSize, useCase });
    
    const auditBreakdown = engineResult.auditBreakdown;
    const totalSavings = engineResult.totalSavings;

    const audit = new Audit({
      tools,
      teamSize,
      useCase,
      totalSavings,
      auditBreakdown,
      shareId
    });

    await audit.save();

    res.status(201).json({
      message: "Audit saved successfully",
      shareId,
      totalSavings,
      auditBreakdown
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const attachEmail = async (req, res) => {
  try {
    const { shareId, email } = req.body;
    
    const audit = await Audit.findOneAndUpdate(
      { shareId },
      { email },
      { new: true }
    );

    if (!audit) {
      return res.status(404).json({ message: "Audit not found" });
    }

    console.log("Sending email...");

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #0f172a; margin-top: 0;">Your AI Spend Audit Report</h2>
        <p style="color: #334155; font-size: 16px;">Hi,</p>
        <p style="color: #334155; font-size: 16px;">Your AI Spend Audit is ready.</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #8b5cf6;">
          <p style="color: #0f172a; font-size: 16px; margin: 0;">We found potential savings of approximately <strong>$${audit.totalSavings * 12}/year</strong> based on your current AI tooling stack.</p>
        </div>
        
        <h3 style="color: #0f172a;">Key recommendations:</h3>
        <ul style="color: #334155; font-size: 16px; line-height: 1.6; padding-left: 20px;">
          ${audit.auditBreakdown.filter(b => b.savings > 0).map(b => `<li style="margin-bottom: 8px;"><strong>${b.recommendation}</strong> (Save $${b.savings}/mo)</li>`).join('') || '<li style="margin-bottom: 8px;">Your stack is highly optimized! Review your usage for further efficiency.</li>'}
        </ul>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/audit/${audit.shareId}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">View full audit</a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
        <p style="color: #64748b; font-size: 14px; text-align: center; margin-bottom: 0;">Thanks for trying AI Spend Audit.</p>
      </div>
    `;

    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const response = await resend.emails.send({
        from: process.env.EMAIL_FROM || "onboarding@resend.dev",
        to: email,
        subject: "Your AI Spend Audit Report",
        html: emailHtml,
      });
      console.log("Email sent successfully", response);
    } catch (error) {
      console.log("EMAIL ERROR:", error);
    }

    res.status(200).json({ message: "Email attached and confirmation sent" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAudit = async (req, res) => {
  try {
    const { id } = req.params;
    const audit = await Audit.findOne({ shareId: id });
    
    if (!audit) {
      return res.status(404).json({ message: "Audit not found" });
    }
    
    // We intentionally don't expose the email in the shareable link response
    const safeAudit = {
      tools: audit.tools,
      teamSize: audit.teamSize,
      useCase: audit.useCase,
      totalSavings: audit.totalSavings,
      auditBreakdown: audit.auditBreakdown,
      shareId: audit.shareId,
      createdAt: audit.createdAt
    };

    res.status(200).json(safeAudit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createAudit, attachEmail, getAudit };
