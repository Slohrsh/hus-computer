import { GameState } from '../model/GameState';
import { Node, Score, Coordinate } from './dataObjects';
import { GameEngine } from '../control/GameEngine';
import { GameChildrenIterator } from './GameChildrenIterator';

const MAX_DEPTH = 3;

export class MiniMaxCompute {

  calculateNextStep(state: GameState): Coordinate {
    const node = new Node(new Coordinate(0, 0), state);

    this.minimax(node, MAX_DEPTH, true);
    const nextMove = this.getMoveOfChildWithHighestScore(node);
    this.printDebugInfo(node);
    return nextMove;
  }

  private printDebugInfo(node: Node): void {
    for (const child of node.children) {
      if (child.score != null) {
        console.log(
          `X(${child.move.x}) Y(${child.move.y}) - isWinningMove ${child.score.isWinningMove} ` +
          `Score: ${child.score.score} Depth: ${child.score.depth}`
        );
      }
    }
  }

  private getMoveOfChildWithHighestScore(parent: Node): Coordinate {
    parent.children
      .sort((a, b) => {
        if (a.score == null) {
          return - 1;
        } else if (b.score == null) {
          return 1;
        }
        return (b.score.isWinningMove ? 1 : 0) - (a.score.isWinningMove ? 1 : 0) ||
          b.score.score - a.score.score ||
          a.score.depth - b.score.depth;
      }
      );

    return parent.children[0]?.move;
  }

  private minimax(parent: Node, depth: number, isMaximizingPlayer: boolean): Score {

    const engine = new GameEngine(parent.state);
    if (engine.isGameOver() || depth <= 0) {
      const score = this.calculateScore(parent.state);
      const currentDepth = MAX_DEPTH - depth;
      const isWinningMove = engine.didPlayerLoose(parent.state.playerB);
      return new Score(score, currentDepth, isWinningMove);
    }

    const iterator = new GameChildrenIterator(parent.state, isMaximizingPlayer);

    if (isMaximizingPlayer) {
      let maxEval = new Score(-48, MAX_DEPTH, false);
      while (iterator.hasNext()) {
        const child = iterator.next();
        parent.addChild(child);
        const evaluation = this.minimax(child, depth - 1, false);
        child.score = evaluation;
        if (evaluation.score > maxEval.score) {
          maxEval = evaluation;
        }
      }
      return maxEval;
    } else {
      let minEval = new Score(48, MAX_DEPTH, false);
      while (iterator.hasNext()) {
        const child = iterator.next();
        parent.addChild(child);
        const evaluation = this.minimax(child, depth - 1, true);
        child.score = evaluation;
        if (evaluation.score < minEval.score) {
          minEval = evaluation;
        }
      }
      return minEval;
    }
  }

  calculateScore(currentState: GameState): number {
    let currentSumBeansOfPlayerA = 0;
    let currentSumBeansOfPlayerB = 0;

    for (let y = 0; y < 2; y++) {
      for (let x = 0; x < 8; x++) {
        currentSumBeansOfPlayerA += currentState.playerA[y][x];
        currentSumBeansOfPlayerB += currentState.playerB[y][x];
      }
    }

    return currentSumBeansOfPlayerA - currentSumBeansOfPlayerB;
  }
}