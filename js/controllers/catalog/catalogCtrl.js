app.controller('catalogCtrl', ['$scope', '$rootScope', 'FormProducts', 'requestAPI', 'OrderBy', '$state', '$location', '$stateParams', 'identParam', 'Page', '$filter', 'Dart',
   function($scope, $rootScope, FormProducts, requestAPI, OrderBy, $state, $location, $stateParams, identParam, Page, $filter, Dart) {

      var urlParams = angular.copy(FormProducts);

      $scope.showLoading = false;

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

      $scope.buffer_products = [];

      var generalType = ""

      $scope.subtitle = "";

      $scope.dartMenus = Dart;

      $rootScope.isNovidade = false;

      $rootScope.isProduct = false;


      var initUrlParameters = function() {
         if ($stateParams.type == 'novidades') {
            urlParams.page_origin = 'novidades';
            $rootScope.isNovidade = true;
         }
      }
      initUrlParameters();

      $scope.loadMoreProducts = function() {
         var last = ($scope.products.length);
         if ($scope.products.length <= $scope.buffer_products.length) {
            $scope.products = $scope.products.concat($scope.buffer_products.slice(last, last + 19));
         }
      };

      $scope.paginacao = function(count) {

         count = parseInt(count);
         $scope.length = count;
         $scope.length = parseInt(count / 60) + 1;
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

            var qty_sub_previous;
            if (page == 1) {
               qty_sub_previous = 2;
            } else {
               qty_sub_previous = 1;
            }
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

      $scope.setOrder = function(type, value) {
         if (type == 'order_by') {
            if (value == 'created_at') {
               urlParams.order = value + ' desc';
            } else if (value == 'price') {
               urlParams.order = value + ' asc';
            }
         }
         getData(urlParams);
      };

      var setPageTitle = function() {
         var title = $scope.subtitle;
         var subs = generateSubTitles();
         var meta = '';
         // Caso seja marca, precisamos tratar diferente. Ja que primeiro vem a marca em seguidas categorias que são da marca.
         if ($stateParams.para1 && $scope.dartMenus['marcas'][$stateParams.para1] != undefined) {
            title = $scope.dartMenus['marcas'][$stateParams.para1].meta.title;
            meta = title + ' no OQVestir: ' + subs + ' da atual coleção da marca! Frete grátis, troca fácil e pagamento em até 10x sem juros. Aproveite...';
            title = title + ' - Compre ' + subs + ' | OQVestir'
            Page.setTitle(title);
            Page.setMeta(meta);
         } else if ($stateParams.type == 'novidades') {
            Page.setTitle('Lançamentos - Encontre ' + subs + ' e mais | OQVestir');
            Page.setMeta('Lançamentos no OQVestir: ' + subs + ' da atual coleção da marca! Frete grátis, troca fácil e pagamento em até 10x sem juros. Aproveite...')
         } else {

            meta = 'Encontre ' + title.value + ' das melhores Marcas no OQVestir! ' + subs + ' e muito mais. Aproveite!';
            title = title.value + ' - ' + subs + ' e mais | OQVestir';
            Page.setTitle(title);
            Page.setMeta(meta);

            $scope.titPrincipal = "Lançamentos";

         }

         ga('send', 'pageview', {
            'page': $location.url(),
            'title': title
         });

      }

      $rootScope.currentBrand = null;

      var getData = function(urlParams) {
         $scope.showLoading = true;
         requestAPI.products.customGET('', urlParams).then(function(data) {

            if ($scope.donePag == false) {
              $scope.paginacao(data.response.hits.found);
            }

            numProds = data.response.hits.found;

            // Infinite Scroll
            $scope.buffer_products = data.response.hits.hit;
            $scope.products = $scope.buffer_products.slice(0, 20);

            // Filters
            $scope.menuItems = data.response.facets;
            $scope.sizes = OrderBy.sizes($scope.menuItems.sizes_ids_names.buckets);
            $scope.colors = $scope.menuItems.colors_ids_names.buckets;
            $scope.brands = $scope.menuItems.brand_name_slug.buckets;

            //Adiciono a marca filtrada no breadcrumb
            if ($scope.menuItems.brand_name_slug.buckets.length == 1) {
              $rootScope.currentBrand = $scope.menuItems.brand_name_slug.buckets[0].value;
            } else {
              $rootScope.currentBrand = null;
            }

            $rootScope.currentBreadCrumb = data.response.breadcrumb;
            if ($rootScope.currentBreadCrumb != undefined) {
              $scope.subtitle = $rootScope.currentBreadCrumb[$rootScope.currentBreadCrumb.length-1];
              $scope.slugToBack = $rootScope.currentBreadCrumb[$rootScope.currentBreadCrumb.length];
              $rootScope.setCurrentBreadCrumb();
            }

            var crumb = data.response.breadcrumb;
            if (crumb) {
              $rootScope.crumb_final = data.response.breadcrumb;
            }


            setPageTitle();

            $scope.showLoading = false;
         }).catch(function(data) {
            $scope.showLoading = false;
         });
      };

      $scope.clearFilters = function(){
         console.log('asdf');
         $state.go($state.toState.name, null);
      }

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
         if ($scope.current_page > 1) {
            params.session = numProds
            params.page = $scope.current_page;
         } else {
            params.session = null;
            params.page = null;
         }
         $location.search(params);
      }

      var set_init_page = function() {
         urlParams.start = 0;
         $scope.current_page = 1;
         $scope.have_previous_page = false;
         $scope.custom_pages_showing = false;
      };

      var click_filter_price = function(price, id) {
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

      $scope.currentColor = "";
      $scope.currentSize = "";
      $scope.currentBrand = "";

      var identfyParam = function(param, lastParam) {
         var loc = $location.search();
         var type = "";
         if (identParam.isCat(param)) {
            //Categoria
            urlParams.categories_names_slugs = param;
            urlParams.categories_ids_slugs = param;
            type = "Categoria";
         } else if (identParam.isColorSize(param)) {
            var par = param.split("_");
            for (var i in par) {
               if (par[i].split("-")[0] == "cor") {
                  //Cor
                  urlParams.colors_names = par[i].split("-")[1];
                  $scope.current_color_id = urlParams.colors_names;
                  $scope.currentColor = $scope.current_color_id;
                  type = "Cor";
               } else if (par[i].split("-")[0] == "tamanho") {
                  //Tamanho
                  urlParams.sizes_names = par[i].split("-")[1];
                  $scope.current_size_id = urlParams.sizes_names;
                  $scope.currentSize = $scope.current_size_id;
                  type = "Tamanho";
               }
            }
         } else if (lastParam && identParam.isSub(lastParam)) {
            //Subcategoria
            urlParams.categories_names_slugs = param;
            type = "Subcategoria";
         } else if (identParam.isBrand(param)) {
            //Marca
            urlParams.brand_slug = param;
            $scope.current_brand_id = urlParams.brand_slug;
            $scope.currentBrand = $scope.current_brand_id;
            type = "Marca";
         }
         generalType = type;
      }

      var generateSubTitles = function() {
         var subs = '';
         for (i = 0; i < $scope.menuItems.categories_parents_slugs_names.buckets.length; i++) {
            tmp = $filter('formatFacets')($scope.menuItems.categories_parents_slugs_names.buckets[i].value);
            if (tmp != 'OUTLET') {
               subs += tmp
               if (i == 2) {
                  break;
               } else {
                  subs += ', ';
               }
            }
         }
         return subs;
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

         if (location.session && location.page) {
            freshData = false;
            $scope.current_page = location.page
            numProds = location.session;
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
