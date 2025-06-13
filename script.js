// Data strategi untuk 8 deck
const strategyData = {
    hard: {
        '8':  ['H','H','H','H','H','H','H','H','H','H'],
        '9':  ['H','D','D','D','D','H','H','H','H','H'],
        '10': ['D','D','D','D','D','D','D','D','H','H'],
        '11': ['D','D','D','D','D','D','D','D','D','D'],
        '12': ['H','H','S','S','S','H','H','H','H','H'],
        '13': ['S','S','S','S','S','H','H','H','H','H'],
        '14': ['S','S','S','S','S','H','H','H','H','H'],
        '15': ['S','S','S','S','S','H','H','H','H','H'],
        '16': ['S','S','S','S','S','H','H','H','H','H'],
        '17': ['S','S','S','S','S','S','S','S','S','S']
    },
    soft: {
        'A2': ['H','H','H','D','D','H','H','H','H','H'],
        'A3': ['H','H','H','D','D','H','H','H','H','H'],
        'A4': ['H','H','D','D','D','H','H','H','H','H'],
        'A5': ['H','H','D','D','D','H','H','H','H','H'],
        'A6': ['H','D','D','D','D','H','H','H','H','H'],
        'A7': ['S','Ds','Ds','Ds','Ds','S','S','H','H','H'],
        'A8': ['S','S','S','S','S','S','S','S','S','S'],
        'A9': ['S','S','S','S','S','S','S','S','S','S']
    },
    pairs: {
        '22': ['P','P','P','P','P','P','H','H','H','H'],
        '33': ['P','P','P','P','P','P','H','H','H','H'],
        '44': ['H','H','H','P','P','H','H','H','H','H'],
        '55': ['D','D','D','D','D','D','D','D','H','H'],
        '66': ['P','P','P','P','P','H','H','H','H','H'],
        '77': ['P','P','P','P','P','P','H','H','H','H'],
        '88': ['P','P','P','P','P','P','P','P','P','P'],
        '99': ['P','P','P','P','P','S','P','P','S','S'],
        'TT': ['S','S','S','S','S','S','S','S','S','S'],
        'AA': ['P','P','P','P','P','P','P','P','P','P']
    }
};

// Pemetaan nilai kartu
const cardValues = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, 
    '7': 7, '8': 8, '9': 9, '10': 10, 
    'J': 10, 'Q': 10, 'K': 10, 'A': 11
};

// Pemetaan dealer index
const dealerIndex = {
    '2': 0, '3': 1, '4': 2, '5': 3, '6': 4,
    '7': 5, '8': 6, '9': 7, '10': 8, 'A': 9
};

// Elemen DOM
const dealerCardsContainer = document.getElementById('dealer-cards');
const playerCardsContainer = document.getElementById('player-cards');
const dealerCardDisplay = document.getElementById('selected-dealer-card');
const playerCard1Display = document.getElementById('player-card-1');
const playerCard2Display = document.getElementById('player-card-2');
const adviceResult = document.getElementById('advice-result');
const specialAdvice = document.getElementById('special-advice');
const actionDetails = document.getElementById('action-details');
const getAdviceBtn = document.getElementById('get-advice-btn');
const resetBtn = document.getElementById('reset-btn');

// State aplikasi
let selectedDealerCard = null;
let selectedPlayerCards = [];

// Fungsi untuk membuat kartu
function createCardElement(value, isDealer = false) {
    const card = document.createElement('div');
    card.className = 'card-option';
    card.textContent = value;
    card.dataset.value = value;
    
    // Acak warna kartu (merah untuk hati/wajik, hitam untuk sekop/keriting)
    const isRed = Math.random() > 0.5;
    if (isRed) {
        card.classList.add('red');
    }
    
    // Tambahkan event listener
    card.addEventListener('click', () => {
        if (isDealer) {
            // Untuk kartu dealer
            document.querySelectorAll('#dealer-cards .card-option').forEach(c => {
                c.classList.remove('selected');
            });
            card.classList.add('selected');
            selectedDealerCard = value;
            dealerCardDisplay.textContent = value;
        } else {
            // Untuk kartu pemain - izinkan pemilihan ganda
            if (selectedPlayerCards.length < 2) {
                // Tambahkan kartu ke array
                selectedPlayerCards.push(value);
                
                // Update tampilan kartu pemain
                if (selectedPlayerCards.length === 1) {
                    playerCard1Display.textContent = value;
                    playerCard1Display.className = `player-card-display ${isRed ? 'red' : ''}`;
                } else if (selectedPlayerCards.length === 2) {
                    playerCard2Display.textContent = value;
                    playerCard2Display.className = `player-card-display ${isRed ? 'red' : ''}`;
                }
            }
        }
    });
    
    return card;
}

// Fungsi untuk menginisialisasi kartu
function initializeCards() {
    // Kartu dealer
    const dealerCards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A'];
    dealerCards.forEach(card => {
        dealerCardsContainer.appendChild(createCardElement(card, true));
    });
    
    // Kartu pemain
    const playerCards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    playerCards.forEach(card => {
        playerCardsContainer.appendChild(createCardElement(card));
    });
}

// Fungsi untuk mendapatkan saran strategi
function getStrategyAdvice() {
    if (!selectedDealerCard) {
        adviceResult.textContent = "Pilih kartu dealer";
        adviceResult.className = "advice";
        specialAdvice.textContent = "";
        actionDetails.textContent = "Silakan pilih kartu dealer yang terlihat";
        return;
    }
    
    if (selectedPlayerCards.length !== 2) {
        adviceResult.textContent = "Pilih 2 kartu";
        adviceResult.className = "advice";
        specialAdvice.textContent = "";
        actionDetails.textContent = "Silakan pilih dua kartu pertama Anda";
        return;
    }

    const card1 = selectedPlayerCards[0];
    const card2 = selectedPlayerCards[1];
    const dealerCard = selectedDealerCard;
    const dealerIdx = dealerIndex[dealerCard];
    
    // Cek apakah pair
    if (card1 === card2 || (cardValues[card1] === cardValues[card2] && card1 !== 'A')) {
        const pairKey = (card1 === '10' || card1 === 'J' || card1 === 'Q' || card1 === 'K') ? 'TT' : card1 + card2;
        if (strategyData.pairs[pairKey]) {
            const action = strategyData.pairs[pairKey][dealerIdx];
            displayAdvice(action, card1, card2, true);
            return;
        }
    }
    
    // Cek soft hand
    if (card1 === 'A' || card2 === 'A') {
        const nonAce = card1 === 'A' ? card2 : card1;
        const softKey = 'A' + (nonAce === '10' ? 'T' : nonAce);
        if (strategyData.soft[softKey]) {
            const action = strategyData.soft[softKey][dealerIdx];
            displayAdvice(action, card1, card2, false, true);
            return;
        }
    }
    
    // Hard hand
    const total = cardValues[card1] + cardValues[card2];
    let hardKey;
    
    if (total <= 8) hardKey = '8';
    else if (total >= 17) hardKey = '17';
    else hardKey = total.toString();
    
    if (strategyData.hard[hardKey]) {
        const action = strategyData.hard[hardKey][dealerIdx];
        displayAdvice(action, card1, card2);
    }
}

// Fungsi untuk menampilkan saran
function displayAdvice(action, card1, card2, isPair = false, isSoft = false) {
    let adviceText = "";
    let adviceClass = "";
    let specialText = "";
    let details = "";
    
    switch(action) {
        case 'H':
            adviceText = "HIT";
            adviceClass = "hit";
            specialText = "Ambil kartu tambahan";
            details = "Nilai kartu Anda masih rendah atau dealer memiliki kartu kuat. Ambil kartu tambahan untuk meningkatkan nilai tangan.";
            break;
        case 'S':
            adviceText = "STAND";
            adviceClass = "stand";
            specialText = "Pertahankan kartu saat ini";
            details = "Nilai kartu Anda sudah cukup tinggi. Berdiri dan biarkan dealer mengambil risiko.";
            break;
        case 'D':
            adviceText = "DOUBLE";
            adviceClass = "double";
            specialText = "Gandakan taruhan Anda";
            details = "Anda memiliki kartu awal yang kuat dan dealer menunjukkan kartu lemah. Gandakan taruhan untuk memaksimalkan keuntungan.";
            break;
        case 'Ds':
            adviceText = "DOUBLE";
            adviceClass = "double";
            specialText = "Gandakan jika diizinkan, jika tidak STAND";
            details = "Jika aturan mengizinkan, gandakan taruhan. Jika tidak, pertahankan kartu saat ini.";
            break;
        case 'P':
            adviceText = "SPLIT";
            adviceClass = "split";
            specialText = "Pisahkan kartu menjadi dua tangan";
            details = "Kartu Anda sepasang dan memiliki potensi kuat. Pisahkan untuk memainkan dua tangan terpisah.";
            break;
    }
    
    adviceResult.textContent = adviceText;
    adviceResult.className = `advice ${adviceClass}`;
    
    // Tambahkan saran khusus untuk situasi tertentu
    if (isPair && action !== 'P') {
        specialText = "Jangan pisahkan kartu";
        details = "Meskipun kartu Anda sepasang, lebih baik tidak memisahkannya karena nilai kombinasi lebih menguntungkan.";
    } else if (isSoft && action === 'S') {
        specialText = "Soft hand - Berdiri dengan nilai saat ini";
        details = "Anda memiliki soft hand (As dihitung 11) dengan nilai cukup tinggi. Berdiri untuk menghindari risiko bust.";
    }
    
    specialAdvice.textContent = specialText;
    actionDetails.textContent = details;
}

// Fungsi untuk mereset pemilihan
function resetSelection() {
    // Reset dealer card
    document.querySelectorAll('#dealer-cards .card-option').forEach(card => {
        card.classList.remove('selected');
    });
    selectedDealerCard = null;
    dealerCardDisplay.textContent = "Belum dipilih";
    
    // Reset player cards
    selectedPlayerCards = [];
    playerCard1Display.textContent = "?";
    playerCard1Display.className = "player-card-display";
    playerCard2Display.textContent = "?";
    playerCard2Display.className = "player-card-display";
    
    // Reset advice
    adviceResult.textContent = "Pilih kartu Anda";
    adviceResult.className = "advice";
    specialAdvice.textContent = "";
    actionDetails.textContent = "Pilih kartu dealer dan kartu Anda untuk mendapatkan saran strategi";
}

// Event listener untuk tombol saran
getAdviceBtn.addEventListener('click', getStrategyAdvice);

// Event listener untuk tombol reset
resetBtn.addEventListener('click', resetSelection);

// Event listener untuk menghapus kartu pemain
playerCard1Display.addEventListener('click', () => {
    if (selectedPlayerCards.length > 0) {
        selectedPlayerCards.shift();
        playerCard1Display.textContent = "?";
        playerCard1Display.className = "player-card-display";
        
        if (selectedPlayerCards.length === 1) {
            playerCard2Display.textContent = "?";
            playerCard2Display.className = "player-card-display";
        }
    }
});

playerCard2Display.addEventListener('click', () => {
    if (selectedPlayerCards.length > 1) {
        selectedPlayerCards.pop();
        playerCard2Display.textContent = "?";
        playerCard2Display.className = "player-card-display";
    }
});

// Inisialisasi aplikasi
document.addEventListener('DOMContentLoaded', () => {
    initializeCards();
    
    // Set contoh kartu setelah sedikit delay
    setTimeout(() => {
        // Pilih kartu dealer contoh (6)
        const dealerCards = document.querySelectorAll('#dealer-cards .card-option');
        if (dealerCards.length > 4) dealerCards[4].click(); // Index 4 adalah kartu 6
        
        // Pilih kartu pemain contoh (10 dan A)
        const playerCards = document.querySelectorAll('#player-cards .card-option');
        if (playerCards.length > 8) playerCards[8].click(); // 10
        if (playerCards.length > 12) playerCards[12].click(); // A
        
        // Tampilkan saran
        setTimeout(getStrategyAdvice, 500);
    }, 800);
});