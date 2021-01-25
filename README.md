# D3-challenge
In this project, I built an interactive scatterplot to explore the relationships between aggregated census data by state.

Project is deployed at :
[**Website Link**] : [https://tejalkotkar.github.io/D3-challenge/D3_data_journalism/](https://tejalkotkar.github.io/D3-challenge/D3_data_journalism/)


#### Tools:
This project is achieved by using HTML & Plotly in combination with D3 & javascript


### Dataset:
Dataset is in form on csv file named data.csv 
* [Data](D3_data_journalism/assets/data/data.csv)

### About the Data:
The data from the US Census & is based on 2014 ACS 1-year estimates. The data set includes data on rates of income, obesity, poverty, etc. by state.

#### Insructions 
* [Instructions](Instructions/Instructions.md)

### Details:
The final application can be reached at [https://tejalkotkar.github.io/D3-challenge/D3_data_journalism/] (https://tejalkotkar.github.io/D3-challenge/D3_data_journalism/) which is hosted with the help of github pages.

### Application Default view: 
When application ia launched by default view displays Healthcare Vs Poverty. Both axes appears with 3 lables where Healthcare & Poverty shows as active.You can choose any inactive label to display its data. 
![Default View](Images/Default_view)

#### Steps:
Project includes below steps -
1) Responsive chart area depending on browser size:
	The first step was to setup location for the svg area, chart area. This was done inside makeResponsive function. Which gets invoked every time browser window is resized.
	Svg area is then chaged to window inner height & width.

2) Import CSV -
	After the chart area is defined, csv file is imported and required data is then parsed as numbers.

3) Scales & Axes -
	getScale function is then invoked to get the scales for both axes. This function takes Axis as x or y, data, selected axis, chart height & width as parameters & return the LinearScale.
	Created group for each axis and appended them on chart.
	
4) Labels - 
	Created group for each axis labels. Added class as active for Poverty & Healthcare from x & y axis respectively for default view. For all olther labels class added was inactive.

5) Circles & circle text - 
	Again this was achievd by creating group to hold data, circles & text on circle. The circle & text is positioned according to the data.
	However the text is shifted down slightly since y value determines the top of the text element.

6) ToolTip - 
	The tool tip was added for mouseover event using d3.tip and then called it on circle group. Mouseout event is added to hide tooltip.
	
7) Changing Axes & Transitions -
	On click event is added for both axes. When different label is selected from any axis on click event is triggerd.
	Below are the steps added for on click event:

	a) New scale is calculated for the selected data

	b) Axis values are transitioned to new value

	c) Circle & circle text are transitioned to new positions according to new data

	d) Tool tips are updated
    
	e) Class of selected label becomes active and class of other becomes inacive.
	

