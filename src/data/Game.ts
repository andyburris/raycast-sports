import { Final, GameState, InProgress, Scheduled } from "./GameState";
import { Team } from "./Team";

export class Game {
    public constructor(
        public readonly id: string,
        public readonly team1: Team,
        public readonly team2: Team,
        public readonly gameState: GameState,
        public readonly url: string,
    ) {
    }
    
    public name(): string {
        if ((this.gameState instanceof InProgress) || this.gameState instanceof Final) {
            return `${this.gameState.score.score1} ${this.team1.name} - ${this.team2.name} ${this.gameState.score.score2}`
        } else {
            return `${this.team1.name} at ${this.team2.name}`
        }
    }
    
    public shortName(): string {
        if ((this.gameState instanceof InProgress) || this.gameState instanceof Final) {
            return `${this.gameState.score.score1} ${this.team1.shortName} - ${this.team2.shortName} ${this.gameState.score.score2}`
        } else {
            return `${this.team1.shortName} at ${this.team2.shortName}`
        }
    }
    
    public description(): string {
        if (this.gameState instanceof InProgress) {
            return this.gameState.time
        } else if (this.gameState instanceof Final) {
            return "Final • " + this.gameState.scheduledDate.toLocaleDateString("en-us", dateFormat)
        } else {
            return this.gameState.scheduledDate.toLocaleDateString("en-us", dateFormat)
        }
    }
}

const dateFormat: Intl.DateTimeFormatOptions = { month: "short", day: "2-digit", hour: "numeric", minute: "2-digit" }

