app.config(function(RestangularProvider, $locationProvider) {

   $locationProvider.html5Mode(true);

   RestangularProvider.setBaseUrl('http://chunli-production.elasticbeanstalk.com/api/v1');
   RestangularProvider.setDefaultHttpFields({cache: true});

});
