// Get Scales
getScale=(axis, data, chosenAxis, chartHeight, chartWidth)=>{
    var min = d3.min(data, d => d[chosenAxis]);
    var max = d3.max(data, d => d[chosenAxis]);
    var buffer = (max-min)/20;

    var LinearScale = d3.scaleLinear()
        .domain([min-buffer, max+buffer])
        .range([axis === "x" ? 0 : chartHeight, axis === "x" ? chartWidth : 0]);
    
    return LinearScale;
}   

// Render Axes
renderAxis=(axis, newScale, newAxis)=>{

    var axisPos = (axis === "x") ? d3.axisBottom(newScale) : d3.axisLeft(newScale)
    newAxis.transition()
        .duration(1000)
        .call(axisPos);

    return newAxis;
}

// Render Circles & Text
renderCircles=(axis, circlesGroup, newScale, newChosenAxis)=>{
    circlesGroup.selectAll("circle")
        .transition()
        .duration(1000)
        .attr(axis === "x" ? "cx" : "cy", d => newScale(d[newChosenAxis]));
    
    circlesGroup.selectAll("text")
        .transition()
        .duration(1000)
        .attr(axis === "x" ? "x" : "y", axis === "x" ? d => newScale(d[newChosenAxis]) : d => newScale(d[newChosenAxis])+6);
}

// UpdateToolTip
updateToolTip=(chosenXAxis, chosenYAxis, circlesGroup)=>{
    var label1;
    var label2;
    var isPercentageX = false;
    var isPercentageY = false;

    switch(chosenXAxis){
        case "age":
            label1 = "Age";
            break;

        case "poverty":
            label1 = "Poverty";
            isPercentageX = true;
            break;

        case "income":
            label1 = "Income";
            break;
    }

    switch(chosenYAxis){
        case "healthcare":
            label2 = "Healthcare";
            isPercentageY = true;
            break;

        case "smokes":
            label2 = "Smokes";
            isPercentageY = true;
            break;

        case "obesity":
            label2 = "Obesity";
            isPercentageY = true;
            break;
    }

    var toolTip = d3.tip()
        .attr("class","d3-tip")
        .offset([80, -60])
        .html(function(d){
            return (`${d['state']}</br>${label1} : ${d[chosenXAxis]}${isPercentageX ? "%" : ""}</br>${label2} : ${d[chosenYAxis]}${isPercentageY ? "%" : ""}`)
        });
    
    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data){
        toolTip.show(data);
    }).on("mouseout",function(data){
        toolTip.hide(data);
    });
    
    return circlesGroup;
}

makeResponsive=()=>{
    console.log("In function MakeResponsive");

    var svgArea = d3.select("body").select("svg");
    if (!svgArea.empty()) {
        svgArea.remove();
    }

    // SVG parameter
    var svgHeight = window.innerHeight;
    var svgWidth = window.innerWidth;

    var margin = {
        top: 20,
        right: 40,
        bottom: 120,
        left: 120
    };

    // Define chart parameter
    var chartHeight = svgHeight - margin.top - margin.bottom;
    var chartWidth = svgWidth - margin.left - margin.right;
    
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
        var xLinearScale = getScale("x", stateData, chosenXAxis, chartHeight, chartWidth);

        // call getScale function to get the Linear scale for Y Axis
        var yLinearScale = getScale("y", stateData, chosenYAxis, chartHeight, chartWidth);

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

        // Create circle group which will contain circles & text.
        var circlesGroup = chartGroup.append("g").selectAll("g")
            .data(stateData)
            .enter()
            .append("g");
        
        circlesGroup.append("circle")
            .classed("stateCircle", true)
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d[chosenYAxis]))
            .attr("r", 15);

        circlesGroup.append("text")
            .classed("stateText", true)
            .attr("x", d => xLinearScale(d[chosenXAxis]))
            .attr("y", d => yLinearScale(d[chosenYAxis])+6)
            .text(d => d.abbr);
        
        updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // x-Axis labels event listener
        xLabelGroup.selectAll("text").on("click", function(){
            var currentAxis = "x"
            var selected_X_Axis = d3.select(this).attr("value");

            if(selected_X_Axis != chosenXAxis){
                chosenXAxis = selected_X_Axis;

                // Update x-Scale for new data
                newXLinearScale = getScale(currentAxis, stateData, chosenXAxis, chartHeight, chartWidth);

                // Update x-Axis with transitions
                xAxis = renderAxis(currentAxis, newXLinearScale, xAxis)

                // Render Circles + text
                renderCircles(currentAxis, circlesGroup, newXLinearScale, chosenXAxis);

                // Update Tooltip
                updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                // Update label formatting
                switch(chosenXAxis){
                    case "poverty" :
                        povertyLabel.classed("active aText", true).classed("inactive", false);
                        ageLabel.classed("inactive aText", true).classed("active", false);
                        incomeLabel.classed("inactive aText", true).classed("active", false);
                        break;

                    case "age" :
                        ageLabel.classed("active aText", true).classed("inactive", false);
                        incomeLabel.classed("inactive aText", true).classed("active", false);
                        povertyLabel.classed("inactive aText", true).classed("active", false);
                        break;

                    case "income" :
                        incomeLabel.classed("active aText", true).classed("inactive", false);
                        povertyLabel.classed("inactive aText", true).classed("active", false);
                        ageLabel.classed("inactive aText", true).classed("active", false);
                        break;
                }
            }
        });

        // Y-axis labels event listener
        yLabelGroup.selectAll("text").on("click", function(){
            currentAxis = "y";
            var selected_Y_Axis = d3.select(this).attr("value");
            if(selected_Y_Axis != chosenYAxis){
                chosenYAxis = selected_Y_Axis;

                // update y-scale for new data
                newYLinearScale = getScale(currentAxis, stateData, chosenYAxis, chartHeight, chartWidth);

                // update y-Axis with transtitions
                yAxis = renderAxis(currentAxis, newYLinearScale, yAxis);

                // Render Circles + text
                renderCircles(currentAxis, circlesGroup, newYLinearScale, chosenYAxis);

                // Update Tooltip
                updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
                
                // Update label formatting
                switch(chosenYAxis){
                    case "healthcare":
                        healthcareLabel.classed("active aText", true).classed("inactive", false);
                        smokesLabel.classed("inactive aText", true).classed("active", false);
                        obeseLabel.classed("inactive aText", true).classed("active", false);
                        break;

                    case "smokes":
                        smokesLabel.classed("active aText", true).classed("inactive", false);                    
                        healthcareLabel.classed("inactive aText", true).classed("active", false);    
                        obeseLabel.classed("inactive aText", true).classed("active", false);
                        break;

                    case "obesity":
                        obeseLabel.classed("active aText", true).classed("inactive", false);
                        healthcareLabel.classed("inactive aText", true).classed("active", false);
                        smokesLabel.classed("inactive aText", true).classed("active", false);
                        break;
                }
            }
        });        

    }).catch(function(error){
        console.log(error);
    });
}

// Initial call for displaying application when page is loaded.
makeResponsive();

// Event listener for window resize.
// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);