// ── Ex 6: Shared Constants ───────────────────────────────────────
// Set up dimensions and margins
const ex6Margin = { top: 40, right: 30, bottom: 50, left: 70 };
const ex6Width  = 800;
const ex6Height = 400;
const ex6InnerWidth  = ex6Width  - ex6Margin.left - ex6Margin.right;
const ex6InnerHeight = ex6Height - ex6Margin.top  - ex6Margin.bottom;

// Shared scales for histogram
const ex6XScale = d3.scaleLinear();
const ex6YScale = d3.scaleLinear();

// Shared scales + inner chart ref for scatterplot
let ex6InnerChartS;
const ex6XScaleS = d3.scaleLinear();
const ex6YScaleS = d3.scaleLinear();
const ex6ColorScale = d3.scaleOrdinal();

// Tooltip dimensions
const ex6TooltipWidth  = 90;
const ex6TooltipHeight = 36;

// Colours
const ex6BarColor             = "#606464";
const ex6BodyBackgroundColor  = "#f5f6fa";

// Bin generator (used by both histogram + filter update)
const ex6BinGenerator = d3.bin()
    .value(d => d.energyConsumption);

// Filter options for screen technology
const ex6FiltersScreen = [
    { id: "all",  label: "All",  isActive: true  },
    { id: "LED",  label: "LED",  isActive: false },
    { id: "LCD",  label: "LCD",  isActive: false },
    { id: "OLED", label: "OLED", isActive: false }
];

// Filter options for screen size
const ex6FiltersSize = [
    { id: "all", label: "All Sizes", isActive: true  },
    { id: "24",  label: '24"',       isActive: false },
    { id: "32",  label: '32"',       isActive: false },
    { id: "55",  label: '55"',       isActive: false },
    { id: "65",  label: '65"',       isActive: false },
    { id: "98",  label: '98"',       isActive: false }
];