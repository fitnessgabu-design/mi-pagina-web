'use client'

import { useState, useEffect } from 'react'

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
  const [mounted, setMounted] = useState(false)
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

  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem('hm_favs')
      if (saved) setFavorites(JSON.parse(saved))
    } catch (e) {}
  }, [])

  useEffect(() => {
    if (mounted) {
      try { localStorage.setItem('hm_favs', JSON.stringify(favorites)) } catch (e) {}
    }
  }, [favorites, mounted])

  const generate = async () => {
    setLoading(true)
    setError('')
    setHooks([])
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, style, customPrompt }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setHooks(data.hooks.map((h, i) => ({ id: Date.now() + i, text: h, category, style })))
    } catch (e) {
      setError('Error al generar. Verifica tu API key en Netlify.')
    }
    setLoading(false)
  }

  const toggleFav = (hook) => {
    setFavorites(prev =>
      prev.find(f => f.id === hook.id) ? prev.filter(f => f.id !== hook.id) : [...prev, hook]
    )
  }

  const isFav = (id) => favorites.some(f => f.id === id)

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(key)
    setTimeout(() => setCopied(null), 1800)
  }

  const buildExport = (hook, platform) => {
    const ht = (hashtagSets[hook.category] || {})[platform] || ''
    const cat = CATEGORIES.find(c => c.id === hook.category)
    if (platform === 'twitter') return hook.text.slice(0, 240) + '\n\n' + ht
    return hook.text + '\n\n' + ht + '\n\n—\n🔥 Sígueme para más contenido de ' + (cat?.label || 'fitness')
  }

  if (!mounted) return null

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;500&display=swap');
        .hm-app { background:#0A0A0A; min-height:100vh; font-family:'Barlow Condensed',Impact,sans-serif; color:#F0F0F0; }
        .hm-header { border-bottom:1px solid #1a1a1a; padding:16px 20px; display:flex; align-items:center; gap:14px; }
        .hm-logo { font-size:24px; font-weight:900; letter-spacing:3px; text-transform:uppercase; line-height:1; }
        .hm-logo span { color:#FF4500; }
        .hm-sub { font-size:10px; color:#444; letter-spacing:2px; font-family:Barlow,sans-serif; margin-top:2px; }
        .hm-tabs { border-bottom:1px solid #1a1a1a; display:flex; padding:0 20px; }
        .hm-tab { background:none; border:none; border-bottom:2px solid transparent; padding:10px 20px; font-family:'Barlow Condensed',sans-serif; font-size:14px; font-weight:700; letter-spacing:2px; text-transform:uppercase; cursor:pointer; color:#444; transition:all 0.15s; }
        .hm-tab.active { color:#FF4500; border-bottom-color:#FF4500; }
        .hm-content { padding:20px; max-width:720px; margin:0 auto; }
        .hm-label { font-size:10px; color:#444; letter-spacing:2px; margin-bottom:8px; text-transform:uppercase; font-family:Barlow,sans-serif; }
        .hm-grid2 { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:20px; }
        .hm-catbtn { background:#111; border:1px solid #1e1e1e; padding:10px; cursor:pointer; font-family:'Barlow Condensed',sans-serif; color:#777; font-size:12px; font-weight:700; letter-spacing:1px; text-align:center; text-transform:uppercase; transition:all 0.15s; }
        .hm-catbtn:hover { border-color:#333; color:#bbb; }
        .hm-stybtn { background:#111; border:1px solid #1e1e1e; padding:12px; cursor:pointer; text-align:left; transition:all 0.15s; }
        .hm-stybtn:hover { border-color:#333; background:#141414; }
        .hm-input { background:#111; border:1px solid #1e1e1e; color:#F0F0F0; padding:10px 14px; font-family:Barlow,sans-serif; font-size:13px; outline:none; width:100%; margin-bottom:20px; }
        .hm-input:focus { border-color:#FF4500; }
        .hm-input::placeholder { color:#444; }
        .hm-genbtn { background:#FF4500; color:#fff; border:none; padding:14px 0; width:100%; font-family:'Barlow Condensed',sans-serif; font-size:17px; font-weight:900; letter-spacing:3px; text-transform:uppercase; cursor:pointer; margin-bottom:20px; clip-path:polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%); }
        .hm-genbtn:hover { background:#FF6600; }
        .hm-genbtn:disabled { background:#222; color:#444; cursor:not-allowed; clip-path:none; }
        .hm-card { background:#111; border-left:3px solid #FF4500; padding:14px 16px; margin-bottom:10px; display:flex; gap:12px; align-items:flex-start; }
        .hm-num { color:#FF4500; font-weight:900; font-size:18px; min-width:20px; line-height:1; flex-shrink:0; }
        .hm-text { flex:1; font-size:15px; line-height:1.6; color:#E0E0E0; font-family:Barlow,sans-serif; }
        .hm-actions { display:flex; gap:5px; flex-shrink:0; }
        .hm-ibtn { background:none; border:1px solid #272727; width:32px; height:32px; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:14px; color:#888; transition:all 0.15s; flex-shrink:0; }
        .hm-ibtn:hover { border-color:#FF4500; color:#FF4500; background:#1a0600; }
        .hm-ibtn.fav { border-color:#FFD700; color:#FFD700; background:#1a1400; }
        .hm-skel { background:#161616; height:14px; margin-bottom:8px; border-radius:2px; }
        @keyframes hmpulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .hm-pulse { animation:hmpulse 1s infinite; }
        .hm-error { background:#180000; border:1px solid #400; color:#f88; padding:10px 14px; margin-bottom:14px; font-family:Barlow,sans-serif; font-size:13px; }
        .hm-empty { text-align:center; padding:50px 0; color:#333; }
        .hm-modal { position:fixed; inset:0; background:rgba(0,0,0,0.92); display:flex; align-items:center; justify-content:center; z-index:999; padding:16px; }
        .hm-mbox { background:#0f0f0f; border:1px solid #222; width:100%; max-width:520px; padding:22px; }
        .hm-ta { background:#0a0a0a; border:1px solid #222; color:#e0e0e0; padding:12px; font-family:Barlow,sans-serif; font-size:13px; resize:none; outline:none; width:100%; line-height:1.65; }
        .hm-ta:focus { border-color:#FF4500; }
        .hm-platbtn { flex:1; padding:9px; background:#111; border:1px solid #1e1e1e; color:#666; font-family:'Barlow Condensed',sans-serif; font-size:13px; font-weight:700; letter-spacing:1px; text-transform:uppercase; cursor:pointer; transition:all 0.15s; }
        .hm-platbtn.active { border-color:#FF4500; color:#FF4500; background:#180800; }
        .hm-chip { display:inline-block; padding:2px 8px; font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; margin-right:4px; }
      `}</style>

      <div className="hm-app">
        <div className="hm-header">
          <div style={{width:4,height:32,background:'#FF4500',flexShrink:0}} />
          <div>
            <div className="hm-logo">HOOK<span>MACHINE</span></div>
            <div className="hm-sub">GENERADOR DE HOOKS FITNESS VIRALES</div>
          </div>
          {favorites.length > 0 && (
            <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:6}}>
              <span style={{color:'#FFD700'}}>★</span>
              <span style={{color:'#FFD700',fontWeight:700}}>{favorites.length}</span>
              <span style={{fontSize:10,color:'#444',letterSpacing:1}}>GUARDADOS</span>
            </div>
          )}
        </div>

        <div className="hm-tabs">
          <button className={`hm-tab ${tab==='generate'?'active':''}`} onClick={()=>setTab('generate')}>Generar</button>
          <button className={`hm-tab ${tab==='favorites'?'active':''}`} onClick={()=>setTab('favorites')}>
            Favoritos {favorites.length > 0 && `(${favorites.length})`}
          </button>
        </div>

        <div className="hm-content">
          {tab === 'generate' && (
            <>
              <div className="hm-label">Categoría</div>
              <div className="hm-grid2">
                {CATEGORIES.map(cat => (
                  <button key={cat.id} className="hm-catbtn" onClick={()=>setCategory(cat.id)}
                    style={category===cat.id?{borderColor:cat.color,color:cat.color,background:cat.color+'18'}:{}}>
                    <div style={{fontSize:18,marginBottom:3}}>{cat.icon}</div>
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="hm-label">Estilo</div>
              <div className="hm-grid2">
                {STYLES.map(st => (
                  <button key={st.id} className="hm-stybtn" onClick={()=>setStyle(st.id)}
                    style={style===st.id?{borderColor:st.color,background:st.color+'18'}:{}}>
                    <div style={{fontFamily:"'Barlow Condensed'",fontSize:13,fontWeight:700,letterSpacing:1,textTransform:'uppercase',color:style===st.id?st.color:'#bbb'}}>{st.label}</div>
                    <div style={{fontSize:11,color:'#555',marginTop:2,fontFamily:'Barlow,sans-serif'}}>{st.desc}</div>
                  </button>
                ))}
              </div>

              <div className="hm-label">Contexto Extra (Opcional)</div>
              <input className="hm-input" placeholder="Ej: para mayores de 40, principiantes, ayuno intermitente..." value={customPrompt} onChange={e=>setCustomPrompt(e.target.value)} />

              <button className="hm-genbtn" onClick={generate} disabled={loading}>
                {loading ? <span className="hm-pulse">GENERANDO HOOKS...</span> : '⚡ GENERAR 5 HOOKS'}
              </button>

              {error && <div className="hm-error">{error}</div>}

              {loading && [1,2,3,4,5].map(i=>(
                <div key={i} style={{background:'#111',borderLeft:'3px solid #222',padding:16,marginBottom:10}}>
                  <div className="hm-skel hm-pulse" style={{width:'75%'}} />
                  <div className="hm-skel hm-pulse" style={{width:'55%'}} />
                </div>
              ))}

              {!loading && hooks.map((hook,idx)=>(
                <div key={hook.id} className="hm-card">
                  <div className="hm-num">{idx+1}</div>
                  <div className="hm-text">{hook.text}</div>
                  <div className="hm-actions">
                    <button className={`hm-ibtn ${isFav(hook.id)?'fav':''}`} onClick={()=>toggleFav(hook)}>{isFav(hook.id)?'★':'☆'}</button>
                    <button className="hm-ibtn" onClick={()=>copyText(hook.text,hook.id)}>{copied===hook.id?'✓':'⎘'}</button>
                    <button className="hm-ibtn" style={{fontSize:13}} onClick={()=>setExportHook(hook)}>↗</button>
                  </div>
                </div>
              ))}
            </>
          )}

          {tab === 'favorites' && (
            favorites.length === 0
              ? <div className="hm-empty">
                  <div style={{fontSize:40,marginBottom:10}}>☆</div>
                  <div style={{fontFamily:"'Barlow Condensed'",fontSize:16,fontWeight:700,letterSpacing:2,color:'#333'}}>SIN FAVORITOS AÚN</div>
                  <div style={{fontSize:12,color:'#2a2a2a',marginTop:6,fontFamily:'Barlow,sans-serif'}}>Guarda hooks con la estrella ★</div>
                </div>
              : <>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                    <div className="hm-label" style={{margin:0}}>{favorites.length} HOOKS GUARDADOS</div>
                    <button onClick={()=>copyText(favorites.map((f,i)=>`${i+1}. ${f.text}`).join('\n\n'),'all')}
                      style={{background:'none',border:'1px solid #272727',color:'#888',padding:'5px 14px',cursor:'pointer',fontFamily:"'Barlow Condensed'",fontSize:12,letterSpacing:1,textTransform:'uppercase'}}>
                      {copied==='all'?'✓ COPIADO':'COPIAR TODOS'}
                    </button>
                  </div>
                  {favorites.map((hook,idx)=>{
                    const cat=CATEGORIES.find(c=>c.id===hook.category)
                    return (
                      <div key={hook.id} className="hm-card" style={{borderLeftColor:cat?.color||'#FF4500'}}>
                        <div className="hm-num" style={{color:cat?.color||'#FF4500'}}>{idx+1}</div>
                        <div style={{flex:1}}>
                          <span className="hm-chip" style={{background:(cat?.color||'#FF4500')+'22',color:cat?.color||'#FF4500'}}>{cat?.label}</span>
                          <div className="hm-text" style={{marginTop:8}}>{hook.text}</div>
                        </div>
                        <div className="hm-actions">
                          <button className="hm-ibtn fav" onClick={()=>toggleFav(hook)}>★</button>
                          <button className="hm-ibtn" onClick={()=>copyText(hook.text,hook.id)}>{copied===hook.id?'✓':'⎘'}</button>
                          <button className="hm-ibtn" style={{fontSize:13}} onClick={()=>setExportHook(hook)}>↗</button>
                        </div>
                      </div>
                    )
                  })}
                </>
          )}
        </div>

        {exportHook && (
          <div className="hm-modal" onClick={e=>e.target===e.currentTarget&&setExportHook(null)}>
            <div className="hm-mbox">
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
                <div style={{fontFamily:"'Barlow Condensed'",fontSize:18,fontWeight:800,letterSpacing:2,textTransform:'uppercase'}}>EXPORTAR HOOK</div>
                <button onClick={()=>setExportHook(null)} style={{background:'none',border:'none',color:'#555',cursor:'pointer',fontSize:20}}>✕</button>
              </div>
              <div style={{display:'flex',gap:8,marginBottom:18}}>
                {['instagram','twitter'].map(p=>(
                  <button key={p} className={`hm-platbtn ${exportPlatform===p?'active':''}`} onClick={()=>setExportPlatform(p)}>
                    {p==='instagram'?'Instagram':'Twitter / X'}
                  </button>
                ))}
              </div>
              <div className="hm-label">TEXTO LISTO PARA PEGAR</div>
              <textarea className="hm-ta" rows={9} defaultValue={buildExport(exportHook,exportPlatform)} key={`${exportHook.id}-${exportPlatform}`} />
              <button className="hm-genbtn" style={{marginTop:14,marginBottom:0}}
                onClick={()=>{copyText(buildExport(exportHook,exportPlatform),'export');setTimeout(()=>setExportHook(null),1400)}}>
                {copied==='export'?'✓ COPIADO':'COPIAR Y CERRAR'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
