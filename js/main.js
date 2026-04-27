(function ($) {
	"use strict";
	var nav = $('nav');
  var navHeight = nav.outerHeight();
  
  $('.navbar-toggler').on('click', function() {
    if( ! $('#mainNav').hasClass('navbar-reduce')) {
      $('#mainNav').addClass('navbar-reduce');
    }
  })

  // Preloader
  $(window).on('load', function () {
    if ($('#preloader').length) {
      $('#preloader').delay(100).fadeOut('slow', function () {
        $(this).remove();
      });
    }
  });

  // Back to top button
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });
  $('.back-to-top').click(function(){
    $('html, body').animate({scrollTop : 0},1500, 'easeInOutExpo');
    return false;
  });

	/*--/ Star ScrollTop /--*/
	$('.scrolltop-mf').on("click", function () {
		$('html, body').animate({
			scrollTop: 0
		}, 1000);
	});

	/*--/ Star Counter /--*/
	$('.counter').counterUp({
		delay: 15,
		time: 2000
	});

	/*--/ Star Scrolling nav /--*/
	$('a.js-scroll[href*="#"]:not([href="#"])').on("click", function () {
		if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			if (target.length) {
				$('html, body').animate({
					scrollTop: (target.offset().top - navHeight + 5)
				}, 1000, "easeInOutExpo");
				return false;
			}
		}
	});

	// Closes responsive menu when a scroll trigger link is clicked
	$('.js-scroll').on("click", function () {
		$('.navbar-collapse').collapse('hide');
	});

	// Activate scrollspy to add active class to navbar items on scroll
	$('body').scrollspy({
		target: '#mainNav',
		offset: navHeight
	});
	/*--/ End Scrolling nav /--*/

	/*--/ Navbar Menu Reduce /--*/
	$(window).trigger('scroll');
	$(window).on('scroll', function () {
		var pixels = 50; 
		var top = 1200;
		if ($(window).scrollTop() > pixels) {
			$('.navbar-expand-md').addClass('navbar-reduce');
			$('.navbar-expand-md').removeClass('navbar-trans');
		} else {
			$('.navbar-expand-md').addClass('navbar-trans');
			$('.navbar-expand-md').removeClass('navbar-reduce');
		}
		if ($(window).scrollTop() > top) {
			$('.scrolltop-mf').fadeIn(1000, "easeInOutExpo");
		} else {
			$('.scrolltop-mf').fadeOut(1000, "easeInOutExpo");
		}
	});

	/*--/ Star Typed /--*/
	if ($('.text-slider').length == 1) {
    var typed_strings = $('.text-slider-items').text();
		var typed = new Typed('.text-slider', {
			strings: typed_strings.split(','),
			typeSpeed: 80,
			loop: true,
			backDelay: 1100,
			backSpeed: 30
		});
	}

	/*--/ Testimonials owl /--*/
	if ($('#testimonial-mf').length) {
		$('#testimonial-mf').owlCarousel({
			margin: 20,
			autoplay: true,
			autoplayTimeout: 5000,
			autoplayHoverPause: true,
			responsive: {
				0: {
					items: 1,
				}
			}
		});
	}

	/*--/ Upcoming blog schedule /--*/
	if ($('[data-post-schedule]').length) {
		var scheduledPosts = [
			{ date: '2026-05-11T09:00:00-04:00', title: 'Where AI Fits in Contractor Software Today', topic: 'AI · Operations · Product' },
			{ date: '2026-05-25T09:00:00-04:00', title: 'What I Look For in New Engineering Tools', topic: 'Technology · Evaluation' },
			{ date: '2026-06-08T09:00:00-04:00', title: 'The CTO Job Is Often a Clarity Job', topic: 'Leadership · CTO' },
			{ date: '2026-06-22T09:00:00-04:00', title: 'What Prefabrication Software Gets Wrong', topic: 'Product · Manufacturing' }
		];

		var formatDate = function (isoDate) {
			return new Date(isoDate).toLocaleString('en-US', {
				weekday: 'long',
				month: 'long',
				day: 'numeric',
				year: 'numeric',
				hour: 'numeric',
				minute: '2-digit'
			});
		};

		var updateSchedule = function () {
			var now = new Date();
			var nextPost = scheduledPosts.find(function (post) {
				return new Date(post.date) > now;
			}) || scheduledPosts[scheduledPosts.length - 1];

			$('[data-next-post-title]').text(nextPost.title);
			$('[data-next-post-topic]').text(nextPost.topic);
			$('[data-next-post-date]').text(formatDate(nextPost.date));

			var diffMs = Math.max(new Date(nextPost.date) - now, 0);
			var totalMinutes = Math.floor(diffMs / 60000);
			var days = Math.floor(totalMinutes / 1440);
			var hours = Math.floor((totalMinutes % 1440) / 60);
			var minutes = totalMinutes % 60;

			$('[data-countdown-days]').text(days);
			$('[data-countdown-hours]').text(hours);
			$('[data-countdown-minutes]').text(minutes);
		};

		updateSchedule();
		window.setInterval(updateSchedule, 60000);
	}

})(jQuery);
