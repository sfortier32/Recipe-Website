import * as crud from "./crud.js";
import * as dt from "./datatable.js";
import * as gen from "./generate.js";

// database editor
const tableNames = ["Recipes", "Ingredients", "Tags"];
const editorHeaders = document.getElementById("editor-headers");
const editorActions = document.getElementById("editor-actions");
const radioHeadersGroup = document.getElementsByName("radio-editor-headers");
const radioCrudGroup = document.getElementsByName("radio-editor-crud");

let headerChecked = "Recipes";
let crudChecked = "Create"; 

const response = document.getElementById("response");
function responseSuccess() {
    response.hidden = false;
    response.innerHTML = "Success"
    response.style = "font-size: 16px; font-weight: 600; color: var(--green); margin-top: 10px;"
    setTimeout(function() { response.hidden = true;}, 3000);
}
function responseFail(err) {
    console.log(err);
    response.hidden = false;
    response.innerHTML = `${err}`;
    response.style = "font-size: 13px; font-weight: 600; color: var(--red); margin-top: 10px;"
    setTimeout(function() { response.hidden = true;}, 10000);
}


document.getElementById("editor-btn").addEventListener("click", (e) => { // open editor
    e.preventDefault();
    document.getElementById("editor").style.display = "block";
    displayEditorHeaders("Recipes");
    displayCrudButtons("Create");
    verifyEditorSelection();
});

document.getElementById("close-btn").addEventListener("click", (e) => { // close editor
    e.preventDefault();
    document.getElementById("editor").style.display = "none";
});


function displayEditorHeaders(tableChecked) {
    editorHeaders.innerHTML = "";
    for (let i = 0; i < 3; ++i) {

        const newLabel = document.createElement("label");

        const newInput = document.createElement("input");
        newInput.id = tableNames[i].concat("-editor-table");
        newInput.classList.add("radio-editor-headers");
        newInput.name = "radio-editor-headers";
        newInput.type = "radio";

        if (tableNames[i] === tableChecked) {
            newInput.setAttribute("checked", "checked");
        }
        
        newLabel.setAttribute("for", newInput.id);
        newLabel.innerHTML = tableNames[i];

        newInput.addEventListener("click", (e) => {
            e.preventDefault();
            displayEditorHeaders(tableNames[i]);
            verifyEditorSelection();
        });

        newLabel.appendChild(newInput);

        editorHeaders.appendChild(newLabel);
    }

}

function displayCrudButtons(crudChecked) {
    editorActions.innerHTML = "";
    const actions = ["Create", "Update", "Delete"];
    for (let i = 0; i < 3; ++i) {
        const newLabel = document.createElement("label");

        const newInput = document.createElement("input");
        newInput.id = actions[i];
        newInput.classList.add("radio-headers");
        newInput.name = "radio-editor-crud";
        newInput.type = "radio";

        if (actions[i] === crudChecked) {
            newInput.setAttribute("checked", "checked");
        }
        
        newLabel.setAttribute("for", newInput.id);
        newLabel.innerHTML = actions[i];
        newLabel.classList.add("editor-action-type");

        newInput.addEventListener("click", (e) => {
            e.preventDefault();
            displayCrudButtons(actions[i]);
            verifyEditorSelection();
        });

        newLabel.appendChild(newInput);
        editorActions.appendChild(newLabel);
    }   
}


const editorForm = document.getElementById("editor-form");
function verifyEditorSelection() {
    editorForm.innerText = "";
    for (let i = 0; i < radioHeadersGroup.length; ++i) {
        if (radioHeadersGroup[i].checked) {
            headerChecked = radioHeadersGroup[i].id.split("-")[0];
            break;
        }
    }
    for (let i = 0; i < radioCrudGroup.length; ++i) {
        if (radioCrudGroup[i].checked) {
            crudChecked = radioCrudGroup[i].id.split("-")[0];
            break;
        }
    }
    displayForm(headerChecked, crudChecked);
}


function getElements(tableName, crudOption) {
    let elements = [];
    switch (tableName) {
        case "Recipes":
            switch(crudOption) {
                case "Create":
                    elements = ["Name", "Instructions", "Prep Time", "Cook Time"]; break;
                case "Update":
                    elements = ["Name", "New Name", "Instructions", "Prep Time", "Cook Time"]; break;
                case "Delete":
                    elements = ["Name"]; break;
                
            }
            break;
        case "Ingredients":
            switch(crudOption) {
                case "Create":
                    elements = ["Recipe Name", "Ingredient Name", "Description", "Amount", "Unit"]; break;
                case "Update":
                    elements = ["Recipe Name", "New Recipe Name", "Ingredient Name",
                        "New Ingredient Name", "Description", "Amount", "Unit"]; break;
                case "Delete":
                    elements = ["Recipe Name", "Ingredient Name"]; break;
            }
            break;
        case "Tags":
            switch(crudOption) {
                case "Create":
                    elements = ["Recipe Name", "Tag"]; break;
                case "Update":
                    elements = ["Recipe Name", "New Recipe Name", "Tag", "New Tag"]; break;
                case "Delete":
                    elements = ["Recipe Name", "Tag"]; break;
            }
            break;
    }
    return elements;
}


function displayForm(tableName, crudOption) {
    editorForm.innerHTML = "";
    let elements = getElements(tableName, crudOption);

    for (const ele of elements) {
        const newDiv = document.createElement("div");
        newDiv.classList.add("inline-form");

        const label = document.createElement("label"); // name label
        label.setAttribute("for", ele);
        label.innerText = ele;
        if (ele.endsWith('Name') && !ele.startsWith('New') || ele === 'Tag') {
            label.innerText = label.innerText.concat('*');
        }
        label.classList.add("label-left");

        let newInput = document.createElement("input"); // input type
        if (ele === "Instructions") {
            newInput = document.createElement("textarea");
            newInput.cols = 40;
            newInput.rows = 5;
        } else {
            if (ele.split(" ")[1] === "Time") {
                newInput.type = "number";
            } else {
                newInput.type = "text";
            }
        }
        newInput.id = ele; // input id
        newInput.name = tableName.toLowerCase().concat(crudOption); // input name
        const inputSpan = document.createElement("span"); // <span><input...
        inputSpan.appendChild(newInput);

        newDiv.appendChild(label);
        if (ele.split(" ")[1] === "Time") { // unit label
            const unitLabel = document.createElement("label");
            unitLabel.classList.add("label-right");
            unitLabel.innerText = "min";
            newDiv.appendChild(unitLabel);
        }
        newDiv.appendChild(inputSpan);
        editorForm.appendChild(newDiv);
    }

    const message = document.createElement('p');
    message.id = 'smallText';
    if (crudOption === "Update") {
        message.innerHTML = "*required fields, leave others blank if no change";
    } else {
        message.innerHTML = "*required fields";
    }
    editorForm.appendChild(message);
}


document.getElementById("submit").addEventListener("click", (e) => {
    e.preventDefault();
    submitForm().then();
});


async function submitForm() {
    // TODO: Throw error if null mandatory fields
    if (headerChecked === "Recipes") {
        const name = document.getElementById("Name").value;
        if (crudChecked === "Create") {
            try {
                if (name === '') { throw new Error('Must fill in name field.')};
                const vars = [
                    document.getElementById("Instructions").value,
                    document.getElementById("Prep Time").value,
                    document.getElementById("Cook Time").value
                ].map(x => replaceNull(x));

                await crud.createRecipes(name, vars[0], vars[1], vars[2]);
                responseSuccess();
                editorForm.reset();
            } catch (err) {
                responseFail(err);
            }
        } else if (crudChecked === "Update") {
            try {
                if (name === '') { throw new Error('Must fill in name field.')};
                const vars = [
                    document.getElementById("New Name").value,
                    document.getElementById("Instructions").value,
                    document.getElementById("Prep Time").value,
                    document.getElementById("Cook Time").value
                ].map(x => replaceNoChange(x));

                await crud.updateRecipes(name, vars[0], vars[1], vars[2], vars[3]);
                responseSuccess();
                editorForm.reset();
            } catch (err) {
                responseFail(err);
            }
        } else if (crudChecked === "Delete") {
            try {
                if (name === '') { throw new Error('Must fill in name field.')};
                await crud.deleteRecipes(name);
                responseSuccess();
                editorForm.reset();
            } catch (err) { 
                responseFail(err);
            }
        }
    } else if (headerChecked === "Ingredients") {
        const rname = document.getElementById("Recipe Name").value;
        const name = document.getElementById("Ingredient Name").value;
        if (crudChecked === "Create") {
            try {
                if (name === '' || rname === '') { throw new Error('Must fill in required fields.')};
                const vars = [
                    document.getElementById("Description").value,
                    document.getElementById("Amount").value,
                    document.getElementById("Unit").value
                ].map(x => replaceNull(x));

                await crud.createIngredients(rname, name, vars[0], vars[1], vars[2]);
                responseSuccess();
                editorForm.reset();
            } catch (err) {
                responseFail(err);
            }
        } else if (crudChecked === "Update") {
            try {
                if (name === '' || rname === '') { throw new Error('Must fill in requried fields.')};
                const vars = [
                    document.getElementById("New Recipe Name").value,
                    document.getElementById("New Ingredient Name").value,
                    document.getElementById("Description").value,
                    document.getElementById("Amount").value,
                    document.getElementById("Unit").value
                ].map(x => replaceNoChange(x));

                await crud.updateIngredients(rname, vars[0], name, vars[1], vars[2], vars[3], vars[4]);
                responseSuccess();
                editorForm.reset();
            } catch (err) {
                responseFail(err);
            }
        } else if (crudChecked === "Delete") {
            try {
                if (name === '' || rname === '') { throw new Error('Must fill in requried fields.')};
                await crud.deleteIngredients(rname, name);
                responseSuccess();
                editorForm.reset();
            } catch (err) {
                responseFail(err);
            }
        }
    } else if (headerChecked === "Tags") {
        const rname = document.getElementById("Recipe Name").value;
        const tag = document.getElementById("Tag").value;
        if (crudChecked === "Create") {
            try {
                if (rname === '' || tag === '') { throw new Error('Must fill in requried fields.')};
                await crud.createTags(rname, tag);
                responseSuccess();
            } catch (err) {
                responseFail(err);
            }
        } else if (crudChecked === "Update") {
            try {
                if (rname === '' || tag === '') { throw new Error('Must fill in requried fields.')};
                const vars = [
                    document.getElementById("New Recipe Name").value,
                    document.getElementById("New Tag").value
                ].map(x => replaceNoChange(x));

                await crud.updateTags(rname, vars[0], tag, vars[1]);
                responseSuccess();
            } catch (err) {
                responseFail(err);
            }
        } else if (crudChecked === "Delete") {
            try {
                if (rname === '' || tag === '') { throw new Error('Must fill in requried fields.')};
                await crud.deleteTags(rname, tag);
                responseSuccess();
            } catch (err) {
                responseFail(err);
            }
        }
    } else {
        responseFail(new Error("Form Broken"));
    }

    document.getElementById(headerChecked.concat("-table")).setAttribute('checked', 'checked');
    dt.displayTable(headerChecked);
    
}

function replaceNoChange(val) {
    return val === '' || val === null ? 'nochange' : val;
}
function replaceNull(val) {
    return val === '' ? null : val;
}


// main
async function init() {
    dt.displayHeaders("Recipes");
    await dt.displayTable("Recipes");
}

init();