var gstapp = angular.module('gstapp', ['ngRoute']);

gstapp.config(function($routeProvider){
	$routeProvider.when('/',{
		redirectTo: '/noc'
	}).when('/noc',{
		templateUrl: '../public/noc.html',
		controller: 'noc_controller',
	}).when('/login',{
		templateUrl: '../public/login.html',
		controller: '',		
	}).otherwise({
		redirectTo: '/'
	});
});

function welcome_control($scope, $http){
	$http.get('/user').success(function(data, status, headers, config){
		$scope.user = data;
	}).error(function(data, status, headers, config) {
		// log error
	});	
}

gstapp.controller('noc_controller', function($scope, $http){



		$http.get('/clients').success(function(data, status, headers, config){
			$scope.clients = data;
		}).error(function(data, status, headers, config) {
			// log error
		});

		$scope.noc = {};
		$scope.noc.noc_agent = 'MAGDALENE';	

		$scope.change = function(){		
			angular.forEach($scope.clients, function(value, key){
				var each_client = value;			
				if(each_client.client_name == $scope.noc.client_name){
					$scope.noc.address_line_1 = each_client.address_line_1;
					$scope.noc.address_line_2 = each_client.address_line_2;
					$scope.noc.address_line_3 = each_client.address_line_3;					
				}				
			});
		};

		$scope.submit = function(){
			$http.post('/noc', $scope.noc).success(function(data, status, headers, config){
				console.log($scope.noc);
	            var filename = data;
	            window.open(filename);			
			}).error(function(data, status, headers, config) {
				// log error
			});		
		}

});