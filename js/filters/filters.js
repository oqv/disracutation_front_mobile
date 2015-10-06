app.filter('formatPrice', function () {
    return function (text) {
      var str = '';
      if(text){
        str = text.replace('.', ',');
      }
      return str;
    };
});

app.filter('orderPrices', function(){
   return function(text){
      var str = text.split("::").pop();
      str = str.sort();
      return str;
   }
});

app.filter('variantOption', function(){
   return function(size_name, stock){
      var str = size_name.toUpperCase();
      if(stock == 1){
        str += " - Só 1 peça";
      }
      if(stock == 0){
        str += " - Lista de espera";
      }
      return str;
   }
});

app.filter('formatFacets', function () {
    return function (text) {
      if(text == null){
         return;
      }
      var str = text.split("::").pop();
      return str;
    };
});

app.filter('formatFacetsURL', function(){
   return function(text){
      var str = text.split("::")[1];
      return str.replace(' ', '+');
   }
});

app.filter('formatSlugFacets', function(){
   return function (text){
      if(text == null){
         return;
      }
      var str = text.split("::")[0];
      return str;
   }
});

app.filter('formatBrands', function(){
   return function(text){
      var str = text.replace("-", " ");
      return str.toUpperCase();
   }
})


app.filter('formatColors', function(){
   return function(text){
      var str = text.replace("+", " ");
      return str.toUpperCase();
   }
})
