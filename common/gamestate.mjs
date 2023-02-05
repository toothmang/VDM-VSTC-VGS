class gamestate {
    constructor(baddiesToKill = 5, wavesCleared = 0, seed = 0) {
        this.wavesCleared = 0;
        this.baddiesToKill = baddiesToKill;
        this.baddiesKilled = 0;
        this.seed = seed;
        this.startedAt = performance.now();
        this.clearedIn = 0;
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
        let nowish = performance.now();
        this.clearedIn = (nowish - this.startedAt) / 1000.0;
        this.startedAt = nowish;
    }

    set(gs) {
        this.wavesCleared = gs.wavesCleared ;
        this.baddiesToKill = gs.baddiesToKill;
        this.baddiesKilled = gs.baddiesKilled;
        this.seed = gs.seed;
        this.startedAt = gs.startedAt;
        this.clearedIn = gs.clearedIn;

    }
}

export default gamestate;