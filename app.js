// Données des cartes Lenormand
const lenormandCards = [
  { num: 1, name: "Le Cavalier", file: "lenormand-01.png" },
  { num: 2, name: "Le Trèfle", file: "lenormand-02.png" },
  { num: 3, name: "La Navire", file: "lenormand-03.png" },
  { num: 4, name: "La Maison", file: "lenormand-04.png" },
  { num: 5, name: "L'Arbre", file: "lenormand-05.png" },
  { num: 6, name: "Les Nuages", file: "lenormand-06.png" },
  { num: 7, name: "Le Serpent", file: "lenormand-07.png" },
  { num: 8, name: "Le Cercueil", file: "lenormand-08.png" },
  { num: 9, name: "Le Bouquet", file: "lenormand-09.png" },
  { num: 10, name: "La Faux", file: "lenormand-10.png" },
  { num: 11, name: "Le Fouet", file: "lenormand-11.png" },
  { num: 12, name: "Les Oiseaux", file: "lenormand-12.png" },
  { num: 13, name: "L'Enfant", file: "lenormand-13.png" },
  { num: 14, name: "Le Vieillard", file: "lenormand-14.png" },
  { num: 15, name: "L'Ours", file: "lenormand-15.png" },
  { num: 16, name: "Les Étoiles", file: "lenormand-16.png" },
  { num: 17, name: "La Cigogne", file: "lenormand-17.png" },
  { num: 18, name: "Le Chien", file: "lenormand-18.png" },
  { num: 19, name: "La Tour", file: "lenormand-19.png" },
  { num: 20, name: "Le Parc", file: "lenormand-20.png" },
  { num: 21, name: "Le Chemin", file: "lenormand-21.png" },
  { num: 22, name: "La Souris", file: "lenormand-22.png" },
  { num: 23, name: "Le Cœur", file: "lenormand-23.png" },
  { num: 24, name: "L'Anneau", file: "lenormand-24.png" },
  { num: 25, name: "Le Livre", file: "lenormand-25.png" },
  { num: 26, name: "La Lettre", file: "lenormand-26.png" },
  { num: 27, name: "L'Homme", file: "lenormand-27.png" },
  { num: 28, name: "La Femme", file: "lenormand-28.png" },
  { num: 29, name: "Le Lis", file: "lenormand-29.png" },
  { num: 30, name: "Le Soleil", file: "lenormand-30.png" },
  { num: 31, name: "La Lune", file: "lenormand-31.png" },
  { num: 32, name: "La Clé", file: "lenormand-32.png" },
  { num: 33, name: "Le Poisson", file: "lenormand-33.png" },
  { num: 34, name: "L'Ancre", file: "lenormand-34.png" },
  { num: 35, name: "La Croix", file: "lenormand-35.png" },
  { num: 36, name: "L'Aigle", file: "lenormand-36.png" }
];

// Données des cartes Belline (53)
const bellineCards = [
  { num: 1, name: "L'Allié", file: "belline-01.png" },
  { num: 2, name: "L'Amant", file: "belline-02.png" },
  { num: 3, name: "L'Ami", file: "belline-03.png" },
  { num: 4, name: "L'Amitié", file: "belline-04.png" },
  { num: 5, name: "L'Amour", file: "belline-05.png" },
  { num: 6, name: "L'Ambition", file: "belline-06.png" },
  { num: 7, name: "L'Ange", file: "belline-07.png" },
  { num: 8, name: "L'Anneau", file: "belline-08.png" },
  { num: 9, name: "L'Apparence", file: "belline-09.png" },
  { num: 10, name: "L'Apprenti", file: "belline-10.png" },
  { num: 11, name: "L'Arbre", file: "belline-11.png" },
  { num: 12, name: "L'Archer", file: "belline-12.png" },
  { num: 13, name: "L'Armée", file: "belline-13.png" },
  { num: 14, name: "L'Arnaque", file: "belline-14.png" },
  { num: 15, name: "L'Art", file: "belline-15.png" },
  { num: 16, name: "L'Artisan", file: "belline-16.png" },
  { num: 17, name: "L'Ascension", file: "belline-17.png" },
  { num: 18, name: "L'Assaut", file: "belline-18.png" },
  { num: 19, name: "L'Assistance", file: "belline-19.png" },
  { num: 20, name: "L'Astre", file: "belline-20.png" },
  { num: 21, name: "L'Athée", file: "belline-21.png" },
  { num: 22, name: "L'Atlatl", file: "belline-22.png" },
  { num: 23, name: "L'Atoll", file: "belline-23.png" },
  { num: 24, name: "L'Atrophe", file: "belline-24.png" },
  { num: 25, name: "L'Attache", file: "belline-25.png" },
  { num: 26, name: "L'Attaque", file: "belline-26.png" },
  { num: 27, name: "L'Attente", file: "belline-27.png" },
  { num: 28, name: "L'Attention", file: "belline-28.png" },
  { num: 29, name: "L'Attestation", file: "belline-29.png" },
  { num: 30, name: "L'Attirer", file: "belline-30.png" },
  { num: 31, name: "L'Attitude", file: "belline-31.png" },
  { num: 32, name: "L'Attirance", file: "belline-32.png" },
  { num: 33, name: "L'Attirail", file: "belline-33.png" },
  { num: 34, name: "L'Attribut", file: "belline-34.png" },
  { num: 35, name: "L'Aubade", file: "belline-35.png" },
  { num: 36, name: "L'Aube", file: "belline-36.png" },
  { num: 37, name: "L'Aubépine", file: "belline-37.png" },
  { num: 38, name: "L'Auberge", file: "belline-38.png" },
  { num: 39, name: "L'Aubergiste", file: "belline-39.png" },
  { num: 40, name: "L'Aubin", file: "belline-40.png" },
  { num: 41, name: "L'Aucun", file: "belline-41.png" },
  { num: 42, name: "L'Audace", file: "belline-42.png" },
  { num: 43, name: "L'Audience", file: "belline-43.png" },
  { num: 44, name: "L'Audit", file: "belline-44.png" },
  { num: 45, name: "L'Auge", file: "belline-45.png" },
  { num: 46, name: "L'Augmentation", file: "belline-46.png" },
  { num: 47, name: "L'Augure", file: "belline-47.png" },
  { num: 48, name: "L'Aujourd'hui", file: "belline-48.png" },
  { num: 49, name: "L'Aumône", file: "belline-49.png" },
  { num: 50, name: "L'Aune", file: "belline-50.png" },
  { num: 51, name: "L'Aurore", file: "belline-51.png" },
  { num: 52, name: "L'Ausculte", file: "belline-52.png" },
  { num: 53, name: "L'Auspice", file: "belline-53.png" }
];

let currentDeck = 'lenormand';
let currentCards = lenormandCards;

const lenormandBtn = document.getElementById('lenormand-btn');
const bellineBtn = document.getElementById('belline-btn');
const drawBtn = document.getElementById('draw-btn');
const cardDisplay = document.getElementById('card-display');

// Sélectionner le jeu de cartes
lenormandBtn.addEventListener('click', () => {
  currentDeck = 'lenormand';
  currentCards = lenormandCards;
  lenormandBtn.classList.add('active');
  bellineBtn.classList.remove('active');
  cardDisplay.innerHTML = '';
});

bellineBtn.addEventListener('click', () => {
  currentDeck = 'belline';
  currentCards = bellineCards;
  bellineBtn.classList.add('active');
  lenormandBtn.classList.remove('active');
  cardDisplay.innerHTML = '';
});

// Fonction pour tirer une carte au hasard
function drawCard() {
  const randomIndex = Math.floor(Math.random() * currentCards.length);
  const card = currentCards[randomIndex];

  const imagePath = `/Divinatory/public/${currentDeck}/${card.file}`;

  const cardHTML = `
    <div class="card">
      <img src="${imagePath}" alt="${card.name}" />
      <div class="card-number">Carte #${card.num}</div>
      <div class="card-name">${card.name}</div>
      <div class="card-description">
        Une carte du jeu ${currentDeck === 'lenormand' ? 'Lenormand' : 'Belline'}
      </div>
    </div>
  `;

  cardDisplay.innerHTML = cardHTML;
}

drawBtn.addEventListener('click', drawCard);

console.log('Divinatory - App initialized');