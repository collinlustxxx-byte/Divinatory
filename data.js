// Données des cartes (placeholder)
const cartes = {
  tarot: [
    { id: 1, nom: 'Le Bateleur', image: 'tarot/01.png' },
    { id: 2, nom: 'La Papesse', image: 'tarot/02.png' },
    { id: 3, nom: 'L\'Impératrice', image: 'tarot/03.png' },
    { id: 4, nom: 'L\'Empereur', image: 'tarot/04.png' },
    { id: 5, nom: 'Le Pape', image: 'tarot/05.png' },
  ],
  lenormand: [
    { id: 1, nom: 'Le Cavalier', image: 'lenormand/01.png' },
    { id: 2, nom: 'Le Trèfle', image: 'lenormand/02.png' },
    { id: 3, nom: 'Le Navire', image: 'lenormand/03.png' },
  ],
  belline: [
    { id: 1, nom: 'L\'Amour', image: 'belline/01.png' },
    { id: 2, nom: 'La Fortune', image: 'belline/02.png' },
    { id: 3, nom: 'La Sagesse', image: 'belline/03.png' },
  ]
};

// Fonction pour piocher une carte aléatoire
function pickRandomCard(deck) {
  return deck[Math.floor(Math.random() * deck.length)];
}

// Exporter les données
window.cartes = cartes;
window.pickRandomCard = pickRandomCard;