app.factory('requestAPI',
   function(Restangular){
      var GET = function(base, url, params) {
         if (!url) {
            url = '';
         }
         if (!params) {
            params = {};
         }
         return base.customGET(url, params);
      };
      return {
         products: Restangular.all('products'),
         search: function (search){
            return GET(Restangular.all('products'), 'search', search)
         },
         utils: Restangular.all('utils'),
         rakuten_decode: function (codes){
           return GET(Restangular.all('utils'), 'decode_rakuten', { values: codes })
         }
      }
   }
);

app.factory('identParam', function(){
   return{
      isCat: function(param){
         switch (param) {
            case "natal":
               return true;
            break;
            case "pre-venda":
               return true;
            break;
            case "moda-praia":
               return true;
            break;
            case "looks":
               return true;
            break;
            case "acessorios":
               return true;
            break;
            case "roupas":
               return true;
            break;
            case "casa":
               return true;
            break;
            case "sapatos":
               return true;
            break;
            case "outlet":
               return true;
            break;
            case "vitrines":
               return true;
            break;
            case "kids":
               return true;
            break;
            case "fitness":
               return true;
            break;
            default:
               return false;
         }
      },
      isColorSize: function(param){
         var res = param.split('_');
         if(res[0].split("-")[0] == "tamanho" || res[0].split("-")[0] == "cor"){
            return true;
         }else{
            return false;
         }
      },
      isSub: function(lastParam){
         if(this.isCat(lastParam)){
            return true;
         }else{
            return false;
         }
      },
      isBrand: function(param){
         if(!this.isCat(param) && !this.isColorSize(param) && !this.isSub(param)){
            return true;
         }else{
            return false;
         }
      }
   }
});

app.factory('OrderBy', function(){
   return{
      compare: function(a, b){
         if(a.orderMor < b.orderMor){
            return -1;
         }
         if(a.orderMor > b.orderMor){
            return 1;
         }
         if (a.order < b.order){
            return -1;
         }
         if (a.order > b.order){
            return 1;
         }
         if (a.value2 < b.value2){
            return -1;
         }
         if (a.value2 > b.value2){
            return 1;
         }
         return 0;
      },
      sizes: function(arrSizes){
         for(var i in arrSizes){
            arrSizes[i].value2 = arrSizes[i].value.split("::").pop();
            if(arrSizes[i].value2 == "Pp"){
               arrSizes[i].order = 1;
               arrSizes[i].orderMor = 1;
            }else if(arrSizes[i].value2 == "P"){
               arrSizes[i].order = 2;
               arrSizes[i].orderMor = 1;
            }else if(arrSizes[i].value2 == "M"){
               arrSizes[i].order = 3;
               arrSizes[i].orderMor = 1;
            }else if(arrSizes[i].value2 == "G"){
               arrSizes[i].order = 4;
               arrSizes[i].orderMor = 1;
            }else if(arrSizes[i].value2 == "Gg"){
               arrSizes[i].order = 5;
               arrSizes[i].orderMor = 1;
            }else{
               arrSizes[i].orderMor = 2;
            }
         }
         return arrSizes.sort(this.compare);
      }
   }
});
