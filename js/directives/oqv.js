app.directive('dynamicUrl', function() {
   return {
      restrict: 'A',
      link: function postLink(scope, element, attr) {
         element.attr('src', attr.dynamicUrlSrc);
      }
   };
});

app.directive('pageName', function() {
   return {
      restrict: 'A',
      link: function(scope, element, attr) {
         document.title = attr.pname;
      }
   }
});

app.directive('dynamicHref', ['identParam', '$stateParams', function(identParam, $stateParams) {
   return {
      restrict: 'A',
      scope: {
         dynamicNovidade: '='
      },
      link: function postLink(scope, element, attr) {

         var currentUrl = "/";

         if (scope.dynamicNovidade) {
            currentUrl = "/novidades/"
         }

         var url = {
            cat: '',
            sub: '',
            brand: '',
            size: '',
            color: ''
         };

         var identfyParam = function(param, lastParam) {
            if (identParam.isCat(param)) {
               url.cat = param;
            } else if (identParam.isColorSize(param)) {
               var par = param.split("_");
               for (var i in par) {
                  if (par[i].split("-")[0] == "cor") {
                     url.color = par[i].split("-")[1];
                  } else if (par[i].split("-")[0] == "tamanho") {
                     url.size = par[i].split("-")[1];
                  }
               }
            } else if (lastParam && identParam.isSub(lastParam)) {
               url.sub = param;
            } else if (identParam.isBrand(param)) {
               url.brand = param;
            }
         }

         var mountUrl = function() {
            var params = $stateParams;
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
         }

         mountUrl();

         if (attr.dynamicType == "brand") {
            url.brand = attr.dynamicValue;
         }
         if (attr.dynamicType == "cat" && identParam.isCat(attr.dynamicValue)) {
            url.cat = attr.dynamicValue;
         }
         if (attr.dynamicType == "cat" && url.cat != "" && !identParam.isCat(attr.dynamicValue)) {
            url.sub = attr.dynamicValue;
         }
         if (attr.dynamicType == "size") {
            url.size = attr.dynamicValue;
         }
         if (attr.dynamicType == "color") {
            url.color = attr.dynamicValue;
         }

         if (attr.dynamicLevel == 2 && attr.dynamicType == "cat" && identParam.isCat(attr.dynamicValue)) {
            url.sub = "";
         }

         if (url.brand != "") {
            currentUrl += url.brand + "/";
         }
         if (url.cat != "") {
            currentUrl += url.cat + '/';
         }
         if (url.sub != "") {
            currentUrl += url.sub + '/';
         }
         if (url.size != "") {
            currentUrl += "tamanho-" + url.size;
         }
         if (url.color != "") {
            if (url.size != "") {
               currentUrl += "_";
            }
            currentUrl += "cor-" + url.color;
         }

         if (attr.dynamicType == "breadcrumb") {
            currentUrl = currentUrl + "?new";
            $(element).attr('href', currentUrl);
         } else {
            $(element).attr('value', currentUrl);
         }

      }
   }
}]);

//Toggle Menu
app.directive('toggleMenu', function() {
   return {
      restrict: 'A',
      link: function(scope, element, attr) {
         $(element).on('click', function() {
            $("#wrapper").toggleClass("toggled");
         })
      }
   }
});

//Toggle Filter
app.directive('toggleFilter', function() {
   return {
      restrict: 'A',
      link: function(scope, element, attr) {
         $(element).on('click', function() {
            $('.action-filters').toggleClass("hidden");
            $('.filter-wraper').toggleClass("hidden");
         })
      }
   }
});

app.directive('setFilter', function() {
   return {
      restrict: 'A',
      link: function(scope, element, attrs) {
         $(element).on('change', function() {
            var value = $(element).find('option:selected')[0].value;

            scope.$apply(function() {
               scope.setFilter(value);
            });
         })
      }
   }
});

app.directive('filterPrice', function() {
   return {
      restrict: 'A',
      link: function(scope, element, attrs) {
         $(element).on('change', function() {
            var value = $(element).find('option:selected')[0].value;
            scope.$apply(function() {
               scope.setFilterPrice(value);
            });
         })
      }
   }
});

app.directive('setOrder', function() {
   return {
      restrict: 'A',
      link: function(scope, element, attrs) {
         $(element).on('change', function() {
            var value = $(element).find('option:selected')[0].value;
            scope.$apply(function() {
               scope.setOrder('order_by', value);
            });
         })
      }
   }
});
