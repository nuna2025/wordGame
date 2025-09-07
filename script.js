// Import the wordPairs variable from the word.js file.
import { wordPairs } from './words.js';

document.addEventListener('DOMContentLoaded', function() {
            
    const wordsGrid = document.getElementById('words-grid');
    const wordInput = document.getElementById('word-input');
    const resetBtn = document.getElementById('reset-btn');
    const messageEl = document.getElementById('message');
    const remainingWordsEl = document.getElementById('remaining-words');
    const completedWordsEl = document.getElementById('completed-words');
    
    let completedWords = 0;
    let remainingWords = 36;
    
    // Create word cards
    function createWordCards() {
        wordsGrid.innerHTML = '';
        // Shuffle the word order
        const shuffledPairs= [...wordPairs].sort(() => Math.random() - 0.5);
        const shuffledWords=shuffledPairs.slice(0, 36);
        
        shuffledWords.forEach((word, index) => {
            const card = document.createElement('div');
            card.className = 'word-card';
            card.dataset.korean = word.korean;
            card.dataset.german = word.german;
            
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">${word.korean}</div>
                    <div class="card-back">${word.german}</div>
                </div>
            `;
            
            wordsGrid.appendChild(card);
        });
        
        // Initialize / Reset
        completedWords = 0;
        remainingWords = 36;
        updateWordCount();
        messageEl.textContent = '';
        messageEl.className = '';
    }
    
    // Update the word count
    function updateWordCount() {
        remainingWordsEl.textContent = remainingWords;
        completedWordsEl.textContent = completedWords;
    }

    // Handle input events
    wordInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();              // Prevent default behavior (form submission, spacebar scroll, etc.)
            const inputText = this.value.trim();
            
            if (inputText === '') return;

            const cards = document.querySelectorAll('.word-card');
            let found = false;

            cards.forEach(card => {
                if (!card.classList.contains('completed') && 
                    card.dataset.korean === inputText) {
                    
                    found = true;
                    card.classList.add('flipped');
                    
                    setTimeout(() => {
                        card.classList.add('completed');
                        completedWords++;
                        remainingWords--;
                        updateWordCount();
                        
                        if (completedWords === 36) {
                            messageEl.textContent = 'Herzlichen Glückwunsch! Sie haben alle Wörter richtig geraten!';
                            messageEl.className = 'success';
                        }
                    }, 600);

                    messageEl.textContent = 'Richtig!';
                    messageEl.className = 'success';
                }
            });

            if (!found) {
                messageEl.textContent = 'Kein passendes Wort gefunden. Bitte versuchen Sie es erneut.';
                messageEl.className = 'error';
                
                setTimeout(() => {
                    messageEl.textContent = '';
                    messageEl.className = '';
                }, 1500);
            }

            // Clear the input field regardless of whether the answer is correct or not
            this.value = '';
        }
    });

    
    // Handle card click event (for mobile responsiveness)
    wordsGrid.addEventListener('click', function(e) {
        const card = e.target.closest('.word-card');
        if (card && !card.classList.contains('completed')) {
            card.classList.toggle('flipped');
        }
    });
    
    // Restart button
    resetBtn.addEventListener('click', createWordCards);
    
    // Create initial cards
    createWordCards();
});