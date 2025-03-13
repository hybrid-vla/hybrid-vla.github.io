window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "https://homes.cs.washington.edu/~kpar/nerfies/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}


$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 3,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    preloadInterpolationImages();

    $('#interpolation-slider').on('input', function(event) {
      setInterpolationImage(this.value);
    });
    setInterpolationImage(0);
    $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    bulmaSlider.attach();

    const videoPaths = {
      franka: {
        open_drawer: 'default',
        pick_and_place: 'blue_block1',
        pour_water: 'episode1',
        pull_charger: 'episode1',
        wipe_whiteboard: 'episode1',
      },
      agilex: {
        pick_place: 'episode_1',
        lift_place: 'episode_1',
        place_bottle: 'episode_1',
        wipe_board: 'episode_1',
        fold_shorts: 'episode_1',
      }
    };

    $('#robot-select').change(function() {
      const robot = $(this).val();
      const taskSelect = $('#task-select');
      taskSelect.empty();
      if (robot) {
        Object.keys(videoPaths[robot]).forEach(task => {
          taskSelect.append(`<option value="${task}">${task}</option>`);
        });
        taskSelect.prop('disabled', false).trigger('change');
      } else {
        taskSelect.prop('disabled', true);
      }
    });

    $('#task-select').change(function() {
      const robot = $('#robot-select').val();
      const task = $(this).val();
      const videoSource = $('#video-source');
      if (task) {
        const episode = videoPaths[robot][task];
        videoSource.attr('src', `./static/videos/${robot}/${task}/${episode}.mp4`);
        $('#selected-video')[0].load();
      }
    });

    // Set default selections
    $('#robot-select').val('franka').trigger('change');
    $('#task-select').val('open_drawer').trigger('change');
})
