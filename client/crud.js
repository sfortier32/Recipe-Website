// recipes
export async function createRecipes(name, inst, prep, cook) {
    const response = await fetch(
        `/recipes/create?rname=${name}&inst=${inst}&prep=${prep}&cook=${cook}`,
        { method: 'POST' }
    );
    const data = await response.json();
    return data;
}
export async function updateRecipes(oldrname, rname, inst, prep, cook) {
    try {
        const response = await fetch(
            `/recipes/update?oldrname=${oldrname}&rname=${rname}&instructions=${inst}&preptime=${prep}&cooktime=${cook}`,
            { method: 'PUT' }
        );
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}
export async function deleteRecipes(rname) {
    try {
        const response = await fetch(
            `/recipes/delete?rname=${rname}`,
            { method: 'DELETE' }
        );
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}

// ingredients
export async function createIngredients(rname, name, desc, amount, unit) {
    const response = await fetch(
        `/ingredients/create?rname=${rname}&name=${name}&desc=${desc}&amount=${amount}&unit=${unit}`,
        { method: 'POST' }
    );
    const data = await response.json();
    return data;
}
export async function updateIngredients(oldrname, rname, oldname, name, desc, amt, unit) {
    try {
        const response = await fetch(
            `/ingredients/update?oldrname=${oldrname}&rname=${rname}&oldname=${oldname}&name=${name}&description=${desc}&amount=${amt}&unit=${unit}`,
            { method: 'PUT' }
        );
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}
export async function deleteIngredients(rname, name) {
    try {
        const response = await fetch(
            `/ingredients/delete?rname=${rname}&name=${name}`,
            { method: 'DELETE' }
        );
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}

// tags
export async function createTags(rname, tag) {
    const response = await fetch(
        `/tags/create?rname=${rname}&tag=${tag}`,
        { method: 'POST' }
    );
    const data = await response.json();
    return data;
}
export async function updateTags(oldrname, rname, oldtag, tag) {
    const response = await fetch(
        `/tags/update?oldrname=${oldrname}&rname=${rname}&oldtag=${oldtag}&tag=${tag}`,
        { method: 'PUT' }
    );
    const data = await response.json();
    return data;
}
export async function deleteTags(rname, tag) {
    try {
        const response = await fetch(
            `/tags/delete?rname=${rname}&tag=${tag}`,
            { method: 'DELETE' }
        );
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}

// read all
export async function readAllRecipes() {
    try {
        const response = await fetch(
            `/recipes/all`,
            { method: 'GET' }
        );
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}
export async function readAllIngredients() {
    try {
        const response = await fetch(
            `/ingredients/all`,
            { method: 'GET' }
        );
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}
export async function readAllTags() {
    try {
        const response = await fetch(
            `/tags/all`,
            { method: 'GET' }
        );
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}

// generate
export async function generate(num) {
    try {
        const response = await fetch(`/generate?num=${num}`, {
            method: 'GET'
        });
        const data = await response.json();
        return data;
    } catch (err) {
        console.log("ERROR Displayed in CRUD");
        console.log(err);
    }
}