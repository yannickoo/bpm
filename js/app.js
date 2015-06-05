(function($) {

  $(document).ready(function() {
    var $body = $('body'),
        $configForm = $('#config-form'),
        $bpm = $('#bpm'),
        $luminosity = $('#luminosity'),
        $hue = $('#hue'),
        $transition = $('#transition'),
        $opacityElements = $('#config-form, #github'),
        $count = $('#count'),
        color,
        backgroundChanger,
        formOpacity,
        countStart,
        timeElapsed,
        beats = 0,
        stopBackgroundChanger = function() {
           window.clearInterval(backgroundChanger);
           backgroundChanger = null;
        };

    $bpm.add($luminosity, $hue).on('change', function() {
      // Stop timeout and interval.
      window.clearTimeout(formOpacity);
      stopBackgroundChanger();

      backgroundChanger = window.setInterval(function() {
        color = randomColor({
          luminosity: $luminosity.val(),
          hue: $hue.val()
        });

        $body.css('background-color', color);
      }, 1000 * 60 / $bpm.val());
    }).trigger('change');

    $transition.on('change', function() {
      if ($transition.val()) {
        $body.addClass('transition');

        $body[0].style.transitionDuration = $transition.val();
      }
      else {
        $body.removeClass('transition');
      }
    });

    $count.on('click', function(e) {
      e.preventDefault();
      window.clearInterval(formOpacity);

      if (!countStart) {
        // Initialize BPM counter if user really want to do this
        if (window.confirm('Do you really want to count the BPM?')) {
          countStart = new Date();
        }
        else {
          return;
        }
      }

      var diff = new Date().getTime() - countStart.getTime();

      beats++
      timeElapsed = diff ? Math.abs(diff / 1000) : 1;

      $bpm.val(Math.round(beats * 60 / timeElapsed));
    });

    $opacityElements.on('mousemove', function() {
      window.clearInterval(formOpacity);

      $opacityElements.removeClass('furtive');

      formOpacity = window.setTimeout(function() {
        $opacityElements.addClass('furtive');
      }, 5000)
    });

    $configForm.find(':input').on('focus', function() {
      window.clearInterval(formOpacity);
    });

    $(document).keyup(function(e) {
      // ESC key stops the background color changer.
      if (e.keyCode === 27) {
        stopBackgroundChanger();
      }
      // Space key toggles background color changer.
      else if (e.keyCode === 32) {
        if (backgroundChanger) {
          stopBackgroundChanger();
        }
        else {
          $bpm.trigger('change');
        }
      }
    });
  });

})(jQuery);