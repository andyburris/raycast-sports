import { GameItem } from "./GameItem";
import { List } from "@raycast/api";
import { Game } from "./data/Game";

export function GameSection({
	title,
	games,
	isShowingDetail,
	onToggleDetail
}: {
	title: string,
	games: Game[],
	isShowingDetail: boolean,
	onToggleDetail: () => void
}) {
	return (
		<List.Section title={title} key={title}>
			{games.map(g => <GameItem game={g} key={g.id} onToggleDetail={onToggleDetail} isSidebarOpen={isShowingDetail}/>)}
		</List.Section>
		)
}