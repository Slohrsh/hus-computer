export class Move {
    constructor(
        public isPlayerA: boolean,
        public remainingBeans: number,
        public beansOfField: number,
        public x: number, 
        public y: number,
        public stealBeans: boolean) { }
}