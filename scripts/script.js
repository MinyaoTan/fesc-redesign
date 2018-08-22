function myFunction() {
  var x = document.getElementById("myTopNav");
  if (x.className === "upper-nav") {
      x.className += " responsive";
  } else {
      x.className = "upper-nav";
  }
}

function onDOMLoad() {
  //load google library
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(getData);

  let app = new Vue({
    el: '#app'
  })
}

document.addEventListener("DOMContentLoaded", onDOMLoad);

Vue.component('midsection', {
  props: ['heading', 'content'],
  template: '<div class="col-md-6 col-sm-12"><h2 class="heading">{{heading}}</h2><p>{{content}}</p></div>'
})

var loaded = true
var energyResponse
var electricityResponse
function getData() {
  // Create a new request object
  let energyRequest = new XMLHttpRequest()
  let electricityRequest = new XMLHttpRequest()

  // TODO: URL to contact goes here
  let energyRequestUrl = "https://api.eia.gov/series/?api_key=7db5bdd7fcd56a23243294af7c7aa449&series_id=SEDS.REPRB.FL.A"
  let electricityRequestUrl = "https://api.eia.gov/series/?api_key=7db5bdd7fcd56a23243294af7c7aa449&series_id=SEDS.TETCB.FL.A"
  // Open a connection
  energyRequest.open('GET', energyRequestUrl, true)
  electricityRequest.open('GET', electricityRequestUrl, true)
  // Callback for when the request completes
  energyRequest.onload = function() {
    if (energyRequest.status !== 200) {
      console.log("Something went wrong: ", energyRequest)
      loaded = false
      return
    }

    energyResponse = JSON.parse(energyRequest.response)
    let headerArray = ["Year", "Renewable energy production"];
    energyResponse.series[0].data.unshift(headerArray);
    drawEnergyLineChart(energyResponse.series[0].data);
  }

  electricityRequest.onload = function() {
    if (electricityRequest.status !== 200) {
      console.log("Something went wrong: ", electricityRequest)
      loaded = false
      return
    }

    electricityResponse = JSON.parse(electricityRequest.response)
    let headerArray = ["Year", "Electricity total consumption"];
    electricityResponse.series[0].data.unshift(headerArray);
    drawElectricityLineChart(electricityResponse.series[0].data);
  }
  // Callback for when there's an error
  energyRequest.error = function(err){
    console.log("error is: ", err)
  }

  electricityRequest.error = function(err){
    console.log("error is: ", err)
  }
  // Send the request to the specified URL
  energyRequest.send()
  electricityRequest.send()
}

if (window.addEventListener) {
    window.addEventListener('resize', resize);
}
else {
    window.attachEvent('onresize', resize);
}

//var toggleButton = document.getElementById("toggle");
// toggleButton.addEventListener("click", function() {
//   console.log("clicked")
//   if (loaded) {
//   	toggleButton.disabled = true;
//   	if (toggleButton.innerHTML === "Combine Charts") {
//   		toggleButton.innerHTML = "Split Chart";

//   		document.getElementById("electricity-chart-parent").style.display = "none";
//   		document.getElementById("energy-chart").innerHTML = "";
//       console.log("combine");
//   		drawComboLineChart();

//   	} else {
//   		toggleButton.innerHTML = "Combine Charts";
//   		document.getElementById("electricity-chart-parent").style.display = "block";
//   		document.getElementById("energy-chart").innerHTML = "";
//   		drawEnergyLineChart(energyResponse.series[0].data);
//   	}

//   	toggleButton.disabled = false;
//   }
// })

function resize () {
    // change dimensions if necessary
  drawEnergyLineChart(energyResponse.series[0].data);
  drawElectricityLineChart(electricityResponse.series[0].data);
}

function drawEnergyLineChart(freshData) {
  let data = google.visualization.arrayToDataTable(freshData);

  let options = {
    title: "Renewable energy production Florida",
    legend: { position: 'bottom' },
    colors: ["green"],
    vAxis: {title: "Billion Btu"}
  };

  let chart = new google.visualization.LineChart(document.getElementById("energy-chart"));

  chart.draw(data, options);
}

function drawElectricityLineChart(freshData) {
  let data = google.visualization.arrayToDataTable(freshData);

  let options = {
    title: "Electricity total consumption (i.e. sold) Florida",
    legend: { position: 'bottom' },
    colors: ["orange"],
    vAxis: {title: "Billion Btu"}
  };

  let chart = new google.visualization.LineChart(document.getElementById("electricity-chart"));

  chart.draw(data, options);
}

// function drawComboLineChart() {
//   let headerArray1 = ["title", "other title"];
// 	let data1 = google.visualization.arrayToDataTable(energyResponse.series[0].data);

//   let headerArray2 = ["title", "other title"];
//   let data2 = google.visualization.arrayToDataTable(electricityResponse.series[0].data);

//   let options = {
//     title: "Florida Renewable Energy Production v.s. Electricity Consumption",
//     legend: { position: 'bottom' },
//     colors: ["green", "orange"],
//     vAxis: {title: "Billion Btu"}
//   };

// 	let joinedData = google.visualization.data.join(data1, data2, 'full', [[0, 0]], [1], [1]);
//   let chart = new google.visualization.LineChart(document.getElementById("energy-chart"));

//   chart.draw(joinedData, options);
// }


