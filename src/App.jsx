import { useState, useRef, useEffect } from "react";

// ─── Color & Style Config ────────────────────────────────────────────────────
const COLORS = {
  primary: "#1a3a6b",
  primaryLight: "#2563eb",
  accent: "#f59e0b",
  accentLight: "#fbbf24",
  bg: "#f0f4fb",
  white: "#ffffff",
  text: "#1e293b",
  textMuted: "#64748b",
  border: "#dbe6f7",
  success: "#16a34a",
  chatBubbleUser: "#1a3a6b",
  chatBubbleBot: "#ffffff",
};

// ─── Data ────────────────────────────────────────────────────────────────────
const STATS = [
  { value: "209K+", label: "Jiwa Terlayani", icon: "👥" },
  { value: "5 Tahun", label: "Periode RPJMD", icon: "📅" },
  { value: "78+", label: "Program Prioritas", icon: "🎯" },
  { value: "100%", label: "Transparansi Data", icon: "📊" },
];

const BERITA = [
  {
    id: 1,
    title: "Musrenbang Kabupaten Pasuruan 2026 Hasilkan 68 Usulan Program Prioritas",
    kategori: "Musrenbang 2026",
    tanggal: "23 Apr 2026",
    ringkasan:
      "Pemerintah Kabupaten Pasuruan sukses menyelenggarakan Musyawarah Rencana Pembangunan tingkat kota dengan menampung 68 usulan program prioritas dari berbagai elemen masyarakat.",
    emoji: "🏛️",
  },
  {
    id: 2,
    title: "Dokumen RPJMD Kabupaten Pasuruan 2025–2029 Resmi Ditetapkan Perda",
    kategori: "Dokumen Resmi",
    tanggal: "23 Apr 2026",
    ringkasan:
      "DPRD Kabupaten Pasuruan mengesahkan Peraturan Daerah tentang RPJMD Kabupaten Pasuruan 2025–2029 dalam sidang paripurna.",
    emoji: "📜",
  },
  {
    id: 3,
    title: "Progres Infrastruktur Kabupaten Pasuruan Capai 78% Sesuai Target RPJMD",
    kategori: "Realisasi Program",
    tanggal: "23 Apr 2026",
    ringkasan:
      "Bupati Kabupaten Pasuruan mengumumkan capaian realisasi program infrastruktur telah mencapai 78% dari target RPJMD.",
    emoji: "🏗️",
  },
];

const LAYANAN = [
  {
    judul: "Dokumen RPJMD",
    deskripsi: "Unduh dan akses dokumen resmi RPJMD Kabupaten Pasuruan 2025–2029 beserta lampiran program prioritas dan indikator kinerja.",
    icon: "📋",
    link: "#",
    warna: "#1a3a6b",
  },
  {
    judul: "Monitoring Capaian",
    deskripsi: "Pantau realisasi dan capaian program prioritas RPJMD secara berkala, lengkap dengan indikator kinerja utama (IKU) setiap OPD.",
    icon: "📈",
    link: "#",
    warna: "#2563eb",
  },
  {
    judul: "Aspirasi & Pengaduan",
    deskripsi: "Sampaikan aspirasi, masukan, dan laporan terkait pelaksanaan program RPJMD langsung kepada tim pengelola.",
    icon: "💬",
    link: "#",
    warna: "#f59e0b",
  },
];

const PROFIL_DATA = [
  { label: "Nama Instansi", value: "Badan Perencanaan Pembangunan, Riset, dan Inovasi Daerah (Bapperida)" },
  { label: "Kabupaten", value: "Kabupaten Pasuruan, Jawa Timur" },
  { label: "Periode RPJMD", value: "2025 – 2029" },
  { label: "Visi", value: "Mewujudkan Kabupaten Pasuruan yang Maju, Sejahtera, Berdaya Saing, dan Berakhlak" },
  { label: "Program Prioritas", value: "78 Program tersebar di 12 bidang pembangunan" },
  { label: "Anggaran APBD", value: "Rp 2,8 Triliun (Tahun 2026)" },
];

const CAPAIAN_DATA = [
  { bidang: "Infrastruktur & Konektivitas", persen: 78, warna: "#2563eb" },
  { bidang: "Kesehatan & Gizi", persen: 85, warna: "#16a34a" },
  { bidang: "Pendidikan & SDM", persen: 72, warna: "#f59e0b" },
  { bidang: "Ekonomi & Investasi", persen: 65, warna: "#dc2626" },
  { bidang: "Lingkungan Hidup", persen: 60, warna: "#7c3aed" },
  { bidang: "Tata Kelola Pemerintahan", persen: 90, warna: "#0891b2" },
];

const MENU_ITEMS = ["Beranda", "Profil", "Layanan", "Capaian", "Berita", "Kontak"];

// ─── AI SYSTEM PROMPT ────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `Kamu adalah Asisten Virtual resmi Bapperida Kabupaten Pasuruan bernama "SIPA" (Sistem Informasi dan Pelayanan Aspirasi). Kamu bertugas membantu masyarakat mendapatkan informasi seputar:

1. RPJMD (Rencana Pembangunan Jangka Menengah Daerah) Kabupaten Pasuruan 2025-2029
2. Program-program prioritas pembangunan daerah (78+ program)
3. Capaian kinerja OPD (Organisasi Perangkat Daerah)
4. Layanan informasi Bapperida
5. Aspirasi, pengaduan, dan saran masyarakat

Data penting yang kamu ketahui:
- Periode RPJMD: 2025–2029
- Visi: "Mewujudkan Kabupaten Pasuruan yang Maju, Sejahtera, Berdaya Saing, dan Berakhlak"
- Jumlah jiwa terlayani: 209.000+ jiwa
- Program prioritas: 78+ program
- Capaian Infrastruktur: 78%
- Capaian Kesehatan: 85%
- Capaian Pendidikan: 72%
- APBD 2026: Rp 2,8 Triliun
- Alamat: Gedung Berakhlak Lt. 2, Jl. Raya Raci Km. 09 Bangil – Pasuruan
- Email: bapperida@pasuruankab.go.id

Selalu jawab dalam Bahasa Indonesia yang formal namun ramah. Gunakan emoji secukupnya agar terasa hangat. Jika ada pertanyaan di luar bidangmu, arahkan ke layanan terkait. Akhiri setiap respons dengan menawarkan bantuan lanjutan.`;

// ─── CHAT MESSAGE COMPONENT ──────────────────────────────────────────────────
function ChatMessage({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div style={{
      display: "flex",
      justifyContent: isUser ? "flex-end" : "flex-start",
      marginBottom: 12,
      gap: 8,
      alignItems: "flex-end",
    }}>
      {!isUser && (
        <div style={{
          width: 34, height: 34, borderRadius: "50%",
          background: "linear-gradient(135deg, #1a3a6b, #2563eb)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, flexShrink: 0, boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
        }}>🤖</div>
      )}
      <div style={{
        maxWidth: "75%",
        background: isUser
          ? "linear-gradient(135deg, #1a3a6b, #2563eb)"
          : "#ffffff",
        color: isUser ? "#ffffff" : "#1e293b",
        borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        padding: "10px 14px",
        fontSize: 14,
        lineHeight: 1.6,
        boxShadow: isUser
          ? "0 2px 12px rgba(37,99,235,0.35)"
          : "0 2px 8px rgba(0,0,0,0.08)",
        whiteSpace: "pre-wrap",
        border: isUser ? "none" : "1px solid #e2e8f0",
      }}>
        {msg.content}
        {msg.loading && (
          <span style={{ display: "inline-flex", gap: 4, marginLeft: 4 }}>
            {[0,1,2].map(i => (
              <span key={i} style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "#94a3b8",
                animation: `bounce 1s ${i * 0.2}s infinite`,
                display: "inline-block",
              }} />
            ))}
          </span>
        )}
      </div>
      {isUser && (
        <div style={{
          width: 34, height: 34, borderRadius: "50%",
          background: "#f0f4fb", border: "2px solid #dbe6f7",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, flexShrink: 0,
        }}>👤</div>
      )}
    </div>
  );
}

// ─── QUICK REPLIES ────────────────────────────────────────────────────────────
const QUICK_REPLIES = [
  "Apa itu RPJMD?",
  "Program prioritas apa saja?",
  "Capaian infrastruktur 2026",
  "Cara menyampaikan aspirasi",
  "Info dokumen RPJMD",
];

// ─── CHATBOT PANEL ────────────────────────────────────────────────────────────
function ChatbotPanel({ onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Halo! Saya SIPA, Asisten Virtual Bapperida Kabupaten Pasuruan 👋\n\nSaya siap membantu Anda mendapatkan informasi seputar RPJMD 2025–2029, program pembangunan, capaian kinerja, dan layanan Bapperida.\n\nAda yang bisa saya bantu hari ini?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;
    setInput("");

    const newMessages = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    const loadingId = Date.now();
    setMessages(prev => [...prev, { role: "assistant", content: "", loading: true, id: loadingId }]);

    try {
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: apiMessages,
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Maaf, saya tidak dapat memproses permintaan Anda saat ini.";
      setMessages(prev => prev.map(m =>
        m.id === loadingId ? { role: "assistant", content: reply } : m
      ));
    } catch {
      setMessages(prev => prev.map(m =>
        m.id === loadingId ? { role: "assistant", content: "⚠️ Terjadi gangguan koneksi. Silakan coba lagi." } : m
      ));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", bottom: 90, right: 24, zIndex: 1000,
      width: 370, height: 540,
      background: "#f8fafc",
      borderRadius: 20,
      boxShadow: "0 20px 60px rgba(26,58,107,0.25)",
      display: "flex", flexDirection: "column",
      overflow: "hidden",
      border: "1px solid #dbe6f7",
      animation: "slideUp 0.3s ease",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1a3a6b 0%, #2563eb 100%)",
        padding: "14px 16px",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          background: "rgba(255,255,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, border: "2px solid rgba(255,255,255,0.3)",
        }}>🤖</div>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, fontFamily: "Georgia, serif" }}>SIPA</div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 11 }}>Asisten Virtual Bapperida • Online</div>
        </div>
        <button onClick={onClose} style={{
          background: "rgba(255,255,255,0.15)", border: "none", color: "#fff",
          width: 28, height: 28, borderRadius: "50%", cursor: "pointer", fontSize: 14,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>✕</button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 12px 8px" }}>
        {messages.map((msg, i) => <ChatMessage key={i} msg={msg} />)}
        <div ref={bottomRef} />
      </div>

      {/* Quick Replies */}
      {messages.length <= 2 && (
        <div style={{ padding: "0 12px 6px", display: "flex", gap: 6, flexWrap: "wrap" }}>
          {QUICK_REPLIES.map(q => (
            <button key={q} onClick={() => sendMessage(q)} style={{
              background: "#fff", border: "1px solid #bfdbfe",
              borderRadius: 20, padding: "5px 12px", fontSize: 11,
              color: "#2563eb", cursor: "pointer", fontWeight: 500,
              transition: "all 0.2s",
            }}>{q}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{
        padding: "10px 12px 12px",
        borderTop: "1px solid #e2e8f0",
        background: "#fff",
        display: "flex", gap: 8, alignItems: "center",
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
          placeholder="Ketik pertanyaan Anda..."
          disabled={loading}
          style={{
            flex: 1, border: "1px solid #dbe6f7", borderRadius: 20,
            padding: "9px 14px", fontSize: 13, outline: "none",
            background: "#f8fafc", color: "#1e293b",
          }}
        />
        <button onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{
          width: 38, height: 38, borderRadius: "50%",
          background: loading || !input.trim()
            ? "#e2e8f0"
            : "linear-gradient(135deg, #1a3a6b, #2563eb)",
          border: "none", cursor: loading || !input.trim() ? "not-allowed" : "pointer",
          color: "#fff", fontSize: 16,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s",
          boxShadow: loading || !input.trim() ? "none" : "0 2px 8px rgba(37,99,235,0.4)",
        }}>➤</button>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activePage, setActivePage] = useState("Beranda");
  const [chatOpen, setChatOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const nav = (page) => { setActivePage(page); setMobileMenu(false); };

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, sans-serif", background: COLORS.bg, minHeight: "100vh", color: COLORS.text }}>
      <style>{`
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .nav-link:hover { background: rgba(37,99,235,0.08) !important; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(26,58,107,0.15) !important; }
        .btn-hover:hover { opacity: 0.9; transform: translateY(-1px); }
        .berita-card:hover { border-color: #2563eb !important; }
        .chat-btn:hover { transform: scale(1.08); }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        background: "#fff", borderBottom: "1px solid #dbe6f7",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 2px 12px rgba(26,58,107,0.08)",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", height: 64, gap: 12 }}>
          {/* Logo */}
          <div onClick={() => nav("Beranda")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", flexShrink: 0 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: "linear-gradient(135deg, #1a3a6b, #2563eb)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
            }}>🏛️</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, color: COLORS.primary, fontFamily: "Georgia, serif" }}>BAPPERIDA</div>
              <div style={{ fontSize: 10, color: COLORS.textMuted }}>Kabupaten Pasuruan</div>
            </div>
          </div>

          <div style={{ flex: 1 }} />

          {/* Desktop Menu */}
          <div style={{ display: "flex", gap: 4 }}>
            {MENU_ITEMS.map(item => (
              <button key={item} onClick={() => nav(item)} className="nav-link" style={{
                background: activePage === item ? "linear-gradient(135deg, #1a3a6b, #2563eb)" : "transparent",
                color: activePage === item ? "#fff" : COLORS.textMuted,
                border: "none", borderRadius: 8, padding: "7px 14px",
                fontSize: 13, fontWeight: activePage === item ? 600 : 400,
                cursor: "pointer", transition: "all 0.2s",
              }}>{item}</button>
            ))}
          </div>
        </div>
      </nav>

      {/* ── PAGES ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px 80px", animation: "fadeIn 0.4s ease" }}>

        {/* BERANDA */}
        {activePage === "Beranda" && (
          <div>
            {/* Hero */}
            <div style={{
              background: "linear-gradient(135deg, #0f2450 0%, #1a3a6b 40%, #2563eb 100%)",
              borderRadius: "0 0 28px 28px",
              padding: "56px 40px",
              color: "#fff",
              textAlign: "center",
              marginBottom: 40,
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: -40, right: -40, width: 220, height: 220,
                borderRadius: "50%", background: "rgba(255,255,255,0.04)",
              }} />
              <div style={{
                position: "absolute", bottom: -30, left: -30, width: 160, height: 160,
                borderRadius: "50%", background: "rgba(245,158,11,0.1)",
              }} />
              <div style={{
                display: "inline-block", background: "rgba(245,158,11,0.15)",
                border: "1px solid rgba(245,158,11,0.4)",
                borderRadius: 20, padding: "5px 16px", fontSize: 12, marginBottom: 16,
                color: "#fbbf24", fontWeight: 600,
              }}>#PasuruanMajuBersamaBapperida</div>
              <h1 style={{ fontSize: "clamp(24px, 5vw, 40px)", fontFamily: "Georgia, serif", fontWeight: 800, lineHeight: 1.3, marginBottom: 16 }}>
                Membangun Kabupaten Pasuruan<br/>
                <span style={{ color: "#fbbf24" }}>Lebih Maju</span>
              </h1>
              <p style={{ color: "rgba(255,255,255,0.8)", maxWidth: 580, margin: "0 auto 28px", lineHeight: 1.7, fontSize: 15 }}>
                Portal resmi Layanan Informasi Bapperida Kabupaten Pasuruan. Akses data perencanaan,
                target pembangunan, dan capaian kinerja daerah secara transparan.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={() => nav("Layanan")} className="btn-hover" style={{
                  background: "#f59e0b", color: "#fff", border: "none", borderRadius: 10,
                  padding: "12px 24px", fontWeight: 700, fontSize: 14, cursor: "pointer",
                  transition: "all 0.2s",
                }}>🎯 Akses Layanan</button>
                <button onClick={() => nav("Berita")} className="btn-hover" style={{
                  background: "rgba(255,255,255,0.15)", color: "#fff",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: 10, padding: "12px 24px", fontWeight: 600, fontSize: 14,
                  cursor: "pointer", transition: "all 0.2s",
                }}>📰 Berita Kota</button>
                <button onClick={() => setChatOpen(true)} className="btn-hover" style={{
                  background: "rgba(245,158,11,0.2)", color: "#fbbf24",
                  border: "1px solid rgba(245,158,11,0.4)",
                  borderRadius: 10, padding: "12px 24px", fontWeight: 600, fontSize: 14,
                  cursor: "pointer", transition: "all 0.2s",
                }}>🤖 Tanya SIPA</button>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 40 }}>
              {STATS.map((s, i) => (
                <div key={i} className="card-hover" style={{
                  background: "#fff", borderRadius: 16, padding: "24px 20px", textAlign: "center",
                  boxShadow: "0 2px 12px rgba(26,58,107,0.08)", border: "1px solid #dbe6f7",
                  transition: "all 0.3s",
                }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.primary, fontFamily: "Georgia, serif" }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Chatbot Promo */}
            <div style={{
              background: "linear-gradient(135deg, #1a3a6b, #2563eb)",
              borderRadius: 20, padding: 28, marginBottom: 40,
              display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap",
            }}>
              <div style={{ fontSize: 48 }}>🤖</div>
              <div style={{ flex: 1, color: "#fff" }}>
                <div style={{ fontWeight: 800, fontSize: 18, fontFamily: "Georgia, serif", marginBottom: 6 }}>
                  Tanya SIPA — Asisten Virtual Kami
                </div>
                <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, lineHeight: 1.6 }}>
                  Dapatkan informasi RPJMD, capaian program, dan layanan Bapperida kapan saja melalui chatbot AI kami.
                </div>
              </div>
              <button onClick={() => setChatOpen(true)} className="btn-hover" style={{
                background: "#f59e0b", color: "#fff", border: "none", borderRadius: 12,
                padding: "12px 24px", fontWeight: 700, fontSize: 14, cursor: "pointer",
                transition: "all 0.2s", whiteSpace: "nowrap",
              }}>Mulai Chat 💬</button>
            </div>

            {/* Berita Preview */}
            <h2 style={{ fontSize: 22, fontWeight: 800, fontFamily: "Georgia, serif", color: COLORS.primary, marginBottom: 20 }}>
              📰 Berita Terkini
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
              {BERITA.map(b => (
                <div key={b.id} className="berita-card" style={{
                  background: "#fff", borderRadius: 16, padding: 20,
                  border: "1px solid #dbe6f7", transition: "all 0.3s", cursor: "pointer",
                }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>{b.emoji}</div>
                  <div style={{
                    display: "inline-block", background: "#eff6ff", color: "#2563eb",
                    borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 600, marginBottom: 10,
                  }}>{b.kategori}</div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.5, color: COLORS.text, marginBottom: 8 }}>{b.title}</h3>
                  <p style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 1.6 }}>{b.ringkasan}</p>
                  <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 10 }}>📅 {b.tanggal}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROFIL */}
        {activePage === "Profil" && (
          <div style={{ paddingTop: 32 }}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div style={{
                width: 80, height: 80, borderRadius: 20, margin: "0 auto 16px",
                background: "linear-gradient(135deg, #1a3a6b, #2563eb)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40,
              }}>🏛️</div>
              <h1 style={{ fontSize: 28, fontFamily: "Georgia, serif", fontWeight: 800, color: COLORS.primary }}>
                Profil Instansi
              </h1>
              <p style={{ color: COLORS.textMuted, marginTop: 8 }}>Badan Perencanaan Pembangunan, Riset, dan Inovasi Daerah</p>
            </div>
            <div style={{ background: "#fff", borderRadius: 20, padding: 32, boxShadow: "0 2px 16px rgba(26,58,107,0.08)", border: "1px solid #dbe6f7" }}>
              {PROFIL_DATA.map((item, i) => (
                <div key={i} style={{
                  display: "flex", gap: 16, padding: "16px 0",
                  borderBottom: i < PROFIL_DATA.length - 1 ? "1px solid #f1f5f9" : "none",
                }}>
                  <div style={{ width: 160, fontWeight: 600, fontSize: 13, color: COLORS.textMuted, flexShrink: 0 }}>{item.label}</div>
                  <div style={{ fontSize: 14, color: COLORS.text, lineHeight: 1.6 }}>{item.value}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 28, background: "linear-gradient(135deg, #1a3a6b, #2563eb)", borderRadius: 20, padding: 28, color: "#fff" }}>
              <h3 style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 800, marginBottom: 12 }}>Misi Utama</h3>
              {["Memperkuat perencanaan pembangunan berbasis data dan inovasi",
                "Mewujudkan tata kelola pemerintahan yang transparan dan akuntabel",
                "Mendorong pertumbuhan ekonomi inklusif dan berkelanjutan",
                "Meningkatkan kualitas SDM dan pelayanan publik daerah",
              ].map((m, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                  <span style={{ color: "#fbbf24", fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                  <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 1.6 }}>{m}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LAYANAN */}
        {activePage === "Layanan" && (
          <div style={{ paddingTop: 32 }}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <h1 style={{ fontSize: 28, fontFamily: "Georgia, serif", fontWeight: 800, color: COLORS.primary }}>
                Layanan Informasi Bapperida
              </h1>
              <p style={{ color: COLORS.textMuted, marginTop: 10, maxWidth: 520, margin: "10px auto 0", lineHeight: 1.7 }}>
                Satu portal untuk mengakses dokumen RPJMD, memantau capaian program, dan menyampaikan aspirasi.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 40 }}>
              {LAYANAN.map((l, i) => (
                <div key={i} className="card-hover" style={{
                  background: "#fff", borderRadius: 20, padding: 28,
                  boxShadow: "0 2px 12px rgba(26,58,107,0.08)",
                  border: "1px solid #dbe6f7", transition: "all 0.3s",
                }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 14, marginBottom: 16,
                    background: `${l.warna}15`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
                  }}>{l.icon}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 800, color: COLORS.primary, fontFamily: "Georgia, serif", marginBottom: 10 }}>{l.judul}</h3>
                  <p style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.7, marginBottom: 20 }}>{l.deskripsi}</p>
                  <button className="btn-hover" style={{
                    background: l.warna, color: "#fff", border: "none",
                    borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 600,
                    cursor: "pointer", transition: "all 0.2s",
                  }}>Akses Layanan →</button>
                </div>
              ))}
            </div>

            {/* Chatbot as 4th service */}
            <div className="card-hover" style={{
              background: "linear-gradient(135deg, #1a3a6b 0%, #2563eb 100%)",
              borderRadius: 20, padding: 28, color: "#fff",
              boxShadow: "0 4px 20px rgba(37,99,235,0.3)", transition: "all 0.3s",
              display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap",
            }}>
              <div style={{ fontSize: 52 }}>🤖</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Asisten Virtual SIPA</h3>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, lineHeight: 1.7 }}>
                  Tanyakan apa saja seputar RPJMD, program pembangunan, capaian OPD, dan layanan Bapperida. SIPA siap membantu 24/7.
                </p>
              </div>
              <button onClick={() => setChatOpen(true)} className="btn-hover" style={{
                background: "#f59e0b", color: "#fff", border: "none", borderRadius: 12,
                padding: "12px 24px", fontWeight: 700, fontSize: 14, cursor: "pointer",
                transition: "all 0.2s", whiteSpace: "nowrap",
              }}>Mulai Chat 💬</button>
            </div>
          </div>
        )}

        {/* CAPAIAN */}
        {activePage === "Capaian" && (
          <div style={{ paddingTop: 32 }}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <h1 style={{ fontSize: 28, fontFamily: "Georgia, serif", fontWeight: 800, color: COLORS.primary }}>
                📊 Monitoring Capaian RPJMD
              </h1>
              <p style={{ color: COLORS.textMuted, marginTop: 10 }}>Realisasi Program Prioritas 2025–2026</p>
            </div>
            <div style={{ display: "grid", gap: 16, marginBottom: 40 }}>
              {CAPAIAN_DATA.map((c, i) => (
                <div key={i} style={{
                  background: "#fff", borderRadius: 16, padding: "20px 24px",
                  boxShadow: "0 2px 8px rgba(26,58,107,0.06)", border: "1px solid #dbe6f7",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, alignItems: "center" }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: COLORS.text }}>{c.bidang}</span>
                    <span style={{ fontWeight: 800, fontSize: 18, color: c.warna }}>{c.persen}%</span>
                  </div>
                  <div style={{ background: "#f1f5f9", borderRadius: 8, height: 10, overflow: "hidden" }}>
                    <div style={{
                      width: `${c.persen}%`, height: "100%", borderRadius: 8,
                      background: c.warna,
                      transition: "width 1s ease",
                    }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                    <span style={{ fontSize: 11, color: COLORS.textMuted }}>Target: 100%</span>
                    <span style={{ fontSize: 11, color: c.persen >= 75 ? "#16a34a" : c.persen >= 60 ? "#f59e0b" : "#dc2626", fontWeight: 600 }}>
                      {c.persen >= 75 ? "✅ On Track" : c.persen >= 60 ? "⚠️ Perlu Perhatian" : "🔴 Perlu Akselerasi"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{
              background: "#fff", borderRadius: 16, padding: 24,
              border: "1px solid #dbe6f7", textAlign: "center",
            }}>
              <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 4 }}>Rata-Rata Capaian Keseluruhan</div>
              <div style={{ fontSize: 42, fontWeight: 800, color: COLORS.primary, fontFamily: "Georgia, serif" }}>
                {Math.round(CAPAIAN_DATA.reduce((a, b) => a + b.persen, 0) / CAPAIAN_DATA.length)}%
              </div>
              <div style={{ fontSize: 13, color: "#16a34a", fontWeight: 600 }}>📈 Progres Baik — Menuju Target 2026</div>
            </div>
          </div>
        )}

        {/* BERITA */}
        {activePage === "Berita" && (
          <div style={{ paddingTop: 32 }}>
            <h1 style={{ fontSize: 28, fontFamily: "Georgia, serif", fontWeight: 800, color: COLORS.primary, marginBottom: 8 }}>
              📰 Informasi & Berita
            </h1>
            <p style={{ color: COLORS.textMuted, marginBottom: 32 }}>Pembaruan terkini seputar RPJMD dan pembangunan Kabupaten Pasuruan</p>
            <div style={{ display: "grid", gap: 20 }}>
              {BERITA.map(b => (
                <div key={b.id} className="berita-card" style={{
                  background: "#fff", borderRadius: 20, padding: 28,
                  border: "1px solid #dbe6f7", transition: "all 0.3s", cursor: "pointer",
                  display: "flex", gap: 20, alignItems: "flex-start",
                }}>
                  <div style={{ fontSize: 44, flexShrink: 0 }}>{b.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap", alignItems: "center" }}>
                      <span style={{
                        background: "#eff6ff", color: "#2563eb",
                        borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 600,
                      }}>{b.kategori}</span>
                      <span style={{ fontSize: 12, color: COLORS.textMuted }}>📅 {b.tanggal}</span>
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.5, color: COLORS.text, marginBottom: 10 }}>{b.title}</h3>
                    <p style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.7 }}>{b.ringkasan}</p>
                    <button style={{
                      marginTop: 14, background: "none", border: "1px solid #2563eb",
                      color: "#2563eb", borderRadius: 8, padding: "7px 16px",
                      fontSize: 12, fontWeight: 600, cursor: "pointer",
                    }}>Baca Selengkapnya →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* KONTAK */}
        {activePage === "Kontak" && (
          <div style={{ paddingTop: 32 }}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <h1 style={{ fontSize: 28, fontFamily: "Georgia, serif", fontWeight: 800, color: COLORS.primary }}>
                📬 Hubungi Kami
              </h1>
              <p style={{ color: COLORS.textMuted, marginTop: 10 }}>Sampaikan aspirasi dan pertanyaan Anda kepada Bapperida</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 32 }}>
              {[
                { icon: "📍", label: "Alamat", value: "Gedung Berakhlak Lt. 2, Jl. Raya Raci Km. 09 Bangil – Pasuruan, Jawa Timur" },
                { icon: "📧", label: "Email", value: "bapperida@pasuruankab.go.id" },
                { icon: "🕐", label: "Jam Operasional", value: "Senin – Jumat: 08.00 – 16.00 WIB" },
              ].map((item, i) => (
                <div key={i} style={{
                  background: "#fff", borderRadius: 16, padding: 24,
                  border: "1px solid #dbe6f7", boxShadow: "0 2px 8px rgba(26,58,107,0.06)",
                }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{item.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.primary, marginBottom: 6 }}>{item.label}</div>
                  <div style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.7 }}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* Aspirasi Form */}
            <div style={{ background: "#fff", borderRadius: 20, padding: 32, border: "1px solid #dbe6f7", boxShadow: "0 2px 12px rgba(26,58,107,0.08)" }}>
              <h3 style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 800, color: COLORS.primary, marginBottom: 6 }}>
                💌 Form Aspirasi & Pengaduan
              </h3>
              <p style={{ color: COLORS.textMuted, fontSize: 13, marginBottom: 24, lineHeight: 1.6 }}>
                Sampaikan aspirasi, saran, atau laporan Anda terkait pelaksanaan program RPJMD.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                {[{ label: "Nama Lengkap", ph: "Masukkan nama Anda" }, { label: "Email", ph: "email@example.com" }].map((f, i) => (
                  <div key={i}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 6 }}>{f.label}</label>
                    <input placeholder={f.ph} style={{
                      width: "100%", border: "1px solid #dbe6f7", borderRadius: 10,
                      padding: "10px 14px", fontSize: 13, outline: "none", color: COLORS.text,
                    }} />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 6 }}>Pesan / Aspirasi</label>
                <textarea rows={4} placeholder="Tuliskan aspirasi atau pengaduan Anda..." style={{
                  width: "100%", border: "1px solid #dbe6f7", borderRadius: 10,
                  padding: "10px 14px", fontSize: 13, outline: "none",
                  resize: "vertical", color: COLORS.text, fontFamily: "inherit",
                }} />
              </div>
              <button style={{
                background: "linear-gradient(135deg, #1a3a6b, #2563eb)", color: "#fff",
                border: "none", borderRadius: 10, padding: "12px 28px",
                fontSize: 14, fontWeight: 700, cursor: "pointer",
              }}>Kirim Aspirasi 📤</button>
            </div>

            {/* Or use chatbot */}
            <div style={{
              marginTop: 20, background: "#eff6ff", borderRadius: 16, padding: 20,
              border: "1px solid #bfdbfe", display: "flex", gap: 14, alignItems: "center",
            }}>
              <span style={{ fontSize: 32 }}>🤖</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.primary }}>Butuh jawaban cepat?</div>
                <div style={{ fontSize: 13, color: COLORS.textMuted }}>Tanyakan langsung ke asisten virtual kami SIPA — tersedia 24/7.</div>
              </div>
              <button onClick={() => setChatOpen(true)} style={{
                background: "#2563eb", color: "#fff", border: "none", borderRadius: 10,
                padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer",
                whiteSpace: "nowrap",
              }}>Chat SIPA</button>
            </div>
          </div>
        )}
      </div>

      {/* ── FOOTER ── */}
      <footer style={{
        background: COLORS.primary, color: "rgba(255,255,255,0.7)",
        textAlign: "center", padding: "20px 20px",
        fontSize: 13,
      }}>
        <div style={{ fontFamily: "Georgia, serif", color: "#fff", fontWeight: 700, marginBottom: 4 }}>BAPPERIDA Kabupaten Pasuruan</div>
        <div>© 2026 RPJMD Kabupaten Pasuruan. Hak Cipta Dilindungi.</div>
        <div style={{ marginTop: 4, fontSize: 12 }}>bapperida@pasuruankab.go.id</div>
      </footer>

      {/* ── CHATBOT FAB ── */}
      <button onClick={() => setChatOpen(!chatOpen)} className="chat-btn" style={{
        position: "fixed", bottom: 24, right: 24, zIndex: 999,
        width: 58, height: 58, borderRadius: "50%",
        background: chatOpen ? "#64748b" : "linear-gradient(135deg, #1a3a6b, #2563eb)",
        color: "#fff", border: "none", fontSize: 24, cursor: "pointer",
        boxShadow: "0 4px 20px rgba(37,99,235,0.5)",
        transition: "all 0.3s", display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {chatOpen ? "✕" : "🤖"}
      </button>

      {/* ── CHATBOT PANEL ── */}
      {chatOpen && <ChatbotPanel onClose={() => setChatOpen(false)} />}
    </div>
  );
}
