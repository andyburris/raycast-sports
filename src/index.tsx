import {ActionPanel, Detail, List, Action, ListSection} from "@raycast/api";
import { League, LeagueDropdown } from "./Dropdown";
import { useEffect, useMemo, useState } from "react";
import { getScoresFor } from "./scoreRepository";
import {GameItem} from "./GameItem";
import { Final, InProgress, Scheduled } from "./data/GameState";
import { Game } from "./data/Game";

export default function Command() {
  const [currentLeague, onLeagueChange] = useState(League.NFL)
  const { isLoading, data, revalidate } = getScoresFor(currentLeague)
  const [isShowingDetail, setShowingDetail] = useState(false)
//  useEffect(() => console.log(data), [data])
  const inProgressGames: Game[] = useMemo(() => data?.filter(g => g.gameState instanceof InProgress) ?? [], [data])
  const pastGames: Game[] = useMemo(() => data?.filter(g => g.gameState instanceof Final) ?? [], [data])
  const futureGames: Game[] = useMemo(() => data?.filter(g => g.gameState instanceof Scheduled) ?? [], [data])
  return (
    <List
      isLoading={isLoading}
      searchBarAccessory={<LeagueDropdown currentLeague={currentLeague} onLeagueChange={onLeagueChange}/>}
      isShowingDetail={isShowingDetail}
    >
      {inProgressGames.length > 0 &&
        <GameSection
          title="In Progress"
          games={inProgressGames}
          isShowingDetail={isShowingDetail}
          onToggleDetail={() => setShowingDetail(!isShowingDetail)}/>}
      {futureGames.length > 0 &&
        <GameSection
          title="Scheduled Games"
          games={futureGames}
          isShowingDetail={isShowingDetail}
          onToggleDetail={() => setShowingDetail(!isShowingDetail)}/>}
      {pastGames.length > 0 &&
        <GameSection
          title="Past Games"
          games={pastGames}
          isShowingDetail={isShowingDetail}
          onToggleDetail={() => setShowingDetail(!isShowingDetail)}/>}
    </List>
  );
}

function GameSection({title, games, isShowingDetail, onToggleDetail}: { title: string, games: Game[], isShowingDetail: boolean, onToggleDetail: () => void }) {
  return (
    <List.Section title={title}>
      {games.map(g => <GameItem game={g} onToggleDetail={onToggleDetail} isSidebarOpen={isShowingDetail}/>)}
    </List.Section>
  )
}