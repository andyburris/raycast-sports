import { List } from "@raycast/api";

export enum League {
    Favorites="favorites",
    MLB="mlb",
    NFL="nfl",
    NBA="nba",
    NHL="nhl",
    MLS="mls", 
}

function readableLeagueName(league: League): string {
    switch(league) {
        case League.Favorites: return "Favorites";
        case League.MLB: return "MLB";
        case League.NFL: return "NFL";
        case League.NBA: return "NBA";
        case League.NHL: return "NHL";
        case League.MLS: return "MLS";
    } 
} 

export function LeagueDropdown({ currentLeague, onLeagueChange }: { currentLeague: League, onLeagueChange: (league: League) => void }) {
    return (
        <List.Dropdown
            value={currentLeague}
            tooltip="Select league"
            onChange={s => onLeagueChange(s as League)}>
            {Object.values(League).map(l =>
                <List.Dropdown.Item title={readableLeagueName(l)} value={l} key={l}/>
            )}
        </List.Dropdown>
    )
}