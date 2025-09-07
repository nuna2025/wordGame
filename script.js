// word.js 파일에서 wordPairs 변수를 가져옵니다.
import { wordPairs } from './words.js';

document.addEventListener('DOMContentLoaded', function() {
            // 한글-독일어 단어 쌍
            

            const wordsGrid = document.getElementById('words-grid');
            const wordInput = document.getElementById('word-input');
            const resetBtn = document.getElementById('reset-btn');
            const messageEl = document.getElementById('message');
            const remainingWordsEl = document.getElementById('remaining-words');
            const completedWordsEl = document.getElementById('completed-words');
            
            let completedWords = 0;
            let remainingWords = 36;
            
            // 단어 카드 생성
            function createWordCards() {
                wordsGrid.innerHTML = '';
                // 단어 순서 섞기
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
                
                // 초기화
                completedWords = 0;
                remainingWords = 36;
                updateWordCount();
                messageEl.textContent = '';
                messageEl.className = '';
            }
            
            // 단어 개수 업데이트
            function updateWordCount() {
                remainingWordsEl.textContent = remainingWords;
                completedWordsEl.textContent = completedWords;
            }

            // 입력 이벤트 처리
            wordInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();              // 기본 동작(폼 제출, 스페이스 스크롤 등) 방지
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
                                    messageEl.textContent = '축하합니다! 모든 단어를 맞히셨습니다!';
                                    messageEl.className = 'success';
                                }
                            }, 600);

                            messageEl.textContent = '정답입니다!';
                            messageEl.className = 'success';
                        }
                    });

                    if (!found) {
                        messageEl.textContent = '일치하는 단어가 없습니다. 다시 시도해주세요.';
                        messageEl.className = 'error';
                        
                        setTimeout(() => {
                            messageEl.textContent = '';
                            messageEl.className = '';
                        }, 1500);
                    }

                    // 정답/오답 관계없이 입력란은 비우기
                    this.value = '';
                }
            });

            
            // 카드 클릭 이벤트 (모바일 대응)
            wordsGrid.addEventListener('click', function(e) {
                const card = e.target.closest('.word-card');
                if (card && !card.classList.contains('completed')) {
                    card.classList.toggle('flipped');
                }
            });
            
            // 재시작 버튼
            resetBtn.addEventListener('click', createWordCards);
            
            // 초기 카드 생성
            createWordCards();
        });