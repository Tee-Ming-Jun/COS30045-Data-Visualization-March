// ── Ex 6: Scatterplot ────────────────────────────────────────────
const ex6DrawScatterplot = (data) => {

    // Set up chart area
    const svg = d3.select("#scatterplot")
        .append("svg")
        .attr("viewBox", `0 0 ${ex6Width} ${ex6Height}`)
        .style("width", "100%")
        .style("height", "auto");

    // innerChartS is declared in shared-constants as let, assigned here
    ex6InnerChartS = svg.append("g")
        .attr("transform", `translate(${ex6Margin.left},${ex6Margin.top})`);

    // Set up x and y scales
    ex6XScaleS
        .domain([0, d3.max(data, d => d.star) + 0.5])
        .range([0, ex6InnerWidth]);

    ex6YScaleS
        .domain([0, d3.max(data, d => d.energyConsumption) * 1.05])
        .range([ex6InnerHeight, 0]);

    // Set up colour scale — different hues for categories
    ex6ColorScale
        .domain(["LED", "LCD", "OLED"])
        .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);

    // Draw circles
    ex6InnerChartS.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => ex6XScaleS(d.star))
        .attr("cy", d => ex6YScaleS(d.energyConsumption))
        .attr("r", 5)
        .attr("fill", d => ex6ColorScale(d.screenTech))
        .attr("opacity", 0.5);

    // Bottom axis
    ex6InnerChartS.append("g")
        .attr("transform", `translate(0,${ex6InnerHeight})`)
        .call(d3.axisBottom(ex6XScaleS).ticks(8));

    svg.append("text")
        .text("Star Rating")
        .attr("text-anchor", "end")
        .attr("x", ex6Width - 20)
        .attr("y", ex6Height - 5)
        .attr("class", "ex6-axis-label");

    // Left axis
    ex6InnerChartS.append("g")
        .call(d3.axisLeft(ex6YScaleS).ticks(8));

    svg.append("text")
        .text("Labeled Energy Consumption (kWh/year)")
        .attr("x", 30)
        .attr("y", 20)
        .attr("class", "ex6-axis-label");

    // Legend
    const legendData = ["LED", "LCD", "OLED"];
    const legend = ex6InnerChartS.append("g")
        .attr("transform", `translate(${ex6InnerWidth - 80}, 10)`);

    legendData.forEach((tech, i) => {
        const row = legend.append("g").attr("transform", `translate(0, ${i * 20})`);
        row.append("rect")
            .attr("width", 12).attr("height", 12)
            .attr("fill", ex6ColorScale(tech));
        row.append("text")
            .attr("x", 16).attr("y", 10)
            .style("font-size", "12px").style("fill", "#333")
            .text(tech);
    });
};
