const Audit = require('../models/Audit');
const { nanoid } = require('nanoid');
const nodemailer = require('nodemailer');

const createAudit = async (req, res) => {
  try {
    const { tools, teamSize, useCase, totalSavings } = req.body;
    const shareId = nanoid(10);

    const audit = new Audit({
      tools,
      teamSize,
      useCase,
      totalSavings,
      shareId
    });

    await audit.save();
    res.status(201).json({ message: "Audit saved successfully", shareId });
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

    // Mock sending email via nodemailer
    const transport = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
          user: 'mock_user@ethereal.email',
          pass: 'mock_password'
      }
    });

    console.log(`[MOCK EMAIL] Sending audit report to ${email} for shareId: ${shareId}`);
    console.log(`[MOCK EMAIL] Total Savings: $${audit.totalSavings}`);
    
    // In production, we'd do transport.sendMail(...)

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
      shareId: audit.shareId,
      createdAt: audit.createdAt
    };

    res.status(200).json(safeAudit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createAudit, attachEmail, getAudit };
