const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const { Resend } = require('resend');
const rateLimit = require('express-rate-limit');

dotenv.config();

// MongoDB connect
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));

const auditRoutes = require('./routes/auditRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Apply rate limiter to all API routes
app.use('/api/', limiter);

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.get('/test-email', async (req, res) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      to: "your_email@gmail.com",
      subject: "Test Email",
      html: "<h1>Email working</h1>",
    });
    console.log("Test email sent:", response);
    res.send("Email sent successfully! Check your console/inbox.");
  } catch (error) {
    console.log("TEST EMAIL ERROR:", error);
    res.send(error);
  }
});

app.use('/api/audit', auditRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
