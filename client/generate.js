
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