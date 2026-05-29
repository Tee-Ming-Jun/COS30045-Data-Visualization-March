// ── Ex 6: Interactions ───────────────────────────────────────────

// ── Filter: Screen Technology ─────────────────────────────────────
const ex6PopulateFilters = (data) => {

    // Build screen tech filter buttons
    d3.select("#filters_screen")
        .selectAll(".ex6-filter-btn")
        .data(ex6FiltersScreen)
        .join("button")
        .attr("class", d => `ex6-filter-btn ${d.isActive ? "active" : ""}`)
        .text(d => d.label)
        .on("click", (e, d) => {
            if (!d.isActive) {
                // Set only clicked button active
                ex6FiltersScreen.forEach(f => { f.isActive = f.id === d.id; });

                d3.selectAll("#filters_screen .ex6-filter-btn")
                    .classed("active", f => f.id === d.id);

                ex6UpdateHistogram(d.id, data, ex6ActiveSizeFilter);
            }
        });

    // Build screen size filter buttons
    d3.select("#filters_size")
        .selectAll(".ex6-filter-btn-size")
        .data(ex6FiltersSize)
        .join("button")
        .attr("class", d => `ex6-filter-btn ex6-filter-btn-size ${d.isActive ? "active" : ""}`)
        .text(d => d.label)
        .on("click", (e, d) => {
            if (!d.isActive) {
                ex6FiltersSize.forEach(f => { f.isActive = f.id === d.id; });

                d3.selectAll("#filters_size .ex6-filter-btn-size")
                    .classed("active", f => f.id === d.id);

                ex6ActiveSizeFilter = d.id;

                // Re-apply current tech filter too
                const activeTech = ex6FiltersScreen.find(f => f.isActive)?.id || "all";
                ex6UpdateHistogram(activeTech, data, d.id);
            }
        });
};

// Track the active size filter globally
let ex6ActiveSizeFilter = "all";

// ── Update histogram with combined tech + size filters ────────────
const ex6UpdateHistogram = (techId, data, sizeId = "all") => {

    let updatedData = data;

    // Apply tech filter
    if (techId !== "all") {
        updatedData = updatedData.filter(d => d.screenTech === techId);
    }

    // Apply size filter
    if (sizeId !== "all") {
        updatedData = updatedData.filter(d => String(d.screenSize) === sizeId);
    }

    const updatedBins = ex6BinGenerator(updatedData);

    // Update y scale domain
    const binsMaxLength = d3.max(updatedBins, d => d.length) || 1;
    ex6YScale.domain([0, binsMaxLength]).nice();

    // Animate bars
    d3.selectAll("#histogram rect")
        .data(updatedBins)
        .transition()
        .duration(500)
        .ease(d3.easeCubicInOut)
        .attr("y", d => ex6YScale(d.length))
        .attr("height", d => ex6InnerHeight - ex6YScale(d.length));

    // Redraw left axis smoothly
    d3.select("#histogram .ex6-y-axis")
    .transition().duration(500)
    .call(d3.axisLeft(ex6YScale));
};

// ── Tooltip (Ex 6.2) ─────────────────────────────────────────────
const ex6CreateTooltip = () => {
    const tooltip = ex6InnerChartS
        .append("g")
        .attr("class", "ex6-tooltip")
        .style("opacity", 0);

    tooltip.append("rect")
        .attr("width",  ex6TooltipWidth)
        .attr("height", ex6TooltipHeight)
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("fill", ex6BarColor)
        .attr("fill-opacity", 0.85);

    tooltip.append("text")
        .text("NA")
        .attr("x", ex6TooltipWidth / 2)
        .attr("y", ex6TooltipHeight / 2 + 2)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("fill", "white")
        .style("font-size", "12px")
        .style("font-weight", 900);
};

// ── Mouse event handlers (Ex 6.2) ────────────────────────────────
const ex6HandleMouseEvents = () => {
    ex6InnerChartS.selectAll("circle")
        .on("mouseenter", (e, d) => {
            console.log("Mouse entered circle", d);

            // Update tooltip text with screen size
            d3.select(".ex6-tooltip text")
                .text(`${d.screenSize}" · ${d.screenTech}`);

            // Position tooltip above the circle
            const cx = +e.target.getAttribute("cx");
            const cy = +e.target.getAttribute("cy");

            d3.select(".ex6-tooltip")
                .attr("transform", `translate(${cx - ex6TooltipWidth * 0.5}, ${cy - ex6TooltipHeight * 1.6})`)
                .transition()
                .duration(200)
                .style("opacity", 1);
        })
        .on("mouseleave", (e, d) => {
            console.log("Mouse left circle", d);

            d3.select(".ex6-tooltip")
                .transition()
                .duration(150)
                .style("opacity", 0)
                .attr("transform", `translate(0, 500)`);
        });
};