db = db.getSiblingDB('recipeSample')
recipesCollection = db.getCollection("recipes")
recipesCollection.insert({

   recipeTitle: 'Cereal',
   recipeId: 5,
   ingredients: "Cereal of choice, we recommend: Special K, Cheerios. Milk",
   calories: 100-400,
   protein: 10,
   fat: 4,
   carbs: 10,
   sugar: 30,
   goal: 'Cut'
})