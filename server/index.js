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
            const data =  db.createRecipes(rname, inst, prep, cook);
            res.status(200).send(JSON.stringify(data));
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
            const data = await db.updateRecipes(oldrname, vars[0], vars[1], vars[2], vars[3]);
            res.status(200).send(JSON.stringify(data));
        } catch (err) {
            res.status(500).send(err);
        }
    });
    app.delete('/recipes/delete', (req, res) => {
        try {
            const { rname } = req.query;
            const data =  db.deleteRecipes(rname);
            res.status(200).send(JSON.stringify(data));
        } catch (err) {
            res.status(500).send(err);
        }
    });

    // ingredients
    app.post('/ingredients/create', (req, res) => {
        try {
            const { rname, name, desc, amount, unit } = req.query;
            const data =  db.createIngredients(rname, name, desc, amount, unit);
            res.status(200).send(JSON.stringify(data));
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

            const data = await db.udpateIngredients(oldrname, vars[0], oldname, vars[1], vars[2], vars[3], vars[4]);
            res.status(200).send(JSON.stringify(data));
        } catch (err) {
            res.status(500).send(err);
        }
    });
    app.delete('/ingredients/delete', async (req, res) => {
        try {
            const { rname, name } = req.query;
            const data = await db.deleteIngredients(rname, name);
            res.status(200).send(JSON.stringify(data));
        } catch (err) {
            res.status(500).send(err);
        }
    });

    // tags
    app.post('/tags/create', async (req, res) => {
        try {
            const { rname, tag } = req.query;
            const data = await db.createTags(rname, tag);
            res.status(200).send(JSON.stringify(data));
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
            
            const data =  db.updateTags(oldrname, vars[0], oldtag, vars[1]);
            res.status(200).send(JSON.stringify(data));
        } catch (err) {
            res.status(500).send(err);
        }
    });
    app.delete('/tags/delete', async (req, res) => {
        try {
            const { rname, tag } = req.query;
            const data =  await db.deleteTags(rname, tag);
            res.status(200).send(JSON.stringify(data));
        } catch (err) {
            res.status(500).send(err);
        }
    });

    // read all
    app.get('/recipes/all', async (req, res) => {
        try {
            const data = await db.readAllRecipes();
            res.status(200).send(JSON.stringify(data));
        } catch (err) {
            res.status(500).send(err);
        }
    });
    app.get('/ingredients/all', async (req, res) => {
        try {
            const data = await db.readAllIngredients();
            res.status(200).send(JSON.stringify(data));
        } catch (err) {
            res.status(500).send(err);
        }
    });
    app.get('/tags/all', async (req, res) => {
        try {
            const data = await db.readAllTags();
            res.status(200).send(JSON.stringify(data));
        } catch (err) {
            res.status(500).send(err);
        }
    });
    app.get('/', (req, res) => {
        res.redirect('/recipes/all');
    });

    // for generate feature
    app.get('/generate', async (req, res) => {
        try {
            const { num } = req.query;
            const data = await db.getRandomRecipes(num);
            res.status(200).send(JSON.stringify(data));
        } catch (err) {
            res.status(500).send(err);
        }
    });

    // helper functions for update routes
    async function noChangeRecipes (name, varObj) {
        const val = Object.values(varObj)[0];
        if (val === 'nochange') {
            const data = await db.getNoChangeRecipes(name, Object.keys(varObj)[0]);
            return data;
        } else {
            return val;
        }
    };

    async function noChangeIngredients (rname, name, varObj) {
        const val = Object.values(varObj)[0];
        if (val === 'nochange') {
            const data = await db.getNoChangeIngredients(rname, name, Object.keys(varObj)[0]);
            return data;
        } else {
            return val;
        }
    };

    async function noChangeTags (rname, tag, varObj) {
        const val = Object.values(varObj)[0];
        if (val === 'nochange') {
            const res = await db.getNoChangeTags(rname, tag, Object.keys(varObj)[0]);
            return data;
        } else {
            return data;
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