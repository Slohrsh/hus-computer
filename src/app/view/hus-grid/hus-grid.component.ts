import { Component, OnInit } from '@angular/core';
import { GameEngine } from 'src/app/control/GameEngine';
import { GameState } from 'src/app/model/GameState';
import { MiniMaxCompute } from 'src/app/computing/MiniMaxCompute'
import { Coordinate } from 'src/app/computing/dataObjects';

@Component({
  selector: 'app-hus-grid',
  templateUrl: './hus-grid.component.html',
  styleUrls: ['./hus-grid.component.scss']
})
export class HusGridComponent implements OnInit {

  private readonly engine: GameEngine;

  husi: string = '';

  grid: number[][] = [];

  nextStesps: GameState[] = [];

  constructor() {
    let state: GameState = new GameState();
    this.engine = new GameEngine(state);
  }

  ngOnInit(): void {
    this.husi = '../../assets/waving1.svg';

    this.engine.init();
    this.updateGrid(this.engine.state)

    this.engine.stateChangedSubject$.subscribe((state: GameState) => {
      this.updateGrid(state)
    })
  }

  move(x: number, y: number, element: Event) {

    this.engine.movePlayerB(x, 3 - y, true);
    let compute: MiniMaxCompute = new MiniMaxCompute();
    let coordinate: Coordinate = compute.calculateNextStep(this.engine.state)
    console.log("Move:" + coordinate);
    this.engine.movePlayerA(coordinate.x, coordinate.y, true);
  }

  async updateGrid(state: GameState) {

    for (let y: number = 0; y < 2; y++) {
      this.grid[y] = [];
      this.grid[3 - y] = [];
      for (let x: number = 0; x < 8; x++) {
        this.grid[y][x] = state.playerA[y][7 - x];
        this.grid[3 - y][x] = state.playerB[y][x];
      }
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
}
