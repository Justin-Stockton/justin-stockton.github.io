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

	var blogPosts = [
		{
			date: '2026-05-11T09:00:00-04:00',
			title: 'The End of the Sunday Night Scramble: Where AI Fits in Construction Today',
			topic: 'AI · Construction · Operations',
			description: 'A pragmatic look at where AI is actually helping contractors today, from meeting capture and field handoffs to risk visibility and operational follow-through.',
			href: '/blog/where-ai-fits-in-construction-today/'
		},
		{
			date: '2026-04-27T09:00:00-04:00',
			title: 'What Building Software for Electrical Contractors Taught Me About Product Design',
			topic: 'Leadership · Product',
			description: 'Good product work in construction does not start with interface trends or abstract process diagrams. It starts with listening to how work actually happens in the field and designing around pressure, timing, and operational reality.',
			href: '/blog/building-software-for-electrical-contractors/'
		},
		{
			date: '2026-04-12T09:00:00-04:00',
			title: 'AI Should Remove Friction, Not Add Noise',
			topic: 'AI · Engineering',
			description: 'The strongest AI use cases are the ones that reduce repetitive work, improve clarity, and keep engineers focused on judgment instead of churn.',
			href: '/blog/ai-should-remove-friction/'
		},
		{
			date: '2026-03-28T09:00:00-04:00',
			title: 'Staying Hands-On as a CTO',
			topic: 'CTO · Engineering Management',
			description: 'Technical proximity still matters in leadership. The challenge is knowing when hands-on involvement creates leverage and when it creates drag.',
			href: '/blog/staying-hands-on-as-a-cto/'
		},
		{
			date: '2026-03-14T09:00:00-04:00',
			title: 'Tech Trends Worth Watching Without Chasing Hype',
			topic: 'Trends · Technology',
			description: 'Not every fast-moving trend deserves adoption. The better question is which shifts materially improve delivery, product quality, or customer experience.',
			href: '/blog/tech-trends-without-hype/'
		},
		{
			date: '2026-02-28T09:00:00-04:00',
			title: 'How I Form First Impressions of New Technology',
			topic: 'New Technology · Evaluation',
			description: 'My first pass on a new tool is less about novelty and more about adoption cost, workflow fit, and whether the upside is real enough to justify team attention.',
			href: '/blog/first-impressions-of-new-technology/'
		},
		{
			date: '2026-05-25T09:00:00-04:00',
			title: 'The Spreadsheet Ceiling: Why Your Growth Is Hitting an Excel Wall',
			topic: 'Data · Product · Operations',
			description: 'Why Excel eventually hits a ceiling, and why software built around the voice of the user creates a stronger foundation for future automation.',
			href: '/blog/master-spreadsheet-or-purpose-built-saas/'
		},
		{
			date: '2026-06-08T09:00:00-04:00',
			title: 'The CTO Job Is Often a Clarity Job',
			topic: 'Leadership · CTO',
			description: 'How technical leadership often creates the most value by reducing ambiguity, not by generating more motion.'
		},
		{
			date: '2026-06-22T09:00:00-04:00',
			title: 'What Prefabrication Software Gets Wrong',
			topic: 'Product · Manufacturing',
			description: 'A look at where prefabrication tools often miss the operational realities they are supposed to support.'
		}
	];

	var sortedBlogPosts = blogPosts.slice().sort(function (a, b) {
		return new Date(b.date) - new Date(a.date);
	});

	var formatBlogMeta = function (post) {
		return new Date(post.date).toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		}) + ' · ' + post.topic;
	};

	var publishedBlogPosts = function () {
		var now = new Date();
		return sortedBlogPosts.filter(function (post) {
			return post.href && new Date(post.date) <= now;
		});
	};

	var upcomingBlogPosts = function () {
		var now = new Date();
		return sortedBlogPosts.slice().reverse().filter(function (post) {
			return new Date(post.date) > now;
		});
	};

	if ($('[data-blog-preview-list]').length) {
		var previewMarkup = publishedBlogPosts().slice(0, 3).map(function (post) {
			return [
				'<div class="col-lg-4 mb-4">',
					'<article class="blog-tease-card h-100">',
						'<p class="blog-meta">' + formatBlogMeta(post) + '</p>',
						'<h3><a href="' + post.href + '">' + post.title + '</a></h3>',
						'<p>' + post.description + '</p>',
						'<a class="blog-link" href="' + post.href + '">Read the post</a>',
					'</article>',
				'</div>'
			].join('');
		}).join('');

		$('[data-blog-preview-list]').html(previewMarkup);
	}

	if ($('[data-blog-featured]').length || $('[data-blog-index-list]').length) {
		var publishedPosts = publishedBlogPosts();
		var featuredPost = publishedPosts[0];
		var additionalPosts = publishedPosts.slice(1, 5);

		if (featuredPost && $('[data-blog-featured]').length) {
			$('[data-blog-featured]').html([
				'<article class="blog-index-card featured-blog-card">',
					'<p class="blog-meta">' + formatBlogMeta(featuredPost) + '</p>',
					'<h2><a href="' + featuredPost.href + '">' + featuredPost.title + '</a></h2>',
					'<p>' + featuredPost.description + '</p>',
					'<a class="blog-link" href="' + featuredPost.href + '">Read article</a>',
				'</article>'
			].join(''));
		}

		if ($('[data-blog-index-list]').length) {
			var indexMarkup = additionalPosts.map(function (post) {
				return [
					'<div class="col-md-6 mb-4">',
						'<article class="blog-index-card h-100">',
							'<p class="blog-meta">' + formatBlogMeta(post) + '</p>',
							'<h3><a href="' + post.href + '">' + post.title + '</a></h3>',
							'<p>' + post.description + '</p>',
							'<a class="blog-link" href="' + post.href + '">Read article</a>',
						'</article>',
					'</div>'
				].join('');
			}).join('');

			$('[data-blog-index-list]').html(indexMarkup);
		}
	}

	/*--/ Upcoming blog schedule /--*/
	if ($('[data-post-schedule]').length) {
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
			var futurePosts = upcomingBlogPosts();
			var nextPost = futurePosts[0];

			if (!nextPost) {
				$('[data-next-post-title]').text('No scheduled post queued');
				$('[data-next-post-topic]').text('');
				$('[data-next-post-date]').text('');
				$('[data-countdown-days]').text(0);
				$('[data-countdown-hours]').text(0);
				$('[data-countdown-minutes]').text(0);
				return;
			}

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
