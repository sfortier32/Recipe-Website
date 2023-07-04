import * as crud from "./crud.js";
import * as dt from "./datatable.js";

// database editor
const tableNames = ["Recipes", "Ingredients", "Tags"];
const editorHeaders = document.getElementById("editor-headers");
const editorActions = document.getElementById("editor-actions");
const radioHeadersGroup = document.getElementsByName("radio-editor-headers");
const radioCrudGroup = document.getElementsByName("radio-editor-crud");

let headerChecked = "Recipes";
let crudChecked = "Create"; 

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
        newInput.classList.add("radio-crud");
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
                    elements = ["Recipe Name", "Tag"]; break;
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
        if (ele.split(' ')[0] === "New") {
            newInput.placeholder = "Enter old one if no change"
        }

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

    const mandatory = document.createElement('p');
    mandatory.id = 'smallText';
    mandatory.innerHTML = "*all fields required";
    editorForm.appendChild(mandatory);
}


document.getElementById("submit").addEventListener("click", (e) => {
    e.preventDefault();
    submitForm();
});


const response = document.getElementById("response");
function responseSuccess() {
    response.innerHTML = "Success"
    response.style = "font-size: 16px; font-weight: 600; color: var(--green); margin-top: 10px;"
}
function responseFail() {
    response.innerHTML = "Failed: Check your spelling and make sure the entered information exists."
    response.style = "font-size: 13px; font-weight: 600; color: var(--red); margin-top: 10px;"
}



async function submitForm() {
    const action = headerChecked.toLowerCase().concat(crudChecked);
    if (action === "recipesCreate") {

    } else if (action === "recipesUpdate") {

    } else if (action === "recipesDelete") {
        const rname = document.getElementById("Name").value;
        response.hidden = false;
        try {
            await crud.deleteRecipes(rname);
            responseSuccess();
            editorForm.reset();
        } catch (err) {
            responseFail();
        }
        setTimeout(function() { response.hidden = true;}, 3000);

    } else if (action === "ingredientsCreate") {

    } else if (action === "ingredientsUpdate") {

    } else if (action === "ingredientsDelete") {

    } else if (action === "tagsCreate") {

    } else if (action === "tagsUpdate") {

    } else if (action === "tagsDelete") {

    }
}

async function init() {
    dt.displayHeaders("Recipes");
    await dt.displayTable("Recipes");
}

init();