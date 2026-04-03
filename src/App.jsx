import { useState } from 'react'
import { majorArcana } from './data/majorArcana'
import { batons, coupes } from './data/minorArcana_batons_coupes'
import { epees, deniers } from './data/minorArcana_epees_deniers'
import { oracleBelline } from './data/oracleBelline'
import { lenormand } from './data/lenormand'

const SUITS = [
  { nom: 'Bâtons', cartes: batons, couleur: '#c0782a' },
  { nom: 'Coupes', cartes: coupes, couleur: '#3a8fbf' },
  { nom: 'Épées', cartes: epees, couleur: '#8fbf3a' },
  { nom: 'Deniers', cartes: deniers, couleur: '#bfaf3a' },
]

// ─── Spread configuration ──────────────────────────────────────────────────

// 9 tarot positions : nom affiché + index Belline associé (null = pas de Belline)
const TPOS = [
  { pos: 'La Situation',      bi: null }, // T1
  { pos: "L'Obstacle",        bi: 0    }, // T2
  { pos: 'Ce qui Aide',       bi: null }, // T3
  { pos: 'La Réponse',        bi: 1    }, // T4
  { pos: 'Le Passé',          bi: null }, // T5
  { pos: 'Le Futur Immédiat', bi: null }, // T6
  { pos: "L'Évolution",       bi: 2    }, // T7
  { pos: 'Le Conseil',        bi: null }, // T8
  { pos: 'Carte du Dessous',  bi: 3    }, // T9 (centre)
]

// Rôle de chacune des 4 cartes Belline dans le tirage
const BROLES = [
  'Nature réelle du blocage',
  'Réponse saine, toxique ou illusoire ?',
  'Vécu karmique de la situation',
  'Intention profonde du tirage',
]

// Position [col, row] dans la grille 3×3 pour T1→T9
const GPOS = [[0,0],[1,0],[2,0],[0,1],[0,2],[2,2],[2,1],[1,2],[1,1]]

// ─── Tirage functions ──────────────────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Construit la grille de tirage à partir de cartes mélangées.
 * Retourne { grid: tableau 3×3, lenormandRow: [3 cartes] }
 * Chaque cellule : { tarot:{card,rev}, posName, belline:{card,role}|null }
 */
function buildGrid(tarotDrawn, bellineDrawn, lenormandDrawn) {
  const grid = Array.from({ length: 3 }, () => Array(3).fill(null))

  tarotDrawn.forEach((slot, i) => {
    const [col, row] = GPOS[i]
    const bi = TPOS[i].bi
    grid[row][col] = {
      tarot:   slot,
      posName: TPOS[i].pos,
      belline: bi !== null
        ? { card: bellineDrawn[bi].card, role: BROLES[bi] }
        : null,
    }
  })

  return { grid, lenormandRow: lenormandDrawn }
}

function drawSpread() {
  const allTarot = [...majorArcana, ...batons, ...coupes, ...epees, ...deniers]
  const tarotDrawn    = shuffle(allTarot).slice(0, 9).map(card => ({ card, rev: Math.random() < 0.3 }))
  const bellineDrawn  = shuffle(oracleBelline).slice(0, 4).map(card => ({ card }))
  const lenormandDrawn = shuffle(lenormand).slice(0, 3).map(card => ({ card }))
  return buildGrid(tarotDrawn, bellineDrawn, lenormandDrawn)
}

const styles = {
  app: {
    minHeight: '100vh',
    background: '#07040e',
    color: '#e8ddc8',
    fontFamily: 'Georgia, serif',
    padding: '2rem',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2.5rem',
  },
  title: {
    fontSize: '2.2rem',
    color: '#c9a84c',
    letterSpacing: '0.12em',
    marginBottom: '0.4rem',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#9a8a6a',
    letterSpacing: '0.08em',
  },
  section: {
    marginBottom: '2.5rem',
  },
  sectionTitle: {
    fontSize: '1.3rem',
    color: '#c9a84c',
    borderBottom: '1px solid #3a2060',
    paddingBottom: '0.5rem',
    marginBottom: '1rem',
    letterSpacing: '0.06em',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
    gap: '0.8rem',
  },
  card: {
    background: '#13092a',
    border: '1px solid #3a2060',
    borderRadius: '8px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.15s, border-color 0.15s',
  },
  cardImg: {
    width: '100%',
    aspectRatio: '2/3',
    objectFit: 'cover',
    display: 'block',
    background: '#1e1035',
  },
  cardName: {
    fontSize: '0.72rem',
    padding: '0.3rem 0.4rem',
    textAlign: 'center',
    color: '#e8ddc8',
    lineHeight: 1.3,
  },
  modal: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '1rem',
  },
  modalBox: {
    background: '#13092a',
    border: '1px solid #3a2060',
    borderRadius: '12px',
    maxWidth: '480px',
    width: '100%',
    maxHeight: '85vh',
    overflow: 'auto',
    padding: '1.5rem',
  },
  modalImg: {
    width: '140px',
    borderRadius: '6px',
    float: 'right',
    marginLeft: '1rem',
    marginBottom: '0.5rem',
  },
  modalTitle: {
    fontSize: '1.3rem',
    color: '#c9a84c',
    marginBottom: '0.3rem',
  },
  modalSub: {
    fontSize: '0.85rem',
    color: '#9a8a6a',
    marginBottom: '0.8rem',
  },
  kw: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.3rem',
    marginBottom: '0.8rem',
  },
  kwTag: {
    background: '#2a1060',
    border: '1px solid #5a3090',
    borderRadius: '4px',
    padding: '0.15rem 0.5rem',
    fontSize: '0.75rem',
    color: '#c9a84c',
  },
  para: {
    fontSize: '0.88rem',
    lineHeight: 1.6,
    color: '#e8ddc8',
    marginBottom: '0.6rem',
  },
  closeBtn: {
    marginTop: '1rem',
    padding: '0.5rem 1.2rem',
    background: '#3a2060',
    border: '1px solid #5a3090',
    borderRadius: '6px',
    color: '#e8ddc8',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  badge: {
    display: 'inline-block',
    background: '#1e1035',
    border: '1px solid #5a3090',
    borderRadius: '4px',
    padding: '0.1rem 0.4rem',
    fontSize: '0.75rem',
    color: '#9a8a6a',
    marginRight: '0.4rem',
  },
}

function CardModal({ card, onClose }) {
  if (!card) return null
  return (
    <div style={styles.modal} onClick={onClose}>
      <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
        {card.image && (
          <img src={card.image} alt={card.nom} style={styles.modalImg} loading="lazy" />
        )}
        <div style={styles.modalTitle}>{card.nom}</div>
        <div style={styles.modalSub}>
          {card.nomAnglais && <span style={styles.badge}>{card.nomAnglais}</span>}
          {card.element && <span style={styles.badge}>{card.element}</span>}
          {card.planete && <span style={styles.badge}>{card.planete}</span>}
        </div>
        {(card.motsClésEndroit ?? card.motsClés)?.length > 0 && (
          <div style={styles.kw}>
            {(card.motsClésEndroit ?? card.motsClés).map(k => (
              <span key={k} style={styles.kwTag}>{k}</span>
            ))}
          </div>
        )}
        {(card.significationEndroit ?? card.signification) && (
          <p style={styles.para}>{card.significationEndroit ?? card.signification}</p>
        )}
        {card.significationInversé && (
          <p style={{ ...styles.para, color: '#9a8a6a', borderTop: '1px solid #3a2060', paddingTop: '0.6rem' }}>
            <strong style={{ color: '#7a5a9a' }}>Inversée : </strong>
            {card.significationInversé}
          </p>
        )}
        <br style={{ clear: 'both' }} />
        <button style={styles.closeBtn} onClick={onClose}>Fermer</button>
      </div>
    </div>
  )
}

function CardGrid({ cartes }) {
  const [selected, setSelected] = useState(null)
  return (
    <>
      <div style={styles.grid}>
        {cartes.map(card => (
          <div
            key={card.id ?? card.numero}
            style={styles.card}
            onClick={() => setSelected(card)}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.04)'
              e.currentTarget.style.borderColor = '#c9a84c'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = ''
              e.currentTarget.style.borderColor = '#3a2060'
            }}
          >
            {card.image
              ? <img src={card.image} alt={card.nom} style={styles.cardImg} loading="lazy" />
              : <div style={{ ...styles.cardImg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', color: '#3a2060' }}>✦</div>
            }
            <div style={styles.cardName}>{card.nom}</div>
          </div>
        ))}
      </div>
      <CardModal card={selected} onClose={() => setSelected(null)} />
    </>
  )
}

// ─── SpreadGrid component ──────────────────────────────────────────────────

function SpreadGrid({ spread }) {
  const [modal, setModal] = useState(null)

  return (
    <>
      {/* Grille tarot 3×3 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem', maxWidth: '700px', margin: '0 auto' }}>
        {spread.grid.flat().map((cell, i) => {
          if (!cell) return <div key={i} />
          const { tarot, posName, belline } = cell
          return (
            <div key={i} style={{ background: '#13092a', border: '1px solid #3a2060', borderRadius: '8px', overflow: 'hidden' }}>
              {/* Position label */}
              <div style={{ fontSize: '0.65rem', color: '#9a8a6a', textAlign: 'center', padding: '0.25rem 0.3rem 0', letterSpacing: '0.04em' }}>
                {posName}
              </div>
              {/* Tarot card */}
              <div
                onClick={() => setModal(tarot.card)}
                style={{ cursor: 'pointer', padding: '0.3rem' }}
              >
                {tarot.card.image
                  ? <img
                      src={tarot.card.image}
                      alt={tarot.card.nom}
                      loading="lazy"
                      style={{
                        width: '100%',
                        aspectRatio: '2/3',
                        objectFit: 'cover',
                        borderRadius: '4px',
                        display: 'block',
                        transform: tarot.rev ? 'rotate(180deg)' : 'none',
                        opacity: tarot.rev ? 0.8 : 1,
                      }}
                    />
                  : <div style={{ width: '100%', aspectRatio: '2/3', background: '#1e1035', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3a2060', fontSize: '1.5rem' }}>✦</div>
                }
                <div style={{ fontSize: '0.68rem', color: tarot.rev ? '#9a6a6a' : '#e8ddc8', textAlign: 'center', padding: '0.2rem 0', lineHeight: 1.2 }}>
                  {tarot.card.nom}{tarot.rev ? ' ↓' : ''}
                </div>
              </div>
              {/* Belline card (si présente) */}
              {belline && (
                <div
                  onClick={() => setModal(belline.card)}
                  style={{ borderTop: '1px solid #3a2060', padding: '0.3rem', cursor: 'pointer', background: '#0f0620' }}
                >
                  <div style={{ fontSize: '0.58rem', color: '#7a5a9a', textAlign: 'center', marginBottom: '0.15rem' }}>{belline.role}</div>
                  <div style={{ fontSize: '0.7rem', color: '#c9a84c', textAlign: 'center' }}>{belline.card.nom}</div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Lenormand row */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', marginTop: '1.2rem' }}>
        {spread.lenormandRow.map(({ card }, i) => (
          <div
            key={i}
            onClick={() => setModal(card)}
            style={{ background: '#13092a', border: '1px solid #2a1060', borderRadius: '8px', padding: '0.4rem', width: '120px', cursor: 'pointer', textAlign: 'center' }}
          >
            <div style={{ fontSize: '0.6rem', color: '#7a5a9a', marginBottom: '0.2rem' }}>Lenormand {i + 1}</div>
            <div style={{ fontSize: '0.8rem', color: '#c9a84c' }}>{card.nom}</div>
            <div style={{ fontSize: '0.65rem', color: '#9a8a6a', marginTop: '0.2rem' }}>{card.motsClés?.slice(0, 2).join(' · ')}</div>
          </div>
        ))}
      </div>

      <CardModal card={modal} onClose={() => setModal(null)} />
    </>
  )
}

// ─── App ───────────────────────────────────────────────────────────────────

export default function App() {
  const [step, setStep]         = useState('question') // 'question' | 'spread'
  const [question, setQuestion] = useState('')
  const [spread, setSpread]     = useState(null)
  const [catalogTab, setCatalogTab] = useState(null)   // null = caché
  const [apiKey, setApiKey]     = useState(() => localStorage.getItem('divinatory_api_key') || '')
  const [showApiInput, setShowApiInput] = useState(false)

  function handleApiKeyChange(val) {
    setApiKey(val)
    localStorage.setItem('divinatory_api_key', val)
  }

  const catalogTabs = [
    { id: 'majeurs',   label: `Majeurs (${majorArcana.length})` },
    ...SUITS.map(s => ({ id: s.nom, label: `${s.nom} (${s.cartes.length})` })),
    { id: 'belline',   label: `Belline (${oracleBelline.length})` },
    { id: 'lenormand', label: `Lenormand (${lenormand.length})` },
  ]

  const catalogCards = catalogTab === 'majeurs'
    ? majorArcana
    : catalogTab === 'belline'
    ? oracleBelline
    : catalogTab === 'lenormand'
    ? lenormand
    : SUITS.find(s => s.nom === catalogTab)?.cartes ?? []

  function handleDraw() {
    if (!question.trim()) return
    setSpread(drawSpread())
    setStep('spread')
    setCatalogTab(null)
  }

  const [synthesis, setSynthesis] = useState(null)
  // null = pas demandé | {loading:true} | {data:{...}} | {error:'...'}

  function handleReset() {
    setStep('question')
    setQuestion('')
    setSpread(null)
    setCatalogTab(null)
    setSynthesis(null)
  }

  async function fetchSynthesis() {
    setSynthesis({ loading: true })
    try {
      const cells = GPOS.map(([col, row]) => spread.grid[row][col])

      const tL = cells.map((cell, i) =>
        `T${i + 1} – ${TPOS[i].pos}: ${cell.tarot.card.nom}${cell.tarot.rev ? ' (renversée)' : ''}`
      ).join('\n')

      const bL = BROLES.map((role, i) => {
        const cell = cells.find(c => c.belline?.role === role)
        return cell ? `B${i + 1} – ${role}: ${cell.belline.card.nom}` : ''
      }).filter(Boolean).join('\n')

      const lL = spread.lenormandRow.map(({ card }, i) =>
        `L${i + 1}: ${card.nom} (${card.motsClés?.slice(0, 2).join(', ')})`
      ).join('\n')

      const prompt = `QUESTION: "${question}"

TAROT (9 positions):
${tL}

BELLINE (4 cartes de profondeur):
${bL}

LENORMAND (contexte):
${lL}

Méthode: Tarot (sens profond) → Belline (sous les masques) → Lenormand (réalité concrète). Convergence = vérité. Divergence = tension à nommer.

Réponds uniquement en JSON valide sans backticks ni markdown:
{"t":["T1: 2 phrases précises liées à la carte ET à la question","T2:...","T3:...","T4:...","T5:...","T6:...","T7:...","T8:...","T9:..."],"b":["B1: rôle et sens","B2:...","B3:...","B4:..."],"l":["L1:...","L2:...","L3:..."],"vd":"accord|contradiction|tension","vs":"1 phrase sur la convergence ou divergence des 3 systèmes","sy":"synthèse globale 3-4 phrases répondant directement à la question"}`

      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 2000,
          messages: [{ role: 'user', content: prompt }],
        }),
      })

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}))
        throw new Error(err.error?.message || `Erreur API ${resp.status}`)
      }

      const data = await resp.json()
      const parsed = JSON.parse(data.content[0].text)
      setSynthesis({ data: parsed })
    } catch (e) {
      setSynthesis({ error: e.message })
    }
  }

  // ── Écran Question ────────────────────────────────────────────────────────
  if (step === 'question') {
    return (
      <div style={{ ...styles.app, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={styles.title}>✦ Divinatory ✦</h1>
          <p style={styles.subtitle}>L'Art du Tirage — Tarot · Belline · Lenormand</p>
        </header>

        <div style={{ width: '100%', maxWidth: '540px' }}>
          <label style={{ display: 'block', color: '#9a8a6a', fontSize: '0.85rem', marginBottom: '0.6rem', letterSpacing: '0.06em' }}>
            Formulez votre question
          </label>
          <textarea
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleDraw())}
            placeholder="Quelle guidance cherchez-vous ?"
            rows={4}
            style={{
              width: '100%',
              background: '#13092a',
              border: '1px solid #3a2060',
              borderRadius: '8px',
              color: '#e8ddc8',
              fontFamily: 'Georgia, serif',
              fontSize: '1rem',
              padding: '0.8rem 1rem',
              resize: 'vertical',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <button
            onClick={handleDraw}
            disabled={!question.trim()}
            style={{
              marginTop: '1rem',
              width: '100%',
              padding: '0.85rem',
              background: question.trim() ? '#3a2060' : '#1a1030',
              border: `1px solid ${question.trim() ? '#c9a84c' : '#3a2060'}`,
              borderRadius: '8px',
              color: question.trim() ? '#c9a84c' : '#4a3060',
              cursor: question.trim() ? 'pointer' : 'default',
              fontSize: '1.05rem',
              letterSpacing: '0.08em',
              transition: 'all 0.2s',
            }}
          >
            Révéler le tirage
          </button>

          {/* Clé API — optionnelle, sauvegardée en localStorage */}
          <div style={{ marginTop: '1.2rem', textAlign: 'right' }}>
            <button
              onClick={() => setShowApiInput(v => !v)}
              style={{ background: 'none', border: 'none', color: apiKey ? '#7a5a9a' : '#4a3060', cursor: 'pointer', fontSize: '0.78rem', letterSpacing: '0.04em' }}
            >
              {apiKey ? '⚙ Clé API configurée' : '⚙ Ajouter une clé API Claude'}
            </button>
            {showApiInput && (
              <div style={{ marginTop: '0.5rem' }}>
                <input
                  type="password"
                  value={apiKey}
                  onChange={e => handleApiKeyChange(e.target.value)}
                  placeholder="sk-ant-api03-..."
                  style={{
                    width: '100%',
                    background: '#0f0620',
                    border: '1px solid #3a2060',
                    borderRadius: '6px',
                    color: '#c9a84c',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    padding: '0.5rem 0.8rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <div style={{ color: '#4a3060', fontSize: '0.7rem', marginTop: '0.3rem' }}>
                  Stockée uniquement dans votre navigateur (localStorage). Sans clé : lecture symbolique automatique.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Accès au catalogue */}
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <div style={{ color: '#3a2060', fontSize: '0.75rem', marginBottom: '0.5rem' }}>— Parcourir les decks —</div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {catalogTabs.map(t => (
              <button key={t.id} onClick={() => setCatalogTab(catalogTab === t.id ? null : t.id)}
                style={{ padding: '0.3rem 0.7rem', background: catalogTab === t.id ? '#3a2060' : '#13092a', border: `1px solid ${catalogTab === t.id ? '#c9a84c' : '#3a2060'}`, borderRadius: '5px', color: catalogTab === t.id ? '#c9a84c' : '#9a8a6a', cursor: 'pointer', fontSize: '0.78rem' }}>
                {t.label}
              </button>
            ))}
          </div>
          {catalogTab && (
            <div style={{ marginTop: '1.2rem', maxWidth: '900px', width: '100%' }}>
              <CardGrid cartes={catalogCards} />
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Écran Tirage ──────────────────────────────────────────────────────────
  return (
    <div style={styles.app}>
      {/* En-tête */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h1 style={{ ...styles.title, fontSize: '1.4rem', margin: 0 }}>✦ Divinatory</h1>
        </div>
        <button onClick={handleReset}
          style={{ padding: '0.4rem 1rem', background: '#13092a', border: '1px solid #3a2060', borderRadius: '6px', color: '#9a8a6a', cursor: 'pointer', fontSize: '0.85rem' }}>
          ↩ Nouveau tirage
        </button>
      </header>

      {/* Question */}
      <div style={{ background: '#13092a', border: '1px solid #3a2060', borderRadius: '8px', padding: '0.8rem 1.2rem', marginBottom: '1.5rem' }}>
        <span style={{ color: '#7a5a9a', fontSize: '0.75rem', letterSpacing: '0.06em' }}>QUESTION </span>
        <span style={{ color: '#e8ddc8', fontSize: '0.95rem' }}>{question}</span>
      </div>

      {/* Légende */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem', fontSize: '0.72rem', color: '#9a8a6a' }}>
        <span>■ <span style={{ color: '#e8ddc8' }}>Tarot</span> — clic pour détails</span>
        <span>■ <span style={{ color: '#c9a84c' }}>Belline</span> — lecture en profondeur</span>
        <span>■ <span style={{ color: '#7a5a9a' }}>Lenormand</span> — contexte quotidien</span>
        <span>↓ = carte renversée</span>
      </div>

      {/* Grille */}
      {spread && <SpreadGrid spread={spread} />}

      {/* Synthèse IA */}
      <div style={{ maxWidth: '700px', margin: '2rem auto 0' }}>
        <div style={{ color: '#7a5a9a', fontSize: '0.8rem', letterSpacing: '0.08em', marginBottom: '0.8rem', textAlign: 'center' }}>— SYNTHÈSE IA —</div>

        {/* Pas encore demandé */}
        {!synthesis && (
          <div style={{ textAlign: 'center' }}>
            {apiKey ? (
              <button onClick={fetchSynthesis}
                style={{ padding: '0.7rem 2rem', background: '#2a1060', border: '1px solid #7a5a9a', borderRadius: '8px', color: '#c9a84c', cursor: 'pointer', fontSize: '0.95rem', letterSpacing: '0.06em' }}>
                Obtenir la lecture par Claude
              </button>
            ) : (
              <div style={{ color: '#4a3060', fontSize: '0.85rem', padding: '1rem', border: '1px dashed #3a2060', borderRadius: '8px' }}>
                Ajoutez une clé API Claude (sur l'écran précédent) pour obtenir la lecture interprétée.
              </div>
            )}
          </div>
        )}

        {/* Chargement */}
        {synthesis?.loading && (
          <div style={{ textAlign: 'center', color: '#7a5a9a', padding: '1.5rem', border: '1px solid #3a2060', borderRadius: '8px', fontSize: '0.9rem' }}>
            Lecture en cours…
          </div>
        )}

        {/* Erreur */}
        {synthesis?.error && (
          <div style={{ padding: '1rem', background: '#1a0820', border: '1px solid #6a2040', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ color: '#c06080', fontSize: '0.85rem', marginBottom: '0.6rem' }}>{synthesis.error}</div>
            <button onClick={fetchSynthesis}
              style={{ padding: '0.4rem 1rem', background: '#3a2060', border: '1px solid #5a3090', borderRadius: '6px', color: '#e8ddc8', cursor: 'pointer', fontSize: '0.8rem' }}>
              Réessayer
            </button>
          </div>
        )}

        {/* Résultats */}
        {synthesis?.data && (() => {
          const d = synthesis.data
          const cells = GPOS.map(([col, row]) => spread.grid[row][col])
          return (
            <div>
              {/* Synthèse globale */}
              <div style={{ background: '#1a0e30', border: '1px solid #5a3090', borderRadius: '8px', padding: '1rem 1.2rem', marginBottom: '1.2rem' }}>
                <div style={{ color: '#c9a84c', fontSize: '0.75rem', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>SYNTHÈSE GLOBALE</div>
                <p style={{ color: '#e8ddc8', fontSize: '0.92rem', lineHeight: 1.65, margin: 0 }}>{d.sy}</p>
                {d.vs && <p style={{ color: '#9a8a6a', fontSize: '0.8rem', marginTop: '0.6rem', marginBottom: 0, fontStyle: 'italic' }}>{d.vs}</p>}
              </div>

              {/* Tarot — 9 positions */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ color: '#9a8a6a', fontSize: '0.75rem', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>TAROT</div>
                {d.t?.map((txt, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.4rem', fontSize: '0.84rem' }}>
                    <span style={{ color: '#5a3090', minWidth: '2rem', flexShrink: 0 }}>T{i + 1}</span>
                    <span style={{ color: '#7a5a9a', minWidth: '110px', flexShrink: 0, fontSize: '0.78rem' }}>{cells[i]?.posName}</span>
                    <span style={{ color: '#e8ddc8', lineHeight: 1.5 }}>{txt}</span>
                  </div>
                ))}
              </div>

              {/* Belline — 4 cartes */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ color: '#9a8a6a', fontSize: '0.75rem', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>BELLINE</div>
                {d.b?.map((txt, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.4rem', fontSize: '0.84rem' }}>
                    <span style={{ color: '#5a3090', minWidth: '2rem', flexShrink: 0 }}>B{i + 1}</span>
                    <span style={{ color: '#c9a84c', lineHeight: 1.5 }}>{txt}</span>
                  </div>
                ))}
              </div>

              {/* Lenormand */}
              <div>
                <div style={{ color: '#9a8a6a', fontSize: '0.75rem', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>LENORMAND</div>
                {d.l?.map((txt, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.4rem', fontSize: '0.84rem' }}>
                    <span style={{ color: '#5a3090', minWidth: '2rem', flexShrink: 0 }}>L{i + 1}</span>
                    <span style={{ color: '#e8ddc8', lineHeight: 1.5 }}>{txt}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })()}
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button onClick={handleReset}
          style={{ padding: '0.6rem 1.8rem', background: '#3a2060', border: '1px solid #5a3090', borderRadius: '7px', color: '#e8ddc8', cursor: 'pointer', fontSize: '0.9rem' }}>
          ↩ Nouvelle question
        </button>
      </div>
    </div>
  )
}
