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
