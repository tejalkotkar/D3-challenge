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
        
        // Create group for x-Axis labels
        var xLabelGroup = chartGroup.append("g")
            .attr("transform",`translate(${chartWidth/2}, ${chartHeight+margin.top})`);

        const povertyLabel = xLabelGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "poverty")
            .classed("active aText", true)
            .text("In Poverty (%)");

        const ageLabel = xLabelGroup.append("text")
            .attr("x", 0)
            .attr("y", 50)
            .attr("value", "age")
            .classed("inactive aText", true)
            .text("Age (Median)");

        const incomeLabel = xLabelGroup.append("text")
            .attr("x", 0)
            .attr("y", 80)
            .attr("value", "income")
            .classed("inactive aText", true)
            .text("Household Income (Median)"); 
    
        // Create group for y-Axis labels
        var yLabelGroup = chartGroup.append("g")
            .attr("transform","rotate(-90)");
    
        const healthcareLabel = yLabelGroup.append("text")
            .attr("x", 0 - (chartHeight / 2))
            .attr("y", 0 - margin.left + 80)
            .attr("value", "healthcare")
            .classed("active aText", true)
            .text("Lacks Healthcare (%)");

        const smokesLabel = yLabelGroup.append("text")
            .attr("x", 0 - (chartHeight / 2))
            .attr("y", 0 - margin.left + 50)
            .attr("value", "smokes")
            .classed("inactive aText", true)
            .text("Smokes (%)");
        
        const obeseLabel = yLabelGroup.append("text")
            .attr("x", 0 - (chartHeight / 2))
            .attr("y", 0 - margin.left + 20)
            .attr("value", "obesity")
            .classed("inactive aText", true)
            .text("Obese (%)");        

    }).catch(function(error){
        console.log(error);
    });
}


makeResponsive();
// Event listener for window resize.
// When the browser window is resized, makeResponsive() is called.

d3.select(window).on("resize", makeResponsive);