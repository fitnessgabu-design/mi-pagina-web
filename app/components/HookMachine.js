"use client";
import { useState } from "react";

const CATEGORIES = [
  { id: "muscle", label: "Masa muscular", icon: "💪", accent: "#FF4500" },
  { id: "fat_loss", label: "Quema de grasa", icon: "🔥", accent: "#FF6B00" },
  { id: "testosterone", label: "Testosterona", icon: "⚡", accent: "#FFD700" },
  { id: "discipline", label: "Disciplina", icon: "🎯", accent: "#C0C0C0" },
  { id: "nutrition", label: "Nutrición", icon: "🥩", accent: "#00C853" },
  { id: "transformation", label: "Transformación", icon: "🔄", accent: "#9C27B0" },
];

const STYLES = [
  { id: "hormozi", label: "Hormozi", desc: "Datos + brutal honesty" },
  { id: "shock", label: "Shock", desc: "Rompe creencia desde el seg 1" },
  { id: "storytelling", label: "Story", desc: "Historia que engancha" },
  { id: "challenger", label: "Challenger", desc: "Confronta al espectador" },
  { id: "educational", label: "Educativo viral", desc: "Enseña algo que nadie sabe" },
  { id: "prueba_social", label: "Prueba social", desc: "Resultados como gancho" },
];

const buildPrompt = (categoryLabel, styleLabel) => `
Eres el mejor estratega de contenido viral de fitness del mundo. Tu trabajo es generar scripts de video que generen máxima retención y viralidad en Instagram Reels, TikTok y YouTube Shorts.

CATEGORÍA: ${categoryLabel}
ESTILO: ${styleLabel}

Inventa tú el tema del video. Elige el ángulo más viral, contraintuitivo o provocador posible dentro de esa categoría y ese estilo. No preguntes, decide.

Responde SOLO con este JSON (sin backticks, sin texto extra):

{
  "tema": "El tema/ángulo que elegiste en una línea",
  "hook_variants": [
    {
      "version": "A",
      "linea": "Exactamente qué dices o muestras en los primeros 3 segundos",
      "texto_pantalla": "Texto grande que aparece en pantalla",
      "trigger": "Emoción o mecanismo psicológico que activa (curiosidad/miedo/shock/identidad)"
    },
    {
      "version": "B",
      "linea": "Segunda opción completamente diferente",
      "texto_pantalla": "Texto pantalla B",
      "trigger": "Trigger psicológico B"
    },
    {
      "version": "C",
      "linea": "Tercera opción",
      "texto_pantalla": "Texto pantalla C",
      "trigger": "Trigger psicológico C"
    }
  ],
  "script": [
    {
      "segundo": "0-3s",
      "seccion": "HOOK",
      "guion": "Exactamente qué dices",
      "camara": "Qué haces físicamente / ángulo de cámara",
      "pantalla": "Texto/gráfico en pantalla",
      "edicion": "Tip de edición o ritmo"
    },
    {
      "segundo": "3-12s",
      "seccion": "TENSIÓN",
      "guion": "Desarrollas el problema o la promesa para que no puedan irse",
      "camara": "Acción en cámara",
      "pantalla": "Texto pantalla",
      "edicion": "Tip edición"
    },
    {
      "segundo": "12-35s",
      "seccion": "VALOR",
      "guion": "El contenido real. Concreto, puntos claros, sin relleno.",
      "camara": "Acción en cámara",
      "pantalla": "Texto pantalla",
      "edicion": "Tip edición"
    },
    {
      "segundo": "35-50s",
      "seccion": "GIRO",
      "guion": "Dato sorpresa, resultado o giro que nadie esperaba",
      "camara": "Acción en cámara",
      "pantalla": "Texto pantalla",
      "edicion": "Tip edición"
    },
    {
      "segundo": "50-60s",
      "seccion": "CTA",
      "guion": "CTA directo y específico",
      "camara": "Acción en cámara",
      "pantalla": "Texto pantalla",
      "edicion": "Tip edición"
    }
  ],
  "viral_score": 88,
  "por_que_va_a_viral": "Una sola frase explicando el mecanismo viral principal",
  "caption_line": "Primera línea del caption (gancho para que abran el post)"
}
`;

const SECTION_COLORS = {
  "HOOK": "#FF4500",
  "TENSIÓN": "#FF6B00",
  "VALOR": "#FFD700",
  "GIRO": "#00C853",
  "CTA": "#7B61FF",
};

export default function ScriptMachine() {
  const [category, setCategory] = useState(null);
  const [style, setStyle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeHook, setActiveHook] = useState("A");
  const [activeStep, setActiveStep] = useState(0);
  const [saved, setSaved] = useState([]);
  const [copied, setCopied] = useState(false);

  const ready = category && style;
  const catObj = CATEGORIES.find(c => c.id === category);
  const accent = catObj?.accent || "#FF4500";

  const generate = async () => {
    if (!ready) return;
    setLoading(true);
    setResult(null);
    setError(null);
    setActiveStep(0);
    setActiveHook("A");
    try {
      const catLabel = CATEGORIES.find(c => c.id === category)?.label;
      const styleLabel = STYLES.find(s => s.id === style)?.label;
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: buildPrompt(catLabel, styleLabel) }),
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === "text")?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      setResult(JSON.parse(clean));
    } catch (e) {
      setError("Error al generar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const copyAll = () => {
    if (!result) return;
    const hook = result.hook_variants?.find(h => h.version === activeHook);
    const lines = result.script?.map(s =>
      `[${s.segundo} — ${s.seccion}]\n${s.guion}\nCámara: ${s.camara}\nPantalla: ${s.pantalla}`
    ).join("\n\n");
    const txt = `TEMA: ${result.tema}\n\nHOOK ${activeHook}: ${hook?.linea}\nPantalla: ${hook?.texto_pantalla}\n\n${lines}\n\nCAPTION: ${result.caption_line}`;
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveScript = () => {
    if (!result) return;
    setSaved(prev => [{ id: Date.now(), category, style, result }, ...prev.slice(0, 9)]);
  };

  return (
    <div style={{ background: "#080808", minHeight: "100vh", color: "#fff", fontFamily: "'Barlow Condensed', Arial, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;900&display=swap');`}</style>

      <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid #111", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 4, height: 24, background: accent, transition: "background 0.3s" }} />
        <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: 3, textTransform: "uppercase" }}>Script Machine</div>
        <div style={{ marginLeft: "auto", fontSize: 11, color: "#333", letterSpacing: 1 }}>@gabufitness</div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "20px 16px" }}>

        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 10, color: "#444", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>1 — Categoría</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {CATEGORIES.map(c => (
              <button key={c.id} onClick={() => setCategory(c.id)} style={{
                background: category === c.id ? c.accent : "#0e0e0e",
                border: `1px solid ${category === c.id ? c.accent : "#1a1a1a"}`,
                color: category === c.id ? "#000" : "#555",
                padding: "11px 8px", borderRadius: 4, cursor: "pointer",
                fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase",
                transition: "all 0.15s", display: "flex", alignItems: "center", gap: 6,
              }}>
                <span style={{ fontSize: 14 }}>{c.icon}</span>
                <span style={{ flex: 1, textAlign: "left" }}>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 26 }}>
          <div style={{ fontSize: 10, color: "#444", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>2 — Estilo narrativo</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {STYLES.map(s => (
              <button key={s.id} onClick={() => setStyle(s.id)} style={{
                background: style === s.id ? "#111" : "#0a0a0a",
                border: `1px solid ${style === s.id ? accent : "#1a1a1a"}`,
                color: "#fff", padding: "11px 10px", borderRadius: 4,
                cursor: "pointer", textAlign: "left", transition: "all 0.15s",
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, color: style === s.id ? accent : "#ccc", marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 10, color: "#444" }}>{s.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <button onClick={generate} disabled={!ready || loading} style={{
          width: "100%",
          background: !ready ? "#0e0e0e" : loading ? "#111" : accent,
          color: !ready ? "#2a2a2a" : loading ? "#666" : "#000",
          border: `1px solid ${!ready ? "#1a1a1a" : accent}`,
          padding: "15px", fontSize: 13, fontWeight: 900, letterSpacing: 3,
          textTransform: "uppercase", cursor: !ready || loading ? "not-allowed" : "pointer",
          borderRadius: 4, transition: "all 0.2s", marginBottom: 28,
        }}>
          {loading ? "⚡ GENERANDO SCRIPT..." : ready ? "GENERAR SCRIPT VIRAL →" : "ELIGE CATEGORÍA + ESTILO"}
        </button>

        {error && (
          <div style={{ background: "#110000", border: "1px solid #FF1744", borderRadius: 4, padding: 12, color: "#FF1744", fontSize: 12, marginBottom: 20 }}>{error}</div>
        )}

        {result && (
          <div>
            <div style={{ background: "#0d0d0d", border: `1px solid #1a1a1a`, borderLeft: `3px solid ${accent}`, borderRadius: 4, padding: "14px 16px", marginBottom: 20, display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: "#444", letterSpacing: 2, marginBottom: 5 }}>TEMA ELEGIDO POR LA IA</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", lineHeight: 1.4 }}>{result.tema}</div>
                {result.por_que_va_a_viral && (
                  <div style={{ fontSize: 11, color: "#555", marginTop: 6 }}>⚡ {result.por_que_va_a_viral}</div>
                )}
              </div>
              <div style={{ textAlign: "center", minWidth: 56 }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: result.viral_score >= 85 ? "#00C853" : result.viral_score >= 70 ? "#FFD700" : "#FF4500" }}>{result.viral_score}</div>
                <div style={{ fontSize: 9, color: "#333", letterSpacing: 1 }}>VIRAL SCORE</div>
              </div>
            </div>

            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 10, color: "#444", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Hooks — primeros 3 segundos</div>
              <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                {result.hook_variants?.map(h => (
                  <button key={h.version} onClick={() => setActiveHook(h.version)} style={{
                    background: activeHook === h.version ? accent : "#0e0e0e",
                    border: `1px solid ${activeHook === h.version ? accent : "#1a1a1a"}`,
                    color: activeHook === h.version ? "#000" : "#555",
                    padding: "6px 18px", fontSize: 11, fontWeight: 900,
                    cursor: "pointer", borderRadius: 3, letterSpacing: 1, transition: "all 0.15s",
                  }}>HOOK {h.version}</button>
                ))}
              </div>
              {result.hook_variants?.filter(h => h.version === activeHook).map(h => (
                <div key={h.version} style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 4, padding: 16 }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 10, lineHeight: 1.4 }}>"{h.linea}"</div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {h.texto_pantalla && (
                      <div style={{ background: "#000", border: `1px solid ${accent}`, borderRadius: 3, padding: "5px 12px", fontSize: 11, color: accent }}>
                        📺 {h.texto_pantalla}
                      </div>
                    )}
                    {h.trigger && (
                      <div style={{ background: "#111", border: "1px solid #222", borderRadius: 3, padding: "5px 12px", fontSize: 11, color: "#666" }}>
                        🧠 {h.trigger}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 10, color: "#444", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Script completo</div>
              <div style={{ display: "flex", gap: 4, marginBottom: 12, flexWrap: "wrap" }}>
                {result.script?.map((s, i) => {
                  const col = SECTION_COLORS[s.seccion] || accent;
                  return (
                    <button key={i} onClick={() => setActiveStep(i)} style={{
                      background: activeStep === i ? col : "#0e0e0e",
                      border: `1px solid ${activeStep === i ? col : "#1a1a1a"}`,
                      color: activeStep === i ? "#000" : "#555",
                      padding: "5px 12px", fontSize: 10, fontWeight: 900,
                      cursor: "pointer", borderRadius: 3, letterSpacing: 1, transition: "all 0.15s",
                    }}>{s.seccion}</button>
                  );
                })}
              </div>

              {(() => {
                const s = result.script?.[activeStep];
                if (!s) return null;
                const col = SECTION_COLORS[s.seccion] || accent;
                return (
                  <div style={{ background: "#0a0a0a", border: `1px solid ${col}33`, borderLeft: `3px solid ${col}`, borderRadius: 4, padding: 18 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                      <span style={{ fontSize: 12, fontWeight: 900, letterSpacing: 2, color: col }}>{s.seccion}</span>
                      <span style={{ fontSize: 10, color: "#333" }}>{s.segundo}</span>
                    </div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", lineHeight: 1.5, marginBottom: 14 }}>{s.guion}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: s.edicion ? 10 : 0 }}>
                      <div style={{ background: "#111", borderRadius: 3, padding: "9px 12px" }}>
                        <div style={{ fontSize: 9, color: "#333", letterSpacing: 1.5, marginBottom: 4 }}>CÁMARA</div>
                        <div style={{ fontSize: 12, color: "#777", lineHeight: 1.4 }}>{s.camara}</div>
                      </div>
                      <div style={{ background: "#111", borderRadius: 3, padding: "9px 12px" }}>
                        <div style={{ fontSize: 9, color: "#333", letterSpacing: 1.5, marginBottom: 4 }}>PANTALLA</div>
                        <div style={{ fontSize: 12, color: "#777", lineHeight: 1.4 }}>{s.pantalla}</div>
                      </div>
                    </div>
                    {s.edicion && <div style={{ fontSize: 11, color: "#444", fontStyle: "italic" }}>⚡ {s.edicion}</div>}
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14 }}>
                      <button onClick={() => setActiveStep(Math.max(0, activeStep - 1))} disabled={activeStep === 0}
                        style={{ background: "none", border: "1px solid #1a1a1a", color: activeStep === 0 ? "#222" : "#555", padding: "5px 14px", fontSize: 11, cursor: activeStep === 0 ? "not-allowed" : "pointer", borderRadius: 3 }}>
                        ← Anterior
                      </button>
                      <button onClick={() => setActiveStep(Math.min((result.script?.length || 1) - 1, activeStep + 1))} disabled={activeStep === (result.script?.length || 1) - 1}
                        style={{ background: "none", border: "1px solid #1a1a1a", color: activeStep === (result.script?.length || 1) - 1 ? "#222" : "#555", padding: "5px 14px", fontSize: 11, cursor: activeStep === (result.script?.length || 1) - 1 ? "not-allowed" : "pointer", borderRadius: 3 }}>
                        Siguiente →
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>

            {result.caption_line && (
              <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 4, padding: "12px 14px", marginBottom: 20 }}>
                <div style={{ fontSize: 9, color: "#333", letterSpacing: 2, marginBottom: 5 }}>PRIMERA LÍNEA DEL CAPTION</div>
                <div style={{ fontSize: 14, color: "#999" }}>{result.caption_line}</div>
              </div>
            )}

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={copyAll} style={{ flex: 1, background: copied ? "#001a00" : "#0e0e0e", border: `1px solid ${copied ? "#00C853" : "#1a1a1a"}`, color: copied ? "#00C853" : "#666", padding: "11px", fontSize: 11, fontWeight: 700, cursor: "pointer", borderRadius: 4, letterSpacing: 1, transition: "all 0.2s" }}>
                {copied ? "✓ COPIADO" : "COPIAR SCRIPT"}
              </button>
              <button onClick={saveScript} style={{ flex: 1, background: "#0e0e0e", border: "1px solid #1a1a1a", color: "#666", padding: "11px", fontSize: 11, fontWeight: 700, cursor: "pointer", borderRadius: 4, letterSpacing: 1 }}>
                GUARDAR
              </button>
              <button onClick={generate} style={{ flex: 1, background: "#0e0e0e", border: `1px solid ${accent}44`, color: accent, padding: "11px", fontSize: 11, fontWeight: 700, cursor: "pointer", borderRadius: 4, letterSpacing: 1 }}>
                REGENERAR
              </button>
            </div>
          </div>
        )}

        {saved.length > 0 && (
          <div style={{ marginTop: 36, borderTop: "1px solid #0e0e0e", paddingTop: 20 }}>
            <div style={{ fontSize: 10, color: "#2a2a2a", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Guardados ({saved.length})</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {saved.map(s => {
                const c = CATEGORIES.find(c => c.id === s.category);
                return (
                  <div key={s.id} style={{ background: "#0a0a0a", border: "1px solid #111", borderRadius: 4, padding: "9px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 12, color: "#888" }}>{s.result.tema}</div>
                      <div style={{ fontSize: 10, color: "#333" }}>{c?.label} · {STYLES.find(st => st.id === s.style)?.label}</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: c?.accent || "#FF4500" }}>{s.result.viral_score}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
