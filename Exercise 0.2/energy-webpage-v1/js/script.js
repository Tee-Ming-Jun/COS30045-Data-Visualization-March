
let tvActive = false;

// store  polling interval id 
let pollInterval;

// switch between pages
function showPage(page) {

    // list tabs
    const sections = ["home", "tv", "about"];

    // loop 
    sections.forEach(sec => {
        // hide each section
        document.getElementById(sec).style.display = "none";

        // remove highlight from nav
        document.getElementById("nav-" + sec).classList.remove("active");
    });

   
    document.getElementById(page).style.display = "block";
    document.getElementById("nav-" + page).classList.add("active");


    if (page === "tv") {
        tvActive = true;     
        loadCSV();           // load data 
        startPolling();      // refresh every 5 seconds
    } else {
        tvActive = false;    // not on tv page
        stopPolling();       // stop 
    }
}

// start polling/auto refresh
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

// load CSV and display
function loadCSV() {

    fetch("data/data.csv?v=" + Date.now())
        .then(res => res.text()) // convert response to text
        .then(data => {

            // split CSV into rows
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
            // show error in console if something fails
            console.error("Error loading CSV:", err);
        });
}