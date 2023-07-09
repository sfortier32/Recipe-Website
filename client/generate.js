
// sidebar listeners
const minusDays = document.getElementById("minusDays");
const plusDays = document.getElementById("plusDays");
const generate = document.getElementById("generate-button");

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

generate.addEventListener("click", (e) => {
    // crud get meals
});