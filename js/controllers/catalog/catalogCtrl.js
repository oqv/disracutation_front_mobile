app.controller('catalogCtrl', ['$scope', '$rootScope', 'FormProducts', 'requestAPI', 'OrderBy', '$state', '$location', '$stateParams', 'identParam',
  function($scope, $rootScope, FormProducts, requestAPI, OrderBy, $state, $location, $stateParams, identParam) {

    var urlParams = angular.copy(FormProducts);

    $rootScope.showLoading = false;

    $scope.show_pagination = false;
    $scope.have_previous_page = false;

    $scope.current_page = 1;
    $scope.last_page = 1;

    $scope.have_next_page = false;
    $scope.paginas = [];

    $scope.validate_presence_next_page = true;
    $scope.custom_pages_showing = false;

    $scope.donePag = false;

    var numProds = 0; 

    $scope.paginacao = function(count) {
      count = parseInt(count);
      $scope.length = count;
      $scope.length = parseInt(count / 99) + 1;
      $scope.last_page = $scope.length;
      $scope.show_pagination = $scope.length > 1;

      if ($scope.show_pagination && !$scope.custom_pages_showing && $scope.current_page == 1) {
        $scope.paginas = [];
        if ($scope.validate_presence_next_page) {
          $scope.have_next_page = true;
        }
        for (var i = 1; i <= $scope.length; i++) {
          //mostra até 9 blocos.
          if (i < 6)
            $scope.paginas.push(i);
        }
      }

      console.log($scope.paginas);

      $scope.donePag = true;
    };

    $scope.paginate = function(page) {

      page = parseInt(page);

      $scope.validate_presence_next_page = false;

      var qty = parseInt(urlParams.qty);

      if (page >= $scope.last_page) {
        page = $scope.last_page;
      }

      $scope.have_next_page = page < $scope.last_page;
      if (page == 1) {
        urlParams.start = 0;
        $scope.have_previous_page = false;
        $scope.show_pagination = true;
        $scope.custom_pages_showing = false;
      } else {
        urlParams.start = (qty * page) - (qty - 1);
        $scope.have_previous_page = true;
      }

      //Mudar a paginação caso tenha passado da página 8
      if (page > 7) {
        var arr_pag_previous = [];
        var qty_sub_previous = 1;
        for (var i = 0; i <= 4; i++) {
          arr_pag_previous.push((page + 1) - qty_sub_previous);
          qty_sub_previous++;
        }

        if ($scope.last_page > page) {
          var arr_pag_next = arr_pag_previous.reverse();
          var qty_sub_next = 1;
          var diff_page = (5 + ($scope.last_page - page));

          if (diff_page > 8)
            diff_page = 8;

          for (var id = 5; id <= diff_page; id++) {
            if (page + qty_sub_next <= $scope.last_page) {
              arr_pag_previous.push(page + qty_sub_next);
              qty_sub_next++;
            }
          }
          //limpa o array de páginas
          $scope.paginas.length = 0;
          $scope.paginas = arr_pag_next;
        } else {
          $scope.paginas.length = 0;
          $scope.paginas = arr_pag_previous.reverse();
        }
        $scope.custom_pages_showing = true;
      } else {
        var arr_pag_previous = [];
        var qty_sub_previous = 1;
        //PÁGINAS ANTERIORES
        for (var i = 0; i <= 4; i++) {
          if (page > 0 && ((((page + 1) - qty_sub_previous) >= 0))) {
            if (page == 1) {
              arr_pag_previous.push(page);
            } else {
              if ((page + 1) - qty_sub_previous) {
                arr_pag_previous.push((page + 1) - qty_sub_previous);
              }
            }
            qty_sub_previous++;
          }
        }

        if ($scope.last_page > page) {
          var arr_pag_next = arr_pag_previous.reverse();
          var qty_sub_next = 1;
          var diff_page = (5 + ($scope.last_page - page));

          if (diff_page > 8)
            diff_page = 8;

          for (var id = 5; id <= diff_page; id++) {
            if (page + qty_sub_next <= $scope.last_page) {
              arr_pag_previous.push(page + qty_sub_next);
              qty_sub_next++;
            }
          }
          //limpa o array de páginas
          $scope.paginas.length = 0;
          $scope.paginas = arr_pag_next;
        } else {
          $scope.paginas.length = 0;
          $scope.paginas = arr_pag_previous.reverse();
        }
        //$scope.paginas = arr_pag_previous.reverse();

        $scope.custom_pages_showing = true;
      }

      if (page > 7) {
        $scope.custom_pages_showing = true;
      } else {
        $scope.custom_pages_showing = false;
      }

      $scope.current_page = page;
      mount_url();

      getData(urlParams);
    };




    var getData = function(urlParams) {
      $rootScope.showLoading = true;
      requestAPI.products.customGET('', urlParams).then(function(data) {

        if($scope.donePag == false){
            $scope.paginacao(data.response.hits.found);
         }

         if($scope.current_page > 1){
            numProds = data.response.hits.found;
         }else{
            numProds = 0;
         }

        $scope.products = data.response.hits.hit;

        // Filters
        var menuItems = data.response.facets;
        $scope.sizes = OrderBy.sizes(menuItems.sizes_ids_names.buckets);
        $scope.colors = menuItems.colors_ids_names.buckets;
        $scope.brands = menuItems.brand_name_slug.buckets;


        $rootScope.showLoading = false;
      }).catch(function(data) {
        $rootScope.showLoading = false;
      });
    };

    $scope.setFilter = function(value) {
      var buf = value.split('/');
      for (var i in buf) {
        if (buf[i] == "") {
          buf.splice(i, 1);
        }
      }

      var toUrl = {
        para1: buf[0] != "" || buf[0] != undefined ? buf[0] : null,
        para2: buf[1] != "" || buf[1] != undefined ? buf[1] : null,
        para3: buf[2] != "" || buf[2] != undefined ? buf[2] : null,
        para4: buf[3] != "" || buf[3] != undefined ? buf[3] : null
      }

      $state.go($state.toState.name, toUrl);
    }


    var mount_url = function() {
      var params = {
        new: ''
      };
      if (urlParams["price_range[from]"] != 0.10) {
        params.priceFrom = urlParams["price_range[from]"];
      }
      if (urlParams["price_range[to]"] != null) {
        params.priceTo = urlParams["price_range[to]"];
      }
      if($scope.current_page > 1){
        params.session = numProds
        params.page = $scope.current_page;
      }else{
        params.session = null;
        params.page = null;
      }
      $location.search(params);
    }

    var set_init_page = function() {
      urlParams.start = 0;
      // $scope.current_page = 1;
      // $scope.have_previous_page = false;
      // $scope.custom_pages_showing = false;
    };

    var click_filter_price = function(price, id) {
      console.log("olaaaa", price, id);

      var p_from = price.substr(0, price.indexOf('|'));
      var p_to = price.substr(price.indexOf('|') + 1, price.length);
      urlParams['price_range[from]'] = p_from;
      urlParams['price_range[to]'] = p_to;
      set_init_page();
      getData(urlParams);

      mount_url();
    };


    $scope.setFilterPrice = function(value) {
      var buf = value.split(',');
      click_filter_price(buf[0], buf[1]);
    }

    var identfyParam = function(param, lastParam) {
      var loc = $location.search();
      if (identParam.isCat(param)) {
        //Categoria
        urlParams.categories_names_slugs = param;
        urlParams.categories_ids_slugs = param;
      } else if (identParam.isColorSize(param)) {
        var par = param.split("_");
        for (var i in par) {
          if (par[i].split("-")[0] == "cor") {
            //Cor
            urlParams.colors_names = par[i].split("-")[1];
            $scope.current_color_id = urlParams.colors_names;
          } else if (par[i].split("-")[0] == "tamanho") {
            //Tamanho
            urlParams.sizes_names = par[i].split("-")[1];
            $scope.current_size_id = urlParams.sizes_names;
          }
        }
      } else if (lastParam && identParam.isSub(lastParam)) {
        //Subcategoria
        urlParams.categories_names_slugs = param;
      } else if (identParam.isBrand(param)) {
        //Marca
        urlParams.brand_slug = param;
        $scope.current_brand_id = urlParams.brand_slug;
      }

    }

    var getInitData = function() {
      var location = $location.search();
      var params = $stateParams;
      var freshData = true;

      if (params.para1 != null) {
        identfyParam(params.para1, null);
      }
      if (params.para2 != null) {
        identfyParam(params.para2, params.para1);
      }
      if (params.para3 != null) {
        identfyParam(params.para3, params.para2);
      }
      if (params.para4 != null) {
        identfyParam(params.para4, params.para3);
      }

      if (location.priceFrom != "") {
        urlParams["price_range[from]"] = location.priceFrom;
      }
      if (location.priceTo != "") {
        urlParams["price_range[to]"] = location.priceTo;
      }

      if (location.numProds && location.page) {
        freshData = false;
        $scope.current_page = location.page
        var numProds = location.numProds;
        $scope.paginacao(numProds);
        $scope.paginate($scope.current_page);
      }

      if (freshData) {
        getData(urlParams);
        freshData = false;
      } else {
        freshData = true;
      }

    }

    getInitData();

  }
]);
