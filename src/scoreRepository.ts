import {useFetch} from "@raycast/utils";
import {UseCachedPromiseReturnType} from "@raycast/utils/dist/types";
import { Game } from "./data/Game";
import { Team } from "./data/Team";
import { GameState, InProgress, Final, Scheduled, Score } from "./data/GameState"
import { Category, Preset, League } from "./data/League";

const baseUrl = "http://site.api.espn.com/apis/site/v2/sports"

export function getScoresFor(category: Category): UseCachedPromiseReturnType<Array<Game>, undefined> {
    switch (category) {
      case Preset.Favorites: return getScoresForFavorites();
      default: return getScoresForLeague(category);
    }
}

function getScoresForLeague(league: League): UseCachedPromiseReturnType<Array<Game>, undefined> {
    const endpoint = getEndpointForLeague(league)
    return useFetch(endpoint, {
		keepPreviousData: true,
        parseResponse: (response) => {
            return response.json()
                .then(obj => (obj["events"] as Array<any>).map(e => parseEvent(e, league)))
        },
    })
}

function parseEvent(event: any, league: League): Game {
    const competition = event.competitions[0]
    const date = new Date(competition.date)
//    console.log(competition.status)
    const competitor1 = competition.competitors[1] //ESPN lists home first, we want to list away first so flip
    const competitor2 = competition.competitors[0]
    const team1Raw = competitor1.team
    const team2Raw = competitor2.team
	const team1Record = (competitor1.records || competitor1.record) ? (competitor1.records || competitor1.record)[0].summary : "0-0"
	const team2Record = (competitor2.records || competitor2.record) ? (competitor2.records || competitor2.record)[0].summary : "0-0"
    const score = new Score(competitor1.score, competitor2.score)
	const team1 = new Team(team1Raw.id, team1Raw.displayName, team1Raw.abbreviation, team1Record, team1Raw.logo)
	const team2 = new Team(team2Raw.id, team2Raw.displayName, team2Raw.abbreviation, team2Record, team2Raw.logo)
    const status = competition.status
	const possession = status.type.name != "STATUS_IN_PROGRESS" ? undefined : parsePossession(league, event.competitions[0].situation, team1, team2);

    let gameState: GameState;
    switch(status.type.name) {
		case "STATUS_END_PERIOD":
        case "STATUS_IN_PROGRESS":
            gameState = new InProgress(
                date,
                score,
                status.type.shortDetail.replace("- ", ""),
                possession,
				parseSituation(competition.situation, league),
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
		league,
        team1,
        team2,
        gameState,
		event.links[0].href,
    )
//    console.log(game)
    return game
}

function parseSituation(situation: any, league: League) {
	switch (league) {
    	case League.NFL: return situation.shortDownDistanceText
		default: return ""
  }
}

function parsePossession(league: League, situation: any, team1: Team, team2: Team): boolean | undefined {
	switch (league) {
		case League.NFL: return possessionByTeam(situation.possession, team1, team2);
		case League.MLB: return situation.batter == undefined ? possessionByTeam(situation.dueUp[0].athlete.team.id, team1, team2) : possessionByTeam(situation.batter.athlete.team.id, team1, team2);
		default: return undefined;
	}
}

function possessionByTeam(possessionID: string, team1: Team, team2: Team): boolean | undefined {
	return (team1.id == possessionID) ? false : (team2.id == possessionID) ? true : undefined;
}

export function getEndpointForLeague(league: League) {
    let slug: string;
    switch (league) {
        case League.MLB: slug = "/baseball/mlb"; break;
        case League.NFL: slug = "/football/nfl"; break;
        case League.NBA: slug = "/basketball/nba"; break;
        case League.NHL: slug = "/hockey/nhl"; break;
        case League.MLS: slug = "/soccer/mls"; break;
    }
    return baseUrl + slug + "/scoreboard";
}

function getScoresForFavorites(): UseCachedPromiseReturnType<Array<Game>, undefined>{
    return useFetch(baseUrl)
}