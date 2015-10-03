app.factory('FormProducts', function () {
    return {
        brand: '',
        name: '',
        'properties[sizes_ids]': null,
        'properties[colors_ids]': null,
        qty: 36,
        order: 'created_at desc',
        categories: '',
        start: '',
        group: 'brand_name_slug,categories_parents_slugs_names,categories_parent_ids_names,colors_ids_names,sizes_ids_names,brand_id_name',
        raw: 1,
        menu_level: 2,
        is_freebie: 0,
        sold_out: 0,
        'price_range[from]': 0.10,
        'price_range[to]': null,
        page_origin: '',
        category_parent_id:'',
        brand_slug: '',
        categories_names_slugs: '',
        categories_ids_slugs: '',
        colors_names: '',
        sizes_names: ''
    }
});

app.factory('Page', function($window) {
   var title = 'Encontre Acessórios, Casa, Kids, Moda Praia e mais no OQVestir';
   var meta = 'Encontre Acessórios, Casa, Kids, Moda Praia das melhores Marcas no OQVestir!'
   var image = 'http://d1tswt3tbnas76.cloudfront.net/images/logo_ti.png'
   return {
     title: function() { return title; },
     meta: function() { return meta; },
     image: function() { return image; },
     setTitle: function(newTitle) { title = newTitle; $window.document.title = newTitle; },
     setMeta: function(newMeta) { meta = newMeta },
     setImage: function(newImage) { image = newImage }
   };
});
