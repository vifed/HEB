(function($) {
  "use strict";

  // Toggle the side navigation
  $("#sidebarToggle").click(function(e) {
    e.preventDefault();
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
  });

  // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
  $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
    if ($window.width() > 768) {
      var e0 = e.originalEvent,
        delta = e0.wheelDelta || -e0.detail;
      this.scrollTop += (delta < 0 ? 1 : -1) * 30;
      e.preventDefault();
    }
  });

  // Scroll to top button appear
  $(document).scroll(function() {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });

  // Smooth scrolling using jQuery easing
  $(document).on('click', 'a.scroll-to-top', function(event) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top)
    }, 1000, 'easeInOutExpo');
    event.preventDefault();
  });

})(jQuery);

/**

function fillData() {
  console.log("filldata");
    $.post('/eventiAttivi', (res) => {
        if(res){
            var result ={};
            result = JSON.parse(res);
            renderCards(result.Eventi, result.Scheduling);
        }
    });
}

function renderCards(event, scheduling, ) {
    var x=0;
    var html = '';
    $.each(event, function(key, value) {
        html += '<div class="col-md-10 box-area-event"><div class="card"><div class="card-content"><div class="card__date"><span class="card_date_Start"> ' + value.Data_Inizio + '</span></div><span id="title'+ x +'" class="card-title grey-text text-darken-4">' + value.Nome + '</span>&nbsp;<div class="location"><i class="small material-icons">' + value.Luogo + '</i></div>&nbsp;<div class="row"><div class="col-md-7"><div class="row"><div class="description"><h6>Descrizione: <br></h6><p class="card-subtitle grey-text text-darken-2">' + value.Descrizione + '</p></div><div class="orari"><h5>Orari Visite: <br></h5><div class="col-md-12 schedulingOrari'+x+'"></div></div></div></div><div class="col-md-5"><img src='+ value.Foto +' class="responsive"></div></div></div></div></div></div><div class="dropdown-divider"></div>';
        html += '</div>';
        x++;
    });
    $('.lastEvent').html(html);
    x=0;
    $.each(event, function (key, value) {
        Orari ='<ul>';
        var container = [];
        for( let i of scheduling){
            if(i.ID_Events === value.ID){
                var time = i.Ora_Inizio;
                time = time.substr(0, time.length-3);
                container.push(' <li id="ora'+key+'">'+ time +'</li>');
                console.log(container);
            }
        }
        container = container.reverse();
        for (let i =0; i<container.length; i++){
            Orari += container[i];
        }
        Orari += '</ul>';
        $(".schedulingOrari"+x).html(Orari);
        x++;
    })
}

 **/