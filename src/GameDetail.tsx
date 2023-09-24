import { List } from "@raycast/api";
import { Game } from "./data/Game";

export function GameDetail({game}: { game: Game }){
	return (
		<List.Item.Detail markdown={gameMarkdown(game)}/>
	)
}

function gameMarkdown(game: Game) {
	return `
​<img src="${game.team1.iconUrl}" alt="${game.team1.name} logo" width="25"/> **${game.team1.name}**  (${game.team1.record})

​<img src="${game.team2.iconUrl}" alt="${game.team2.name} logo" width="25"/> **${game.team2.name}**  (${game.team2.record})
																																						`
}

function otherMarkdown(game: Game) {
	return `
| <img src="${game.team1.iconUrl}" alt="${game.team1.name} logo" width="20"/> **${game.team1.name}** | ${game.team1.record} |
|--------|----:|
| <img src="${game.team2.iconUrl}" alt="${game.team2.name} logo" width="20"/> **${game.team2.name}** | ${game.team2.record} |
	`
}