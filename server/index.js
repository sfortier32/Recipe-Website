import 'dotenv/config'
import express from 'express';
import { RecipesDatabase } from './recipesdb.js';
// import { serverFail } from '../client/client.js';

const RecipesRoutes =  (app, db) => {
    app.use(express.static('client'));

    // recipes
    app.post('/recipes/create', (req, res) => {
        try {
            const { rname, inst, prep, cook } = req.query;
            const recipe =  db.createRecipes(rname, inst, prep, cook);
            res.send(JSON.stringify(recipe));
        } catch (err) {
            res.status(500).send(err);
        }
    });
    app.put('/recipes/update', async (req, res) => {
        try {
            const { oldrname, rname, instructions, preptime, cooktime } = req.query;
            const vars = [
                await noChangeRecipes(oldrname, {rname}),
                await noChangeRecipes(oldrname, {instructions}),
                await noChangeRecipes(oldrname, {preptime}),
                await noChangeRecipes(oldrname, {cooktime})
            ];
            const recipe = await db.updateRecipes(oldrname, vars[0], vars[1], vars[2], vars[3]);
            res.send(JSON.stringify(recipe));
        } catch (err) {
            res.status(500).send(err);
        }
    });
    app.delete('/recipes/delete', (req, res) => {
        try {
            const { rname } = req.query;
            const recipe =  db.deleteRecipes(rname);
            res.send(JSON.stringify(recipe));
        } catch (err) {
            res.status(500).send(err);
        }
    });

    // ingredients
    app.post('/ingredients/create', (req, res) => {
        try {
            const { rname, name, desc, amount, unit } = req.query;
            const recipe =  db.createIngredients(rname, name, desc, amount, unit);
            res.send(JSON.stringify(recipe));
        } catch (err) {
            res.status(500).send(err);
        }
    });
    app.put('/ingredients/update', async (req, res) => {
        try {
            const { oldrname, rname, oldname, name, description, amount, unit } = req.query;
            const vars = [
                await noChangeIngredients(oldrname, oldname, {rname}),
                await noChangeIngredients(oldrname, oldname, {name}),
                await noChangeIngredients(oldrname, oldname, {description}),
                await noChangeIngredients(oldrname, oldname, {amount}),
                await noChangeIngredients(oldrname, oldname, {unit})
            ];

            const ingredient = await db.udpateIngredients(oldrname, vars[0], oldname, vars[1], vars[2], vars[3], vars[4]);
            res.send(JSON.stringify(ingredient));
        } catch (err) {
            res.status(500).send(err);
        }
    });
    app.delete('/ingredients/delete', async (req, res) => {
        try {
            const { rname, name } = req.query;
            const ingredient = await db.deleteIngredients(rname, name);
            res.send(JSON.stringify(ingredient));
        } catch (err) {
            res.status(500).send(err);
        }
    });

    // tags
    app.post('/tags/create', async (req, res) => {
        try {
            const { rname, tag } = req.query;
            const tags = await db.createTags(rname, tag);
            res.send(JSON.stringify(tags));
        } catch (err) {
            res.status(500).send(err);
        }
    });
    app.put('/tags/update', async (req, res) => {
        try {
            const { oldrname, rname, oldtag, tag } = req.query;
            const vars = [
                await noChangeTags(oldrname, oldtag, {rname}),
                await noChangeTags(oldrname, oldtag, {tag}),
            ];
            console.log(vars);
            
            const tags =  db.updateTags(oldrname, vars[0], oldtag, vars[1]);
            res.send(JSON.stringify(tags));
        } catch (err) {
            res.status(500).send(err);
        }
    });
    app.delete('/tags/delete', async (req, res) => {
        try {
            const { rname, tag } = req.query;
            const tags =  await db.deleteTags(rname, tag);
            res.send(JSON.stringify(tags));
        } catch (err) {
            res.status(500).send(err);
        }
    });

    // read all
    app.get('/recipes/all', async (req, res) => {
        try {
            const recipes = await db.readAllRecipes();
            res.send(JSON.stringify(recipes));
        } catch (err) {
            res.status(500).send(err);
        }
    });
    app.get('/ingredients/all', async (req, res) => {
        try {
            const ingredients = await db.readAllIngredients();
            res.send(JSON.stringify(ingredients));
        } catch (err) {
            res.status(500).send(err);
        }
    });
    app.get('/tags/all', async (req, res) => {
        try {
            const tags = await db.readAllTags();
            res.send(JSON.stringify(tags));
        } catch (err) {
            res.status(500).send(err);
        }
    });
    app.get('/', (req, res) => {
        res.redirect('/recipes/all');
    });

    // helper functions for update routes
    async function noChangeRecipes (name, varObj) {
        const val = Object.values(varObj)[0];
        const col = Object.keys(varObj)[0];
        if (val === 'nochange') {
            const res = await db.getNoChangeRecipes(name, col);
            return res;
        } else {
            return val;
        }
    };

    async function noChangeIngredients (rname, name, varObj) {
        const val = Object.values(varObj)[0];
        const col = Object.keys(varObj)[0];
        if (val === 'nochange') {
            const res = await db.getNoChangeIngredients(rname, name, col);
            return res;
        } else {
            return val;
        }
    };

    async function noChangeTags (rname, tag, varObj) {
        const val = Object.values(varObj)[0];
        const col = Object.keys(varObj)[0];
        if (val === 'nochange') {
            const res = await db.getNoChangeTags(rname, tag, col);
            return res;
        } else {
            return val;
        }
    };

    return app;
};

const start = async () => {
    const db = await RecipesDatabase(process.env.DATABASE_URL).connect();
    db.init();
    const app = RecipesRoutes(express(), db);
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
};

start();