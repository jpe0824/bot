const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("recipe")
    .setDescription("Returns a random recipe for you to make!"),
  async execute(interaction) {
    const fetch = require("node-fetch");
    let recipe = " ";
    await fetch("https://www.themealdb.com/api/json/v1/1/random.php")
      .then((response) => response.json())
      .then((data) => {
        const meal = data.meals[0];
        const ingredients = [];

        for (let i = 1; i <= 20; i++) {
          const ingredient = meal[`strIngredient${i}`];
          const measure = meal[`strMeasure${i}`];
          if (ingredient) {
            ingredients.push(`${ingredient} (${measure})`);
          }
        }

        let mealInfo = `${meal.strMeal}\n\nIngredients: ${ingredients.join(", ")}\n\nInstructions: ${meal.strInstructions}`;

        if (mealInfo.length > 1900) {
          let outputString = mealInfo.substring(0, 1900);
          mealInfo = `${outputString} ...`;
        }

        const source = meal.strSource ? `\n\nSource: ${meal.strSource}` : "";
        recipe = `${mealInfo}${source}`;
      })
      .catch((err) => console.error(err));
    await interaction.reply(recipe);
  },
};
