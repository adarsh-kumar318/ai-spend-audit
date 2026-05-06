const mongoose = require("mongoose");

const auditSchema = new mongoose.Schema({
  email: {
    type: String,
    default: null
  },
  tools: {
    type: Array,
    required: true
  },
  teamSize: {
    type: Number,
    required: true
  },
  useCase: {
    type: String,
    required: true
  },
  totalSavings: {
    type: Number,
    required: true
  },
  shareId: {
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Audit", auditSchema);
