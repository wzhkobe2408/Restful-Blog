$(document).ready(function() {
    $('.ui.menu .control').click(function(event) {
      event.preventDefault();
      $(this).addClass('active');
      $(this).siblings().removeClass('active');
      var tab = $(this).attr('href');
      $('.tab-content').not(tab).css("display", "none");
      $(tab).fadeIn();
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
});
