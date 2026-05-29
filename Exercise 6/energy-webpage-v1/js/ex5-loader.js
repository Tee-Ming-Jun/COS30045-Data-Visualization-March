// ── Ex 5: Chart Loader — loads each chart from its own CSV ───────
let ex5Loaded = false;

function loadEx5Charts() {
    if (ex5Loaded) { redrawEx5Charts(); return; }
    ex5Loaded = true;

    Promise.all([
        d3.csv("data/Energy_star_scatter.csv"),
        d3.csv("data/Power_price_line.csv"),
        d3.csv("data/Energy_consump_55inch_bar.csv"),
        d3.csv("data/Energy_consump_screentype_donut.csv")
    ]).then(([scatterRaw, lineRaw, barRaw, donutRaw]) => {
        drawScatterPlot(scatterRaw);
        drawLineChart(lineRaw);
        drawBar55Chart(barRaw);
        drawDonutChart(donutRaw);
    }).catch(err => {
        console.error("Chart CSV load error:", err);
    });
}

function redrawEx5Charts() {
    ex5Loaded = false;
    loadEx5Charts();
}

let ex5ResizeTimer;
window.addEventListener("resize", () => {
    const s = document.getElementById("ex5");
    if (s && s.style.display !== "none") {
        clearTimeout(ex5ResizeTimer);
        ex5ResizeTimer = setTimeout(() => { ex5Loaded = false; loadEx5Charts(); }, 300);
    }
});