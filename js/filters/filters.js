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
        str += " - Esgotado";
      }
      return str;
   }
});
