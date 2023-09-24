import {League} from "./Dropdown";
import {useFetch} from "@raycast/utils";
import {UseCachedPromiseReturnType} from "@raycast/utils/dist/types";
import { Game } from "./data/Game";
import { Team } from "./data/Team";
import { GameState, InProgress, Final, Scheduled, Score } from "./data/GameState"

const baseUrl = "http://site.api.espn.com/apis/site/v2/sports"

export function getScoresFor(league: League): UseCachedPromiseReturnType<Array<Game>, undefined> {
    switch (league) {
      case League.Favorites: return getScoresForFavorites();
      default: return getScoresForLeague(league);
    }
}

function getScoresForLeague(league: League): UseCachedPromiseReturnType<Array<Game>, undefined> {
    const endpoint = getEndpointForLeague(league) + "/scoreboard"
    return useFetch(endpoint, {
        parseResponse: (response) => {
            return response.json()
                .then(obj => (obj["events"] as Array<any>).map(e => parseEvent(e)))
        }
    })
}

function parseEvent(event: any): Game {
    const competition = event.competitions[0]
    const date = new Date(competition.date)
    console.log(event)
    const competitor1 = competition.competitors[1] //ESPN lists home first, we want to list away first so flip
    const competitor2 = competition.competitors[0]
    const team1 = competitor1.team
    const team2 = competitor2.team
    const score = new Score(competitor1.score, competitor2.score)
    const status = competition.status
    let gameState: GameState;
    switch(status.type.name) {
        case "STATUS_IN_PROGRESS":
            gameState = new InProgress(
                date,
                score,
                status.type.shortDetail.replace("- ", ""),
                undefined,
                "",
            )
            break;
        case "STATUS_SCHEDULED":
            gameState = new Scheduled(date)
            break;
        case "STATUS_FINAL":
        default:
            gameState = new Final(
                date,
                score,
            );
            break;
    }
    
    const game = new Game(
        event.id,
        new Team(team1.id, team1.displayName, team1.abbreviation, team1.logo),
        new Team(team2.id, team2.displayName, team2.abbreviation, team2.logo),
        gameState,
        event.links.href,
    )
    console.log(game)
    return game
}

function getEndpointForLeague(league: League) {
    let slug: string;
    switch (league) {
        case League.Favorites: throw new Error("should never get league score for favorites");
        case League.MLB: slug = "/baseball/mlb"; break;
        case League.NFL: slug = "/football/nfl"; break;
        case League.NBA: slug = "/basketball/nba"; break;
        case League.NHL: slug = "/hockey/nhl"; break;
        case League.MLS: slug = "/soccer/mls"; break;
    }
    return baseUrl + slug;
}

function getScoresForFavorites(): UseCachedPromiseReturnType<Array<Game>, undefined>{
    return useFetch(baseUrl)
}