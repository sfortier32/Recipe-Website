import * as crud from './crud.js';
import { schema } from './schema.js';

// sidebar listeners
const minusDays = document.getElementById("minusDays");
const plusDays = document.getElementById("plusDays");

minusDays.addEventListener("click", (e) => {
    e.preventDefault();
    let days = Number(document.getElementById("days").innerText);
    if (days > 1) {
        --days;
    }
    document.getElementById("days").innerText = days;
});

plusDays.addEventListener("click", (e) => {
    e.preventDefault();
    let days = Number(document.getElementById("days").innerText);
    if (days < 7) {
        ++days;
    }
    document.getElementById("days").innerText = days;
});


// main panel listeners

const tableOptions = document.getElementById("table-options");
const table = document.getElementById('table');
const tableNames = ["Recipes", "Ingredients", "Tags"];


async function displayHeaders(checked) {
    tableOptions.innerHTML = '';
    for (let i = 0; i < tableNames.length; ++i) {

        const newLabel = document.createElement('label');

        const newInput = document.createElement('input');
        newInput.id = tableNames[i].concat('-table');
        newInput.classList.add('radio-headers');
        newInput.name = 'radio-group';
        newInput.type = 'radio';

        if (tableNames[i] === checked) {
            newInput.setAttribute("checked", "checked");
        }
        
        newLabel.setAttribute("for", newInput.id);
        newLabel.innerHTML = tableNames[i];

        newInput.addEventListener("click", (e) => {
            e.preventDefault();
            displayHeaders(tableNames[i]);
            displayTable(tableNames[i]);
        });

        newLabel.appendChild(newInput);

        tableOptions.appendChild(newLabel);
    }
};

async function displayTable(tableName) {
    table.innerHTML = '';

    const headerNames = schema[tableName.toLowerCase()];
    for (let i = 0; i < headerNames.length; ++i) {

        const newRow = document.createElement('td');
        const header = document.createElement('th');

        header.classList.add('table-font');
        header.classList.add('h-tf');
        header.innerText = headerNames[i];

        newRow.appendChild(header);
        table.appendChild(newRow);
    }

    let res = await crud.readAllRecipes();

    if (tableName === "Ingredients") {
        res = await crud.readAllIngredients();
    } else if (tableName === "Tags") {
        res = await crud.readAllTags();
    }

    for (let i = 0; i < res.length; ++i) {
        const newRow = document.createElement('tr');

        for (const [key, value] of Object.entries(res[i])) {
            const newCell = document.createElement('td');
            newCell.innerText = value;
            newCell.classList.add('table-font');
            newRow.appendChild(newCell);
        }

        table.appendChild(newRow);
    }
}


// database editor
const editorHeaders = document.getElementById("editor-headers");
const editorActions = document.getElementById("editor-actions");
const radioHeadersGroup = document.getElementsByName("radio-editor-headers");
const radioCrudGroup = document.getElementsByName("radio-editor-crud");

document.getElementById('editor-btn').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById("editor").style.display = "block";
    displayEditorHeaders("Recipes");
    displayCrudButtons("Create");
    verifyEditorSelection();
});

document.getElementById('close-btn').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById("editor").style.display = "none";
});


function displayEditorHeaders(tableChecked) {
    editorHeaders.innerHTML = '';
    for (let i = 0; i < 3; ++i) {

        const newLabel = document.createElement('label');

        const newInput = document.createElement('input');
        newInput.id = tableNames[i].concat('-editor-table');
        newInput.classList.add('radio-editor-headers');
        newInput.name = 'radio-editor-headers';
        newInput.type = 'radio';

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
    editorActions.innerHTML = '';
    const actions = ["Create", "Update", "Delete"];
    for (let i = 0; i < 3; ++i) {
        const newLabel = document.createElement('label');

        const newInput = document.createElement('input');
        newInput.id = actions[i];
        newInput.classList.add('radio-green');
        newInput.name = 'radio-editor-crud';
        newInput.type = 'radio';

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
    editorForm.innerText = '';

    let headerChecked = '';
    let crudChecked = '';
    for (let i = 0; i < radioHeadersGroup.length; ++i) {
        if (radioHeadersGroup[i].checked) {
            headerChecked = radioHeadersGroup[i].id.split('-')[0];
            break;
        }
    }
    for (let i = 0; i < radioCrudGroup.length; ++i) {
        if (radioCrudGroup[i].checked) {
            crudChecked = radioCrudGroup[i].id.split('-')[0];
            break;
        }
    }
    displayForm(headerChecked, crudChecked);

}

function displayForm(tableName, crudOption) {
    editorForm.innerHTML = '';
    if (tableName === "Recipes") {
        if (crudOption === "Create") {
            editorForm.innerText = "Recipes Create";
        } else if (crudOption === "Update") {
            editorForm.innerText = "Recipes Update";
        } else if (crudOption === "Delete") {
            editorForm.innerText = "Recipes Delete";
        }
    } else if (tableName === "Ingredients") {
        if (crudOption === "Create") {
            editorForm.innerText = "Ingredients Create";
        } else if (crudOption === "Update") {
            editorForm.innerText = "Ingredients Update";
        } else if (crudOption === "Delete") {
            editorForm.innerText = "Ingredients Delete";
        }
    } else if (tableName === "Tags") {
        if (crudOption === "Create") {
            editorForm.innerText = "Tags Create";
        } else if (crudOption === "Update") {
            editorForm.innerText = "Tags Update";
        } else if (crudOption === "Delete") {
            editorForm.innerText = "Tags Delete";
        }
    };
}

// other

async function init() {
    displayHeaders("Recipes");
    await displayTable("Recipes");
}

init();