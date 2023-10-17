import { useState } from "react";
import { Category, Preset } from "./data/League";
import { CategoryList } from "./CategoryList";

export default function Command() {
	const [currentCategory, setCategory] = useState<Category>(Preset.Favorites);
	return <CategoryList key={currentCategory} category={currentCategory} onCategoryChange={setCategory} />;
}