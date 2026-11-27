require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

// Health check – quick way to see the server is alive
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// One route file per screen (each developer owns one)
app.use("/api/hub", require("./routes/hub"));          // Cajun – Screen 02
app.use("/api/results", require("./routes/results"));  // Anna – Screen 03
app.use("/api/stations", require("./routes/details")); // Shubhada – Screen 04
app.use("/api/compare", require("./routes/compare"));  // Sarita – Screen 05

// Unknown routes
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
