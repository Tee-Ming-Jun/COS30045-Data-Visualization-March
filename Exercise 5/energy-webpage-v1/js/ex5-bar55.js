// ── Ex 5: Bar Chart — 55" TV Energy Consumption by Screen Tech ──
// CSV columns: Screen_Tech, Mean(Labelled energy consumption (kWh/year))
function drawBar55Chart(raw) {
    const container = document.getElementById("bar55-container");
    d3.select(container).selectAll("*").remove();

    const data = raw.map(d => ({
        tech:  d["Screen_Tech"].trim(),
        power: Math.round(+d["Mean(Labelled energy consumption (kWh/year))"] * 10) / 10
    })).filter(d => d.power > 0).sort((a,b) => b.power - a.power);

    const width  = container.clientWidth || 560;
    const height = 340;
    const margin = { top: 20, right: 40, bottom: 65, left: 80 };
    const innerW = width  - margin.left - margin.right;
    const innerH = height - margin.top  - margin.bottom;

    const svg = d3.select(container)
        .append("svg")
        .attr("viewBox",`0 0 ${width} ${height}`)
        .style("width","100%").style("height","auto");

    const g = svg.append("g").attr("transform",`translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.tech)).range([0, innerW]).padding(0.35);
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.power) * 1.2]).range([innerH, 0]);

    // Gridlines
    g.append("g").call(d3.axisLeft(yScale).tickSize(-innerW).tickFormat(""))
        .attr("class","ex5-grid")
        .selectAll("line").style("stroke","#eee").style("stroke-dasharray","3,3");
    g.select(".ex5-grid .domain").remove();

    g.append("g").attr("transform",`translate(0,${innerH})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text").style("font-size","12px");
    g.append("g").call(d3.axisLeft(yScale).ticks(6))
        .selectAll("text").style("font-size","11px");

    // Axis labels
    g.append("text").attr("x",innerW/2).attr("y",innerH+52)
        .attr("text-anchor","middle").style("font-size","12px").style("fill","#555")
        .text("Screen Technology");
    g.append("text").attr("transform","rotate(-90)")
        .attr("x",-innerH/2).attr("y",-65)
        .attr("text-anchor","middle").style("font-size","12px").style("fill","#555")
        .text("Mean Energy Consumption (kWh/year)");

    const colorScale = d3.scaleOrdinal()
        .domain(["LCD","LED","OLED"])
        .range(["#3498db","#2ecc71","#e74c3c"]);

    g.selectAll("rect.bar55")
        .data(data).join("rect").attr("class","bar55")
        .attr("x", d => xScale(d.tech))
        .attr("y", d => yScale(d.power))
        .attr("width", xScale.bandwidth())
        .attr("height", d => innerH - yScale(d.power))
        .attr("fill", d => colorScale(d.tech))
        .attr("rx", 4);

    g.selectAll("text.bar55-val")
        .data(data).join("text").attr("class","bar55-val")
        .attr("x", d => xScale(d.tech) + xScale.bandwidth()/2)
        .attr("y", d => yScale(d.power) - 6)
        .attr("text-anchor","middle")
        .style("font-size","12px").style("fill","#333").style("font-weight","bold")
        .text(d => d.power);
}