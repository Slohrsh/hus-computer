import { GameState } from '../model/GameState';

export class Score {
    constructor(public score: number, public depth: number, public isWinningMove: boolean) { }
}

export class Coordinate {
    constructor(public x: number, public y: number) {}
}

export class Node {
    private _score: Score | null = null;
  
    constructor(public readonly move: Coordinate, public readonly state: GameState) {}
  
    get score(): Score | null {
      return this._score;
    }
  
    set score(score: Score | null) {
      this._score = score;
    }
  
    children: Node[] = [];
  
    addChild(child: Node): void {
      this.children.push(child);
    }
  }