'use client'
import { useState } from 'react'

const CATEGORIES = [
  { id: 'muscle', label: 'MASA MUSCULAR', icon: '💪', color: '#FF4500' },
  { id: 'fat_loss', label: 'PÉRDIDA DE GRASA', icon: '🔥', color: '#FF6B00' },
  { id: 'testosterone', label: 'TESTOSTERONA', icon: '⚡', color: '#FFD700' },
  { id: 'discipline', label: 'DISCIPLINA', icon: '🎯', color: '#C0C0C0' },
]

const STYLES = [
  { id: 'hormozi', label: 'Alex Hormozi', desc: 'Directo, datos, brutal honesty', color: '#FF4500' },
  { id: 'aggressive', label: 'Reel Agresivo', desc: 'Alta energía, provocador, viral', color: '#FF6B00' },
  { id: 'stoic', label: 'Estoico', desc: 'Frío, filosófico, impacto silencioso', color: '#C0C0C0' },
  { id: 'challenger', label: 'Challenger', desc: 'Rompe creencias, controversia', color: '#FFD700' },
]

const hashtagSets = {
  muscle: { instagram: '#MasaMuscular #Hipertrofia #Gym #FitnessMotivation #Musculacion #GymLife', twitter: '#Fitness #Gym' },
  fat_loss: { instagram: '#PerdidaDeGrasa #QuemarGrasa #TransformacionFisica #Fitness #Metabolismo', twitter: '#QuemarGrasa #Fitness' },
  testosterone: { instagram: '#Testosterona #SaludMasculina #HombresFit #MasculinidadReal #FuerzaMental', twitter: '#Testosterona #Salud' },
  discipline: { instagram: '#Disciplina #MentalidadGanadora #Habitos #NoExcusas #Consistencia', twitter: '#Disciplina #Motivacion' },
}

export default function HookMachine() {
  const [tab, setTab] = useState('generate')
  const [category, setCategory] = useState('muscle')
  const [style, setStyle] = useState('hormozi')
  const [customPrompt, setCustomPrompt] = useState('')
  const [hooks, setHooks] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(null)
  const [exportHook, setExportHook] = useState(null)
  const [exportPlatform, setExportPlatform] = useState('instagram')

  const generate = async () => {
    setLoading(true); setError(''); setHooks([])
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, style, customPrompt }),
      })
      const data = await res.json()
      setHooks(data.hooks.map((h, i) => ({ id: Date.now() + i, text: h, category, style })))
    } catch (e) { setError('Error al generar. Intenta de nuevo.') }
    setLoading(false)
  }

  const toggleFav = (hook) => {
    setFavorites(prev => prev.find(f => f.id === hook.id) ? prev.filter(f => f.id !== hook.id) : [...prev, hook])
  }

  const isFav = (id) => favorites.some(f => f.id === id)

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1800)
  }

  const buildExport = (hook, platform) => {
    const ht = (hashtagSets[hook.category] || {})[platform] || ''
    const cat = CATEGORIES.find(c => c.id === hook.category)
    if (platform === 'twitter') return hook.text.slice(0, 240) + '\n\n' + ht
    return hook.text + '\n\n' + ht + '\n\n—\n🔥 Sígueme para más contenido de ' + (cat?.label || 'fitness')
  }

  const s = {
    app: { background: '#0A0A0A', minHeight: '100vh', fontFamily: "'Barlow Condensed', Impact, sans-serif", color: '#F0F0F0' },
    header: { borderBottom: '1px solid #1a1a1a', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 },
    logo: { fontSize: 24, fontWeight: 900, letterSpacing: 3, textTransform: 'uppercase', lineHeight: 1 },
    tabs: { borderBottom: '1px solid #1a1a1a', display: 'flex', padding: '0 20px' },
    content: { padding: 20, maxWidth: 720, margin: '0 auto' },
    label: { fontSize: 10, color: '#444', letterSpacing: 2, marginBottom: 8, textTransform: 'uppercase', fontFamily: 'Barlow, sans-serif' },
    catGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 },
    styleGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 },
    genBtn: { background: '#FF4500', color: '#fff', border: 'none', padding: '14px 0', width: '100%', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 17, fontWeight: 900, letterSpacing: 3, textTransform: 'uppercase', cursor: 'pointer', marginBottom: 20, clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)' },
    hookCard: { background: '#111', borderLeft: '3px solid #FF4500', padding: '14px 16px', marginBottom: 10, display: 'flex', gap: 12 },
    iconBtn: { background: 'none', border: '1px solid #272727', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#888', flexShrink: 0 },
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .cat-btn { background: #111; border: 1px solid #1e1e1e; padding: 10px; cursor: pointer; font-family: 'Barlow Condensed', sans-serif; color: #777; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-align: center; text-transform: uppercase; transition: all 0.15s; }
        .cat-btn:hover { border-color: #333; color: #bbb; }
        .style-btn { background: #111; border: 1px solid #1e1e1e; padding: 12px; cursor: pointer; text-align: left; transition: all 0.15s; }
        .style-btn:hover { border-color: #333; background: #141414; }
        .tab-btn { background: none; border: none; border-bottom: 2px solid transparent; padding: 10px 20px; font-family: 'Barlow Condensed', sans-serif; font-size: 14px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; color: #444; transition: all 0.15s; }
        .tab-btn.active { color: #FF4500; border-bottom-color: #FF4500; }
        .icon-btn-h:hover { border-color: #FF4500 !important; color: #FF4500 !important; background: #1a0600 !important; }
        .custom-input { background: #111; border: 1px solid #1e1e1e; color: #F0F0F0; padding: 10px 14px; font-family: Barlow, sans-serif; font-size: 13px; outline: none; width: 100%; margin-bottom: 20px; }
        .custom-input:focus { border-color: #FF4500; }
        .custom-input::placeholder { color: #444; }
        .modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,0.92); display: flex; align-items: center; justify-content: center; z-index: 999; padding: 16px; }
        .export-ta { background: #0a0a0a; border: 1px solid #222; color: #e0e0e0; padding: 12px; font-family: Barlow, sans-serif; font-size: 13px; resize: none; outline: none; width: 100%; line-height: 1.65; }
        .export-ta:focus { border-color: #FF4500; }
        .plat-btn { flex: 1; padding: 9px; background: #111; border: 1px solid #1e1e1e; color: #666; font-family: 'Barlow Condensed', sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .pulse { animation: pulse 1s infinite; }
      `}</style>

      <div style={s.app}>
        <div style={s.header}>
          <div style={{ width: 4, height: 32, background: '#FF4500', flexShrink: 0 }} />
          <div>
            <div style={s.logo}>HOOK<span style={{ color: '#FF4500' }}>MACHINE</span></div>
            <div style={{ fontSize: 10, color: '#444', letterSpacing: 2, fontFamily: 'Barlow, sans-serif' }}>GENERADOR DE HOOKS FITNESS VIRALES</div>
          </div>
          {favorites.length > 0 && (
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#FFD700' }}>★</span>
              <span style={{ color: '#FFD700', fontWeight: 700 }}>{favorites.length}</span>
              <span style={{ fontSize: 10, color: '#444', letterSpacing: 1 }}>GUARDADOS</span>
            </div>
          )}
        </div>

        <div style={s.tabs}>
          <button className={`tab-btn ${tab === 'generate' ? 'active' : ''}`} onClick={() => setTab('generate')}>Generar</button>
          <button className={`tab-btn ${tab === 'favorites' ? 'active' : ''}`} onClick={() => setTab('favorites')}>Favoritos {favorites.length > 0 && `(${favorites.length})`}</button>
        </div>

        <div style={s.content}>
          {tab === 'generate' && (
            <>
              <div style={s.label}>Categoría</div>
              <div style={s.catGrid}>
                {CATEGORIES.map(cat => (
                  <button key={cat.id} className="cat-btn" onClick={() => setCategory(cat.id)}
                    style={category === cat.id ? { borderColor: cat.color, color: cat.color, background: cat.color + '18' } : {}}>
                    <div style={{ fontSize: 18, marginBottom: 3 }}>{cat.icon}</div>
                    {cat.label}
                  </button>
                ))}
              </div>

              <div style={s.label}>Estilo</div>
              <div style={s.styleGrid}>
                {STYLES.map(st => (
                  <button key={st.id} className="style-btn" onClick={() => setStyle(st.id)}
                    style={style === st.id ? { borderColor: st.color, background: st.color + '18' } : {}}>
                    <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: style === st.id ? st.color : '#bbb' }}>{st.label}</div>
                    <div style={{ fontSize: 11, color: '#555', marginTop: 2, fontFamily: 'Barlow, sans-serif' }}>{st.desc}</div>
                  </button>
                ))}
              </div>

              <div style={s.label}>Contexto Extra (Opcional)</div>
              <input className="custom-input" placeholder="Ej: para mayores de 40, principiantes, ayuno intermitente..." value={customPrompt} onChange={e => setCustomPrompt(e.target.value)} />

              <button style={{ ...s.genBtn, ...(loading ? { background: '#222', color: '#444', cursor: 'not-allowed', clipPath: 'none' } : {}) }} onClick={generate} disabled={loading}>
                {loading ? <span className="pulse">GENERANDO HOOKS...</span> : '⚡ GENERAR 5 HOOKS'}
              </button>

              {error && <div style={{ background: '#180000', border: '1px solid #400', color: '#f88', padding: '10px 14px', marginBottom: 14, fontFamily: 'Barlow, sans-serif', fontSize: 13 }}>{error}</div>}

              {loading && [1,2,3,4,5].map(i => (
                <div key={i} style={{ background: '#111', borderLeft: '3px solid #222', padding: 16, marginBottom: 10 }}>
                  <div className="pulse" style={{ height: 14, background: '#1a1a1a', marginBottom: 8, width: '75%' }} />
                  <div className="pulse" style={{ height: 14, background: '#1a1a1a', width: '55%' }} />
                </div>
              ))}

              {!loading && hooks.map((hook, idx) => (
                <div key={hook.id} style={s.hookCard}>
                  <div style={{ color: '#FF4500', fontWeight: 900, fontSize: 18, minWidth: 20, lineHeight: 1 }}>{idx + 1}</div>
                  <div style={{ flex: 1, fontSize: 15, lineHeight: 1.6, color: '#E0E0E0', fontFamily: 'Barlow, sans-serif' }}>{hook.text}</div>
                  <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                    <button className="icon-btn-h" style={{ ...s.iconBtn, ...(isFav(hook.id) ? { borderColor: '#FFD700', color: '#FFD700', background: '#1a1400' } : {}) }} onClick={() => toggleFav(hook)}>{isFav(hook.id) ? '★' : '☆'}</button>
                    <button className="icon-btn-h" style={s.iconBtn} onClick={() => copyText(hook.text, hook.id)}>{copied === hook.id ? '✓' : '⎘'}</button>
                    <button className="icon-btn-h" style={{ ...s.iconBtn, fontSize: 13 }} onClick={() => setExportHook(hook)}>↗</button>
                  </div>
                </div>
              ))}
            </>
          )}

          {tab === 'favorites' && (
            favorites.length === 0
              ? <div style={{ textAlign: 'center', padding: '50px 0', color: '#333' }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>☆</div>
                  <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 16, fontWeight: 700, letterSpacing: 2 }}>SIN FAVORITOS AÚN</div>
                  <div style={{ fontSize: 12, color: '#2a2a2a', marginTop: 6, fontFamily: 'Barlow, sans-serif' }}>Guarda hooks con la estrella ★</div>
                </div>
              : <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div style={{ ...s.label, margin: 0 }}>{favorites.length} HOOKS GUARDADOS</div>
                    <button onClick={() => copyText(favorites.map((f,i) => `${i+1}. ${f.text}`).join('\n\n'), 'all')}
                      style={{ background: 'none', border: '1px solid #272727', color: '#888', padding: '5px 14px', cursor: 'pointer', fontFamily: "'Barlow Condensed'", fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' }}>
                      {copied === 'all' ? '✓ COPIADO' : 'COPIAR TODOS'}
                    </button>
                  </div>
                  {favorites.map((hook, idx) => {
                    const cat = CATEGORIES.find(c => c.id === hook.category)
                    return (
                      <div key={hook.id} style={{ ...s.hookCard, borderLeftColor: cat?.color || '#FF4500' }}>
                        <div style={{ color: cat?.color || '#FF4500', fontWeight: 900, fontSize: 18, minWidth: 20 }}>{idx + 1}</div>
                        <div style={{ flex: 1 }}>
                          <span style={{ background: (cat?.color || '#FF4500') + '22', color: cat?.color || '#FF4500', padding: '2px 8px', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', marginRight: 4 }}>{cat?.label}</span>
                          <div style={{ fontSize: 15, lineHeight: 1.6, color: '#E0E0E0', fontFamily: 'Barlow, sans-serif', marginTop: 8 }}>{hook.text}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                          <button className="icon-btn-h" style={{ ...s.iconBtn, borderColor: '#FFD700', color: '#FFD700', background: '#1a1400' }} onClick={() => toggleFav(hook)}>★</button>
                          <button className="icon-btn-h" style={s.iconBtn} onClick={() => copyText(hook.text, hook.id)}>{copied === hook.id ? '✓' : '⎘'}</button>
                          <button className="icon-btn-h" style={{ ...s.iconBtn, fontSize: 13 }} onClick={() => setExportHook(hook)}>↗</button>
                        </div>
                      </div>
                    )
                  })}
                </>
          )}
        </div>

        {exportHook && (
          <div className="modal-bg" onClick={e => e.target === e.currentTarget && setExportHook(null)}>
            <div style={{ background: '#0f0f0f', border: '1px solid #222', width: '100%', maxWidth: 520, padding: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 18, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase' }}>EXPORTAR HOOK</div>
                <button onClick={() => setExportHook(null)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 20 }}>✕</button>
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
                {['instagram', 'twitter'].map(p => (
                  <button key={p} className="plat-btn" onClick={() => setExportPlatform(p)}
                    style={exportPlatform === p ? { borderColor: '#FF4500', color: '#FF4500', background: '#180800' } : {}}>
                    {p === 'instagram' ? 'Instagram' : 'Twitter / X'}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 10, color: '#444', letterSpacing: 2, marginBottom: 8, textTransform: 'uppercase' }}>TEXTO LISTO PARA PEGAR</div>
              <textarea className="export-ta" rows={9} defaultValue={buildExport(exportHook, exportPlatform)} key={`${exportHook.id}-${exportPlatform}`} />
              <button style={{ ...s.genBtn, marginTop: 14, marginBottom: 0 }}
                onClick={() => { copyText(buildExport(exportHook, exportPlatform), 'export'); setTimeout(() => setExportHook(null), 1400) }}>
                {copied === 'export' ? '✓ COPIADO' : 'COPIAR Y CERRAR'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
