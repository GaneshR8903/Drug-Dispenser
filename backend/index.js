const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const doctorEnquiryRoutes = require("./routes/doctorEnquiryRoutes");
const patientRoutes = require('./routes/patientRoutes');
const stockRoutes = require("./routes/stockRoutes");
const dispenseRoutes = require("./routes/dispenseRoutes");

dotenv.config();

const app = express();

// Connect to Database
(async () => {
  try {
    await connectDB();
    console.log("Database Connected Successfully");
  } catch (error) {
    console.error("Database Connection Failed:", error.message);
    process.exit(1); // Exit process if DB connection fails
  }
})();

// CORS Configuration
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Default API Route (Health Check)
app.get("/", (req, res) => {
  res.send({ message: "API is running successfully!" });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use("/api/doctor-enquiries", doctorEnquiryRoutes);
app.use('/api/patients', patientRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/dispense", dispenseRoutes);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
