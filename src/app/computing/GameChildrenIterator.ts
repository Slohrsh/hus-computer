import { GameEngine } from '../control/GameEngine';
import { GameState } from '../model/GameState';
import { Node, Coordinate } from './dataObjects';

export class GameChildrenIterator {

  private readonly isMaximizingPlayer: boolean;
  private readonly possibleMoves: Coordinate[] = [];
  private readonly engine: GameEngine = new GameEngine();

  constructor(private parentState: GameState, isMaximizingPlayer: boolean) {
    this.isMaximizingPlayer = isMaximizingPlayer;
    if (isMaximizingPlayer) {
      this.initializePossibleMoves(parentState.playerA);
    } else {
      this.initializePossibleMoves(parentState.playerB);
    }
  }

  private initializePossibleMoves(player: number[][]): void {
    for (let y = 0; y < 2; y++) {
      for (let x = 7; x >= 0; x--) {
        if (player[y][x] > 1) {
          this.possibleMoves.push(new Coordinate(x, y));
        }
      }
    }
  }

  hasNext(): boolean {
    return this.possibleMoves.length > 0;
  }

  next(): Node {
    const nextMove: Coordinate = this.possibleMoves.shift() as Coordinate;
    const childState: GameState = this.parentState.clone();
    this.engine.setState(childState);
    return new Node(nextMove, this.move(nextMove));
  }

  private move(nextMove: Coordinate): GameState {
    if (this.isMaximizingPlayer) {
      return this.engine.movePlayerA(nextMove.x, nextMove.y, false);
    } else {
      return this.engine.movePlayerB(nextMove.x, nextMove.y, false);
    }
  }
}