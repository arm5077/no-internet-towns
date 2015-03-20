app = angular.module("internetApp", []);

app.controller("internetController", ["$scope", "$http", function($scope, $http){
	
	$scope.Math = window.Math;
	$scope.numeral = numeral;
	
	$http.get("data.json")
		.error(function(error){
			console.log("Hit an error! Here it is: " + error);
		})
		.success(function(response){
			$scope.data = response;
			
			$scope.buildChart($scope.data, {name: "below_poverty", textx: "Percent of households below poverty threshold"});
			
			d3.select("#age").on("click", function(){ $scope.changeMetric($scope.data, {name: "median_age", textx: "Median age" }) });
			d3.select("#poverty").on("click", function(){ $scope.changeMetric($scope.data, {name: "below_poverty", textx: "Percent of households below poverty threshold"}, true); });
			d3.select("#college").on("click", function(){ $scope.changeMetric($scope.data, {name: "bachelors_or_above_25_and_up", textx: "Percent of residents with college degree"}, true); });
			
		});

$scope.top5 = function(data){
	data.sort(function(a,b){ return b["percentage_with_internet"] - a["percentage_with_internet"] });
	return(data.slice(0,5));
	
}

$scope.bottom5 = function(data){
	data.sort(function(a,b){ return a["percentage_with_internet"] - b["percentage_with_internet"] });
	return(data.slice(0,5));	
}

$scope.buildChart = function(data, metric){
	
	var margin = {top: 20, right: 10, bottom: 20, left: 60},
		width = document.getElementById("container").offsetWidth - margin.right * 2 - margin.left,
		height = document.getElementById("container").offsetHeight - margin.top * 2 - margin.bottom * 2;
		
	var y = d3.scale.linear()
		.domain([d3.min( data.map(function(d){ return d.percentage_without_internet })) * .5, d3.max( data.map(function(d){ return d.percentage_without_internet }) )])
		.range([height, 0]);
	
	var x = d3.scale.linear()
		.domain([d3.min( data.map(function(d){ return d[metric.name] * 0; })), d3.max( data.map(function(d){ return d[metric.name]; }) ) * 1.1])
		.range([0, width]);
	
	var r = d3.scale.linear()
		.domain([d3.min( data.map(function(d){ return d.no_internet_estimate })), d3.max( data.map(function(d){ return d.no_internet_estimate; }) )])
		.range([5, 20]);
		
		
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.tickFormat(d3.format("%"));
		
	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.tickFormat(d3.format("%"));
		
	var svg = d3.select("#container").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");	
	
		dots = svg.selectAll(".dot")
			.data(data)
		.enter().append("circle")
			.attr("class", "dot")
			.attr("r", function(d){ return r(d.no_internet_estimate); })
			.attr("cx", function(d) { return x(d[metric.name]); })
			.attr("cy", function(d) { return y(d.percentage_without_internet); })
			.attr("fill", function(d){ return (d.percentage_without_internet <= .1927) ? "seagreen" : "darkred" })
			.on("mousemove", function(d){
				console.log(d3.mouse(this)[0] + 175);
				
				var popup = d3.select(".popup");
				popup.html("<h3>" + d.name + "</h3><h4><strong>" + Math.floor(d.percentage_without_internet * 100) + "%</strong> of households lack an Internet connection.</h4>")
					.classed("visible", true);
				
				d3.select(".popup.float")
					.style("top", (d3.event.clientY + 30) + "px")
					.style("left", (d3.event.clientX - popup.node().clientWidth / 2) + "px");
			})
			.on("mouseout", function(d){
				d3.selectAll(".popup")
					.classed("visible", false);
			});
	
	svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.append("text")
			.attr("class", "label")
			.attr("x", width)
			.attr("y", -6)
			.style("text-anchor", "end")
			.text(metric.textx);
		
		svg.append("g")
			.attr("class", "y axis")
		.call(yAxis)
		.append("text")
			.attr("class", "label")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Percent of households without Internet connection");
			
		
}

// I know this is horrifically not DRY. It is very late at night.
$scope.changeMetric = function(data, metric, percent){
	var margin = {top: 20, right: 10, bottom: 20, left: 60},
		width = document.getElementById("container").offsetWidth - margin.right * 2 - margin.left,
		height = document.getElementById("container").offsetHeight - margin.top * 2 - margin.bottom * 2;
		
	var y = d3.scale.linear()
		.domain([d3.min( data.map(function(d){ return d.percentage_without_internet })) * .5, d3.max( data.map(function(d){ return d.percentage_without_internet }) )])
		.range([height, 0]);
	
	var x = d3.scale.linear()
		.domain([d3.min( data.map(function(d){ return d[metric.name] * .8; })), d3.max( data.map(function(d){ return d[metric.name]; }) ) * 1.1])
		.range([0, width]);
	
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.tickFormat(d3.format());
		
	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");
	
	if( percent )
		xAxis.tickFormat(d3.format("%"));
	else
		xAxis.tickFormat(d3.format());
	
	d3.selectAll(".label").remove();
	
	d3.select(".x.axis").call(xAxis)
	.append("text")
		.attr("class", "label")
		.attr("x", width)
		.attr("y", -6)
		.style("text-anchor", "end")
		.text(metric.textx);
	
	d3.select(".y.axis").call(yAxis)
		.append("text")
		.attr("class", "label")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Percent of households without Internet connection");
	
	dots = d3.selectAll(".dot")
			.transition()
			.duration(1000)
			.attr("cx", function(d) { return x(d[metric.name]); })
			.attr("cy", function(d) { return y(d.percentage_without_internet); });
	
}
	
}]);

app.directive('town', function() {
  return {
    restrict: 'E',
    templateUrl: 'townbox.html'
  }
});

