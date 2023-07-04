// create
export async function createRecipes(name, inst, prep, cook) {
    console.log(name);
    const response = await fetch(
        `/recipes/create?name=${name}&inst=${inst}&prep=${prep}&cook=${cook}`,
        { method: 'POST' }
    );
    const data = await response.json();
    return data;
}
export async function createIngredients(rname, name, desc, amount, unit) {
    const response = await fetch(
        `/ingredients/create?rname=${rname}&name=${name}&desc=${desc}&amount=${amount}&unit=${unit}`,
        { method: 'POST' }
    );
    const data = await response.json();
    return data;
}
export async function createTags(rname, name) {
    const response = await fetch(
        `/tags/create?rname=${rname}&name=${name}`,
        { method: 'POST' }
    );
    const data = await response.json();
    return data;
}

// read
export async function readRecipes(name) {
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
export async function readIngredients(rname, name) {
    try {
        const response = await fetch(
            `/ingredients/read?rname=${rname}&name=${name}`,
            { method: 'GET' }
        );
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}
export async function readTags(rname, tag) {
    try {
        const response = await fetch(
            `/tags/read?rname=${rname}&tag=${tag}`,
            { method: 'GET' }
        );
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}

// update
export async function updateRecipes(name, newName, inst, prep, cook) {
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
export async function updateIngredients(rname, newRName, name, newName, desc, amount, unit) {
    try {
        const response = await fetch(
            `/ingredients/create?rname=${rname}&newRName=${newRName}&name=${name}&newName=${newName}&desc=${desc}&amount=${amount}&unit=${unit}`,
            { method: 'PUT' }
        );
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}

// delete
export async function deleteRecipes(name) {
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