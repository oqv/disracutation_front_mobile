app.controller('mainCtrl', ['$scope','$rootScope', '$cookies', 'Page', function($scope, $rootScope, $cookies, Page){

  $scope.Page = Page;

   $scope.getCartTotal = function(){
     var total = 0;

     for(var i = 0; i < $scope.cartItems.length; i++){
        var item = $scope.cartItems[i];
        total += (item.price*item.quantity);
     }
     return total;
   };

  $scope.initRakuten = function(){
    $scope.cartTotalItems = $cookies.get('QtdeItensCestaOQV');
    $scope.current_user = {
      id: $cookies.get('CodigoClienteOQV'),
      name: $cookies.get('NomeClienteOQV'),
      email: $cookies.get('EmailCliente')
    };
  };
  $scope.initRakuten();



  $rootScope.setCurrentBreadCrumb = function() {
     $rootScope.currentBreadCrumb.pop();
     $rootScope.currentBreadCrumb.reverse();
 }



}]);
