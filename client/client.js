import * as crud from './crud.js';
import * as dt from './datatable.js';
import * as edit from './editor.js';
import * as gen from './generate.js';

// dt.displayData();

// sidebar listeners

const minusDays = document.getElementById("minusDays");
const plusDays = document.getElementById("plusDays");
const generate = document.getElementById("generate");
const tags = document.getElementById("tags");

minusDays.addEventListener("click", (e) => {
    e.preventDefault();
    let days = Number(document.getElementById("days").innerText);
    if (days > 1) {
        --days;
    }
    document.getElementById("days").innerText = days;
})

plusDays.addEventListener("click", (e) => {
    e.preventDefault();
    let days = Number(document.getElementById("days").innerText);
    if (days < 7) {
        ++days;
    }
    document.getElementById("days").innerText = days;
})

generate.addEventListener("click", (e) => {
    e.preventDefault();
    const numMeals = Number(document.getElementById("days").innerText);
    showMeals(numMeals);
});

function showMeals(num) {
    throw new Error("showMeals not implemented");
}

// main panel listeners
