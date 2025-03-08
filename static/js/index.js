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
        open_drawer: ['default'],
        pick_and_place: ['add_light', 'blue_block1', 'blue_block2', 'blue_charger1', 'blue_charger2', 'complex_background', 'high_place', 'red_block_grey_bowl1', 'red_block_grey_bowl2', 'strawberry'],
        pour_water: ['episode1', 'episode2'],
        pull_charger: ['episode1', 'episode2'],
        wipe_whiteboard: ['episode1', 'episode2'],
      },
      agilex: {
        pick_place: ['episode_1', 'episode_2', 'episode_3'],
        lift_place: ['episode_1', 'episode_2', 'episode_3', 'episode_4_background', 'episode_5_object', 'episode_6_height', 'episode_7_light'],
        place_bottle: ['episode_1', 'episode_2', 'episode_3'],
        wipe_board: ['episode_1', 'episode_2', 'episode_3'],
        fold_shorts: ['episode_1', 'episode_2', 'episode_3', 'episode_4, episode_5', 'episode_6'],
      }
    };

    $('#robot-select').change(function() {
      const robot = $(this).val();
      const taskSelect = $('#task-select');
      const episodeSelect = $('#episode-select');
      taskSelect.empty();
      episodeSelect.empty();
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
      const episodeSelect = $('#episode-select');
      episodeSelect.empty();
      if (task) {
        videoPaths[robot][task].forEach((episode) => {
          episodeSelect.append(`<option value="${episode}">${episode}</option>`);
        });
        episodeSelect.prop('disabled', false).trigger('change');
      } else {
        episodeSelect.prop('disabled', true);
      }
    });

    $('#episode-select').change(function() {
      const robot = $('#robot-select').val();
      const task = $('#task-select').val();
      const episode = $(this).val();
      const videoSource = $('#video-source');
      if (episode) {
        videoSource.attr('src', `./static/videos/${robot}/${task}/${episode}.mp4`);
        $('#selected-video')[0].load();
      }
    });

    // Set default selections
    $('#robot-select').val('franka').trigger('change');
    $('#task-select').val('open_drawer').trigger('change');
    $('#episode-select').val('default').trigger('change');

})
