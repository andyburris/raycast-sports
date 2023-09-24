export interface GameState {
    scheduledDate: Date,
}

export class Scheduled implements GameState {
    public constructor(public scheduledDate: Date) {}
}

export class InProgress implements GameState {
    public constructor(
        public scheduledDate: Date,
        public score: Score,
        public time: string,
        public homeTeamPossession: boolean | undefined,
        public situation: string,
    ) {
    }
}

export class Final implements GameState {
    public constructor(
        public scheduledDate: Date,
        public score: Score,
    ) {
    }
}

export class Score {
    public constructor(
        public score1: string,
        public score2: string,
        ) {
    }
}