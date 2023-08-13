export class Cell {
    constructor(
        public value: number,
        public isFocusedAllowed: boolean = false,
        public isFocusedNotAllowed: boolean = false,
        public hasChanged: boolean = false,
        public isStolen: boolean = false) { }
}