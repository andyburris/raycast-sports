import {Action, ActionPanel, Detail, Icon, List} from "@raycast/api";
import { Game } from "./data/Game";
import { GameDetail } from "./GameDetail";
import { getEndpointForLeague } from "./scoreRepository";

export function GameItem({ game, isSidebarOpen, onToggleDetail }: { game: Game; isSidebarOpen: boolean, onToggleDetail: () => void }) {
//	const name = isSidebarOpen ? game.shortName() : game.name();
	const name = game.nameAndScore()
	const description = game.description()
  return (
	<List.Item
      	title={name}
//		subtitle={game.score()}
      	key={game.id}
//		accessories={[{ text: description }]}
//		accessories={[
//			{ text: description },
//			{ icon: game.team1.iconUrl, text: (game.gameState instanceof InProgress || game.gameState instanceof Final) ? game.gameState.score.score1 : game.team1.record },
//			{ icon: game.team2.iconUrl, text: (game.gameState instanceof InProgress || game.gameState instanceof Final) ? game.gameState.score.score2 : game.team2.record },
//		]}
		accessories={[
		{ text: description },
		{ icon: game.team1.iconUrl },
		{ icon: game.team2.iconUrl },
		]}
		detail={<GameDetail game={game}/>}
      actions={
        <ActionPanel>
          <Action
              title={isSidebarOpen ? "Close Sidebar" : "Open in Sidebar"}
              onAction={() => onToggleDetail()}
              icon={Icon.AppWindowSidebarLeft}
          />
          <Action.OpenInBrowser url={game.url} />
          <Action title={`Add ${game.team1.name} to Favorites`} icon={Icon.Heart} />
          <Action title={`Add ${game.team2.name} to Favorites`} icon={Icon.Heart} />
			<Action.OpenInBrowser title="Open Debug URL"  url={getEndpointForLeague(game.league)}/>
        </ActionPanel>
      }
    />
  );
}