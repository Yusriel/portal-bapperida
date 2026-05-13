export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { messages, system } = req.body;
    const pertanyaan = messages[messages.length - 1]?.content || "";

    // ── STEP 1: Ubah pertanyaan ke embedding pakai Cloudflare ──
    const embRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/baai/bge-base-en-v1.5`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: [pertanyaan] }),
      }
    );
    const embData = await embRes.json();
    const queryEmbedding = embData.result.data[0];

    // ── STEP 2: Cari dokumen relevan di Supabase ──
    const sbRes = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/rpc/cari_dokumen`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": process.env.SUPABASE_SERVICE_KEY,
          "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
        },
        body: JSON.stringify({
          query_embedding: queryEmbedding,
          match_count: 5,
        }),
      }
    );
    const dokumen = await sbRes.json();
    console.log("Dokumen ditemukan:", dokumen?.length || 0);

    // ── STEP 3: Susun konteks dari dokumen ──
    let konteks = "";
    if (Array.isArray(dokumen) && dokumen.length > 0) {
      konteks = dokumen
        .map((d, i) => `[Sumber ${i + 1}: ${d.metadata?.source}]\n${d.content}`)
        .join("\n\n---\n\n");
    }

    // ── STEP 4: Gabungkan system prompt + konteks PDF ──
    const systemFinal = `${system || ""}

${konteks ? `Berikut informasi dari dokumen resmi RPJMD yang relevan dengan pertanyaan:

${konteks}

Jawab berdasarkan dokumen di atas. Sebutkan nama file sumbernya. Jika informasi tidak tersedia dalam dokumen, katakan "Informasi ini tidak tersedia dalam dokumen RPJMD yang saya miliki."` : ""}`;

    // ── STEP 5: Format messages untuk Gemini ──
    const geminiMessages = messages
      .filter(m => m.content && m.content.trim())
      .map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    // ── STEP 6: Kirim ke Gemini 3 Flash Preview ──
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemFinal }]
          },
          contents: geminiMessages,
          generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.7,
            responseMimeType: "text/plain", // ← paksa output plain text, tanpa markdown
          },
        }),
      }
    );

    const geminiData = await geminiRes.json();
    console.log("Gemini response:", JSON.stringify(geminiData));

    const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text
      || "Maaf, saya tidak dapat memproses permintaan Anda saat ini.";

    res.status(200).json({ content: [{ type: "text", text }] });

  } catch (error) {
    console.error("Error RAG:", error.message);
    res.status(500).json({ error: error.message });
  }
}