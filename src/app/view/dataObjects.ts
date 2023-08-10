export class Cell {
    constructor(
        public value: number,
        public hasChanged: boolean = false,
        public isStolen: boolean = false) { }
}