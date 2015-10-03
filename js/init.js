$(function() {

  $(window).on('load', function(e) {

console.log("asdoifhjawofjuwcnepiogjhnsepofjnsepogjhns");

    setTimeout(function() {
      $(".slider-for").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        asNavFor: ".slide-nav"
      });

      $(".slider-nav").slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        asNavFor: ".slide-for",
        dots: false,
        centerMode: true,
        focusOnSelect: false
      });

    }, 1000);

  });
});
