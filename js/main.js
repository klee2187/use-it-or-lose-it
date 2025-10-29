// Load css for each page
function loadPageStyle(filename) {
    const styleLink = document.getElementById("page-style");
    styleLink.setAttribute("href", `css/${filename}`);
}

// Mascot speech text
function updateMascotMessage(message) {
    const speech = document.getElementById("mascotSpeech");
    if (speech) speech.textContent = message;
}

// Nav event handling
document.querySelectorAll("#navbar a").forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();

        document.querySelectorAll("#navbar a").forEach(a => a.classList.remove("active"));
        link.classList.add("active");

        const page = link.dataset.page;
        const content = document.getElementById("content");

        switch (page) {
            case "home":
                content.innerHTML = `
                <h2>Welcome to Use It or Lose It!</h2>
                <p>Track, store, and use your food storage wisely.</p>
                `;
                loadPageStyle("home.css");
                updateMascotMessage("Hey there! Let's keep your food fresh and organized ");
                break;

            case "inventory":
                loadInventoryFeature();
                loadPageStyle("inventory.css");
                updateMascotMessage("Adding new foot items? Let's keep that pantry full! ");
                break;

            case "recipes":
                loadRecipesFeature();
                loadPageStyle("recipes.css");
                updateMascotMessage("Let's cook something yummy! ");
                break;

            case "budget":
                loadBudgetFeature();
                loadPageStyle("budget.css");
                updateMascotMessage("Let's use that budget wisely! ");
                break;
        }
    });
});

// Load default
loadPageStyle("home.css");