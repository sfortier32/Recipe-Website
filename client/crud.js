// create
export async function createRecipe(name, inst, prep, cook) {
    console.log(name);
    const response = await fetch(
        `/recipes/create?name=${name}&inst=${inst}&prep=${prep}&cook=${cook}`,
        { method: 'POST' }
    );
    const data = await response.json();
    return data;
}
export async function createIngredient(rname, name, desc, amount, unit) {
    const response = await fetch(
        `/recipes/ingredients/create?rname=${rname}&name=${name}&desc=${desc}&amount=${amount}&unit=${unit}`,
        { method: 'POST' }
    );
    const data = await response.json();
    return data;
}
export async function createTag(rname, name) {
    const response = await fetch(
        `/recipes/tags/create?rname=${rname}&name=${name}`,
        { method: 'POST' }
    );
    const data = await response.json();
    return data;
}

// read
export async function readRecipe(name) {
    try {
        const response = await fetch(
            `/recipes/read?name=${name}`,
            { method: 'GET' }
        );
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}
export async function readIngredient(rname, name) {
    try {
        const response = await fetch(
            `/recipes/ingredients/read?rname=${rname}&name=${name}`,
            { method: 'GET' }
        );
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}
export async function readTag(rname, tag) {
    try {
        const response = await fetch(
            `/recipes/tags/read?rname=${rname}&tag=${tag}`,
            { method: 'GET' }
        );
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}

// update
export async function updateRecipe(name, newName, inst, prep, cook) {
    try {
        const response = await fetch(
            `/recipes/create?name=${name}&newName=${newName}&inst=${inst}&prep=${prep}&cook=${cook}`,
            { method: 'PUT' }
        );
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}
export async function updateIngredient(rname, newRName, name, newName, desc, amount, unit) {
    try {
        const response = await fetch(
            `/recipes/ingredients/create?rname=${rname}&newRName=${newRName}&name=${name}&newName=${newName}&desc=${desc}&amount=${amount}&unit=${unit}`,
            { method: 'PUT' }
        );
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}

// delete
export async function deleteRecipe(name) {
    try {
        const response = await fetch(
            `/recipes/delete?name=${name}`,
            { method: 'DELETE' }
        );
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}
export async function deleteIngredient(rname, name) {
    try {
        const response = await fetch(
            `/recipes/ingredients/delete?rname=${rname}&name=${name}`,
            { method: 'DELETE' }
        );
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}
export async function deleteTag(rname, tag) {
    try {
        const response = await fetch(
            `/recipes/tags/delete?rname=${rname}&tag=${tag}`,
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