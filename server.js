require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.listen(3000, () => {
  console.log("✅ Server starting...");
  console.log("🚀 Server running at http://localhost:3000");
  console.log("TELEGRAM_BOT_TOKEN:", TELEGRAM_TOKEN ? "[LOADED]" : "[MISSING]");
  console.log("TELEGRAM_CHAT_ID:", CHAT_ID ? "[LOADED]" : "[MISSING]");
});

app.post("/send-telegram", async (req, res) => {
  const { message } = req.body;

  if (!TELEGRAM_TOKEN || !CHAT_ID) {
    return res.status(500).json({ error: "Missing Telegram credentials" });
  }

  try {
    const telegramURL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

    const response = await fetch(telegramURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });

    const data = await response.json();
    console.log("Telegram response:", data); // ← Log response

    if (!data.ok) {
      return res.status(500).json({ error: data.description });
    }

    res.json({ success: true, telegram_response: data });
  } catch (error) {
    console.error("Telegram error:", error.message);
    res.status(500).json({ error: "Failed to send Telegram message" });
  }
});
