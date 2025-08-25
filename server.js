const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Translate endpoint using MyMemory
app.post("/translate", async (req, res) => {
  const { text, source, target } = req.body;
  console.log("Received request:", text, source, target); // <-- ADD THIS

  if (!text) return res.status(400).json({ error: "No text provided" });

  const langpair = `${source}|${target}`;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`;

  try {
    const response = await axios.get(url);
    console.log("API response:", response.data); // <-- ADD THIS
    const translatedText = response.data.responseData.translatedText;
    res.json({ translatedText });
  } catch (err) {
    console.error("Translation error:", err.message);
    res.status(500).json({ error: "Translation failed" });
  }
});


app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
