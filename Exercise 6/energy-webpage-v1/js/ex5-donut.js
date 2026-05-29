// ── Ex 5: Donut Chart — Energy Share by Screen Technology ────────
// CSV columns: Screen_Tech, Mean(Labelled energy consumption (kWh/year))
function drawDonutChart(raw) {
    const container = document.getElementById("donut-container");
    d3.select(container).selectAll("*").remove();

    const data = raw.map(d => ({
        tech:  d["Screen_Tech"].trim(),
        value: +d["Mean(Labelled energy consumption (kWh/year))"]
    })).filter(d => d.value > 0);

    const width  = container.clientWidth || 560;
    const height = 340;
    const cx     = width * 0.40;
    const cy     = height / 2;
    const radius = Math.min(cx, cy) - 18;

    const svg = d3.select(container)
        .append("svg")
        .attr("viewBox",`0 0 ${width} ${height}`)
        .style("width","100%").style("height","auto");

    const g = svg.append("g").attr("transform",`translate(${cx},${cy})`);

    const colorScale = d3.scaleOrdinal()
        .domain(["LCD","LED","OLED"])
        .range(["#3498db","#2ecc71","#e74c3c"]);

    const pie = d3.pie().value(d => d.value).sort(null);
    const arc = d3.arc().innerRadius(radius * 0.52).outerRadius(radius);
    const total = d3.sum(data, d => d.value);

    g.selectAll("path.donut-arc")
        .data(pie(data)).join("path").attr("class","donut-arc")
        .attr("d", arc)
        .attr("fill", d => colorScale(d.data.tech))
        .attr("stroke","white").attr("stroke-width",2);

    // Centre text
    g.append("text").attr("text-anchor","middle").attr("dy","-0.4em")
        .style("font-size","12px").style("fill","#666").text("Mean Energy");
    g.append("text").attr("text-anchor","middle").attr("dy","0.9em")
        .style("font-size","12px").style("fill","#666").text("(kWh/year)");

    // Legend
    const legendX = cx + radius + 20;
    const legendY = cy - (data.length * 32) / 2;
    const legend  = svg.append("g").attr("transform",`translate(${legendX},${legendY})`);

    data.sort((a,b) => b.value - a.value).forEach((d, i) => {
        const row = legend.append("g").attr("transform",`translate(0,${i*36})`);
        row.append("rect").attr("width",13).attr("height",13).attr("rx",3)
            .attr("fill", colorScale(d.tech));
        row.append("text").attr("x",18).attr("y",11)
            .style("font-size","12px").style("font-weight","bold").style("fill","#333")
            .text(d.tech);
        row.append("text").attr("x",18).attr("y",26)
            .style("font-size","11px").style("fill","#888")
            .text(`${Math.round(d.value / total * 100)}%  (${Math.round(d.value)} kWh/yr)`);
    });
}