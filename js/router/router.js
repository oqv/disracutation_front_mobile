app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

   $stateProvider
      .state('app', {
         abstract: true,
         templateUrl: 'views/template/template.html'
      })

      .state('app.produto',{
         url: "/:id.html",
         templateUrl: "views/produto/produto.html",
         controller: "productCtrl"
      })

      .state('app.novidades', {
         url: "/novidades/:para1/:para2/:para3/:para4",
         templateUrl: "views/lancamentos/lancamentos.html",
         params:{
            type: 'novidades',
            para1: {squash: true, value: null},
            para2: {squash: true, value: null},
            para3: {squash: true, value: null},
            para4: {squash: true, value: null}
         },
         controller: "catalogCtrl"
      })

      .state('app.catalog', {
         url: "/:para1/:para2/:para3/:para4",
         templateUrl: "views/lancamentos/lancamentos.html",
         params:{
            para1: {squash: true, value: null},
            para2: {squash: true, value: null},
            para3: {squash: true, value: null},
            para4: {squash: true, value: null}
         },
         controller: "catalogCtrl"
      })

   $urlRouterProvider.otherwise("/");

});
