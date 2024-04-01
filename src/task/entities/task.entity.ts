export class Task {
    constructor(
        public id: string, 
        public title: string, 
        public description: string, 
        public date: Date,
        public completed: boolean
    ) {}
}