import { List } from "@raycast/api";
import { Game } from "./data/Game";
import {Final, InProgress} from "./data/GameState";

export function GameDetail({game}: { game: Game }){
	if (game.gameState instanceof InProgress) {
		return <List.Item.Detail
			markdown={gameMarkdown(game)}
			metadata={
				<List.Item.Detail.Metadata>
					{game.gameState.situation.trim() != "" && <List.Item.Detail.Metadata.Label title="Situation" text={game.gameState.situation}/> }
					<List.Item.Detail.Metadata.Label title="Time" text={game.gameState.time}/>
					<List.Item.Detail.Metadata.Separator/>
					{/*<List.Item.Detail.Metadata.Label title="Teams"/>*/}
					<List.Item.Detail.Metadata.Label title={game.team1.name} text={game.team1.record} icon={game.team1.iconUrl}/>
					<List.Item.Detail.Metadata.Label title={game.team2.name} text={game.team2.record} icon={game.team2.iconUrl}/>
				</List.Item.Detail.Metadata>
			}
		/>
	} else {
//		return <List.Item.Detail markdown={gameMarkdown(game)}/>
		return <List.Item.Detail metadata={
			<List.Item.Detail.Metadata>
				{/*<List.Item.Detail.Metadata.Label title="Teams"/>*/}
				<List.Item.Detail.Metadata.Label title={game.team1.name} text={game.team1.record} icon={game.team1.iconUrl}/>
				<List.Item.Detail.Metadata.Label title={game.team2.name} text={game.team2.record} icon={game.team2.iconUrl}/>
			</List.Item.Detail.Metadata>
		}/>
	}
}

function gameMarkdown(game: Game) {
	const table =
	(game.gameState instanceof InProgress || game.gameState instanceof Final)
		? `
| ​<img src="${game.team1.iconUrl}" alt="${game.team1.name} logo" width="16"/>  **${game.team1.name}** | ${game.gameState.score.score1} |
|--------|--:|
| ​<img src="${game.team2.iconUrl}" alt="${game.team2.name} logo" width="16"/>  **${game.team2.name}** | ${game.gameState.score.score2} |
	`
		: `
| ​<img src="${game.team1.iconUrl}" alt="${game.team1.name} logo" width="16"/>  **${game.team1.name}** (${game.team1.record}) |
|--------|
| ​<img src="${game.team2.iconUrl}" alt="${game.team2.name} logo" width="16"/>  **${game.team2.name}** (${game.team2.record}) |
	`
	return `
*${game.status()}* ∙ ${game.readableScheduledDate()}
${table}
	`
}

function otherMarkdown(game: Game) {
	return `
| ​<img src="${game.team1.iconUrl}" alt="${game.team1.name} logo" width="16"/> **${game.team1.name}** | ${game.team1.record} |
|--------|----:|
| ​<img src="${game.team2.iconUrl}" alt="${game.team2.name} logo" width="16"/> **${game.team2.name}** | ${game.team2.record} |
	`
}