import { List } from "@raycast/api";
import { CategoryDropdown } from "./Dropdown";
import { useEffect, useMemo, useState } from "react";
import { getScoresFor } from "./scoreRepository";
import { GameItem } from "./GameItem";
import { Final, InProgress, Scheduled } from "./data/GameState";
import { Game } from "./data/Game";
import { Category, League, Preset } from "./data/League";

export default function Command() {
	const [currentCategory, onCategoryChange] = useState<Category>(League.NFL);
	const { isLoading, data, revalidate } = getScoresFor(currentCategory);
	const [isShowingDetail, setShowingDetail] = useState(false);
	useEffect(() => console.log(data), [data])
	const [games, setGames] = useState<Game[]>([])
	useEffect(() => {
		if (data != undefined && data.length > 0 && data[0] instanceof Game) {
			setGames(data)
		}
	}, [data])
	const inProgressGames: Game[] = games?.filter((g) => g.gameState instanceof InProgress) ?? []
	const pastGames: Game[] = games?.filter((g) => g.gameState instanceof Final) ?? []
	const futureGames: Game[] = games?.filter((g) => g.gameState instanceof Scheduled) ?? []
	return (
    <List
      isLoading={isLoading}
      searchBarAccessory={<CategoryDropdown currentCategory={currentCategory} onCategoryChange={onCategoryChange} />}
      isShowingDetail={isShowingDetail}
    >
      {inProgressGames.length > 0 && (
        <GameSection
          title="In Progress"
          games={inProgressGames}
          isShowingDetail={isShowingDetail}
          onToggleDetail={() => setShowingDetail(!isShowingDetail)}
        />
      )}
      {futureGames.length > 0 && (
        <GameSection
          title="Scheduled Games"
          games={futureGames}
          isShowingDetail={isShowingDetail}
          onToggleDetail={() => setShowingDetail(!isShowingDetail)}
        />
      )}
      {pastGames.length > 0 && (
        <GameSection
          title="Past Games"
          games={pastGames}
          isShowingDetail={isShowingDetail}
          onToggleDetail={() => setShowingDetail(!isShowingDetail)}
        />
      )}
    </List>
  );
}

function GameSection({
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