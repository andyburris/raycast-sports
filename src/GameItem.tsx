import { Action, ActionPanel, Icon, List } from "@raycast/api";
import { Game } from "./data/Game";

export function GameItem({ game, isSidebarOpen, onToggleDetail }: { game: Game; isSidebarOpen: boolean, onToggleDetail: () => void }) {
  const name = isSidebarOpen ? game.shortName() : game.name();
  const description = game.description()
  return (
    <List.Item
      title={name}
      key={game.id}
      accessories={[{ text: description }]}
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
        </ActionPanel>
      }
    />
  );
}