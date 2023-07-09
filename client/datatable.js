import * as crud from "./crud.js";
import { schema } from "./schema.js";

// main panel
const tableOptions = document.getElementById("table-options");
const table = document.getElementById("table");
const tableNames = ["Recipes", "Ingredients", "Tags"];


export async function displayHeaders(checked) {
    tableOptions.innerHTML = "";
    for (let i = 0; i < tableNames.length; ++i) {

        const newLabel = document.createElement("label");

        const newInput = document.createElement("input");
        newInput.id = tableNames[i].concat("-table");
        newInput.classList.add("radio-headers");
        newInput.name = "radio-group";
        newInput.type = "radio";

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

export async function displayTable(tableName) {
    table.innerHTML = "";

    const headerNames = schema[tableName.toLowerCase()];
    for (let i = 0; i < headerNames.length; ++i) {

        const newRow = document.createElement("td");
        newRow.classList.add("sticky");

        const header = document.createElement("th");

        header.classList.add("table-font");
        header.classList.add("h-tf");
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
        const newRow = document.createElement("tr");

        for (const [key, value] of Object.entries(res[i])) {
            const newCell = document.createElement("td");
            const newDiv = document.createElement('div');
            newDiv.setAttribute("style", `
                min-width: 150px;
                max-height: 45px;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
            `);
            newDiv.innerText = value;
            newDiv.classList.add("table-font");
            newCell.append(newDiv);
            newRow.appendChild(newCell);
        }

        table.appendChild(newRow);
    }
}