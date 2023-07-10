import * as crud from "./crud.js";

// sidebar listeners
const minusDays = document.getElementById('minus-days');
const plusDays = document.getElementById('plus-days');
const generate = document.getElementById('generate-button');
const bottomContainer = document.getElementById('bottom-container');
const mealsDisplay = document.getElementById('meals-display');

minusDays.addEventListener('click', (e) => {
    e.preventDefault();
    let days = Number(document.getElementById('days').innerText);
    if (days > 1) {
        --days;
    }
    document.getElementById('days').innerText = days;
});

plusDays.addEventListener('click', (e) => {
    e.preventDefault();
    let days = Number(document.getElementById('days').innerText);
    if (days < 7) {
        ++days;
    }
    document.getElementById('days').innerText = days;
});

generate.addEventListener('click', async (e) => {
    e.preventDefault();
    const data = await crud.generate(Number(document.getElementById('days').innerText));
    showMealsDisplay(data);
});


function showMealsDisplay(data) {
    bottomContainer.style.display = 'block';
    mealsDisplay.innerHTML = '';
    
    for (const ele of data) {
        const newDiv = document.createElement('div');
        newDiv.classList.add('recipe-card');
        let html = `
            <h3>${ele["rname"]}</h3>
        `;
        newDiv.innerHTML = html;
        mealsDisplay.appendChild(newDiv);
    }
}

document.getElementById('generate-clear').addEventListener('click', (e) => {
    bottomContainer.style.display = 'none';
});