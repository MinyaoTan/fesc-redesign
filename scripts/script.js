function myFunction() {
  var x = document.getElementById("myTopNav");
  if (x.className === "upper-nav") {
      x.className += " responsive";
  } else {
      x.className = "upper-nav";
  }
}

google.charts.load('current', {'packages':['corechart']});

var energyData = formatNumbers("energy-data", "Year", "Renewable Energy");
var electricityData = formatNumbers("electricity-data", "Year", "Electricity Consumption");

google.charts.setOnLoadCallback(drawEnergyLineChart);
google.charts.setOnLoadCallback(drawElectricityLineChart);
//google.charts.setOnLoadCallback(drawComboLineChart);

if (window.addEventListener) {
    window.addEventListener('resize', resize);
}
else {
    window.attachEvent('onresize', resize);
}

var toggleButton = document.getElementById("toggle");
toggleButton.addEventListener('click', function() {
	toggleButton.disabled = true;
	if (toggleButton.innerHTML === "Combine Charts") {
		toggleButton.innerHTML = "Split Chart";

		document.getElementById("electricity-chart-parent").style.display = "none";
		document.getElementById("energy-chart").innerHTML = "";
		drawComboLineChart();

	} else {
		toggleButton.innerHTML = "Combine Charts";
		document.getElementById("electricity-chart-parent").style.display = "block";
		document.getElementById("energy-chart").innerHTML = "";
		drawEnergyLineChart();
	}

	toggleButton.disabled = false;
})

function resize () {
    // change dimensions if necessary
    if (toggleButton.innerHTML === "Combine Charts") {
	    drawEnergyLineChart();
	    drawElectricityLineChart();
	  } else {
	  	drawComboLineChart();
	  }   
}

function drawEnergyLineChart() {
  let data = google.visualization.arrayToDataTable(energyData);

  let options = {
    title: "Renewable energy production Florida",
    legend: { position: 'bottom' },
    colors: ["green"],
    vAxis: {title: "Billion Btu"}
  };

  let chart = new google.visualization.LineChart(document.getElementById("energy-chart"));

  chart.draw(data, options);
}

function drawElectricityLineChart() {
  let data = google.visualization.arrayToDataTable(electricityData);

  let options = {
    title: "Electricity total consumption (i.e. sold) Florida",
    legend: { position: 'bottom' },
    colors: ["orange"],
    vAxis: {title: "Billion Btu"}
  };

  let chart = new google.visualization.LineChart(document.getElementById("electricity-chart"));

  chart.draw(data, options);
}

function drawComboLineChart() {
	let data1 = google.visualization.arrayToDataTable(energyData);
  let data2 = google.visualization.arrayToDataTable(electricityData);

  let options = {
    title: "Florida Renewable Energy Production v.s. Electricity Consumption",
    legend: { position: 'bottom' },
    colors: ["green", "orange"],
    vAxis: {title: "Billion Btu"}
  };

	let joinedData = google.visualization.data.join(data1, data2, 'full', [[0, 0]], [1], [1]);
  let chart = new google.visualization.LineChart(document.getElementById("energy-chart"));

  chart.draw(joinedData, options);
}


function formatNumbers(idName, title1, title2) {
	let div = document.getElementById(idName);
	let data = div.innerHTML.trim();
	let lineBreak = data.charAt(11);
	let entries = data.split(lineBreak);
	entries = entries.reverse();

	for (let i = 0; i < entries.length; i ++) {
		entries[i] = entries[i].trim();
		let arrayElements = entries[i].split(",");
		let array = [arrayElements[0], Number(arrayElements[1])];
		entries[i] = array;
	}

	entries.unshift([title1, title2]);
	return entries;
}



