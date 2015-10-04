//header
app.directive('headermobi', function() {
  return {
    restrict: 'E',
    templateUrl: 'views/partials/header.html'
  };
});

//footer
app.directive('footermobi', function() {
  return {
    restrict: 'E',
    templateUrl: 'views/partials/footer.html'
  };
});

//breadcrumb
app.directive('breadcrumb', function() {
  return {
    restrict: 'E',
    templateUrl: 'views/partials/breadcrumb.html'
  };
});

//filters e order by
app.directive('filters', function() {
  return {
    restrict: 'E',
    templateUrl: 'views/partials/filters.html'
  };
});

//pagination
app.directive('pagination', function() {
  return {
    restrict: 'E',
    templateUrl: 'views/partials/pagination.html'
  };
});

//Item produto no catalogo
app.directive('product', function () {
  return {
    restrict: 'E',
    scope: {
      item: '='
    },
    templateUrl: 'views/partials/product.html',
    controller: ['$scope', function ($scope) {
      function testinput(re, str) {
        return (str.indexOf(re) != -1);
      }
      $scope.arrVitrines = []
      for(var i in $scope.item.fields.images){
        var str = $scope.item.fields.images[i];
        if(testinput('Vitrine', str)){
          $scope.arrVitrines.push(str);
        }
      }
    }]
  };
});
