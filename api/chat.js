export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    // Log apa yang diterima dari frontend
    console.log("Body dari frontend:", JSON.stringify(req.body));
    console.log("API Key ada?", !!process.env.ANTHROPIC_API_KEY);
    console.log("API Key prefix:", process.env.ANTHROPIC_API_KEY?.substring(0, 10));

    const { messages, system, model, max_tokens } = req.body;

    // Pastikan messages tidak kosong
    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: "Messages kosong" });
    }

    // Bersihkan messages — hapus field yang tidak dikenal Anthropic
    const cleanMessages = messages.map(m => ({
      role: m.role,
      content: m.content,
    }));

    const requestBody = {
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: cleanMessages,
    };

    // Tambahkan system hanya kalau ada isinya
    if (system) requestBody.system = system;

    console.log("Request ke Anthropic:", JSON.stringify(requestBody));

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    console.log("Response Anthropic:", JSON.stringify(data));

    res.status(200).json(data);

  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
}