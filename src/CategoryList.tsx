import { Action, ActionPanel, List } from "@raycast/api";
import { CategoryDropdown } from "./Dropdown";
import { useEffect, useState } from "react";
import { getEndpointForLeague, getScoresFor } from "./scoreRepository";
import { Final, InProgress, Scheduled } from "./data/GameState";
import { Game } from "./data/Game";
import { Category, Preset } from "./data/League";
import { GameSection } from "./GameSection";

export function CategoryList({ category, onCategoryChange }: { category: Category, onCategoryChange: (newCategory: Category) => void }) {
	const [isLoading, setLoading] = useState(true)
	const [games, setGames] = useState<Game[] | undefined>(undefined)
	useEffect(() => {
		getScoresFor(category)
			.then(scores => {
				if (scores != undefined && scores.length > 0 && scores[0] instanceof Game) {
					setGames(scores)
					setLoading(false)
				}
			})
	}, [])
	const [isShowingDetail, setShowingDetail] = useState(false);

	const inProgressGames: Game[] = games?.filter((g) => g.gameState instanceof InProgress) ?? [];
	const pastGames: Game[] = games?.filter((g) => g.gameState instanceof Final) ?? [];
	const futureGames: Game[] = games?.filter((g) => g.gameState instanceof Scheduled) ?? [];
	return (
		<List
			isLoading={isLoading}
			searchBarAccessory={
				<CategoryDropdown currentCategory={category} onCategoryChange={onCategoryChange} />
			}
			isShowingDetail={isShowingDetail}
			actions={
				<ActionPanel>
					{category != Preset.Favorites && (
						<Action.OpenInBrowser title="Open Debug URL" url={getEndpointForLeague(category)} />
						)}
				</ActionPanel>
			}
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