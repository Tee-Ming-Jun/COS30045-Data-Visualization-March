// ── Ex 6: Histogram ──────────────────────────────────────────────
const ex6DrawHistogram = (data) => {
    
    // Set up chart area
    const svg = d3.select("#histogram")
        .append("svg")
        .attr("viewBox", `0 0 ${ex6Width} ${ex6Height}`)
        .style("width", "100%")
        .style("height", "auto");

    const innerChart = svg.append("g")
        .attr("transform", `translate(${ex6Margin.left},${ex6Margin.top})`);

    // Generate bins
    const bins = ex6BinGenerator(data);

    // Define scales
    const minEng = bins[0].x0;
    const maxEng = bins[bins.length - 1].x1;
    const binsMaxLength = d3.max(bins, d => d.length);

    ex6XScale
        .domain([minEng, maxEng])
        .range([0, ex6InnerWidth]);

    ex6YScale
        .domain([0, binsMaxLength])
        .range([ex6InnerHeight, 0])
        .nice();

    // Draw bars
    innerChart.selectAll("rect")
        .data(bins)
        .join("rect")
        .attr("x", d => ex6XScale(d.x0))
        .attr("y", d => ex6YScale(d.length))
        .attr("width", d => ex6XScale(d.x1) - ex6XScale(d.x0))
        .attr("height", d => ex6InnerHeight - ex6YScale(d.length))
        .attr("fill", ex6BarColor)
        .attr("stroke", ex6BodyBackgroundColor)
        .attr("stroke-width", 2);

    // Bottom axis
    const bottomAxis = d3.axisBottom(ex6XScale).ticks(10);
    innerChart.append("g")
        .attr("transform", `translate(0,${ex6InnerHeight})`)
        .call(bottomAxis);

    svg.append("text")
        .text("Labeled Energy Consumption (kWh/year)")
        .attr("text-anchor", "end")
        .attr("x", ex6Width - 20)
        .attr("y", ex6Height - 5)
        .attr("class", "ex6-axis-label");

    // Left axis
    const leftAxis = d3.axisLeft(ex6YScale);
    innerChart.append("g").attr("class", "ex6-y-axis").call(leftAxis);

    svg.append("text")
        .text("Frequency")
        .attr("x", 30)
        .attr("y", 20)
        .attr("class", "ex6-axis-label");
};
