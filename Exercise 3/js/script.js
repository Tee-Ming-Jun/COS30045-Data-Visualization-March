let tvActive = false;

// store polling interval id
let pollInterval;

// ── Storyboard data ──────────────────────────────────────────────
const storyboards = {

    frequency: {
        title: "TV Screen Frequency in Australia",
        panels: [
            {
                image: "images/panel1.png",  
                description: "A consumer walks into an electronics store and sees a wide range of TVs with different screen technologies."
            },
            {
                image: "images/panel2.png",
                description: "With so many options available, he starts thinking about which screen technology is the most common."
            },
            {
                image: "images/panel3.png",
                description: "He begins comparing the three main types available, LCD LED, LCD, and OLED, to understand the market better."
            },
            {
                image: "images/panel4.png",
                description: "After reviewing more detailed information, he identifies that one technology appears far more frequently than the others."
            },
            {
                image: "images/panel5.png",
                description: "The data confirms it clearly as LCD (LED) dominates with 3800 models, while LCD has 481 and OLED has 311."
            },
            {
                image: "images/panel6.png",
                description: "Based on the data, he chooses an LCD LED TV as it is the most widely available option."
            }
        ]
    },

    technology: {
        title: "Screen Technology Power Consumption",
        panels: [
            {
                image: "images/panel7.png",
                description: "While watching his new TV, he checks his phone and notices his electricity bill has increased sharply, making him realise the TV might be consuming more power than expected."
            },
            {
                image: "images/panel8.png",
                description: "He begins researching the three main screen technologies, LCD LED, LCD, and OLED, to compare how much power each one consumes."
            },
            {
                image: "images/panel9.png",
                description: "After analyzing the data, he reviews the bar chart comparing power consumption across LCD LED, LCD, and OLED to identify which uses the least power."
            },
            {
                image: "images/panel10.png",
                description: "He sees that OLED and LCD (LED) use more power, so he checks his own TV specifications on his phone."
            },
            {
                image: "images/panel11.png",
                description: "He compares his TV specifications with the data and realizes his current TV uses more power than other options."
            },
            {
                image: "images/panel12.png",
                description: "He decides to switch to an LCD TV as it consumes the least power and helps reduce electricity costs."
            }
        ]
    }
};

// ── Slideshow state ──────────────────────────────────────────────
let currentStoryboard = null;
let currentSlide = 0;

function openStoryboard(type) {
    currentStoryboard = storyboards[type];
    currentSlide = 0;

    document.getElementById("modal-title").textContent = currentStoryboard.title;

    // Build dot indicators
    const dotsEl = document.getElementById("slide-dots");
    dotsEl.innerHTML = currentStoryboard.panels.map((_, i) =>
        `<span class="dot ${i === 0 ? 'active' : ''}" onclick="goToSlide(${i})"></span>`
    ).join("");

    renderSlide();
    document.getElementById("storyboard-modal").style.display = "flex";
}

function closeStoryboard() {
    document.getElementById("storyboard-modal").style.display = "none";
}

function closeStoryboardOnOverlay(event) {
    if (event.target === document.getElementById("storyboard-modal")) {
        closeStoryboard();
    }
}

function renderSlide() {
    const panel = currentStoryboard.panels[currentSlide];
    const total = currentStoryboard.panels.length;

    // Image
    const img = document.getElementById("slide-img");
    const placeholder = document.getElementById("slide-placeholder");
    const placeholderLabel = document.getElementById("placeholder-label");

    if (panel.image) {
        img.src = panel.image;
        img.style.display = "block";
        placeholder.style.display = "none";
    } else {
        img.style.display = "none";
        placeholder.style.display = "flex";
        placeholderLabel.textContent = "Panel " + (currentSlide + 1);
    }

    // Description
    document.getElementById("slide-desc").textContent = panel.description;

    // Counter
    document.getElementById("slide-counter").textContent = `${currentSlide + 1} / ${total}`;

    // Dots
    document.querySelectorAll(".dot").forEach((dot, i) => {
        dot.classList.toggle("active", i === currentSlide);
    });
}

function nextSlide() {
    const total = currentStoryboard.panels.length;
    currentSlide = (currentSlide + 1) % total;
    renderSlide();
}

function prevSlide() {
    const total = currentStoryboard.panels.length;
    currentSlide = (currentSlide - 1 + total) % total;
    renderSlide();
}

function goToSlide(index) {
    currentSlide = index;
    renderSlide();
}

// ── Page navigation ──────────────────────────────────────────────
function showPage(page) {
    const sections = ["home", "tv", "storyboard", "about"];

    sections.forEach(sec => {
        document.getElementById(sec).style.display = "none";
        document.getElementById("nav-" + sec).classList.remove("active");
    });

    document.getElementById(page).style.display = "block";
    document.getElementById("nav-" + page).classList.add("active");

    if (page === "tv") {
        tvActive = true;
        loadCSV();
        startPolling();
    } else {
        tvActive = false;
        stopPolling();
    }
}

// ── Polling ──────────────────────────────────────────────────────
function startPolling() {
    if (!pollInterval) {
        pollInterval = setInterval(() => {
            if (tvActive) loadCSV();
        }, 5000);
    }
}

function stopPolling() {
    clearInterval(pollInterval);
    pollInterval = null;
}

// ── CSV loader ───────────────────────────────────────────────────
function loadCSV() {
    fetch("data/data.csv?v=" + Date.now())
        .then(res => res.text())
        .then(data => {
            const rows = data
                .trim()
                .replace(/\r/g, "")
                .split("\n")
                .slice(1);

            const tableBody = document.getElementById("tv-table-body");

            tableBody.innerHTML = rows.map(row => {
                const cols = row.split(",");
                if (cols.length === 4) {
                    return `
                        <tr>
                            <td>${cols[0]}</td>
                            <td>${cols[1]}</td>
                            <td>${cols[2]}</td>
                            <td>${cols[3]}</td>
                        </tr>
                    `;
                }
                return "";
            }).join("");
        })
        .catch(err => {
            console.error("Error loading CSV:", err);
        });
}

// ── Keyboard navigation for modal ────────────────────────────────
document.addEventListener("keydown", function (e) {
    const modal = document.getElementById("storyboard-modal");
    if (modal.style.display !== "flex") return;

    if (e.key === "ArrowRight") nextSlide();
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "Escape") closeStoryboard();
});