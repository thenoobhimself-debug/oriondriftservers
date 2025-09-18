require("dotenv").config();
const express = require("express");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000; // Render provides PORT

app.use(cors());

app.get("/stations", async (req, res) => {
  try {
    const response = await fetch("https://api.oriondriftvr.com/stations", {
      headers: {
        "Authorization": `Bearer ${process.env.API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`API error ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error fetching stations:", err.message);
    res.status(500).json({ error: "Failed to fetch stations" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
