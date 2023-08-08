import { Subject } from 'rxjs';
import { GameState } from '../model/GameState';

export class GameEngine {

    stateChangedSubject$: Subject<GameState> = new Subject();

    state: GameState;

    constructor(state: GameState);

    constructor();

    constructor(state?: GameState) {
        this.state = state || new GameState();
    }

    init(): void {
        for (let y = 0; y < 2; y++) {
            this.state.playerA[y] = [];
            this.state.playerB[y] = [];
            for (let x = 0; x <= 7; x++) {
                if (y === 0 || x >= 4) {
                    this.state.playerA[y][x] = 2;
                    this.state.playerB[y][x] = 2;
                } else {
                    this.state.playerA[y][x] = 0;
                    this.state.playerB[y][x] = 0;
                }
            }
        }
    }

    setState(state: GameState): void {
        this.state = state;
    }

    movePlayerA(x: number, y: number, updateFrontend: boolean): GameState {
        return this.movePlayer(this.state.playerA, this.state.playerB, x, y, updateFrontend);
    }

    movePlayerB(x: number, y: number, updateFrontend: boolean): GameState {
        return this.movePlayer(this.state.playerB, this.state.playerA, x, y, updateFrontend);
    }

    private movePlayer(player: number[][], opponent: number[][], x: number, y: number, updateFrontend: boolean): GameState {
        this.movePlayerInternally(player, opponent, x, y, updateFrontend);
        this.state.addMove();
        this.state.setGameOver(this.isGameOver());
        if (updateFrontend) {
            this.update();
        }
        return this.state;
    }

    private movePlayerInternally(player: number[][], opponent: number[][], x: number, y: number, updateFrontend: boolean): void {
        const beans = this.getBeansOfPlayerAtPosition(player, x, y);

        if (beans <= 1) {
            return;
        }

        let newX = x;
        let newY = y;
        this.removeBeansOfPlayerAtPosition(player, x, y);
        let iterator = newY === 1 ? 1 : -1;
        for (let b = beans; b > 0; b--) {
            newX += iterator;
            if (newX > 7 || newX < 0) {
                iterator *= -1;
                newY = (newY + 1) % 2;
                newX += iterator;
            }
            this.addBeanOfPlayerAtPosition(player, newX, newY);
            if (b === 1) {
                if (!this.state.startPhase && newY === 1 && this.getBeansOfPlayerAtPosition(player, newX, newY) > 1) {
                    this.stealOpponentBeans(player, opponent, newX, newY);
                    const currentBeansOfPlayerField = this.getBeansOfPlayerAtPosition(player, newX, newY);
                    if (currentBeansOfPlayerField > 1) {
                        b += currentBeansOfPlayerField;
                        this.removeBeansOfPlayerAtPosition(player, newX, newY);
                    }
                } else {
                    const beansOfNewField = this.getBeansOfPlayerAtPosition(player, newX, newY);
                    if (beansOfNewField > 1) {
                        b += beansOfNewField;
                        this.removeBeansOfPlayerAtPosition(player, newX, newY);
                    }
                }
            }
            if (updateFrontend) {
                this.update();
            }
        }
    }

    private stealOpponentBeans(player: number[][], opponent: number[][], newX: number, newY: number): void {
        const opponentBeansFirstLine = this.getBeansOfOpponentAtPosition(opponent, newX, 1);
        if (opponentBeansFirstLine > 0) {
            const opponentBeansSecondLine = this.getBeansOfOpponentAtPosition(opponent, newX, 0);
            this.addBeansOfPlayerAtPosition(player, opponentBeansFirstLine + opponentBeansSecondLine, newX, newY);
            this.removeBeansOfOpponentAtPosition(opponent, newX, 0);
            this.removeBeansOfOpponentAtPosition(opponent, newX, 1);
        }
    }

    private removeBeansOfOpponentAtPosition(opponent: number[][], x: number, y: number): void {
        this.removeBeansOfPlayerAtPosition(opponent, 7 - x, y);
    }

    private getBeansOfOpponentAtPosition(opponent: number[][], x: number, y: number): number {
        return this.getBeansOfPlayerAtPosition(opponent, 7 - x, y);
    }

    private addBeanOfPlayerAtPosition(player: number[][], x: number, y: number): void {
        this.addBeansOfPlayerAtPosition(player, 1, x, y);
    }

    private addBeansOfPlayerAtPosition(player: number[][], amountOfBeans: number, x: number, y: number): void {
        player[y][x] += amountOfBeans;
    }

    private removeBeansOfPlayerAtPosition(player: number[][], x: number, y: number): void {
        player[y][x] = 0;
    }

    private getBeansOfPlayerAtPosition(player: number[][], x: number, y: number): number {
        return player[y][x];
    }

    isGameOver(): boolean {
        let isPlayerAGameOver = true;
        let isPlayerBGameOver = true;
        for (let y = 0; y < 2; y++) {
            for (let x = 7; x >= 0; x--) {
                if (this.state.playerA[y][x] > 1) {
                    isPlayerAGameOver = false;
                }
                if (this.state.playerB[y][x] > 1) {
                    isPlayerBGameOver = false;
                }
                if (!isPlayerAGameOver && !isPlayerBGameOver) {
                    return false;
                }
            }
        }
        return true;
    }

    didPlayerLoose(player: number[][]): boolean {
        for (let y = 0; y < 2; y++) {
            for (let x = 0; x < 8; x++) {
                if (player[y][x] > 1) {
                    return false;
                }
            }
        }
        return true;
    }

    didPlayerALoose(): boolean {
        return this.didPlayerLoose(this.state.playerA);
    }

    async update() {
        this.stateChangedSubject$.next(this.state);
    }
}
