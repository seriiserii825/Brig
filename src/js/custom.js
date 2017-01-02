(function($) {
   $('#show-socials').on('click', function(){
        $('.socials').slideToggle();
   }); 
   $('#show-menu').on('click', function(){
        $('.main-menu, .socials').slideToggle();
   });
})(jQuery);
