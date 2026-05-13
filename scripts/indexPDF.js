import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const require = createRequire(import.meta.url);
const PDFParser = require("pdf2json");

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Koneksi ke Supabase ─────────────────────────────────────────────────────
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const CF_URL = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/baai/bge-base-en-v1.5`;

// ─── Fungsi: Embedding pakai Cloudflare AI (gratis) ──────────────────────────
async function buatEmbedding(teks) {
  const res = await fetch(CF_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: [teks] }),
  });

  const data = await res.json();

  if (!data.success) {
    console.error("\n❌ Cloudflare error:", JSON.stringify(data.errors));
    throw new Error("Embedding gagal");
  }

  return data.result.data[0]; // array of numbers
}

// ─── Fungsi: Potong teks ─────────────────────────────────────────────────────
function potongTeks(teks, ukuran = 500, overlap = 50) {
  const kata = teks.split(" ");
  const potongan = [];
  let i = 0;
  while (i < kata.length) {
    const chunk = kata.slice(i, i + ukuran).join(" ");
    if (chunk.trim()) potongan.push(chunk);
    i += ukuran - overlap;
  }
  return potongan;
}

// ─── Fungsi: Baca PDF ────────────────────────────────────────────────────────
function bacaPDFText(filePath) {
  return new Promise((resolve, reject) => {
    const parser = new PDFParser(null, 1);
    parser.on("pdfParser_dataReady", () => {
      const teks = parser.getRawTextContent()
        .replace(/\s+/g, " ")
        .trim();
      resolve(teks);
    });
    parser.on("pdfParser_dataError", (err) => reject(err));
    parser.loadPDF(filePath);
  });
}

// ─── Fungsi: Proses satu PDF ─────────────────────────────────────────────────
async function prosesPDF(filePath) {
  const namaFile = path.basename(filePath);
  console.log(`\n📄 Memproses: ${namaFile}`);

  const teks = await bacaPDFText(filePath);

  if (!teks || teks.trim().length < 10) {
    console.log(`⚠️  Teks kosong, skip: ${namaFile}`);
    return;
  }

  const potongan = potongTeks(teks, 500, 50);
  console.log(`   ✂️  ${potongan.length} potongan dibuat`);

  for (let i = 0; i < potongan.length; i++) {
    const chunk = potongan[i];
    process.stdout.write(`   🔢 Embedding ${i + 1}/${potongan.length}...\r`);

    try {
      const embedding = await buatEmbedding(chunk);

      const { error } = await supabase.from("dokumen").insert({
        content: chunk,
        metadata: {
          source: namaFile,
          chunk_index: i,
          total_chunks: potongan.length,
        },
        embedding: embedding,
      });

      if (error) console.error(`\n❌ Error simpan:`, error.message);

    } catch (err) {
      console.error(`\n❌ Error:`, err.message);
    }

    // Jeda kecil agar tidak kena rate limit
    await new Promise(r => setTimeout(r, 100));
  }

  console.log(`\n   ✅ Selesai: ${namaFile}`);
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
async function main() {
  const folderPDF = path.join(__dirname, "pdfs");

  if (!fs.existsSync(folderPDF)) {
    console.error("❌ Folder scripts/pdfs tidak ditemukan!");
    process.exit(1);
  }

  const files = fs.readdirSync(folderPDF)
    .filter(f => f.toLowerCase().endsWith(".pdf"));

  if (files.length === 0) {
    console.error("❌ Tidak ada file PDF di folder scripts/pdfs/");
    process.exit(1);
  }

  console.log(`\n🚀 Mulai indexing ${files.length} file PDF...\n`);
  console.log("=".repeat(50));

  for (const file of files) {
    await prosesPDF(path.join(folderPDF, file));
  }

  console.log("\n" + "=".repeat(50));
  console.log("🎉 Semua PDF berhasil diindeks ke Supabase!");
  console.log("=".repeat(50));
}

main().catch(console.error);