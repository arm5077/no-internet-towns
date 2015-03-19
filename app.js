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
			console.log( $scope.top5($scope.data) );
		});

$scope.top5 = function(data){
	data.sort(function(a,b){ return b["percentage_with_internet"] - a["percentage_with_internet"] });
	return(data.slice(0,5));
	
}

$scope.bottom5 = function(data){
	data.sort(function(a,b){ return a["percentage_with_internet"] - b["percentage_with_internet"] });
	return(data.slice(0,5));
	
}
	
}]);

app.directive('town', function() {
  return {
    restrict: 'E',
    templateUrl: 'townbox.html'
  }
});

