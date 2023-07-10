import * as crud from "./crud.js";

// sidebar listeners
const minusDays = document.getElementById('minus-days');
const plusDays = document.getElementById('plus-days');
const generate = document.getElementById('generate-button');
const bottomContainer = document.getElementById('bottom-container');
const mealsDisplay = document.getElementById('meals-display');
const days = document.getElementById('days');

minusDays.addEventListener('click', (e) => {
    e.preventDefault();
    let numDays = Number(days.innerText);
    if (numDays > 1) {
        --numDays;
    }
    localStorage.setItem('days', numDays);
    days.innerText = numDays;
});

plusDays.addEventListener('click', (e) => {

    localStorage.clear();
    e.preventDefault();
    let numDays = Number(days.innerText);
    if (numDays < 7) {
        ++numDays;
    }
    localStorage.setItem('days', numDays);
    days.innerText = numDays;
});

document.getElementsByName('switch').forEach(ele => {
    ele.addEventListener('click', (e) => {
        e.preventDefault();
        const input = ele.querySelector('input');
        if (input.checked === null) {
            input.setAttribute('checked', true);
            localStorage.setItem(input.id, input.checked);
        } else {
            if (input.checked) {
                input.removeAttribute('checked');
                localStorage.removeItem(input.id);
            } else {
                input.setAttribute('checked', true);
                localStorage.setItem(input.id, input.checked);
            }
        }
    });
});

generate.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const tags = [];
    const selectedTags = document.getElementsByName('tag-switch');
    for (const tag of selectedTags) {
        if (tag.checked) { tags.push(tag.value); }
    }

    const data = await crud.generate(Number(document.getElementById('days').innerText), tags);
    localStorage.setItem('meals', JSON.stringify(data));
    showMealsDisplay(data);
});


export function showMealsDisplay(data) {
    bottomContainer.style.display = 'block';
    localStorage.setItem('bottom-container', 'block');

    mealsDisplay.innerHTML = '';
    let iter = 0;

    for (const ele of data) {
        const newDiv = document.createElement('div');
        newDiv.classList.add('recipe-card');
        let html = `<div class="header negbr">Day ${++iter}</div><br>`;
        html += `<div class="field"><strong>Recipe:</strong> ${ele["rname"]}</div>`;
        if (ele["cooktime"] !== null) {
            html += `<div class="field"><strong>Cook Time:</strong> ${ele["cooktime"]} min</div>`;
        }
        if (ele["preptime"] !== null) {
            html += `<div class="field"><strong>Prep Time:</strong> ${ele["preptime"]} min</div>`;
        }
        html += `<div class="field"><strong>Tags:</strong> ${ele["tags"]}</div>`;

        newDiv.innerHTML = html;
        mealsDisplay.appendChild(newDiv);
    }
}

document.getElementById('generate-clear').addEventListener('click', (e) => {
    bottomContainer.style.display = 'none';
    localStorage.setItem('bottom-container', 'none');
    localStorage.removeItem('meals');
});