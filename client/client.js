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
        newInput.classList.add('radio-custom');
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
const editorTables = document.getElementById("editor-tables");
const editorButton = document.getElementById('editor-btn');
const closeButton = document.getElementById('close-btn');
const editor = document.getElementById("editor");


editorButton.addEventListener('click', (e) => {
    e.preventDefault();
    editor.style.display = "block";
    displayEditorHeaders("Recipes");
});

closeButton.addEventListener('click', (e) => {
    e.preventDefault();
    editor.style.display = "none";
});

function displayEditorHeaders(checked) {
    editorTables.innerHTML = '';
    for (let i = 0; i < tableNames.length; ++i) {

        const newLabel = document.createElement('label');

        const newInput = document.createElement('input');
        newInput.id = tableNames[i].concat('-editor-table');
        newInput.classList.add('radio-custom');
        newInput.name = 'radio-editor-group';
        newInput.type = 'radio';

        if (tableNames[i] === checked) {
            newInput.setAttribute("checked", "checked");
        }
        
        newLabel.setAttribute("for", newInput.id);
        newLabel.innerHTML = tableNames[i];

        newInput.addEventListener("click", (e) => {
            e.preventDefault();
            displayEditorHeaders(tableNames[i]);
        });

        newLabel.appendChild(newInput);

        editorTables.appendChild(newLabel);
    }

}


// other

async function init() {
    displayHeaders("Recipes");
    await displayTable("Recipes");
}

init();