//header
app.directive('headermobi', function() {
  return {
    restrict: 'E',
    scope: {
      item: '='
    },
    templateUrl: 'views/partials/header.html'
  };
})

//footer
app.directive('footermobi', function() {
  return {
    restrict: 'E',
    scope: {
      item: '='
    },
    templateUrl: 'views/partials/footer.html'
  };
})

//breadcrumb
app.directive('breadcrumb', function() {
  return {
    restrict: 'E',
    scope: {
      item: '='
    },
    templateUrl: 'views/partials/breadcrumb.html'
  };
})
