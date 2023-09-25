import { Final, GameState, InProgress, Scheduled } from "./GameState";
import { Team } from "./Team";
import { League } from "./League";

export class Game {
    public constructor(
        public readonly id: string,
		public readonly league: League,
        public readonly team1: Team,
        public readonly team2: Team,
        public readonly gameState: GameState,
        public readonly url: string,
    ) {
    }
    
    public longName(): string {
		return `${this.team1.name} at ${this.team2.name}`
    }

    public shortName(): string {
		return `${this.team1.shortName} at ${this.team2.shortName}`
    }

	public score(): string | undefined {
		if ((this.gameState instanceof InProgress) || this.gameState instanceof Final) {
			return `${this.gameState.score.score1}-${this.gameState.score.score2}`
		} else {
			return undefined
		}
	}

	public nameAndScore(): string {
		if (this.gameState instanceof InProgress) {
			return `${this.gameState.homeTeamPossession == false ? "• " : ""}${this.team1.shortName} ${this.gameState.score.score1}-${this.gameState.score.score2} ${this.team2.shortName}${this.gameState.homeTeamPossession == true ? " •" : ""}`
		} else if (this.gameState instanceof Final) {
			return `${this.team1.shortName} ${this.gameState.score.score1}-${this.gameState.score.score2} ${this.team2.shortName}`
		} else {
			return this.shortName()
		}
	}
    
    public description(): string {
        if (this.gameState instanceof InProgress) {
			if (this.gameState.situation.trim() == "") {
				return this.gameState.time
			}
			return `${this.gameState.situation} ∙ ${this.gameState.time}`
        } else if (this.gameState instanceof Final) {
			return "Final ∙ " + this.gameState.scheduledDate.toLocaleDateString("en-us", dateFormat)
        } else {
            return this.gameState.scheduledDate.toLocaleDateString("en-us", dateFormat)
        }
    }
}

const dateFormat: Intl.DateTimeFormatOptions = { month: "numeric", day: "2-digit", hour: "numeric", minute: "2-digit" }

