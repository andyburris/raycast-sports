export enum Preset {
	Favorites="favorites",
}
export enum League {
    MLB="mlb",
    NFL="nfl",
    NBA="nba",
    NHL="nhl",
    MLS="mls", 
}

export type Category = Preset | League

export function readableCategoryName(category: Category): string {
	switch(category) {
		case Preset.Favorites: return "Favorites";
		case League.MLB: return "MLB";
		case League.NFL: return "NFL";
		case League.NBA: return "NBA";
		case League.NHL: return "NHL";
		case League.MLS: return "MLS";
	} 
} 