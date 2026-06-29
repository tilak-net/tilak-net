class GameState {
    constructor(mode = 'daily') {
        this.mode = mode;
        this.currentPokemon = null;
        this.guesses = [];
        this.guessCount = 0;
        this.hintIndex = 0;
        this.isGameOver = false;
        this.streak = parseInt(localStorage.getItem('pokemonWordle_streak') || '0');
    }

    addGuess(pokemon, result) {
        this.guesses.push({ pokemon, result });
        this.guessCount++;
    }

    getNextHint() {
        if (this.currentPokemon && this.hintIndex < this.currentPokemon.name.length) {
            return this.currentPokemon.name[this.hintIndex++];
        }
        return null;
    }

    resetGame() {
        this.guesses = [];
        this.guessCount = 0;
        this.hintIndex = 0;
        this.isGameOver = false;
    }

    endGame(won) {
        this.isGameOver = true;
        if (won) {
            this.streak++;
            localStorage.setItem('pokemonWordle_streak', this.streak);
        } else {
            this.streak = 0;
            localStorage.setItem('pokemonWordle_streak', '0');
        }
    }
}

class PokemonWordle {
    constructor() {
        this.gameState = new GameState('daily');
        this.filters = { generation: 'all' };
        this.maxStats = 200;
        this.initializeGame();
    }

    initializeGame() {
        this.setupEventListeners();
        this.startNewGame();
    }

    setupEventListeners() {
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchMode(e.target.dataset.mode));
        });

        document.getElementById('guessBtn').addEventListener('click', () => this.handleGuess());
        document.getElementById('guessInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleGuess();
        });

        document.getElementById('hintBtn').addEventListener('click', () => this.revealHint());
        document.getElementById('answerBtn').addEventListener('click', () => this.revealAnswer());
        document.getElementById('newGameBtn').addEventListener('click', () => this.startNewGame());

        document.getElementById('generationFilter').addEventListener('change', (e) => {
            this.filters.generation = e.target.value;
            this.startNewGame();
        });

        document.getElementById('infoBtn').addEventListener('click', () => this.showInfoModal());
        document.getElementById('closeInfoBtn').addEventListener('click', () => this.hideInfoModal());
        document.getElementById('modalCloseBtn').addEventListener('click', () => this.hideGameOverModal());
    }

    switchMode(mode) {
        this.gameState = new GameState(mode);
        document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
        this.startNewGame();
    }

    selectRandomPokemon() {
        let available = POKEMON_DATABASE;
        if (this.filters.generation !== 'all') {
            available = available.filter(p => p.gen === parseInt(this.filters.generation));
        }
        if (available.length === 0) return null;
        return available[Math.floor(Math.random() * available.length)];
    }

    startNewGame() {
        this.gameState.resetGame();
        this.gameState.currentPokemon = this.selectRandomPokemon();
        if (!this.gameState.currentPokemon) return;
        this.updateStatsDisplay();
        document.getElementById('message').innerHTML = '';
        document.getElementById('hintText').innerHTML = '';
    }

    updateStatsDisplay() {
        const p = this.gameState.currentPokemon;
        const stats = [
            { id: 'hp', value: p.hp },
            { id: 'atk', value: p.atk },
            { id: 'def', value: p.def },
            { id: 'spa', value: p.spa },
            { id: 'sdf', value: p.spd },
            { id: 'spd', value: p.spd }
        ];
        stats.forEach(s => {
            document.getElementById(`${s.id}Value`).textContent = s.value;
            document.getElementById(`${s.id}Bar`).style.width = `${(s.value / this.maxStats) * 100}%`;
        });
        document.getElementById('genBadge').textContent = `Gen: ${p.gen}`;
        document.getElementById('guessCount').textContent = `Guesses: ${this.gameState.guessCount}`;
        document.getElementById('streakCount').textContent = `Streak: ${this.gameState.streak}`;
    }

    handleGuess() {
        const input = document.getElementById('guessInput');
        const guessText = input.value.trim();
        if (!guessText) return;

        const guessedPokemon = getPokemonByName(guessText);
        if (!guessedPokemon) {
            this.showMessage('Pokémon not found!', 'info');
            return;
        }

        if (guessedPokemon.id === this.gameState.currentPokemon.id) {
            this.showMessage(`🎉 Correct! It's ${this.gameState.currentPokemon.name}!`, 'correct');
            this.gameState.addGuess(guessedPokemon, 'correct');
            this.gameState.endGame(true);
            this.showGameOverModal(true);
        } else {
            const hint = this.compareGenerations(guessedPokemon, this.gameState.currentPokemon);
            this.showMessage(hint.message, 'incorrect');
            this.gameState.addGuess(guessedPokemon, hint.result);
        }
        this.addToHistory(guessedPokemon);
        input.value = '';
        document.getElementById('guessCount').textContent = `Guesses: ${this.gameState.guessCount}`;
    }

    compareGenerations(guessedPokemon, actualPokemon) {
        if (guessedPokemon.gen === actualPokemon.gen) {
            return { message: '🔄 Same generation!', result: 'same_gen' };
        } else if (guessedPokemon.gen < actualPokemon.gen) {
            return { message: '⬆️ From a newer generation!', result: 'newer' };
        } else {
            return { message: '⬇️ From an older generation!', result: 'older' };
        }
    }

    showMessage(text, type) {
        const el = document.getElementById('message');
        el.textContent = text;
        el.className = `message ${type}`;
    }

    addToHistory(pokemon) {
        const history = document.getElementById('guessHistory');
        const empty = history.querySelector('.empty-history');
        if (empty) empty.remove();
        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML = `<strong>${pokemon.name}</strong> (Gen ${pokemon.gen})`;
        history.prepend(item);
    }

    revealHint() {
        const char = this.gameState.getNextHint();
        if (char) document.getElementById('hintText').textContent += char;
    }

    revealAnswer() {
        document.getElementById('hintText').textContent = this.gameState.currentPokemon.name;
    }

    showGameOverModal(won) {
        const p = this.gameState.currentPokemon;
        document.getElementById('modalTitle').textContent = won ? '🎉 You Won!' : '💔 Game Over';
        document.getElementById('modalMessage').textContent = won ? `Found ${p.name} in ${this.gameState.guessCount} guesses!` : `The Pokémon was ${p.name}.`;
        document.getElementById('modalPokemon').textContent = p.name;
        document.getElementById('modalGen').textContent = `Gen ${p.gen}`;
        document.getElementById('modalTotal').textContent = getTotalStats(p);
        document.getElementById('modalGuesses').textContent = this.gameState.guessCount;
        document.getElementById('gameOverModal').classList.add('active');
    }

    hideGameOverModal() {
        document.getElementById('gameOverModal').classList.remove('active');
    }

    showInfoModal() {
        document.getElementById('infoModal').classList.add('active');
    }

    hideInfoModal() {
        document.getElementById('infoModal').classList.remove('active');
    }
}

let game;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { game = new PokemonWordle(); });
} else {
    game = new PokemonWordle();
}