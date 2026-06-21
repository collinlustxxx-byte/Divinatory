import { useState } from 'react'
import { majorArcana } from './data/majorArcana'
import { batons, coupes } from './data/minorArcana_batons_coupes'
import { epees, deniers } from './data/minorArcana_epees_deniers'
import { oracleBelline } from './data/oracleBelline'
import { lenormand } from './data/lenormand'

const BASE = import.meta.env.BASE_URL

function imgUrl(path) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return BASE + path.replace(/^\//, '')
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ── Type A config ─────────────────────────────────────────────────────────────

const TPOS_A = [
  { pos: 'La Situation',          desc: "Au présent de l'événement par rapport à la question",              bi: null },
  { pos: "L'Obstacle",            desc: 'Ce qui entrave — intentions secrètes, non-dits, manipulation possible', bi: 0 },
  { pos: 'Ce qui Aide',           desc: 'La ressource disponible pour le consultant',                       bi: 3 },
  { pos: 'La Réponse',            desc: 'La réponse directe à la question du consultant',                   bi: null },
  { pos: 'La Synthèse',           desc: "Carte centrale — vue d'ensemble",                                  bi: null },
  { pos: 'Le Passé',              desc: 'Ce qui a conduit à la situation',                                  bi: 1 },
  { pos: 'Le Futur Immédiat',     desc: 'Ce qui arrive à court terme',                                     bi: 2 },
  { pos: "L'Évolution / Guidage", desc: 'Précise la direction de la carte #4',                             bi: null },
  { pos: 'Carte du Dessous',      desc: 'Carte représentante du sujet de la question',                     bi: null },
]

const BROLES_A = [
  { sym: '@', label: "Intentions secrètes, non-dits, manipulation possible (à lire avec la carte #2 du Tarot)" },
  { sym: '$', label: 'Ce qui a construit la situation — pourquoi en es-tu rendu là' },
  { sym: '&', label: "Ce qui s'en vient si rien ne change" },
  { sym: '?', label: 'Ce que TU peux faire concrètement' },
]

// [col, row] for T1→T9 in a 3×3 grid (T5 = centre [1,1])
const GPOS_A = [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[0,2],[1,2],[2,2]]
const LEN_LABELS_A = ['A) Passé factuel', 'B) Présent réel', 'C) Futur concret']

// ── Type B config ─────────────────────────────────────────────────────────────

const TPOS_B = [
  { pos: 'La Situation', desc: "L'énergie principale en jeu",         bi: 0 },
  { pos: 'La Réponse',   desc: 'La réponse directe à votre question', bi: null },
  { pos: "L'Issue",      desc: 'Ce qui se concrétise à court terme',  bi: 1 },
]

const BROLES_B = [
  { sym: '@', label: 'Ce qui se cache derrière (La Situation)' },
  { sym: '?', label: "Le meilleur chemin (L'Issue)" },
]

// ── Draw ──────────────────────────────────────────────────────────────────────

function drawSpread(type) {
  const allTarot = [...majorArcana, ...batons, ...coupes, ...epees, ...deniers]
  const st = shuffle(allTarot)
  const sb = shuffle(oracleBelline)
  const sl = shuffle(lenormand)
  if (type === 'A') {
    return {
      type: 'A',
      tarot: st.slice(0, 9).map((card, i) => ({ card, rev: Math.random() < 0.3, ...TPOS_A[i] })),
      belline: sb.slice(0, 4).map(card => ({ card })),
      lenormand: sl.slice(0, 3).map((card, i) => ({ card, label: LEN_LABELS_A[i] })),
    }
  }
  return {
    type: 'B',
    tarot: st.slice(0, 3).map((card, i) => ({ card, rev: Math.random() < 0.3, ...TPOS_B[i] })),
    belline: sb.slice(0, 2).map(card => ({ card })),
    lenormand: [{ card: sl[0], label: 'Énergie ambiante' }],
  }
}

// ── Copy-paste text ───────────────────────────────────────────────────────────

function buildCopyText(type, question, spread) {
  const SEP = '━'.repeat(36)
  const broles = type === 'A' ? BROLES_A : BROLES_B

  const tarotTxt = spread.tarot.map((t, i) => {
    const rev = t.rev ? ' [Renversée]' : ''
    if (type === 'A') return `\t${i + 1}.\t${t.pos} (${t.desc}) :\n${t.card.nom}${rev}`
    return `${i + 1}. ${t.pos} (${t.desc}) :\n${t.card.nom}${rev}`
  }).join('\n')

  const lenTxt = spread.lenormand.map(l => `${l.label} :\n${l.card.nom}`).join('\n\n')

  const belTxt = broles.map((b, i) => `${b.sym}) ${b.label} :\n${spread.belline[i].card.nom}`).join('\n\n')

  const header = type === 'A' ? 'TIRAGE DE TYPE A — LECTURE CLAUDE' : 'TIRAGE DE TYPE B — QUESTION RAPIDE'
  const footer = type === 'A'
    ? 'Fais-moi la lecture complète de ce tirage selon la méthode Type A.'
    : 'Fais-moi la lecture rapide de ce tirage selon la méthode Type B.'

  return [
    SEP, header, SEP,
    '',
    'QUESTION DU CONSULTANT :',
    `« ${question} »`,
    '',
    '━━━ TAROT ━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    tarotTxt,
    '',
    '━━━ LENORMAND ━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    lenTxt,
    '',
    '━━━ ORACLE DE BELLINE ━━━━━━━━━━━━━━━━',
    '',
    belTxt,
    '',
    SEP,
    footer,
    SEP,
  ].join('\n')
}

// ── Styles ────────────────────────────────────────────────────────────────────

const C = {
  bg: '#07040e', panel: '#13092a', border: '#3a2060',
  gold: '#c9a84c', muted: '#9a8a6a', dim: '#4a3060',
  purple: '#7a5a9a', text: '#e8ddc8', acc: '#2a1060',
}

const s = {
  app:    { minHeight: '100vh', background: C.bg, color: C.text, fontFamily: 'Georgia, serif', padding: '1.5rem' },
  panel:  { background: C.panel, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '1.2rem' },
  h1:     { fontSize: '2rem', color: C.gold, letterSpacing: '0.12em', margin: 0, textAlign: 'center' },
  label:  { display: 'block', color: C.muted, fontSize: '0.8rem', marginBottom: '0.35rem', letterSpacing: '0.05em' },
  input:  { width: '100%', background: '#0f0620', border: `1px solid ${C.border}`, borderRadius: '6px', color: C.text, fontFamily: 'Georgia, serif', fontSize: '1rem', padding: '0.65rem 0.9rem', outline: 'none', boxSizing: 'border-box' },
  btn:    { padding: '0.55rem 1.2rem', background: C.acc, border: `1px solid ${C.purple}`, borderRadius: '7px', color: C.text, cursor: 'pointer', fontSize: '0.87rem', fontFamily: 'Georgia, serif', letterSpacing: '0.03em' },
  btnGold:{ padding: '0.7rem 1.8rem', background: '#2a1060', border: `1px solid ${C.gold}`, borderRadius: '7px', color: C.gold, cursor: 'pointer', fontSize: '0.95rem', fontFamily: 'Georgia, serif', letterSpacing: '0.05em' },
}

// ── CardModal ─────────────────────────────────────────────────────────────────

function CardModal({ card, onClose }) {
  if (!card) return null
  const mots = card.motsClésEndroit ?? card.motsClés ?? []
  const sig   = card.significationEndroit ?? card.signification ?? ''
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' }}>
      <div onClick={e => e.stopPropagation()} style={{ ...s.panel, maxWidth: '440px', width: '100%', maxHeight: '88vh', overflow: 'auto' }}>
        {card.image && (
          <img src={imgUrl(card.image)} alt={card.nom} loading="lazy"
            style={{ width: '120px', borderRadius: '6px', float: 'right', marginLeft: '1rem', marginBottom: '0.5rem' }} />
        )}
        <div style={{ fontSize: '1.2rem', color: C.gold, marginBottom: '0.3rem' }}>{card.nom}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.5rem' }}>
          {[card.nomAnglais, card.element, card.planete, card.serie].filter(Boolean).map(v =>
            <span key={v} style={{ background: '#1e1035', border: `1px solid #5a3090`, borderRadius: '4px', padding: '0.1rem 0.4rem', fontSize: '0.7rem', color: C.gold }}>{v}</span>
          )}
        </div>
        {mots.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.6rem' }}>
            {mots.map(k => <span key={k} style={{ background: '#2a1060', border: `1px solid #5a3090`, borderRadius: '4px', padding: '0.1rem 0.4rem', fontSize: '0.7rem', color: C.muted }}>{k}</span>)}
          </div>
        )}
        {sig && <p style={{ fontSize: '0.86rem', lineHeight: 1.65, color: C.text, margin: '0 0 0.5rem' }}>{sig}</p>}
        {card.significationInversé && (
          <p style={{ fontSize: '0.82rem', lineHeight: 1.6, color: C.muted, borderTop: `1px solid ${C.border}`, paddingTop: '0.5rem', margin: 0 }}>
            <strong style={{ color: C.purple }}>Inversée : </strong>{card.significationInversé}
          </p>
        )}
        <br style={{ clear: 'both' }} />
        <button style={{ ...s.btn, marginTop: '1rem' }} onClick={onClose}>Fermer</button>
      </div>
    </div>
  )
}

// ── CardTile ──────────────────────────────────────────────────────────────────

function CardTile({ card, rev = false, posLabel, belline, bellineRole, onClickCard, onClickBelline, small = false }) {
  const w = small ? '90px' : '100%'
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: '8px', overflow: 'hidden', width: small ? '90px' : undefined }}>
      {posLabel && (
        <div style={{ fontSize: '0.58rem', color: C.muted, textAlign: 'center', padding: '0.2rem 0.2rem 0', letterSpacing: '0.03em', lineHeight: 1.2 }}>
          {posLabel}
        </div>
      )}
      <div style={{ cursor: 'pointer', padding: '0.2rem' }} onClick={onClickCard}>
        {card.image
          ? <img src={imgUrl(card.image)} alt={card.nom} loading="lazy"
              style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', borderRadius: '4px', display: 'block',
                transform: rev ? 'rotate(180deg)' : 'none', opacity: rev ? 0.82 : 1 }} />
          : <div style={{ width: '100%', aspectRatio: '2/3', background: '#1e1035', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: C.border }}>✦</div>
        }
        <div style={{ fontSize: '0.6rem', color: rev ? '#9a6a6a' : C.text, textAlign: 'center', padding: '0.15rem 0.1rem', lineHeight: 1.2 }}>
          {card.nom}{rev ? ' ↓' : ''}
        </div>
      </div>
      {belline && (
        <div onClick={onClickBelline} style={{ borderTop: `1px solid ${C.border}`, background: '#0a0418', padding: '0.2rem', cursor: 'pointer', textAlign: 'center' }}>
          {belline.image && (
            <img src={imgUrl(belline.image)} alt={belline.nom} loading="lazy"
              style={{ width: '55%', aspectRatio: '2/3', objectFit: 'cover', borderRadius: '3px', display: 'block', margin: '0 auto 0.1rem' }} />
          )}
          <div style={{ fontSize: '0.52rem', color: C.purple }}>{bellineRole?.sym})</div>
          <div style={{ fontSize: '0.62rem', color: C.gold, lineHeight: 1.2 }}>{belline.nom}</div>
        </div>
      )}
    </div>
  )
}

// ── SpreadView ────────────────────────────────────────────────────────────────

function SpreadView({ spread, onCardClick }) {
  if (spread.type === 'A') {
    const grid = Array.from({ length: 3 }, () => Array(3).fill(null))
    spread.tarot.forEach((t, i) => {
      const [col, row] = GPOS_A[i]
      grid[row][col] = { ...t, idx: i }
    })

    return (
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem', maxWidth: '580px', margin: '0 auto' }}>
          {grid.flat().map((cell, i) => {
            if (!cell) return <div key={i} />
            const bel = cell.bi !== null ? spread.belline[cell.bi] : null
            const bRole = cell.bi !== null ? BROLES_A[cell.bi] : null
            return (
              <CardTile key={i}
                card={cell.card} rev={cell.rev} posLabel={cell.pos}
                belline={bel?.card} bellineRole={bRole}
                onClickCard={() => onCardClick(cell.card)}
                onClickBelline={() => bel && onCardClick(bel.card)}
              />
            )
          })}
        </div>
        {/* Lenormand row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '0.8rem' }}>
          {spread.lenormand.map((l, i) => (
            <div key={i} onClick={() => onCardClick(l.card)}
              style={{ background: C.panel, border: `1px solid ${C.acc}`, borderRadius: '8px', padding: '0.3rem', width: '100px', cursor: 'pointer', textAlign: 'center' }}>
              {l.card.image && (
                <img src={imgUrl(l.card.image)} alt={l.card.nom} loading="lazy"
                  style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', borderRadius: '4px', display: 'block', marginBottom: '0.15rem' }} />
              )}
              <div style={{ fontSize: '0.52rem', color: C.purple, marginBottom: '0.05rem' }}>{l.label}</div>
              <div style={{ fontSize: '0.62rem', color: C.gold }}>{l.card.nom}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Type B — 3-card row
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.7rem', flexWrap: 'wrap' }}>
        {spread.tarot.map((t, i) => {
          const bel = t.bi !== null ? spread.belline[t.bi] : null
          const bRole = t.bi !== null ? BROLES_B[t.bi] : null
          return (
            <div key={i} style={{ width: '140px' }}>
              <CardTile card={t.card} rev={t.rev} posLabel={t.pos}
                belline={bel?.card} bellineRole={bRole}
                onClickCard={() => onCardClick(t.card)}
                onClickBelline={() => bel && onCardClick(bel.card)}
              />
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.8rem' }}>
        <div onClick={() => onCardClick(spread.lenormand[0].card)}
          style={{ background: C.panel, border: `1px solid ${C.acc}`, borderRadius: '8px', padding: '0.3rem', width: '100px', cursor: 'pointer', textAlign: 'center' }}>
          {spread.lenormand[0].card.image && (
            <img src={imgUrl(spread.lenormand[0].card.image)} alt={spread.lenormand[0].card.nom} loading="lazy"
              style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', borderRadius: '4px', display: 'block', marginBottom: '0.15rem' }} />
          )}
          <div style={{ fontSize: '0.52rem', color: C.purple }}>{spread.lenormand[0].label}</div>
          <div style={{ fontSize: '0.62rem', color: C.gold }}>{spread.lenormand[0].card.nom}</div>
        </div>
      </div>
    </div>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen,       setScreen]       = useState('menu')
  const [spreadType,   setSpreadType]   = useState('A')
  const [mode,         setMode]         = useState('offline')
  const [question,     setQuestion]     = useState('')
  const [spread,       setSpread]       = useState(null)
  const [modal,        setModal]        = useState(null)
  const [synthesis,    setSynthesis]    = useState(null)
  const [copyDone,     setCopyDone]     = useState(false)
  const [apiKey,       setApiKey]       = useState(() => localStorage.getItem('divinatory_api_key') || '')

  function saveApiKey(v) { setApiKey(v); localStorage.setItem('divinatory_api_key', v) }

  function handleChooseType(type) { setSpreadType(type); setScreen('question') }

  function handleDraw() {
    if (!question.trim()) return
    setSpread(drawSpread(spreadType))
    setSynthesis(null)
    setCopyDone(false)
    setScreen('spread')
  }

  function handleReset() { setScreen('menu'); setQuestion(''); setSpread(null); setSynthesis(null); setCopyDone(false) }

  function handleCopy() {
    if (!spread) return
    navigator.clipboard.writeText(buildCopyText(spread.type, question, spread)).then(() => {
      setCopyDone(true)
      setTimeout(() => setCopyDone(false), 2500)
    })
  }

  async function fetchSynthesis() {
    if (!spread) return
    setSynthesis({ loading: true })
    try {
      const broles = spread.type === 'A' ? BROLES_A : BROLES_B
      const tarotLines = spread.tarot.map((t, i) =>
        `T${i + 1} — ${t.pos} (${t.desc}) : ${t.card.nom}${t.rev ? ' [Renversée]' : ''}`
      ).join('\n')
      const belLines = broles.map((b, i) =>
        `${b.sym}) ${b.label} : ${spread.belline[i].card.nom}`
      ).join('\n')
      const lenLines = spread.lenormand.map(l =>
        `${l.label} : ${l.card.nom} (${l.card.motsClés?.slice(0, 2).join(', ')})`
      ).join('\n')
      const typeName = spread.type === 'A' ? 'Type A (Développé)' : 'Type B (Rapide)'
      const prompt = `TIRAGE ${typeName}\nQUESTION : "${question}"\n\nTAROT :\n${tarotLines}\n\nLENORMAND :\n${lenLines}\n\nORACLE DE BELLINE :\n${belLines}\n\nMéthode : Tarot (sens profond) → Belline (sous les masques) → Lenormand (réalité concrète). Convergence = vérité. Divergence = tension à nommer.\n\nRéponds uniquement en JSON valide sans backticks :\n{"tarot":["2 phrases pour T1","T2..."],"belline":["1-2 phrases pour ${broles[0].sym})","${broles.length > 1 ? broles[1].sym + ')...' : ''}"],"lenormand":["L1..."],"convergence":"accord|contradiction|tension","vue":"1 phrase sur la convergence des 3 systèmes","synthese":"3-4 phrases répondant directement à la question"}`

      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 2000, messages: [{ role: 'user', content: prompt }] }),
      })
      if (!resp.ok) { const e = await resp.json().catch(() => ({})); throw new Error(e.error?.message || `Erreur ${resp.status}`) }
      const data = await resp.json()
      setSynthesis({ data: JSON.parse(data.content[0].text) })
    } catch (e) { setSynthesis({ error: e.message }) }
  }

  // ── Menu ─────────────────────────────────────────────────────────────────────
  if (screen === 'menu') {
    return (
      <div style={{ ...s.app, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '3rem' }}>
        <h1 style={s.h1}>✦ Divinatory ✦</h1>
        <p style={{ color: C.muted, textAlign: 'center', letterSpacing: '0.08em', marginTop: '0.5rem', marginBottom: '3rem' }}>
          L'Art du Tirage — Tarot · Belline · Lenormand
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '660px', width: '100%' }}>
          {/* Type A */}
          <div style={{ ...s.panel, flex: '1 1 270px', display: 'flex', flexDirection: 'column', gap: '0.8rem', borderColor: C.gold }}>
            <div style={{ color: C.gold, fontSize: '1.25rem', letterSpacing: '0.05em' }}>Tirage Type A</div>
            <div style={{ color: C.gold, fontSize: '0.75rem', letterSpacing: '0.1em', opacity: 0.7 }}>DÉVELOPPÉ</div>
            <p style={{ color: C.muted, fontSize: '0.83rem', lineHeight: 1.6, margin: 0 }}>
              Lecture approfondie combinant les 3 jeux. Idéal pour les questions importantes qui méritent une réponse complète et nuancée.
            </p>
            <div style={{ color: C.dim, fontSize: '0.78rem', lineHeight: 1.8 }}>
              9 cartes de Tarot<br />
              4 cartes de l'Oracle de Belline<br />
              3 cartes du Lenormand
            </div>
            <button style={{ ...s.btnGold, marginTop: '0.5rem' }} onClick={() => handleChooseType('A')}>
              Choisir le Type A →
            </button>
          </div>

          {/* Type B */}
          <div style={{ ...s.panel, flex: '1 1 270px', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <div style={{ color: C.purple, fontSize: '1.25rem', letterSpacing: '0.05em' }}>Tirage Type B</div>
            <div style={{ color: C.purple, fontSize: '0.75rem', letterSpacing: '0.1em', opacity: 0.7 }}>QUESTION RAPIDE</div>
            <p style={{ color: C.muted, fontSize: '0.83rem', lineHeight: 1.6, margin: 0 }}>
              Réponse directe et essentielle. Pour une question simple qui demande une réponse claire et immédiate.
            </p>
            <div style={{ color: C.dim, fontSize: '0.78rem', lineHeight: 1.8 }}>
              3 cartes de Tarot<br />
              2 cartes de l'Oracle de Belline<br />
              1 carte du Lenormand
            </div>
            <button
              style={{ ...s.btn, marginTop: '0.5rem', border: `1px solid ${C.purple}`, color: C.purple }}
              onClick={() => handleChooseType('B')}
            >
              Choisir le Type B →
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Question ──────────────────────────────────────────────────────────────────
  if (screen === 'question') {
    const canDraw = question.trim() && (mode === 'offline' || (mode === 'ai' && apiKey))
    return (
      <div style={{ ...s.app, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ width: '100%', maxWidth: '500px' }}>
          <button onClick={() => setScreen('menu')}
            style={{ background: 'none', border: 'none', color: C.purple, cursor: 'pointer', fontSize: '0.82rem', marginBottom: '1.5rem', padding: 0 }}>
            ← Retour au menu
          </button>
          <div style={{ color: C.gold, fontSize: '0.72rem', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
            TIRAGE TYPE {spreadType} — {spreadType === 'A' ? 'DÉVELOPPÉ' : 'QUESTION RAPIDE'}
          </div>

          <div style={{ marginBottom: '1.2rem' }}>
            <label style={s.label}>Formulez votre question</label>
            <textarea
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && canDraw && (e.preventDefault(), handleDraw())}
              placeholder="Quelle guidance cherchez-vous aujourd'hui ?"
              rows={4}
              style={{ ...s.input, resize: 'vertical' }}
            />
          </div>

          {/* Mode selector */}
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={s.label}>Mode de lecture</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[
                { id: 'offline', label: 'Hors Ligne', sub: 'Texte à copier-coller' },
                { id: 'ai',     label: 'Mode IA',    sub: 'Lecture directe dans l\'app' },
              ].map(m => (
                <button key={m.id} onClick={() => setMode(m.id)}
                  style={{ flex: 1, padding: '0.6rem 0.5rem', borderRadius: '7px', cursor: 'pointer', fontFamily: 'Georgia, serif', textAlign: 'center', transition: 'all 0.15s',
                    background: mode === m.id ? '#2a1060' : '#0f0620',
                    border: `1px solid ${mode === m.id ? C.gold : C.border}`,
                    color: mode === m.id ? C.gold : C.muted,
                  }}>
                  <div style={{ fontSize: '0.88rem' }}>{m.label}</div>
                  <div style={{ fontSize: '0.68rem', marginTop: '0.15rem', opacity: 0.75 }}>{m.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* API key — only for AI mode */}
          {mode === 'ai' && (
            <div style={{ ...s.panel, marginBottom: '1.2rem', padding: '0.8rem 1rem' }}>
              <label style={s.label}>Clé API Claude</label>
              <input type="password" value={apiKey} onChange={e => saveApiKey(e.target.value)}
                placeholder="sk-ant-api03-..." style={{ ...s.input, fontFamily: 'monospace', fontSize: '0.83rem', color: C.gold }} />
              <div style={{ color: C.dim, fontSize: '0.68rem', marginTop: '0.35rem' }}>
                Stockée uniquement dans votre navigateur. Aucun serveur intermédiaire.
              </div>
            </div>
          )}

          <button onClick={handleDraw} disabled={!canDraw}
            style={{ ...s.btnGold, width: '100%', opacity: canDraw ? 1 : 0.35, cursor: canDraw ? 'pointer' : 'default' }}>
            Révéler le tirage
          </button>
        </div>
      </div>
    )
  }

  // ── Spread ────────────────────────────────────────────────────────────────────
  const broles = spread?.type === 'A' ? BROLES_A : BROLES_B

  return (
    <div style={s.app}>
      <CardModal card={modal} onClose={() => setModal(null)} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div style={{ fontSize: '1.15rem', color: C.gold, letterSpacing: '0.08em' }}>✦ Divinatory</div>
          <div style={{ fontSize: '0.68rem', color: C.purple, letterSpacing: '0.06em', marginTop: '0.1rem' }}>
            TYPE {spread?.type} · {mode === 'offline' ? 'HORS LIGNE' : 'MODE IA'}
          </div>
        </div>
        <button onClick={handleReset} style={{ ...s.btn, fontSize: '0.8rem', padding: '0.35rem 0.9rem' }}>↩ Nouveau</button>
      </div>

      {/* Question */}
      <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: '7px', padding: '0.6rem 1rem', marginBottom: '1rem' }}>
        <span style={{ color: C.purple, fontSize: '0.7rem', letterSpacing: '0.05em' }}>QUESTION  </span>
        <span style={{ color: C.text, fontSize: '0.9rem' }}>« {question} »</span>
      </div>

      {/* Légende */}
      <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '0.8rem', fontSize: '0.68rem', color: C.dim }}>
        <span>Tarot — <span style={{ color: C.muted }}>clic pour détails</span></span>
        <span>Belline — <span style={{ color: C.gold }}>dessous chaque position associée</span></span>
        <span>Lenormand — <span style={{ color: C.purple }}>rangée du bas</span></span>
        <span>↓ = renversée</span>
      </div>

      {spread && <SpreadView spread={spread} onCardClick={setModal} />}

      {/* ── Mode Hors Ligne : texte à copier ─────────────────────────────── */}
      {mode === 'offline' && spread && (
        <div style={{ maxWidth: '680px', margin: '1.5rem auto 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ color: C.muted, fontSize: '0.72rem', letterSpacing: '0.06em' }}>
              TEXTE À COPIER — Coller dans Claude.ai ou toute autre IA
            </div>
            <button onClick={handleCopy}
              style={{ ...s.btn, padding: '0.3rem 0.8rem', fontSize: '0.78rem',
                background: copyDone ? '#1a4020' : C.acc,
                borderColor: copyDone ? '#4a9060' : C.purple,
                color: copyDone ? '#8ad0a0' : C.text }}>
              {copyDone ? '✓ Copié !' : 'Copier'}
            </button>
          </div>
          <textarea
            readOnly
            value={buildCopyText(spread.type, question, spread)}
            rows={24}
            style={{ ...s.input, fontFamily: 'monospace', fontSize: '0.74rem', lineHeight: 1.55, color: C.muted, resize: 'vertical', cursor: 'text' }}
          />
        </div>
      )}

      {/* ── Mode IA : synthèse ────────────────────────────────────────────── */}
      {mode === 'ai' && spread && (
        <div style={{ maxWidth: '680px', margin: '1.5rem auto 0' }}>
          <div style={{ color: C.purple, fontSize: '0.75rem', letterSpacing: '0.08em', textAlign: 'center', marginBottom: '0.8rem' }}>— LECTURE IA —</div>

          {!synthesis && (
            <div style={{ textAlign: 'center' }}>
              <button onClick={fetchSynthesis} style={s.btnGold}>Obtenir la lecture par Claude</button>
            </div>
          )}

          {synthesis?.loading && (
            <div style={{ textAlign: 'center', color: C.purple, padding: '1.5rem', border: `1px solid ${C.border}`, borderRadius: '8px' }}>
              Lecture en cours…
            </div>
          )}

          {synthesis?.error && (
            <div style={{ padding: '1rem', background: '#1a0820', border: '1px solid #6a2040', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ color: '#c06080', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{synthesis.error}</div>
              <button onClick={fetchSynthesis} style={{ ...s.btn, fontSize: '0.8rem' }}>Réessayer</button>
            </div>
          )}

          {synthesis?.data && (() => {
            const d = synthesis.data
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                <div style={{ background: '#1a0e30', border: `1px solid #5a3090`, borderRadius: '8px', padding: '1rem 1.1rem' }}>
                  <div style={{ color: C.gold, fontSize: '0.7rem', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>SYNTHÈSE GLOBALE</div>
                  <p style={{ color: C.text, fontSize: '0.9rem', lineHeight: 1.65, margin: 0 }}>{d.synthese}</p>
                  {d.vue && <p style={{ color: C.muted, fontSize: '0.78rem', marginTop: '0.4rem', marginBottom: 0, fontStyle: 'italic' }}>{d.vue}</p>}
                </div>
                {d.tarot?.length > 0 && (
                  <div style={s.panel}>
                    <div style={{ color: C.muted, fontSize: '0.7rem', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>TAROT</div>
                    {d.tarot.map((txt, i) => (
                      <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.3rem', fontSize: '0.82rem' }}>
                        <span style={{ color: C.dim, minWidth: '1.4rem', flexShrink: 0 }}>T{i + 1}</span>
                        <span style={{ color: C.muted, minWidth: '90px', flexShrink: 0, fontSize: '0.72rem', paddingTop: '0.05rem' }}>{spread.tarot[i]?.pos}</span>
                        <span style={{ color: C.text, lineHeight: 1.5 }}>{txt}</span>
                      </div>
                    ))}
                  </div>
                )}
                {d.belline?.length > 0 && (
                  <div style={s.panel}>
                    <div style={{ color: C.muted, fontSize: '0.7rem', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>ORACLE DE BELLINE</div>
                    {d.belline.map((txt, i) => (
                      <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.3rem', fontSize: '0.82rem' }}>
                        <span style={{ color: C.purple, minWidth: '1.4rem', flexShrink: 0 }}>{broles[i]?.sym})</span>
                        <span style={{ color: C.gold, lineHeight: 1.5 }}>{txt}</span>
                      </div>
                    ))}
                  </div>
                )}
                {d.lenormand?.length > 0 && (
                  <div style={s.panel}>
                    <div style={{ color: C.muted, fontSize: '0.7rem', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>LENORMAND</div>
                    {d.lenormand.map((txt, i) => (
                      <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.3rem', fontSize: '0.82rem' }}>
                        <span style={{ color: C.dim, minWidth: '1.4rem', flexShrink: 0 }}>L{i + 1}</span>
                        <span style={{ color: C.text, lineHeight: 1.5 }}>{txt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })()}
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '2rem', paddingBottom: '1rem' }}>
        <button onClick={handleReset} style={{ ...s.btn, padding: '0.55rem 1.6rem' }}>↩ Nouvelle question</button>
      </div>
    </div>
  )
}
