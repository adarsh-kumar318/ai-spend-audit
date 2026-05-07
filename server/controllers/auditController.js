const Audit = require('../models/Audit');
const { nanoid } = require('nanoid');

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
    if (process.env.NODE_ENV === "production") {
      // Send real email here
      // const transport = nodemailer.createTransport({ ... });
      // await transport.sendMail({ ... });
    } else {
      console.log(`[EMAIL MOCK] Sent audit to ${email}`);
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
