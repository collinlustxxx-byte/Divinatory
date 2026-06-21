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

// ── Tirage Type A (Développé) — 9 Tarot + 4 Belline + 3 Lenormand ────────────

const TPOS_A = [
  { pos: 'La Situation',          desc: "Au présent de l'événement par rapport à la question",                   bi: null },
  { pos: "L'Obstacle",            desc: "Ce qui entrave — intentions secrètes, non-dits, manipulation possible", bi: 0 },
  { pos: 'Ce qui Aide',           desc: "La ressource disponible pour le consultant",                            bi: 3 },
  { pos: 'La Réponse',            desc: "La réponse directe à la question du consultant",                        bi: null },
  { pos: 'La Synthèse',           desc: "Carte centrale — vue d'ensemble",                                       bi: null },
  { pos: 'Le Passé',              desc: "Ce qui a conduit à la situation",                                       bi: 1 },
  { pos: 'Le Futur Immédiat',     desc: "Ce qui arrive à court terme",                                          bi: 2 },
  { pos: "L'Évolution / Guidage", desc: "Précise la direction de la carte #4",                                  bi: null },
  { pos: 'Carte du Dessous',      desc: "Carte représentante du sujet de la question",                          bi: null },
]

const BROLES_A = [
  { sym: '@', label: "Intentions secrètes, non-dits, manipulation possible (lecture conjointe avec L'Obstacle #2)" },
  { sym: '$', label: "Ce qui a construit la situation — pourquoi en es-tu rendu là (lecture conjointe avec Le Passé #6)" },
  { sym: '&', label: "Ce qui s'en vient si rien ne change (lecture conjointe avec Le Futur Immédiat #7)" },
  { sym: '?', label: "Ce que TU peux faire concrètement (lecture conjointe avec Ce qui Aide #3)" },
]

const GPOS_A = [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[0,2],[1,2],[2,2]]
const LEN_LABELS_A = ['A) Passé factuel', 'B) Présent réel', 'C) Futur concret']

// ── Tirage Type B (Rapide) — 3 Tarot + 2 Belline + 1 Lenormand ───────────────

const TPOS_B = [
  { pos: 'La Situation', desc: "L'énergie principale en jeu",         bi: 0 },
  { pos: 'La Réponse',   desc: "La réponse directe à votre question", bi: null },
  { pos: "L'Issue",      desc: "Ce qui se concrétise à court terme",  bi: 1 },
]

const BROLES_B = [
  { sym: '@', label: "Ce qui se cache derrière la situation (lecture conjointe avec La Situation #1)" },
  { sym: '?', label: "Le meilleur chemin disponible (lecture conjointe avec L'Issue #3)" },
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
      tarot:    st.slice(0, 9).map((card, i) => ({ card, rev: Math.random() < 0.3, ...TPOS_A[i] })),
      belline:  sb.slice(0, 4).map(card => ({ card })),
      lenormand: sl.slice(0, 3).map((card, i) => ({ card, label: LEN_LABELS_A[i] })),
    }
  }
  return {
    type: 'B',
    tarot:    st.slice(0, 3).map((card, i) => ({ card, rev: Math.random() < 0.3, ...TPOS_B[i] })),
    belline:  sb.slice(0, 2).map(card => ({ card })),
    lenormand: [{ card: sl[0], label: 'Énergie ambiante' }],
  }
}

// ── Texte complet pour copier (mode Hors-Ligne) ───────────────────────────────

function buildCopyText(type, question, spread) {
  const SEP  = '━'.repeat(52)
  const SEP2 = '─'.repeat(52)
  const broles = type === 'A' ? BROLES_A : BROLES_B
  const typeName = type === 'A'
    ? 'TIRAGE DÉVELOPPÉ (TYPE A)  —  9 Tarot + 4 Belline + 3 Lenormand'
    : 'TIRAGE RAPIDE (TYPE B)  —  3 Tarot + 2 Belline + 1 Lenormand'

  // ── Tarot ──
  const tarotTxt = spread.tarot.map((t, i) => {
    const revTag   = t.rev ? ' [RENVERSÉE]' : ''
    const mots     = (t.card.motsClésEndroit ?? t.card.motsClés ?? []).join(', ')
    const motsInv  = (t.card.motsClésInversé ?? []).join(', ')
    const sig      = t.rev
      ? (t.card.significationInversé ?? t.card.significationEndroit ?? t.card.signification ?? '')
      : (t.card.significationEndroit ?? t.card.signification ?? '')
    const posOrder = type === 'A'
      ? `Carte tirée en position ${i + 1} sur 9`
      : `Carte tirée en position ${i + 1} sur 3`

    const lines = [
      `${SEP2}`,
      `TAROT — Position ${i + 1} : ${t.pos}`,
      `Rôle de cette position : ${t.desc}`,
      `${posOrder}`,
      SEP2,
      `Carte : ${t.card.nom}${t.card.numero ? ' (' + t.card.numero + ')' : ''}${revTag}`,
    ]
    if (t.card.element)  lines.push(`Élément : ${t.card.element}`)
    if (t.card.planete)  lines.push(`Planète : ${t.card.planete}`)
    if (mots)            lines.push(`Mots-clés (endroit) : ${mots}`)
    if (t.rev && motsInv) lines.push(`Mots-clés (renversée) : ${motsInv}`)
    lines.push('')
    lines.push(`Signification dans cette position :`)
    lines.push(sig || '—')
    return lines.join('\n')
  }).join('\n\n')

  // ── Lenormand ──
  const lenTxt = spread.lenormand.map((l, i) => {
    const mots = (l.card.motsClés ?? []).join(', ')
    const sig  = l.card.signification ?? ''
    const posOrder = `Carte tirée en position ${i + 1} sur ${spread.lenormand.length}`
    return [
      SEP2,
      `LENORMAND — ${l.label}`,
      posOrder,
      SEP2,
      `Carte : ${l.card.nom}`,
      mots ? `Mots-clés : ${mots}` : '',
      '',
      'Signification :',
      sig || '—',
    ].filter(Boolean).join('\n')
  }).join('\n\n')

  // ── Belline ──
  const belTxt = broles.map((b, i) => {
    const bc   = spread.belline[i]?.card
    if (!bc) return ''
    const mots = (bc.motsClés ?? []).join(', ')
    const sig  = bc.signification ?? ''
    return [
      SEP2,
      `BELLINE — ${b.sym}) ${b.label}`,
      SEP2,
      `Carte : ${bc.nom}${bc.serie ? ' [' + bc.serie + ']' : ''}`,
      bc.polarite ? `Polarité : ${bc.polarite}` : '',
      mots ? `Mots-clés : ${mots}` : '',
      '',
      'Signification :',
      sig || '—',
    ].filter(Boolean).join('\n')
  }).join('\n\n')

  const instrType = type === 'A'
    ? `Tu es un expert en divinologie combinant Tarot, Oracle de Belline et Lenormand.
Fais-moi la lecture COMPLÈTE et DÉVELOPPÉE de ce tirage de Type A.
Pour chaque carte de Tarot, tiens compte de :
  - Sa position et son rôle spécifique dans ce tirage
  - L'ordre dans lequel elle a été tirée (du 1 au 9)
  - La carte de Belline qui lui est associée (si applicable)
  - Sa signification endroit ou renversée selon la carte
Puis croise les 3 systèmes (Tarot + Belline + Lenormand) pour donner une synthèse finale répondant directement à la question.`
    : `Tu es un expert en divinologie combinant Tarot, Oracle de Belline et Lenormand.
Fais-moi la lecture RAPIDE et DIRECTE de ce tirage de Type B.
Pour chaque carte, respecte sa position et son rôle.
Conclus avec une réponse claire et concise à la question posée.`

  return [
    SEP, typeName, SEP,
    '',
    '▸ QUESTION DU CONSULTANT :',
    `« ${question} »`,
    '',
    SEP,
    '▸ INSTRUCTIONS POUR L\'IA :',
    SEP,
    instrType,
    '',
    SEP,
    '▸ DÉTAIL COMPLET DU TIRAGE',
    SEP,
    '',
    '══ TAROT ══════════════════════════════════════════════',
    '',
    tarotTxt,
    '',
    '══ LENORMAND ══════════════════════════════════════════',
    '',
    lenTxt,
    '',
    '══ ORACLE DE BELLINE ══════════════════════════════════',
    '',
    belTxt,
    '',
    SEP,
    '▸ FIN DU TIRAGE — Copier tout ce texte et coller dans Claude.ai ou toute autre IA',
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
  app:     { minHeight: '100vh', background: C.bg, color: C.text, fontFamily: 'Georgia, serif', padding: '1.5rem' },
  panel:   { background: C.panel, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '1.2rem' },
  h1:      { fontSize: '2rem', color: C.gold, letterSpacing: '0.12em', margin: 0, textAlign: 'center' },
  label:   { display: 'block', color: C.muted, fontSize: '0.8rem', marginBottom: '0.35rem', letterSpacing: '0.05em' },
  input:   { width: '100%', background: '#0f0620', border: `1px solid ${C.border}`, borderRadius: '6px', color: C.text, fontFamily: 'Georgia, serif', fontSize: '1rem', padding: '0.65rem 0.9rem', outline: 'none', boxSizing: 'border-box' },
  btn:     { padding: '0.55rem 1.2rem', background: C.acc, border: `1px solid ${C.purple}`, borderRadius: '7px', color: C.text, cursor: 'pointer', fontSize: '0.87rem', fontFamily: 'Georgia, serif', letterSpacing: '0.03em' },
  btnGold: { padding: '0.7rem 1.8rem', background: '#2a1060', border: `1px solid ${C.gold}`, borderRadius: '7px', color: C.gold, cursor: 'pointer', fontSize: '0.95rem', fontFamily: 'Georgia, serif', letterSpacing: '0.05em' },
}

// ── CardModal ─────────────────────────────────────────────────────────────────

function CardModal({ card, posLabel, posDesc, drawOrder, rev, onClose }) {
  if (!card) return null
  const mots    = card.motsClésEndroit ?? card.motsClés ?? []
  const motsInv = card.motsClésInversé ?? []
  const sig     = rev
    ? (card.significationInversé ?? card.significationEndroit ?? card.signification ?? '')
    : (card.significationEndroit ?? card.signification ?? '')
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' }}>
      <div onClick={e => e.stopPropagation()} style={{ ...s.panel, maxWidth: '460px', width: '100%', maxHeight: '90vh', overflow: 'auto' }}>
        {card.image && (
          <img src={imgUrl(card.image)} alt={card.nom} loading="lazy"
            style={{ width: '110px', borderRadius: '6px', float: 'right', marginLeft: '1rem', marginBottom: '0.5rem',
              transform: rev ? 'rotate(180deg)' : 'none', opacity: rev ? 0.82 : 1 }} />
        )}

        {posLabel && (
          <div style={{ marginBottom: '0.5rem' }}>
            {drawOrder && <div style={{ fontSize: '0.62rem', color: C.dim, letterSpacing: '0.05em', marginBottom: '0.1rem' }}>Tirée en {drawOrder}</div>}
            <div style={{ fontSize: '0.72rem', color: C.gold, letterSpacing: '0.06em' }}>{posLabel}</div>
            {posDesc && <div style={{ fontSize: '0.7rem', color: C.muted, marginTop: '0.1rem', lineHeight: 1.4 }}>{posDesc}</div>}
          </div>
        )}

        <div style={{ fontSize: '1.15rem', color: C.gold, marginBottom: '0.3rem' }}>
          {card.nom}{rev ? <span style={{ color: '#9a6a6a', fontSize: '0.8rem' }}> ↓ Renversée</span> : ''}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.5rem' }}>
          {[card.nomAnglais, card.element, card.planete, card.serie, card.polarite].filter(Boolean).map(v =>
            <span key={v} style={{ background: '#1e1035', border: `1px solid #5a3090`, borderRadius: '4px', padding: '0.1rem 0.4rem', fontSize: '0.68rem', color: C.gold }}>{v}</span>
          )}
        </div>

        {mots.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.5rem' }}>
            {mots.map(k => <span key={k} style={{ background: '#2a1060', border: `1px solid #5a3090`, borderRadius: '4px', padding: '0.1rem 0.4rem', fontSize: '0.68rem', color: C.muted }}>{k}</span>)}
          </div>
        )}

        <p style={{ fontSize: '0.85rem', lineHeight: 1.65, color: C.text, margin: '0 0 0.5rem' }}>{sig}</p>

        {rev && card.significationInversé && card.significationEndroit && (
          <details style={{ marginBottom: '0.5rem' }}>
            <summary style={{ fontSize: '0.72rem', color: C.dim, cursor: 'pointer' }}>Voir signification endroit</summary>
            <p style={{ fontSize: '0.8rem', lineHeight: 1.6, color: C.muted, margin: '0.3rem 0 0' }}>{card.significationEndroit}</p>
          </details>
        )}

        {!rev && card.significationInversé && (
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '0.5rem', margin: 0 }}>
            <div style={{ fontSize: '0.68rem', color: C.purple, marginBottom: '0.2rem', letterSpacing: '0.04em' }}>SI RENVERSÉE :</div>
            {motsInv.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem', marginBottom: '0.3rem' }}>
                {motsInv.map(k => <span key={k} style={{ background: '#2a0030', border: `1px solid #7a3060`, borderRadius: '4px', padding: '0.1rem 0.4rem', fontSize: '0.65rem', color: '#c06080' }}>{k}</span>)}
              </div>
            )}
            <p style={{ fontSize: '0.8rem', lineHeight: 1.6, color: C.muted, margin: 0 }}>{card.significationInversé}</p>
          </div>
        )}

        <br style={{ clear: 'both' }} />
        <button style={{ ...s.btn, marginTop: '1rem' }} onClick={onClose}>Fermer</button>
      </div>
    </div>
  )
}

// ── CardTile ──────────────────────────────────────────────────────────────────

function CardTile({ card, rev = false, posLabel, orderNum, belline, bellineRole, onClickCard, onClickBelline }) {
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: '8px', overflow: 'hidden' }}>
      {posLabel && (
        <div style={{ fontSize: '0.55rem', color: C.muted, textAlign: 'center', padding: '0.18rem 0.2rem 0', letterSpacing: '0.03em', lineHeight: 1.2 }}>
          {orderNum && <span style={{ color: C.dim }}>#{orderNum} · </span>}{posLabel}
        </div>
      )}
      <div style={{ cursor: 'pointer', padding: '0.2rem' }} onClick={onClickCard}>
        {card.image
          ? <img src={imgUrl(card.image)} alt={card.nom} loading="lazy"
              style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', borderRadius: '4px', display: 'block',
                transform: rev ? 'rotate(180deg)' : 'none', opacity: rev ? 0.82 : 1 }} />
          : <div style={{ width: '100%', aspectRatio: '2/3', background: '#1e1035', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: C.border }}>✦</div>
        }
        <div style={{ fontSize: '0.58rem', color: rev ? '#9a6a6a' : C.text, textAlign: 'center', padding: '0.12rem 0.1rem', lineHeight: 1.2 }}>
          {card.nom}{rev ? ' ↓' : ''}
        </div>
      </div>
      {belline && (
        <div onClick={onClickBelline} style={{ borderTop: `1px solid ${C.border}`, background: '#0a0418', padding: '0.2rem', cursor: 'pointer', textAlign: 'center' }}>
          {belline.image && (
            <img src={imgUrl(belline.image)} alt={belline.nom} loading="lazy"
              style={{ width: '55%', aspectRatio: '2/3', objectFit: 'cover', borderRadius: '3px', display: 'block', margin: '0 auto 0.1rem' }} />
          )}
          <div style={{ fontSize: '0.5rem', color: C.purple }}>{bellineRole?.sym})</div>
          <div style={{ fontSize: '0.6rem', color: C.gold, lineHeight: 1.2 }}>{belline.nom}</div>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem', maxWidth: '560px', margin: '0 auto' }}>
          {grid.flat().map((cell, i) => {
            if (!cell) return <div key={i} />
            const bel   = cell.bi !== null ? spread.belline[cell.bi] : null
            const bRole = cell.bi !== null ? BROLES_A[cell.bi]       : null
            return (
              <CardTile key={i}
                card={cell.card} rev={cell.rev}
                posLabel={cell.pos} orderNum={cell.idx + 1}
                belline={bel?.card} bellineRole={bRole}
                onClickCard={() => onCardClick({ card: cell.card, posLabel: cell.pos, posDesc: cell.desc, drawOrder: `position ${cell.idx + 1}/9`, rev: cell.rev })}
                onClickBelline={() => bel && onCardClick({ card: bel.card, posLabel: bRole?.label })}
              />
            )
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '0.8rem' }}>
          {spread.lenormand.map((l, i) => (
            <div key={i} onClick={() => onCardClick({ card: l.card, posLabel: l.label })}
              style={{ background: C.panel, border: `1px solid ${C.acc}`, borderRadius: '8px', padding: '0.3rem', width: '96px', cursor: 'pointer', textAlign: 'center' }}>
              {l.card.image && (
                <img src={imgUrl(l.card.image)} alt={l.card.nom} loading="lazy"
                  style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', borderRadius: '4px', display: 'block', marginBottom: '0.15rem' }} />
              )}
              <div style={{ fontSize: '0.5rem', color: C.purple, marginBottom: '0.05rem' }}>{l.label}</div>
              <div style={{ fontSize: '0.6rem', color: C.gold }}>{l.card.nom}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Type B
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.7rem', flexWrap: 'wrap' }}>
        {spread.tarot.map((t, i) => {
          const bel   = t.bi !== null ? spread.belline[t.bi] : null
          const bRole = t.bi !== null ? BROLES_B[t.bi]       : null
          return (
            <div key={i} style={{ width: '130px' }}>
              <CardTile card={t.card} rev={t.rev}
                posLabel={t.pos} orderNum={i + 1}
                belline={bel?.card} bellineRole={bRole}
                onClickCard={() => onCardClick({ card: t.card, posLabel: t.pos, posDesc: t.desc, drawOrder: `position ${i + 1}/3`, rev: t.rev })}
                onClickBelline={() => bel && onCardClick({ card: bel.card, posLabel: bRole?.label })}
              />
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.8rem' }}>
        <div onClick={() => onCardClick({ card: spread.lenormand[0].card, posLabel: spread.lenormand[0].label })}
          style={{ background: C.panel, border: `1px solid ${C.acc}`, borderRadius: '8px', padding: '0.3rem', width: '96px', cursor: 'pointer', textAlign: 'center' }}>
          {spread.lenormand[0].card.image && (
            <img src={imgUrl(spread.lenormand[0].card.image)} alt={spread.lenormand[0].card.nom} loading="lazy"
              style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', borderRadius: '4px', display: 'block', marginBottom: '0.15rem' }} />
          )}
          <div style={{ fontSize: '0.5rem', color: C.purple }}>{spread.lenormand[0].label}</div>
          <div style={{ fontSize: '0.6rem', color: C.gold }}>{spread.lenormand[0].card.nom}</div>
        </div>
      </div>
    </div>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen,     setScreen]     = useState('menu')       // 'menu' | 'spread-type' | 'question' | 'spread'
  const [mode,       setMode]       = useState(null)         // 'offline' | 'ai'
  const [spreadType, setSpreadType] = useState(null)         // 'A' | 'B'
  const [question,   setQuestion]   = useState('')
  const [spread,     setSpread]     = useState(null)
  const [modal,      setModal]      = useState(null)         // { card, posLabel, posDesc, drawOrder, rev }
  const [synthesis,  setSynthesis]  = useState(null)
  const [copyDone,   setCopyDone]   = useState(false)
  const [apiKey,     setApiKey]     = useState(() => localStorage.getItem('divinatory_api_key') || '')

  function saveApiKey(v) { setApiKey(v); localStorage.setItem('divinatory_api_key', v) }

  function handleChooseMode(m) { setMode(m); setScreen('spread-type') }

  function handleChooseType(t) { setSpreadType(t); setScreen('question') }

  function handleDraw() {
    if (!question.trim()) return
    setSpread(drawSpread(spreadType))
    setSynthesis(null)
    setCopyDone(false)
    setScreen('spread')
  }

  function handleReset() {
    setScreen('menu')
    setMode(null)
    setSpreadType(null)
    setQuestion('')
    setSpread(null)
    setSynthesis(null)
    setCopyDone(false)
  }

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

  // ─────────────────────────────────────────────────────────────────────────────
  // Écran 1 : Choix du mode
  // ─────────────────────────────────────────────────────────────────────────────
  if (screen === 'menu') {
    return (
      <div style={{ ...s.app, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '3rem' }}>
        <h1 style={s.h1}>✦ Divinatory ✦</h1>
        <p style={{ color: C.muted, textAlign: 'center', letterSpacing: '0.08em', marginTop: '0.5rem', marginBottom: '0.4rem' }}>
          L'Art du Tirage — Tarot · Belline · Lenormand
        </p>
        <p style={{ color: C.dim, fontSize: '0.8rem', textAlign: 'center', marginBottom: '2.5rem' }}>
          Choisissez votre mode de consultation
        </p>

        <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '680px', width: '100%' }}>

          {/* Mode Hors-Ligne */}
          <div style={{ ...s.panel, flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <div style={{ fontSize: '1.6rem', textAlign: 'center', color: C.purple }}>☽</div>
            <div style={{ color: C.purple, fontSize: '1.2rem', letterSpacing: '0.05em', textAlign: 'center' }}>Mode Hors-Ligne</div>
            <p style={{ color: C.muted, fontSize: '0.83rem', lineHeight: 1.65, margin: 0 }}>
              Le tirage se fait ici. Un texte complet et détaillé — avec les cartes, leurs positions,
              leurs significations et la question du consultant — est généré et prêt à être copié.
              Collez-le ensuite dans <strong style={{ color: C.text }}>Claude.ai</strong> ou toute autre IA pour obtenir votre lecture.
            </p>
            <div style={{ color: C.dim, fontSize: '0.76rem', lineHeight: 1.8, borderTop: `1px solid ${C.border}`, paddingTop: '0.6rem' }}>
              ✓ Aucune clé API requise<br />
              ✓ Texte complet avec significations<br />
              ✓ Fonctionne avec n'importe quelle IA
            </div>
            <button style={{ ...s.btn, border: `1px solid ${C.purple}`, color: C.purple, textAlign: 'center' }}
              onClick={() => handleChooseMode('offline')}>
              Commencer →
            </button>
          </div>

          {/* Mode IA */}
          <div style={{ ...s.panel, flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: '0.9rem', borderColor: C.gold }}>
            <div style={{ fontSize: '1.6rem', textAlign: 'center', color: C.gold }}>✦</div>
            <div style={{ color: C.gold, fontSize: '1.2rem', letterSpacing: '0.05em', textAlign: 'center' }}>Mode IA Intégré</div>
            <p style={{ color: C.muted, fontSize: '0.83rem', lineHeight: 1.65, margin: 0 }}>
              L'intelligence artificielle analyse votre tirage <strong style={{ color: C.text }}>directement dans l'application</strong>.
              La lecture est générée en temps réel, carte par carte, avec une synthèse finale répondant à votre question.
            </p>
            <div style={{ color: C.dim, fontSize: '0.76rem', lineHeight: 1.8, borderTop: `1px solid ${C.border}`, paddingTop: '0.6rem' }}>
              ✓ Lecture instantanée dans l'app<br />
              ✓ Analyse croisée des 3 jeux<br />
              ✓ Nécessite une clé API Claude
            </div>
            <button style={{ ...s.btnGold, textAlign: 'center' }} onClick={() => handleChooseMode('ai')}>
              Commencer →
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Écran 2 : Choix du type de tirage
  // ─────────────────────────────────────────────────────────────────────────────
  if (screen === 'spread-type') {
    return (
      <div style={{ ...s.app, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '2.5rem' }}>
        <button onClick={() => setScreen('menu')}
          style={{ background: 'none', border: 'none', color: C.purple, cursor: 'pointer', fontSize: '0.82rem', marginBottom: '1.5rem', padding: 0, alignSelf: 'flex-start' }}>
          ← Retour
        </button>

        <div style={{ color: C.dim, fontSize: '0.75rem', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
          {mode === 'offline' ? 'MODE HORS-LIGNE' : 'MODE IA INTÉGRÉ'}
        </div>
        <h2 style={{ color: C.gold, fontSize: '1.3rem', letterSpacing: '0.06em', margin: '0 0 2rem', textAlign: 'center' }}>
          Choisissez votre type de tirage
        </h2>

        <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '680px', width: '100%' }}>

          {/* Type B — Rapide */}
          <div style={{ ...s.panel, flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ color: C.purple, fontSize: '1.1rem', letterSpacing: '0.04em' }}>Tirage Rapide</div>
              <span style={{ background: '#1a0e30', border: `1px solid ${C.purple}`, borderRadius: '4px', padding: '0.1rem 0.5rem', fontSize: '0.65rem', color: C.purple }}>TYPE B</span>
            </div>
            <p style={{ color: C.muted, fontSize: '0.83rem', lineHeight: 1.65, margin: 0 }}>
              Pour une question simple qui demande une réponse directe et rapide.
              Peu de développement requis — l'essentiel, clairement posé.
            </p>
            <div style={{ color: C.dim, fontSize: '0.76rem', lineHeight: 2, borderTop: `1px solid ${C.border}`, paddingTop: '0.6rem' }}>
              3 cartes de Tarot<br />
              2 cartes de l'Oracle de Belline<br />
              1 carte du Lenormand
            </div>
            <button style={{ ...s.btn, border: `1px solid ${C.purple}`, color: C.purple }} onClick={() => handleChooseType('B')}>
              Choisir ce tirage →
            </button>
          </div>

          {/* Type A — Développé */}
          <div style={{ ...s.panel, flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: '0.9rem', borderColor: C.gold }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ color: C.gold, fontSize: '1.1rem', letterSpacing: '0.04em' }}>Tirage Développé</div>
              <span style={{ background: '#1e1035', border: `1px solid ${C.gold}`, borderRadius: '4px', padding: '0.1rem 0.5rem', fontSize: '0.65rem', color: C.gold }}>TYPE A</span>
            </div>
            <p style={{ color: C.muted, fontSize: '0.83rem', lineHeight: 1.65, margin: 0 }}>
              Pour les questions importantes qui méritent une lecture complète et nuancée.
              Combine les 3 jeux en profondeur pour une réponse développée.
            </p>
            <div style={{ color: C.dim, fontSize: '0.76rem', lineHeight: 2, borderTop: `1px solid ${C.border}`, paddingTop: '0.6rem' }}>
              9 cartes de Tarot<br />
              4 cartes de l'Oracle de Belline<br />
              3 cartes du Lenormand
            </div>
            <button style={{ ...s.btnGold }} onClick={() => handleChooseType('A')}>
              Choisir ce tirage →
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Écran 3 : Question
  // ─────────────────────────────────────────────────────────────────────────────
  if (screen === 'question') {
    const canDraw = question.trim() && (mode === 'offline' || (mode === 'ai' && apiKey))
    return (
      <div style={{ ...s.app, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ width: '100%', maxWidth: '500px' }}>
          <button onClick={() => setScreen('spread-type')}
            style={{ background: 'none', border: 'none', color: C.purple, cursor: 'pointer', fontSize: '0.82rem', marginBottom: '1.5rem', padding: 0 }}>
            ← Retour
          </button>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ background: '#1e1035', border: `1px solid ${C.border}`, borderRadius: '4px', padding: '0.15rem 0.6rem', fontSize: '0.68rem', color: mode === 'ai' ? C.gold : C.purple }}>
              {mode === 'offline' ? 'Hors-Ligne' : 'Mode IA'}
            </span>
            <span style={{ background: '#1e1035', border: `1px solid ${C.border}`, borderRadius: '4px', padding: '0.15rem 0.6rem', fontSize: '0.68rem', color: spreadType === 'A' ? C.gold : C.purple }}>
              {spreadType === 'A' ? 'Tirage Développé (A)' : 'Tirage Rapide (B)'}
            </span>
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

  // ─────────────────────────────────────────────────────────────────────────────
  // Écran 4 : Tirage
  // ─────────────────────────────────────────────────────────────────────────────
  const broles = spread?.type === 'A' ? BROLES_A : BROLES_B

  return (
    <div style={s.app}>
      <CardModal
        card={modal?.card}
        posLabel={modal?.posLabel}
        posDesc={modal?.posDesc}
        drawOrder={modal?.drawOrder}
        rev={modal?.rev}
        onClose={() => setModal(null)}
      />

      {/* En-tête */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div style={{ fontSize: '1.1rem', color: C.gold, letterSpacing: '0.08em' }}>✦ Divinatory</div>
          <div style={{ fontSize: '0.65rem', color: C.purple, letterSpacing: '0.06em', marginTop: '0.1rem' }}>
            {spread?.type === 'A' ? 'DÉVELOPPÉ · TYPE A' : 'RAPIDE · TYPE B'}
            <span style={{ color: C.dim }}> · </span>
            {mode === 'offline' ? 'HORS-LIGNE' : 'MODE IA'}
          </div>
        </div>
        <button onClick={handleReset} style={{ ...s.btn, fontSize: '0.8rem', padding: '0.35rem 0.9rem' }}>↩ Nouveau</button>
      </div>

      {/* Question */}
      <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: '7px', padding: '0.6rem 1rem', marginBottom: '1rem' }}>
        <span style={{ color: C.purple, fontSize: '0.68rem', letterSpacing: '0.05em' }}>QUESTION  </span>
        <span style={{ color: C.text, fontSize: '0.88rem' }}>« {question} »</span>
      </div>

      {/* Légende */}
      <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '0.8rem', fontSize: '0.65rem', color: C.dim }}>
        <span>Tarot — <span style={{ color: C.muted }}>clic pour signification</span></span>
        <span>Belline — <span style={{ color: C.gold }}>sous la carte associée</span></span>
        <span>Lenormand — <span style={{ color: C.purple }}>rangée du bas</span></span>
        <span>↓ = renversée</span>
      </div>

      {spread && <SpreadView spread={spread} onCardClick={setModal} />}

      {/* ── Mode Hors-Ligne ─────────────────────────────────────────────── */}
      {mode === 'offline' && spread && (
        <div style={{ maxWidth: '700px', margin: '1.8rem auto 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <div>
              <div style={{ color: C.muted, fontSize: '0.72rem', letterSpacing: '0.06em' }}>TEXTE COMPLET À COPIER</div>
              <div style={{ color: C.dim, fontSize: '0.65rem', marginTop: '0.1rem' }}>Coller dans Claude.ai ou toute autre IA</div>
            </div>
            <button onClick={handleCopy}
              style={{ ...s.btn, padding: '0.3rem 0.8rem', fontSize: '0.78rem',
                background: copyDone ? '#1a4020' : C.acc,
                borderColor: copyDone ? '#4a9060' : C.purple,
                color: copyDone ? '#8ad0a0' : C.text }}>
              {copyDone ? '✓ Copié !' : 'Copier le texte'}
            </button>
          </div>
          <textarea
            readOnly
            value={buildCopyText(spread.type, question, spread)}
            rows={28}
            style={{ ...s.input, fontFamily: 'monospace', fontSize: '0.71rem', lineHeight: 1.55, color: C.muted, resize: 'vertical', cursor: 'text' }}
          />
        </div>
      )}

      {/* ── Mode IA ─────────────────────────────────────────────────────── */}
      {mode === 'ai' && spread && (
        <div style={{ maxWidth: '700px', margin: '1.8rem auto 0' }}>
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
                        <span style={{ color: C.dim, minWidth: '1.5rem', flexShrink: 0 }}>T{i + 1}</span>
                        <span style={{ color: C.muted, minWidth: '100px', flexShrink: 0, fontSize: '0.7rem', paddingTop: '0.05rem' }}>{spread.tarot[i]?.pos}</span>
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
                        <span style={{ color: C.purple, minWidth: '1.5rem', flexShrink: 0 }}>{broles[i]?.sym})</span>
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
                        <span style={{ color: C.dim, minWidth: '1.5rem', flexShrink: 0 }}>L{i + 1}</span>
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

      <div style={{ textAlign: 'center', marginTop: '2.5rem', paddingBottom: '1.5rem' }}>
        <button onClick={handleReset} style={{ ...s.btn, padding: '0.55rem 1.6rem' }}>↩ Nouvelle consultation</button>
      </div>
    </div>
  )
}
