// ── Ex 5: Line Chart — Spot Power Prices by State 1998–2024 ─────
// CSV columns: Year, Queensland, New South Wales, Victoria,
//              South Australia, Tasmania, Snowy, Average Price (notTas-Snowy)
function drawLineChart(raw) {
    const container = document.getElementById("line-container");
    d3.select(container).selectAll("*").remove();

    const states = [
        { key: "Queensland ($ per megawatt hour)",    label: "QLD", color: "#e74c3c" },
        { key: "New South Wales ($ per megawatt hour)", label: "NSW", color: "#3498db" },
        { key: "Victoria ($ per megawatt hour)",       label: "VIC", color: "#2ecc71" },
        { key: "South Australia ($ per megawatt hour)",label: "SA",  color: "#f39c12" },
        { key: "Average Price (notTas-Snowy)",         label: "Avg", color: "#8e44ad" }
    ];

    const data = raw.map(d => {
        const row = { year: +d["Year"] };
        states.forEach(s => { row[s.label] = d[s.key] ? +d[s.key] : null; });
        return row;
    });

    const width  = container.clientWidth || 560;
    const height = 340;
    const margin = { top: 20, right: 70, bottom: 55, left: 70 };
    const innerW = width  - margin.left - margin.right;
    const innerH = height - margin.top  - margin.bottom;

    const svg = d3.select(container)
        .append("svg")
        .attr("viewBox",`0 0 ${width} ${height}`)
        .style("width","100%").style("height","auto");

    const g = svg.append("g").attr("transform",`translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year)).range([0, innerW]);

    const allVals = data.flatMap(d => states.map(s => d[s.label]).filter(v => v != null));
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(allVals) * 1.1]).range([innerH, 0]);

    // Gridlines
    g.append("g").call(d3.axisLeft(yScale).tickSize(-innerW).tickFormat(""))
        .attr("class","ex5-grid")
        .selectAll("line").style("stroke","#eee").style("stroke-dasharray","3,3");
    g.select(".ex5-grid .domain").remove();

    g.append("g").attr("transform",`translate(0,${innerH})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format("d")).ticks(8))
        .selectAll("text").style("font-size","11px");
    g.append("g").call(d3.axisLeft(yScale).ticks(6))
        .selectAll("text").style("font-size","11px");

    // Axis labels
    g.append("text").attr("x",innerW/2).attr("y",innerH+45)
        .attr("text-anchor","middle").style("font-size","12px").style("fill","#555")
        .text("Year");
    g.append("text").attr("transform","rotate(-90)")
        .attr("x",-innerH/2).attr("y",-54)
        .attr("text-anchor","middle").style("font-size","12px").style("fill","#555")
        .text("Price ($ per MWh)");

    const lineGen = label => d3.line()
        .defined(d => d[label] != null)
        .x(d => xScale(d.year))
        .y(d => yScale(d[label]))
        .curve(d3.curveMonotoneX);

    states.forEach(s => {
        g.append("path").datum(data)
            .attr("fill","none")
            .attr("stroke", s.color)
            .attr("stroke-width", s.label === "Avg" ? 2.5 : 1.5)
            .attr("stroke-dasharray", s.label === "Avg" ? "6,3" : "none")
            .attr("opacity", s.label === "Avg" ? 1 : 0.75)
            .attr("d", lineGen(s.label));
    });

    // Legend
    const legend = g.append("g").attr("transform",`translate(${innerW - 110},8)`);
    states.forEach((s, i) => {
        const row = legend.append("g").attr("transform",`translate(0,${i*18})`);
        row.append("line").attr("x1",0).attr("x2",16).attr("y1",0).attr("y2",0)
            .attr("stroke",s.color).attr("stroke-width", s.label==="Avg"?2.5:1.5)
            .attr("stroke-dasharray", s.label==="Avg"?"5,2":"none");
        row.append("text").attr("x",20).attr("y",4)
            .style("font-size","10px").style("fill","#444").text(s.label);
    });
}