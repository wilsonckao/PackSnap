function Location (result) {
  this.latitude = result.geometry.location.lat().toFixed(2);
  this.longitude = result.geometry.location.lng().toFixed(2);
  this.address = result.formatted_address;
}

function Forecast (result, inputDate) {
  this.latitude = result.geometry.location.lat().toFixed(2);
  this.longitude = result.geometry.location.lng().toFixed(2);
  this.date = inputDate;
}

function appendToFront (selector, partial) {
  $(selector).empty();
  $(selector).append(partial);
}

function findPos(tag) {
    var curtop = 0;
    if (tag.offsetParent) {
      do {
        curtop += tag.offsetTop;
      } while (tag = tag.offsetParent);
        return [curtop];
    }
}

$(function(){

  $("#geocomplete").geocomplete({
    detailsAttribute: "data-geo"
  });

  $('body').on("submit", ".new-location", function(e){
    e.preventDefault();
    var $form = $(this);
    var inputDate = $("#geocomplete_date").val();
    $("#geocomplete").trigger("geocode").bind('geocode:result', function(e, result){

      var location = new Location(result);
      var forecast = new Forecast(result, inputDate);

      $.ajax({
         url: $form.attr('action'),
         type: $form.attr('method'),
         dateType: 'html',
         data: {location: location, forecast: forecast}
       })
        .done(function(response){
          appendToFront("#append", response);
          window.scroll(0,(findPos(document.getElementById("db-container"))));
          new CBPGridGallery(document.getElementById('grid-gallery'));
          $( '#mi-slider' ).catslider();
        });
         $("#geocomplete").unbind('geocode:result');
    });
  });

   $("body").on("submit","#recommend-btn", function(event) {
      event.preventDefault();
      $form = $(this);
      $.ajax({
        url: $form.attr('action'),
        type: $form.attr('method'),
        dataType: 'html',
        data: $form.serialize()
      })
      .done(function(response) {
        appendToFront(".dash-recommend-btn", response);
        window.scrollTo(0,document.body.scrollHeight);

      }).fail(function() {
        console.log("error");
      })
    })
});
