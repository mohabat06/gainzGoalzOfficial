
interface IRecipeModel {
    recipeTitle: string;
    recipeId: number;
    ingredients: string;
    instructions: string;
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    sugar: number;
    goal: string;
}
export default IRecipeModel;