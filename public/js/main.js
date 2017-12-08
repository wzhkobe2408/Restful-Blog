$(document).ready(function() {

    var initShowItem = 4;

    function changeView() {
      $( ".mainitem" )
        .filter(function( index ) {
          return (index > initShowItem)
        })
      .css( "display", "none" );
    }

    changeView();

    $('.ui.menu .control').click(function(event) {
      event.preventDefault();
      $(this).addClass('active');
      $(this).siblings().removeClass('active');
      var tab = $(this).attr('href');
      $('.tab-content').not(tab).css("display", "none");
      $(tab).fadeIn();
    });

    $('.accordion .title').on('click', function(event) {
        event.preventDefault();
        $('.title.active').removeClass('active');
        $('.content.active').removeClass('active');
        $(this).addClass('active');
        $(this).next().addClass('active');
    });

    $('.ui.vertical.menu a').click(function(event) {
      $(this).addClass('active');
      $(this).siblings().removeClass('active');
    });

    $('.ui.message .close')
    .on('click', function() {
      $(this).parent().fadeOut(500);
    });

    function showModal() {
      $('.ui.modal')
      .modal('show');
    }

    function hideModal() {
      $('.ui.modal')
      .modal('hide');
    }

    $("button.modal-toggle").on('click',function(event) {
      event.stopPropagation();
      showModal();
    });

    $('.ui.deny.button').click(function(event) {
      event.stopPropagation();
      hideModal();
    });

    $('.ui.positive.button').click(function(event) {
      event.stopPropagation();
      hideModal();
    });

    $('.ui.modal').click(function(event) {
      event.stopPropagation();
    });

    $("body").click(function() {
      $('.ui.modal')
      .modal('hide');
    });

    $("input[type='file']").change(function() {
      var imgPath = $("input[type='file']")[0].value;
      console.log(imgPath);
    });

    $("#hamberge").click(function() {
      $("#A").toggleClass('positionChange',500);
    });

    $("#showmore").on('click',function(e) {
        e.preventDefault();
        e.stopPropagation();
        initShowItem = initShowItem+5;
        if($(".mainitem").length < initShowItem) {
          $("#showmore")[0].innerHTML = "<h4>没有更多</h4>";
        };
        $( ".mainitem" )
          .filter(function( index ) {
            return (index < initShowItem)
          })
        .css( "display", "flex" );
    });

    $('#taskObjList').on('change', function(event) {
      event.preventDefault();
      $.ajax({
        method:"GET",
        url:"http://localhost:3000/quickfill?serviceId=" + event.target.value,
      })
      .done(function(msg) {
        event.preventDefault();
        $('#taskForm input')[0].value = msg.name;
        $('#taskForm input')[2].value = msg.address;
        $('#taskForm input')[3].value = msg.tel;
        $(this).val(event.target.value);
        console.log(msg);
      })

    });

});
