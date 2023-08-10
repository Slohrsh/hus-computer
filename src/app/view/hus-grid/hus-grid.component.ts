import { Component, OnInit } from '@angular/core';
import { GameEngine } from 'src/app/control/GameEngine';
import { GameState } from 'src/app/model/GameState';
import { MiniMaxCompute } from 'src/app/computing/MiniMaxCompute'
import { Coordinate } from 'src/app/computing/dataObjects';
import { Move } from 'src/app/control/dataObjects';
import { Cell } from '../dataObjects';

@Component({
  selector: 'app-hus-grid',
  templateUrl: './hus-grid.component.html',
  styleUrls: ['./hus-grid.component.scss']
})
export class HusGridComponent implements OnInit {

  private readonly engine: GameEngine;

  husi: string = '';

  grid: Cell[][] = [];

  nextStesps: GameState[] = [];

  turn: string = "Your turn";

  remainingBeans: number = 0;

  isUpdating: boolean = false;

  isPlayerATurn: boolean = false;

  constructor() {
    let state: GameState = new GameState();
    this.engine = new GameEngine(state);
  }

  ngOnInit(): void {
    this.husi = '../../assets/waving1.svg';

    this.initGrid()

    this.engine.stateChangedSubject$.subscribe((moves: Move[]) => {
      this.updateGrid(moves);
    })
  }


  initGrid() {
    this.engine.init();
    let state = this.engine.state;

    for (let y: number = 0; y < 2; y++) {
      this.grid[y] = [];
      this.grid[3 - y] = [];
      for (let x: number = 0; x < 8; x++) {
        this.grid[y][x] = new Cell(state.playerA[y][7 - x]);
        this.grid[3 - y][x] = new Cell(state.playerB[y][x]);
      }
    }
  }

  removeFocus(x: number, y: number) {
    let element = this.getSquareByCoordinates(x, y);
    if (element.length > 0) {
      element[0].classList.remove('focused-own');
      element[0].classList.remove('focused-other');
    }
  }

  setFocus(x: number, y: number) {
    let element = this.getSquareByCoordinates(x, y);
    if (element.length > 0) {
      if (this.isOwnFocus(x, y) && !this.isPlayerATurn) {
        element[0].classList.add('focused-own');
      } else {
        element[0].classList.add('focused-other');
      }
    }
  }

  isOwnFocus(x: number, y: number) {
    return y > 1;
  }

  getSquareByCoordinates(x: number, y: number): HTMLCollectionOf<Element> {
    let element = document.getElementsByClassName(`square[${y}][${x}]`);
    return element;
  }

  move(x: number, y: number, element: Event) {
    if (y > 1) {
      this.engine.movePlayerB(x, 3 - y, true);
      this.isPlayerATurn = true;
      this.turn = "Computers turn";
    } else {
      console.log("not your move");
    }
  }

  startComputerMove() {
    let compute: MiniMaxCompute = new MiniMaxCompute();
    let coordinate: Coordinate = compute.calculateNextStep(this.engine.state)
    this.engine.movePlayerA(coordinate.x, coordinate.y, true);
    this.isPlayerATurn = false;
    this.turn = "Your turn";
  }

  async updateGrid(moves: Move[]) {

    this.isUpdating = true;
    this.husi = '../../assets/thinking.svg';

    for (let move of moves) {
      let x: number = move.x;
      let y: number = move.y;
      let stealY1: number;
      let stealY2: number;
      if (move.isPlayerA) {
        x = 7 - move.x;
        stealY1 = 2;
        stealY2 = 3;
      } else {
        move.y == 1 ? y = 2 : y = 3;
        stealY1 = 0;
        stealY2 = 1;
      }
      this.grid[y][x].value = move.beansOfField;
      this.grid[y][x].hasChanged = true;
      this.grid = Object.assign([], this.grid);

      this.remainingBeans = move.remainingBeans;

      if (move.stealBeans) {
        if (this.grid[stealY1][x].value > 0) {
          this.grid[stealY1][x].value = 0;
          this.grid[stealY1][x].isStolen = true;
        }
        if (this.grid[stealY2][x].value > 0) {
          this.grid[stealY2][x].value = 0;
          this.grid[stealY2][x].isStolen = true;
        }
      }

      await this.delay(500);
      this.grid[y][x].hasChanged = false;
      this.grid = Object.assign([], this.grid);
      if (move.stealBeans) {
        this.grid[stealY1][x].isStolen = false;
        this.grid[stealY2][x].isStolen = false;
      }
    }

    this.isUpdating = false;

    if (this.engine.isGameOver()) {
      if (this.engine.didPlayerALoose()) {
        this.husi = '../../assets/sad.svg';
        this.turn = "You Won!"
      } else {
        this.husi = '../../assets/happy.svg';
        this.turn = "Wuhuu I Won!"
      }
    } else {
      this.husi = '../../assets/waving1.svg';
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
