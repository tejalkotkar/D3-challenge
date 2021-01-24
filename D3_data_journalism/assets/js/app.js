// @TODO: YOUR CODE HERE!
// Define SVG parameter & margine.

function makeResponsive() {
    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");
  if (!svgArea.empty()) {
    svgArea.remove();
  }
    // svg params
    // var svgHeight = window.innerHeight;
    // var svgWidth = window.innerWidth;
    var svgWidth = 960;
    var svgHeight = 500;

    var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
    };

    // Define chart parameter
    var chartHeight = svgHeight - margin.top - margin.bottom;
    var chartWidth = svgWidth - margin.left - margin.right;

    var svg = d3.select("#scatter")
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);

    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    //Import Data
    d3.csv("assets/data/data.csv").then(function(stateData){
        
        // parse data
        stateData.forEach(data => {
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
        });

        // Create scales
        var xScale = d3.scaleLinear()
            .domain([d3.min(stateData, d => d.poverty) - 0.5, d3.max(stateData, d => d.poverty) + 0.5])
            .range([0, chartWidth]);
        
        var yScale = d3.scaleLinear()
            .domain(d3.extent(stateData, d => d.healthcare))
            .range([chartHeight, 0]);
        
        // Create Axis functions
        var xAxis = d3.axisBottom(xScale);
        var yAxis = d3.axisLeft(yScale);

        // Append Axis on chart
        chartGroup.append("g")
            .attr("transform", `translate(0,${chartHeight})`)
            .call(xAxis);
        
        chartGroup.append("g")
            .call(yAxis);
        
        var circlesGroup = chartGroup.selectAll("g")
            .data(stateData)
            .enter()
            .append("g");

        var circles = circlesGroup.append("circle")
            .classed("stateCircle", true)
            .attr("cx", d => xScale(d.poverty))
            .attr("cy", d => yScale(d.healthcare))
            .attr("r", 15);
        
        // create text of circle group
        var circleText = circlesGroup.append("text")
            .classed("stateText", true)
            .text(d => d.abbr)
            .attr("x", d => xScale(d.poverty))
            .attr("y", d => yScale(d.healthcare)+6);

        // Create axes labels
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 40)
            .attr("x", 0 - (chartHeight / 2))
            .attr("dy", "1em")
            .attr("class", "active aText")
            .text("healthcare(%)");
    
        chartGroup.append("text")
            .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 30})`)
            .attr("class", "active aText")
            .text("In Poverty(%)");
            
    }).catch(function(error){
        console.log(error);
    });
}

makeResponsive();
// Event listener for window resize.
// When the browser window is resized, makeResponsive() is called.

d3.select(window).on("resize", makeResponsive);