export class GameState {

    playerA: number[][] = [];

    playerB: number[][] = [];

    isGameOver: boolean = false;

    startPhase: boolean = true;

    move: number = 0;

    addMove(): void {
        if (this.move + 1 >= 2) {
            this.startPhase = false;
        } else {
            this.move++;
        }
    }

    clone(): GameState {
        let state: GameState = new GameState();
        for (let y: number = 0; y < 2; y++) {
            state.playerA[y] = [];
            state.playerB[y] = [];
            for (let x: number = 0; x < 8; x++) {
                state.playerA[y][x] = this.playerA[y][x];
                state.playerB[y][x] = this.playerB[y][x];
            }
        }
        state.startPhase = this.startPhase;
        state.move = this.move;
        return state;
    }

    setGameOver(isGameOver: boolean): void {
        this.isGameOver = isGameOver;
    }
}