import {Action, ActionPanel, Detail, Icon, List, LocalStorage} from "@raycast/api";
import { Game } from "./data/Game";
import { GameDetail } from "./GameDetail";
import { getAllFavorites, getEndpointForLeague } from "./scoreRepository";
import {useEffect, useState} from "react";

export function GameItem({ game, isSidebarOpen, onToggleDetail }: { game: Game; isSidebarOpen: boolean, onToggleDetail: () => void }) {
	//	const name = isSidebarOpen ? game.shortName() : game.name();
	const name = game.nameAndScore()
	const description = game.description()
	const [isTeam1Favorite, setTeam1Favorite] = useState<boolean | undefined>(undefined)
	const [isTeam2Favorite, setTeam2Favorite] = useState<boolean | undefined>(undefined)
	useEffect(() => {
		getAllFavorites().then(favorites => {
			setTeam1Favorite(favorites.some(f => f.league == game.league && f.id == game.team1.id))
			setTeam2Favorite(favorites.some(f => f.league == game.league && f.id == game.team2.id))
		})
	}, [])
  return (
	<List.Item
      	title={game.nameAndScore()}
//		subtitle={game.score()}
      	key={game.id}
//		accessories={[{ text: description }]}
//		accessories={[
//			{ text: description },
//			{ icon: game.team1.iconUrl, text: (game.gameState instanceof InProgress || game.gameState instanceof Final) ? game.gameState.score.score1 : game.team1.record },
//			{ icon: game.team2.iconUrl, text: (game.gameState instanceof InProgress || game.gameState instanceof Final) ? game.gameState.score.score2 : game.team2.record },
//		]}
		accessories={itemAccessories(game, isSidebarOpen)}
		detail={<GameDetail game={game}/>}
      actions={
        <ActionPanel>
          <Action
              title={isSidebarOpen ? "Close Sidebar" : "Open in Sidebar"}
              onAction={() => onToggleDetail()}
              icon={Icon.AppWindowSidebarLeft}
          />
          <Action.OpenInBrowser url={game.url} />
			{ isTeam1Favorite ?? (isTeam1Favorite)
				? <Action title={`Remove ${game.team1.name} from Favorites`} icon={Icon.Heart} onAction={() => {
					LocalStorage.removeItem(`favorite-${game.league}-${game.team1.id}`)
					setTeam1Favorite(false)
				}} />
				: <Action title={`Add ${game.team1.name} to Favorites`} icon={Icon.Heart} onAction={() => {
					LocalStorage.setItem(`favorite-${game.league}-${game.team1.id}`, game.team1.id)
					setTeam1Favorite(true)
				}} />}
			{ isTeam2Favorite ?? (isTeam2Favorite)
				? <Action title={`Remove ${game.team2.name} from Favorites`} icon={Icon.Heart} onAction={() => {
					LocalStorage.removeItem(`favorite-${game.league}-${game.team2.id}`)
					setTeam2Favorite(false)
				}} />
				: <Action title={`Add ${game.team2.name} to Favorites`} icon={Icon.Heart} onAction={() => {
					LocalStorage.setItem(`favorite-${game.league}-${game.team2.id}`, game.team2.id)
					setTeam2Favorite(true)
				}} />}
			<Action.OpenInBrowser title="Open Debug URL"  url={getEndpointForLeague(game.league)}/>
        </ActionPanel>
      }
    />
  );
}

function itemAccessories(game: Game, isSidebarOpen: boolean): List.Item.Accessory[] {
	if (isSidebarOpen) {
		return [
			{ text: game.description() },
		]
	} else {
		return [
			{ text: game.description() },
			{ icon: game.team1.iconUrl },
			{ icon: game.team2.iconUrl },
		]
	}
}