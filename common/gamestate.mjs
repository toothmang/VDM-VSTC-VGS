class gamestate {
    constructor(baddiesToKill = 5, wavesCleared = 0, seed = 0) {
        this.wavesCleared = 0;
        this.baddiesToKill = baddiesToKill;
        this.baddiesKilled = 0;
        this.seed = seed;
    }

    getBaddiesRemaining() {
        return this.baddiesToKill - this.baddiesKilled;
    }

    isClear() {
        return this.getBaddiesRemaining() == 0;
    }

    kill() {
        this.baddiesKilled++;
    }

    nextLevel() {
        this.baddiesKilled = 0;
        this.baddiesToKill = Math.round(this.baddiesToKill * 1.5);
        this.wavesCleared++;
    }

    set(gs) {
        this.wavesCleared = gs.wavesCleared ;
        this.baddiesToKill = gs.baddiesToKill;
        this.baddiesKilled = gs.baddiesKilled;
        this.seed = gs.seed;

    }
}

export default gamestate;