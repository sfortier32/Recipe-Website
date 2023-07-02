import 'dotenv/config';
import express from 'express';
import { RecipesDatabase } from './recipesdb.js';

const RecipesRoutes = (app, db) => {
    app.use(express.static('client'));

    // create
    app.post('/recipes/create', async (req, res) => {
        try {
            const { name, inst, prep, cook } = req.query;
            const recipe = await db.createRecipe(name, inst, prep, cook);
            res.send(JSON.stringify(recipe));
        } catch (err) {
            res.status(500).send(err);
        }
    });
    app.post('/recipes/ingredients/create', async (req, res) => {
        try {
            const { rname, name, desc, amount, unit } = req.query;
            const recipe = await db.createIngredient(rname, name, desc, amount, unit);
            res.send(JSON.stringify(recipe));
        } catch (err) {
            res.status(500).send(err);
        }
    });
    app.post('/recipes/tags/create', async (req, res) => {
        try {
            const { rname, tag } = req.query;
            const tags = await db.createTag(rname, tag);
            res.send(JSON.stringify(tags));
        } catch (err) {
            res.status(500).send(err);
        }
    });

    // read
    app.get('/recipes/read', (req, res) => {
        try {
            const { name } = req.query;
            const recipe = db.readRecipe(name);
            res.send(JSON.stringify(recipe));
        } catch (err) {
            res.status(500).send(err);
        }
    });
    app.get('/recipes/ingredients/read', (req, res) => {
        try {
            const { rname, name } = req.query;
            const ingredients = db.readIngredients(rname, name);
            res.send(JSON.stringify(ingredients));
        } catch (err) {
            res.status(500).send(err);
        }
    });
    app.get('/recipes/tags/read', (req, res) => {
        try {
            const { rname, tag } = req.query;
            const tags = db.readTags(rname, tag);
            res.send(JSON.stringify(tags));
        } catch (err) {
            res.status(500).send(err);
        }
    });

    // update
    app.put('/recipes/update', (req, res) => {
        try {
            const { name, newName, inst, prep, cook } = req.query;
            const recipe = db.updateRecipe(name, newName, inst, prep, cook);
            res.send(JSON.stringify(recipe));
        } catch (err) {
            res.status(500).send(err);
        }
    });
    app.put('/recipes/ingredients/update', (req, res) => {
        try {
            const { rname, newRName, name, newName, desc, amount, unit } = req.query;
            const ingredient = db.updateRecipe(rname, newRName, name, newName, desc, amount, unit);
            res.send(JSON.stringify(ingredient));
        } catch (err) {
            res.status(500).send(err);
        }
    });

    // delete
    app.delete('/recipes/delete', (req, res) => {
        try {
            const { name } = req.query;
            const recipe = db.deleteRecipe(name);
            res.send(JSON.stringify(recipe));
        } catch (err) {
            res.status(500).send(err);
        }
    });
    app.delete('/recipes/ingredients/delete', (req, res) => {
        try {
            const { rname, name } = req.query;
            const ingredient = db.deleteRecipe(rname, name);
            res.send(JSON.stringify(ingredient));
        } catch (err) {
            res.status(500).send(err);
        }
    });
    app.delete('/recipes/tags/delete', (req, res) => {
        try {
            const { rname, tag } = req.query;
            const tags = db.deleteRecipe(rname, tag);
            res.send(JSON.stringify(tags));
        } catch (err) {
            res.status(500).send(err);
        }
    });

    // other
    app.get('/recipes/all', async (req, res) => {
        try {
            const recipes = await db.readAllRecipes();
            res.send(JSON.stringify(recipes));
        } catch (err) {
            res.status(500).send(err);
        }
    });
    app.get('/', (req, res) => {
        res.redirect('/recipes/all');
    });

    return app;
};

const start = async () => {
    const db = await RecipesDatabase(process.env.DATABASE_URL).connect();
    const app = RecipesRoutes(express(), db);
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
};

start();