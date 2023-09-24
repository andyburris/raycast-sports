import { List } from "@raycast/api";
import { Category, League, Preset, readableCategoryName } from "./data/League";



export function CategoryDropdown({ currentCategory, onCategoryChange }: { currentCategory: Category, onCategoryChange: (league: Category) => void }) {
    return (
		<List.Dropdown
			value={currentCategory}
			tooltip="Select league"
			onChange={s => onCategoryChange(s as Category)}
		>
			<List.Dropdown.Item title={readableCategoryName(Preset.Favorites)} value={Preset.Favorites} key={Preset.Favorites}/>
			<List.Dropdown.Section title="Leagues">
				{Object.values(League).map(l =>
					<List.Dropdown.Item title={readableCategoryName(l)} value={l} key={l}/>
				)}
			</List.Dropdown.Section>
		</List.Dropdown>
    )
}