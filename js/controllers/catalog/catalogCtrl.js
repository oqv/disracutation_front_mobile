app.controller('catalogCtrl', ['$scope', '$rootScope', 'FormProducts', 'requestAPI', function($scope, $rootScope, FormProducts, requestAPI){

  var urlParams = angular.copy(FormProducts);

  var getData = function(urlParams){
    $rootScope.showLoading = true;
    requestAPI.products.customGET('', urlParams).then(function(data){
      $scope.products = data.response.hits.hit;
      
      $rootScope.showLoading = false;
    }).catch(function(data){
      $rootScope.showLoading = false;
    });
  };

  getData(urlParams);


}]);
