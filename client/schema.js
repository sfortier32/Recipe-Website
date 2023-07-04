export { schema };

const schema = {
    recipes: [
        "rid",
        "name",
        "instructions",
        "preptime",
        "cooktime"
    ],
    ingredients: [
        "rid",
        "name", 
        "description",
        "amount",
        "unit"
    ],
    tags: [
        "rid",
        "tag"
    ]
}