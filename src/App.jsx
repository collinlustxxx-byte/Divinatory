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
  const [tab, setTab] = useState('majeurs')
  const [spread, setSpread] = useState(null)

  const tabs = [
    { id: 'tirage',    label: '✦ Tirage' },
    { id: 'majeurs',   label: `Arcanes Majeurs (${majorArcana.length})` },
    ...SUITS.map(s => ({ id: s.nom, label: `${s.nom} (${s.cartes.length})` })),
    { id: 'belline',   label: `Belline (${oracleBelline.length}/53)` },
    { id: 'lenormand', label: `Lenormand (${lenormand.length}/36)` },
  ]

  const currentCards = tab === 'majeurs'
    ? majorArcana
    : tab === 'belline'
    ? oracleBelline
    : tab === 'lenormand'
    ? lenormand
    : SUITS.find(s => s.nom === tab)?.cartes ?? []

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1 style={styles.title}>✦ Divinatory ✦</h1>
        <p style={styles.subtitle}>L'Art du Tirage — prototype</p>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '0.4rem 0.9rem',
              background: tab === t.id ? '#3a2060' : '#13092a',
              border: `1px solid ${tab === t.id ? '#c9a84c' : '#3a2060'}`,
              borderRadius: '6px',
              color: tab === t.id ? '#c9a84c' : '#9a8a6a',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <section style={styles.section}>
        {tab === 'tirage' ? (
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => setSpread(drawSpread())}
              style={{ padding: '0.7rem 2rem', background: '#3a2060', border: '1px solid #c9a84c', borderRadius: '8px', color: '#c9a84c', cursor: 'pointer', fontSize: '1rem', letterSpacing: '0.06em', marginBottom: '1.5rem' }}
            >
              {spread ? 'Nouveau tirage' : 'Tirer les cartes'}
            </button>
            {spread && <SpreadGrid spread={spread} />}
          </div>
        ) : (
          <CardGrid cartes={currentCards} />
        )}
      </section>

      <footer style={{ textAlign: 'center', color: '#3a2060', fontSize: '0.75rem', marginTop: '3rem' }}>
        Clique sur une carte pour voir sa signification
      </footer>
    </div>
  )
}
