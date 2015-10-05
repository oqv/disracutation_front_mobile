app.controller('productCtrl', ['$scope', '$rootScope', 'requestAPI', '$stateParams', 'FormProducts', '$filter', function($scope, $rootScope, requestAPI, $stateParams, FormProducts, $filter) {

  var idProduct = $stateParams.id;
  var urlParams = angular.copy(FormProducts);

  $scope.variants = [];
  $scope.cart = {
    variant: {
      sku: ''
    }
  };

  var getData = function() {
    requestAPI.products.customGET(idProduct).then(function(data) {

      $scope.product = data[0];      

      $scope.arrDets = [];
      $scope.arrDetThumbs = [];

      get_variants($scope.product);
      get_images($scope.product);
      setCarrousel();

    }).catch(function(data) {

    });
  }

  function testinput(re, str) {
    return (str.indexOf(re) != -1);
  }

  var get_images = function(product) {
    for (var i in product.images) {
      var str = product.images[i];
      if (testinput('Detalhes', str) && !testinput('Thumb', str)) {
        $scope.arrDets.push({
          "value": str
        });
      } else if (testinput('Detalhes', str) && testinput('Thumb', str)) {
        $scope.arrDetThumbs.push({
          "value": str
        });
      }



    }
  }

  var setCarrousel = function(){
    $slickFor = $(".slider-for");
    $slickNav = $(".slider-nav");

    if($slickFor.hasClass("slick-initialized")) {
      $slickFor.slick('unslick');
    }
    if($slickNav.hasClass("slick-initialized")) {
      $slickNav.slick('unslick');
    }

    setTimeout(function() {
      $slickFor.slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        asNavFor: $slickNav
      });

      $slickNav.slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        asNavFor: $slickFor,
        dots: false,
        centerMode: true,
        focusOnSelect: true
      });

    }, 500);
  }

  // $(document).ready(function() {
  //   var $slide = $(".slider-for");
  //   var $nav = $(".slider-nav");
  //
  //   setTimeout(function() {
  //     $slide.slick({
  //       slidesToShow: 1,
  //       slidesToScroll: 1,
  //       arrows: true,
  //       fade: true,
  //       asNavFor: $nav
  //     });
  //
  //     $nav.slick({
  //       slidesToShow: 3,
  //       slidesToScroll: 1,
  //       asNavFor: $slide,
  //       dots: true,
  //       centerMode: true,
  //       focusOnSelect: true
  //     });
  //
  //   }, 500);
  //
  // })

  var get_variants = function(product) {
    for (i = 0; i < product.variants_sizes_colors.length; i++) {
      var data = product.variants_sizes_colors[i].split('::');
      var sku = '';
      var size_name = '';
      var stock = 0;

      // Recupera SKU
      for (y = 0; y < product.variants_ids_erp_codes.length; y++) {
        tmp = product.variants_ids_erp_codes[y].split('::');
        if (tmp[0] == data[0]) {
          sku = tmp[1];
        }
      }

      // Recupera Stock
      for (y = 0; y < product.variants_ids_stock.length; y++) {
        tmp = product.variants_ids_stock[y].split('::');
        if (tmp[0] == data[0]) {
          stock = tmp[1];
        }
      }

      // Recupera Cor
      for (y = 0; y < product.sizes_ids_names.length; y++) {
        tmp = product.sizes_ids_names[y].split('::');
        if (tmp[0] == data[1]) {
          size_name = tmp[1];
        }
      }

      stock = parseInt(stock);

      $scope.variants.push({
        id: data[0],
        size_id: data[1],
        color_id: data[2],
        sku: sku,
        stock: stock,
        out_of_stock: (stock == 0 ? true : false),
        size_name: $filter('variantOption')(size_name, stock),
        size_name_no_filter: size_name
      })
    }

    if ($scope.variants.length == 1) {
      $scope.cart.variant = $scope.variants[0];
    }

    if (isNaN($scope.variants[0].size_name_no_filter)) {
      $scope.variants.reverse();
    }
    //    $scope.variants.reverse();

  }

  $scope.actionClick = false;
  $scope.add_to_cart = function() {
    if (!$scope.cart.variant.sku != '') {
      $scope.showSizeError = true;
      return;
    }
    if ($scope.actionClick == false) {
      var url = "//www.oqvestir.com.br/basket/normaliza.aspx?action=garantiaestendida&partnumber=" + $scope.cart.variant.sku;
      window.location.href = url;
      $scope.actionClick = true;
    }
  }

  $scope.add_to_wishlist = function() {
    if (!$scope.cart.variant.sku != '') {
      $scope.showError = true;
      $scope.messageError = "Por favor, escolha um tamanho";
      return;
    }

    if (!$scope.current_user.id) {
      $scope.showError = true;
      $scope.messageError = "Você precisa estar logado para adicionar na Wishlist";
      return;
    }

    var data_to_send = {
      sku: $scope.cart.variant.sku,
      user_id: $scope.current_user.id
    }
    requestAPI.utils.customPOST({}, 'add_to_wishlist', data_to_send).then(function(data) {
      $scope.showError = true;
      $scope.messageError = "Adicionado a Wishlist com sucesso."
    }).catch(function(data) {
      $scope.showError = true;
      $scope.messageError = "Desculpe, houve um erro ao tentar inserir na wishlist. Por favor, tente novamente."
    });
  }



  getData();






}]);
