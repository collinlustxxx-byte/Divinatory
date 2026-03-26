import { useState } from 'react'
import { majorArcana } from './data/majorArcana'
import { batons, coupes } from './data/minorArcana_batons_coupes'
import { epees, deniers } from './data/minorArcana_epees_deniers'

const SUITS = [
  { nom: 'Bâtons', cartes: batons, couleur: '#c0782a' },
  { nom: 'Coupes', cartes: coupes, couleur: '#3a8fbf' },
  { nom: 'Épées', cartes: epees, couleur: '#8fbf3a' },
  { nom: 'Deniers', cartes: deniers, couleur: '#bfaf3a' },
]

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
        {card.motsClésEndroit?.length > 0 && (
          <div style={styles.kw}>
            {card.motsClésEndroit.map(k => (
              <span key={k} style={styles.kwTag}>{k}</span>
            ))}
          </div>
        )}
        {card.significationEndroit && (
          <p style={styles.para}>{card.significationEndroit}</p>
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

export default function App() {
  const [tab, setTab] = useState('majeurs')

  const tabs = [
    { id: 'majeurs', label: `Arcanes Majeurs (${majorArcana.length})` },
    ...SUITS.map(s => ({ id: s.nom, label: `${s.nom} (${s.cartes.length})` })),
  ]

  const currentCards = tab === 'majeurs'
    ? majorArcana
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
        <CardGrid cartes={currentCards} />
      </section>

      <footer style={{ textAlign: 'center', color: '#3a2060', fontSize: '0.75rem', marginTop: '3rem' }}>
        Clique sur une carte pour voir sa signification
      </footer>
    </div>
  )
}
