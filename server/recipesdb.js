import pg from 'pg';

const { Pool } = pg;

export const RecipesDatabase = (dburl) => {
    return {
        connect: async () => {
            const p = new Pool({
                connectionString: dburl
            });
            return RecipeQuery(p, await p.connect());
        },
    };
};

const RecipeQuery = (pool, client) => {
    return {
        init: async () => {
            const queryTables = `
                CREATE TABLE IF NOT EXISTS recipes (
                    rid SERIAL PRIMARY KEY,
                    name VARCHAR NOT NULL UNIQUE,
                    instructions VARCHAR DEFAULT NULL,
                    preptime INTEGER DEFAULT NULL,
                    cooktime INTEGER DEFAULT NULL
                );
                
                CREATE TABLE IF NOT EXISTS ingredients (
                    rid SERIAL REFERENCES recipes(rid) ON DELETE CASCADE,
                    name VARCHAR,
                    description VARCHAR DEFAULT NULL,
                    amount DECIMAL DEFAULT NULL,
                    unit VARCHAR DEFAULT NULL,
                    PRIMARY KEY (rid, name)
                );
                
                CREATE TABLE IF NOT EXISTS tags (
                    rid SERIAL REFERENCES recipes(rid) ON DELETE CASCADE,
                    tag VARCHAR DEFAULT NULL,
                    PRIMARY KEY (rid, tag)
                );
            `;
            const resTables = await client.query(queryTables);
            
            const queryInsert = `
                INSERT INTO recipes(name) 
                VALUES ('Sun Dried Tomato and Pesto Pasta')
                ON CONFLICT DO NOTHING;
                INSERT INTO ingredients(rid, name, description, amount, unit)
                VALUES ((SELECT rid FROM recipes WHERE name='Sun Dried Tomato and Pesto Pasta'), 'Penne Rigate', NULL, 1, 'lb'),
                    ((SELECT rid FROM recipes WHERE name='Sun Dried Tomato and Pesto Pasta'), 'Italian Sausage', NULL, 1, 'lb'),
                    ((SELECT rid FROM recipes WHERE name='Sun Dried Tomato and Pesto Pasta'), 'Buitoni Basil Pesto', NULL, 7, 'oz'),
                    ((SELECT rid FROM recipes WHERE name='Sun Dried Tomato and Pesto Pasta'), 'Sundried Tomatoes in Oil', NULL, 1, 'jar'),
                    ((SELECT rid FROM recipes WHERE name='Sun Dried Tomato and Pesto Pasta'), 'Crushed Red Pepper', NULL, 1, NULL),
                    ((SELECT rid FROM recipes WHERE name='Sun Dried Tomato and Pesto Pasta'), 'Parmesan Cheese', NULL, 0.75, 'cup'),
                    ((SELECT rid FROM recipes WHERE name='Sun Dried Tomato and Pesto Pasta'), 'Parsley', 4, NULL, 'tbsp')
                ON CONFLICT DO NOTHING;
                
                INSERT INTO recipes(name) 
                VALUES ('Carbonara')
                ON CONFLICT DO NOTHING;

                INSERT INTO ingredients(rid, name, description, amount, unit)
                VALUES ((SELECT rid FROM recipes WHERE name='Carbonara'), 'Pasta', 'Any Type', 12, 'oz'),
                    ((SELECT rid FROM recipes WHERE name='Carbonara'), 'Bacon', DEFAULT, 8, 'slice'),
                    ((SELECT rid FROM recipes WHERE name='Carbonara'), 'Onion', 'Medium', 0.5, DEFAULT),
                    ((SELECT rid FROM recipes WHERE name='Carbonara'), 'Garlic', 'Minced', 2, 'clove'),
                    ((SELECT rid FROM recipes WHERE name='Carbonara'), 'Egg', DEFAULT, 3, DEFAULT),
                    ((SELECT rid FROM recipes WHERE name='Carbonara'), 'Parmesan', 'Finely Grated', 0.75, 'cup'),
                    ((SELECT rid FROM recipes WHERE name='Carbonara'), 'Heavy Cream', DEFAULT, 0.75, 'cup'),
                    ((SELECT rid FROM recipes WHERE name='Carbonara'), 'Salt', DEFAULT, DEFAULT, DEFAULT),
                    ((SELECT rid FROM recipes WHERE name='Carbonara'), 'Black Pepper', 'Plenty', DEFAULT, DEFAULT),
                    ((SELECT rid FROM recipes WHERE name='Carbonara'), 'Peas', DEFAULT, 0.5, 'cup')
                ON CONFLICT DO NOTHING;


                INSERT INTO tags(rid, tag) 
                VALUES ((SELECT rid FROM recipes WHERE name='Carbonara'), 'Bulk'),
                    ((SELECT rid FROM recipes WHERE name='Carbonara'), 'Quick'),
                    ((SELECT rid FROM recipes WHERE name='Carbonara'), 'Cheap'),
                    ((SELECT rid FROM recipes WHERE name='Sun Dried Tomato and Pesto Pasta'), 'Bulk')
                ON CONFLICT DO NOTHING;
                `;
            const resInsert = await client.query(queryInsert);
        },

        close: async () => {
            client.release();
            await pool.end();
        },

        // create
        createRecipe: async (name, inst, prep, cook) => {
            const vars = [name, inst, prep, cook].map(x => x === 'null' ? null : x);
            const queryText = `
                INSERT INTO recipes(name, instructions, preptime, cooktime)
                VALUES($1, $2, $3, $4)
                RETURNING *
            `;
            const res = await client.query(queryText, vars);
            return res.rows;
        },
        createIngredient: async (rname, name, desc, amount, unit) => {
            const vars = [rname, name, desc, amount, unit].map(x => x === 'null' ? null : x);
            const queryText = `
                INSERT INTO ingredients (rid, name, description, amount, unit)
                VALUES ((SELECT rid FROM recipes WHERE name = $1), $2, $3, $4, $5)
                RETURNING *;
            `;
            const res = await client.query(queryText, vars);
            return res.rows;
        },
        createTag: async (rname, tag) => {
            const vars = [rname, tag].map(x => x === 'null' ? null : x);
            const queryText = `
                INSERT INTO tags (rid, tag)
                VALUES ((SELECT rid FROM recipes WHERE name = $1), $2)
                RETURNING *;
            `;
            const res = await client.query(queryText, vars);
            return res.rows;
        },

        // read
        readRecipe: async (name) => {
            const vars = [name].map(x => x === 'null' ? null : x);
            const queryText = `
                SELECT * FROM recipes WHERE name = $1;
            `;
            const res = await client.query(queryText, vars);
            return res.rows;
        },
        readIngredient: async (rname, name) => {
            const vars = [rname, name].map(x => x === 'null' ? null : x);
            const queryText = `
                SELECT *
                FROM ingredients
                WHERE rid = (SELECT rid FROM recipes WHERE name = $1) AND name = $2;
            `;
            const res = await client.query(queryText, vars);
            return res.rows;
        },
        readTag: async (rname, tag) => {
            const vars = [rname, tag].map(x => x === 'null' ? null : x);
            const queryText = `
                SELECT rid, tag
                FROM tags
                WHERE rid = (SELECT rid FROM recipes WHERE name = $1) AND tag = $2;
            `;
            const res = await client.query(queryText, vars);
            return res.rows;
        },

        // update
        updateRecipe: async (name, newName, inst, prep, cook) => {
            const vars = [name, newName, inst, prep, cook].map(x => x === 'null' ? null : x);
            const queryText = `
                UPDATE recipes
                SET name = $2,
                    instructions = $3,
                    preptime = $4,
                    cooktime = $5
                WHERE name = $1
                RETURNING *;
            `;
            const res = await client.query(queryText, vars);
            return res.rows;
        },
        udpateIngredient: async (rname, newRName, name, newName, desc, amount, unit) => {
            const vars = [rname, newRName, name, newName, desc, amount, unit].map(x => x === 'null' ? null : x);
            const queryText = `
                UPDATE ingredients
                SET rid = (SELECT rid FROM recipes WHERE name = $2),
                    name = $4,
                    description = $5,
                    amount = $6,
                    unit = $7
                WHERE rid = (SELECT rid FROM recipes WHERE name = $1) AND name = $3
                RETURNING *;
            `;
            const res = await client.query(queryText, vars);
            return res.rows;
        },

        // delete
        deleteRecipe: async (name) => {
            const vars = [name].map(x => x === 'null' ? null : x);
            const queryText = `
                DELETE FROM recipes WHERE name = $1 RETURNING *;
            `;
            const res = await client.query(queryText, [name]);
            return res.rows;
        },
        deleteIngredient: async (rname, name) => {
            const queryText = `
                DELETE FROM ingredients
                WHERE rid = (SELECT rid FROM recipes WHERE name = $1) AND name = $2
                RETURNING *;
            `;
            const res = await client.query(queryText, vars);
            return res.rows;
        },
        deleteTag: async (rname, tag) => {
            const vars = [rname, tag].map(x => x === 'null' ? null : x);
            const queryText = `
                DELETE FROM tags
                WHERE rid = (SELECT rid FROM recipes WHERE name = $1) AND tag = $2
                RETURNING *;
            `;
            const res = await client.query(queryText, vars);
            return res.rows;
        },


        // read all
        readAllRecipes: async () => {
            const queryText = `
                SELECT * FROM recipes;
            `;
            const res = await client.query(queryText);
            return res.rows;
        },
        readAllIngredients: async () => {
            const queryText = `
                SELECT * FROM ingredients;
            `;
            const res = await client.query(queryText);
            return res.rows;
        },
        readAllTags: async () => {
            const queryText = `
                SELECT * FROM tags;
            `;
            const res = await client.query(queryText);
            return res.rows;
        },
    };
};