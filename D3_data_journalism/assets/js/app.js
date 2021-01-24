// SVG parameter
// var svgHeight = window.innerHeight;
// var svgWidth = window.innerWidth;
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 120,
    left: 120
};

// Define chart parameter
var chartHeight = svgHeight - margin.top - margin.bottom;
var chartWidth = svgWidth - margin.left - margin.right;

// Get Scales
getScale=(axis, data, chosenAxis)=>{
    var min = d3.min(data, d => d[chosenAxis]);
    var max = d3.max(data, d => d[chosenAxis]);
    var buffer = (max-min)/20;

    var LinearScale = d3.scaleLinear()
        .domain([min-buffer, max+buffer])
        .range([axis === "x" ? 0 : chartHeight, axis === "x" ? chartWidth : 0]);
    
    return LinearScale;
}   

makeResponsive=()=>{
    console.log("In function MakeResponsive");

    var svgArea = d3.select("body").select("svg");
    if (!svgArea.empty()) {
        svgArea.remove();
    }

    // var svgHeight = window.innerHeight;
    // var svgWidth = window.innerWidth;

    chartHeight = svgHeight - margin.top - margin.bottom;
    chartWidth = svgWidth - margin.left - margin.right;
    
    var svg = d3.select("#scatter")
        .append("svg")
        .attr("style", "outline: thin solid lightgrey;")
        .attr("height", svgHeight)
        .attr("width", svgWidth);
    
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    d3.csv("assets/data/data.csv").then(function(stateData, err){
        if(err) throw err;

        // Initial Params
        var chosenXAxis = "poverty";
        var chosenYAxis = "healthcare";

        // Parse Data
        stateData.forEach(data => {
            data.poverty=+data.poverty;
            data.age=+data.age;
            data.income=+data.income;
            data.healthcare=+data.healthcare;
            data.obesity=+data.obesity;
            data.smokes=+data.smokes;
        });

        // call getScale function to get the Linear scale for X Axis
        var xLinearScale = getScale("x", stateData, chosenXAxis);

        // call getScale function to get the Linear scale for Y Axis
        var yLinearScale = getScale("y", stateData, chosenYAxis);

        // Create initial axis function
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // Apend axis
        var xAxis = chartGroup.append("g")
            .attr("transform",`translate(0, ${chartHeight})`)
            .call(bottomAxis);
        
        var yAxis = chartGroup.append("g")
            .call(leftAxis)
        

    }).catch(function(error){
        console.log(error);
    });
}


makeResponsive();
// Event listener for window resize.
// When the browser window is resized, makeResponsive() is called.

d3.select(window).on("resize", makeResponsive);