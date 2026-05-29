// ── Ex 5: Scatter Plot — Energy Consumption vs Star Rating ───────
// CSV columns: brand, screen_tech, screensize, energy_consumpt, star2, count
function drawScatterPlot(raw) {
    const container = document.getElementById("scatter-container");
    d3.select(container).selectAll("*").remove();

    const data = raw.map(d => ({
        tech:  d["screen_tech"].trim(),
        power: +d["energy_consumpt"],
        stars: +d["star2"],
        size:  +d["screensize"]
    })).filter(d => d.power > 0 && d.stars > 0);

    const width  = container.clientWidth || 560;
    const height = 340;
    const margin = { top: 20, right: 140, bottom: 55, left: 70 };
    const innerW = width  - margin.left - margin.right;
    const innerH = height - margin.top  - margin.bottom;

    const svg = d3.select(container)
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("width","100%").style("height","auto");

    const g = svg.append("g").attr("transform",`translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.power) * 1.05]).range([0, innerW]);
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.stars) + 0.5]).range([innerH, 0]);

    // Gridlines
    g.append("g").call(d3.axisLeft(yScale).tickSize(-innerW).tickFormat(""))
        .attr("class","ex5-grid")
        .selectAll("line").style("stroke","#eee").style("stroke-dasharray","3,3");
    g.select(".ex5-grid .domain").remove();

    g.append("g").attr("transform",`translate(0,${innerH})`)
        .call(d3.axisBottom(xScale).ticks(6))
        .selectAll("text").style("font-size","11px");
    g.append("g").call(d3.axisLeft(yScale).ticks(8))
        .selectAll("text").style("font-size","11px");

    // Axis labels
    g.append("text").attr("x",innerW/2).attr("y",innerH+45)
        .attr("text-anchor","middle").style("font-size","12px").style("fill","#555")
        .text("Energy Consumption (kWh/year)");
    g.append("text").attr("transform","rotate(-90)")
        .attr("x",-innerH/2).attr("y",-54)
        .attr("text-anchor","middle").style("font-size","12px").style("fill","#555")
        .text("Star Rating");

    const colorScale = d3.scaleOrdinal()
        .domain(["LCD (LED)","LCD","OLED"])
        .range(["#2ecc71","#3498db","#e74c3c"]);

    g.selectAll("circle.dot")
        .data(data)
        .join("circle").attr("class","dot")
        .attr("cx", d => xScale(d.power))
        .attr("cy", d => yScale(d.stars))
        .attr("r", 4)
        .attr("fill", d => colorScale(d.tech))
        .attr("opacity", 0.6)
        .attr("stroke", d => colorScale(d.tech))
        .attr("stroke-width", 0.5);

    // Legend
    const legend = g.append("g").attr("transform",`translate(${innerW+14},10)`);
    ["LCD (LED)","LCD","OLED"].forEach((tech, i) => {
        const row = legend.append("g").attr("transform",`translate(0,${i*22})`);
        row.append("circle").attr("r",6).attr("fill",colorScale(tech)).attr("opacity",0.8);
        row.append("text").attr("x",12).attr("y",4)
            .style("font-size","11px").style("fill","#444").text(tech);
    });
}