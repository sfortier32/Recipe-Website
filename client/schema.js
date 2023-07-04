export { schema };

const schema = {
    recipes: [
        "name",
        "instructions",
        "preptime",
        "cooktime"
    ],
    ingredients: [
        "recipe",
        "name", 
        "description",
        "amount",
        "unit"
    ],
    tags: [
        "recipe",
        "tag"
    ]
}