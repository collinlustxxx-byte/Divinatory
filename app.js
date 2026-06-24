// Données des cartes Tarot (placeholder en attente des vraies images)
const tarotCards = [
  { name: "The Fool", number: 0, suit: "Major" },
  { name: "The Magician", number: 1, suit: "Major" },
  { name: "The High Priestess", number: 2, suit: "Major" },
  { name: "The Empress", number: 3, suit: "Major" },
  { name: "The Emperor", number: 4, suit: "Major" },
  { name: "The Hierophant", number: 5, suit: "Major" },
  { name: "The Lovers", number: 6, suit: "Major" },
  { name: "The Chariot", number: 7, suit: "Major" },
  { name: "Strength", number: 8, suit: "Major" },
  { name: "The Hermit", number: 9, suit: "Major" },
  { name: "Wheel of Fortune", number: 10, suit: "Major" },
  { name: "Justice", number: 11, suit: "Major" },
  { name: "The Hanged Man", number: 12, suit: "Major" },
  { name: "Death", number: 13, suit: "Major" },
  { name: "Temperance", number: 14, suit: "Major" },
  { name: "The Devil", number: 15, suit: "Major" },
  { name: "The Tower", number: 16, suit: "Major" },
  { name: "The Star", number: 17, suit: "Major" },
  { name: "The Moon", number: 18, suit: "Major" },
  { name: "The Sun", number: 19, suit: "Major" },
  { name: "Judgement", number: 20, suit: "Major" },
  { name: "The World", number: 21, suit: "Major" },
  { name: "Ace of Cups", number: 1, suit: "Cups" },
  { name: "Two of Cups", number: 2, suit: "Cups" },
  { name: "Three of Cups", number: 3, suit: "Cups" },
  { name: "Four of Cups", number: 4, suit: "Cups" },
  { name: "Five of Cups", number: 5, suit: "Cups" },
  { name: "Six of Cups", number: 6, suit: "Cups" },
  { name: "Seven of Cups", number: 7, suit: "Cups" },
  { name: "Eight of Cups", number: 8, suit: "Cups" },
  { name: "Nine of Cups", number: 9, suit: "Cups" },
  { name: "Ten of Cups", number: 10, suit: "Cups" },
  { name: "Page of Cups", number: 11, suit: "Cups" },
  { name: "Knight of Cups", number: 12, suit: "Cups" },
  { name: "Queen of Cups", number: 13, suit: "Cups" },
  { name: "King of Cups", number: 14, suit: "Cups" },
  { name: "Ace of Wands", number: 1, suit: "Wands" },
  { name: "Two of Wands", number: 2, suit: "Wands" },
  { name: "Three of Wands", number: 3, suit: "Wands" },
  { name: "Four of Wands", number: 4, suit: "Wands" },
  { name: "Five of Wands", number: 5, suit: "Wands" },
  { name: "Six of Wands", number: 6, suit: "Wands" },
  { name: "Seven of Wands", number: 7, suit: "Wands" },
  { name: "Eight of Wands", number: 8, suit: "Wands" },
  { name: "Nine of Wands", number: 9, suit: "Wands" },
  { name: "Ten of Wands", number: 10, suit: "Wands" },
  { name: "Page of Wands", number: 11, suit: "Wands" },
  { name: "Knight of Wands", number: 12, suit: "Wands" },
  { name: "Queen of Wands", number: 13, suit: "Wands" },
  { name: "King of Wands", number: 14, suit: "Wands" },
  { name: "Ace of Swords", number: 1, suit: "Swords" },
  { name: "Two of Swords", number: 2, suit: "Swords" },
  { name: "Three of Swords", number: 3, suit: "Swords" },
  { name: "Four of Swords", number: 4, suit: "Swords" },
  { name: "Five of Swords", number: 5, suit: "Swords" },
  { name: "Six of Swords", number: 6, suit: "Swords" },
  { name: "Seven of Swords", number: 7, suit: "Swords" },
  { name: "Eight of Swords", number: 8, suit: "Swords" },
  { name: "Nine of Swords", number: 9, suit: "Swords" },
  { name: "Ten of Swords", number: 10, suit: "Swords" },
  { name: "Page of Swords", number: 11, suit: "Swords" },
  { name: "Knight of Swords", number: 12, suit: "Swords" },
  { name: "Queen of Swords", number: 13, suit: "Swords" },
  { name: "King of Swords", number: 14, suit: "Swords" },
  { name: "Ace of Pentacles", number: 1, suit: "Pentacles" },
  { name: "Two of Pentacles", number: 2, suit: "Pentacles" },
  { name: "Three of Pentacles", number: 3, suit: "Pentacles" },
  { name: "Four of Pentacles", number: 4, suit: "Pentacles" },
  { name: "Five of Pentacles", number: 5, suit: "Pentacles" },
  { name: "Six of Pentacles", number: 6, suit: "Pentacles" },
  { name: "Seven of Pentacles", number: 7, suit: "Pentacles" },
  { name: "Eight of Pentacles", number: 8, suit: "Pentacles" },
  { name: "Nine of Pentacles", number: 9, suit: "Pentacles" },
  { name: "Ten of Pentacles", number: 10, suit: "Pentacles" },
  { name: "Page of Pentacles", number: 11, suit: "Pentacles" },
  { name: "Knight of Pentacles", number: 12, suit: "Pentacles" },
  { name: "Queen of Pentacles", number: 13, suit: "Pentacles" },
  { name: "King of Pentacles", number: 14, suit: "Pentacles" }
];

// Variables globales
let drawnCards = [];
let currentCardIndex = 0;
let isAnimating = false;
let cardAnimationInterval = null;

// Démarrer la musique d'ambiance
function startAmbientMusic() {
  const audio = document.getElementById('ambient-music');
  if (audio) {
    audio.volume = 0.3; // Volume à 30%
    audio.play().catch(err => console.log('Audio non disponible:', err));
  }
}

// Arrêter la musique
function stopAmbientMusic() {
  const audio = document.getElementById('ambient-music');
  if (audio) {
    audio.pause();
  }
}

// Piocher une carte aléatoire
function drawRandomCard() {
  return tarotCards[Math.floor(Math.random() * tarotCards.length)];
}

// Initialiser le tirage
function initializeDraw(numberOfCards) {
  drawnCards = [];
  for (let i = 0; i < numberOfCards; i++) {
    drawnCards.push(drawRandomCard());
  }
  return drawnCards;
}

// Créer la grille de cartes avec animation de défilement
function createCardsGrid() {
  const grid = document.getElementById('cards-grid');
  grid.innerHTML = '';

  drawnCards.forEach((card, index) => {
    const cardElement = document.createElement('div');
    cardElement.className = 'card-placeholder';
    cardElement.textContent = '🂠'; // Emoji dos de carte
    cardElement.setAttribute('data-index', index);
    cardElement.onclick = () => revealCard(index);
    grid.appendChild(cardElement);
  });

  startCardFlipAnimation();
  startAmbientMusic();
}

// Animation de défilement des cartes
function startCardFlipAnimation() {
  const cards = document.querySelectorAll('.card-placeholder');
  let flipIndex = 0;

  cardAnimationInterval = setInterval(() => {
    // Réinitialiser toutes les cartes
    cards.forEach(card => {
      card.textContent = '🂠';
      card.style.opacity = '1';
    });

    // Animation rapide sur les cartes non révélées
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    randomCard.style.opacity = '0.5';
  }, 300);
}

// Révéler une carte au clic
function revealCard(index) {
  const card = drawnCards[index];
  const cardElement = document.querySelector(`[data-index="${index}"]`);

  if (cardElement.classList.contains('revealed')) {
    return; // Carte déjà révélée
  }

  // Animation de retournement
  cardElement.classList.add('card-flip');
  
  setTimeout(() => {
    cardElement.textContent = '✨';
    cardElement.classList.add('revealed');
    cardElement.style.pointerEvents = 'none';
    cardElement.style.opacity = '1';
    
    displayRevealedCard(card, index);
  }, 300);
}

// Afficher la carte révélée dans la section dédiée
function displayRevealedCard(card, position) {
  const revealedSection = document.getElementById('revealed-card');
  revealedSection.style.display = 'block';
  revealedSection.innerHTML = `
    <h3>${card.name}</h3>
    <p><strong>Position:</strong> ${position + 1}</p>
    <p><strong>Suit:</strong> ${card.suit}</p>
  `;
}

// Gérer le bouton de démarrage du tirage
document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-btn');
  
  startBtn.addEventListener('click', () => {
    // Nombre de cartes par défaut (16 pour Type A)
    const numberOfCards = 16;
    
    initializeDraw(numberOfCards);
    createCardsGrid();
    
    document.getElementById('cards-grid').style.display = 'grid';
    document.getElementById('revealed-card').style.display = 'none';
    startBtn.style.display = 'none';
  });
});
