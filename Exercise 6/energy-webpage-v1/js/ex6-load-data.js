// ── Ex 6: Load Data ──────────────────────────────────────────────
let ex6DataLoaded = false;

const loadEx6Data = () => {
    if (ex6DataLoaded) return;
    ex6DataLoaded = true;

    d3.csv("data/Ex6_TVdata.csv", d => ({
        brand:             d.brand,
        model:             d.model,
        screenSize:        +d.screenSize,
        screenTech:        d.screenTech,
        energyConsumption: +d.energyConsumption,
        star:              +d.star
    })).then(data => {
        console.log("Ex6 data loaded:", data);

        // Draw charts
        ex6DrawHistogram(data);
        ex6DrawScatterplot(data);
        ex6PopulateFilters(data);

        // Attach tooltip and mouse events
        ex6CreateTooltip();
        ex6HandleMouseEvents();

    }).catch(error => {
        console.error("Error loading Ex6 CSV:", error);
    });
};