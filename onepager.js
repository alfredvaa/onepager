(function($){
	$.fn.onepager = function(options) {

		var wrapper = this;
		var isAnimatied = false;
		var lockSlideDown = false;
		var body = $('body');
		var ul = wrapper.children('ul');


		var settings = $.extend({

			activeType: 'bar',			// 'bar', 'color', 'box', 'none'
			activeDefault: true,
			autoSlide: true,
			autoPush: true,

			mobileBreakpoint: 768,		// Pixels width
			mobilePosition: 'top',		// 'top', 'left', 'right'
			mobileToggleFloat: 'left',	// 'left', 'right'
			mobileMenuWidth: '70%',
			mobileMenuFixed: false,
			mobileToggleIcon:  "<span class='onepager-menu-bar'></span>\
								<span class='onepager-menu-bar'></span>\
								<span class='onepager-menu-bar'></span>",
			mobileToggleAnimate: true
		}, options);


		wrapper.addClass('onepager-menu').addClass('onepager-menu-active-'+settings.activeType);

		var isMobile = $(window).width() < settings.mobileBreakpoint;
		if(isMobile) wrapper.addClass('mobile');

		if(settings.activeType == 'bar' && !isMobile) {
			var indicator = $("<div class='onepager-active-indicator'></div>");
			$('body').prepend(indicator);  
		}

		if(settings.mobileMenuFixed) wrapper.addClass('onepager-menu-fixed');

		// Change the active menu item and move indicator
		function changeActive(newActive) {
			wrapper.find('a').removeClass('active');

			if($(newActive).length){
				wrapper.find(newActive).addClass('active');

				if(settings.activeType == 'bar' && !isMobile) {
					indicator.stop().animate({
						'left': $(newActive).offset().left,
						'width': $(newActive).outerWidth()			
					});
				}
			}
		}

		// move indicator & slide down
		wrapper.find('a').click(function(e){
			isAnimatied = true;
			var link = this;

			if(!$(this).parent().hasClass('onepager-title')) { // TODO add class for external links (or depend on hash)
				changeActive(link);
				e.preventDefault();
			}

			if(settings.autoSlide) {

				var toPos = $(link).attr('href');

				if(toPos.charAt(0) == '#') { 
					distanceTop = $(toPos).offset().top-$('body').offset().top+'px';
				} else {
					distanceTop = '0px';
				}

				$('html, body').animate({scrollTop: distanceTop}, function(){
					isAnimatied = false;
				});
			}

			if(settings.autoPush) {
				history.pushState(null, null, $(this).attr('href'));
			}
		});

		// Autoslide
		var menu = {}

		wrapper.find('a').each(function() {
			if(!$(this).parent().hasClass('onepager-title') && $(this).attr('href').charAt(0) == '#') {
				var theID = $(this).attr('href');

				if($(theID).length != 0) {
					menu[$(theID).offset().top] = theID;
				}
			}
		});

		menu['99999'] = "filler";

		var firstMenuItem = wrapper.find('li').not('.onepager-title').first().children().attr('href');

		var lastClosest;
		var closest;

		$(window).scroll(function(e){
			if(isAnimatied == false) {

				var centerOfWindow = $(window).scrollTop()+($(window).height()/2);
				var prevTop = 0;
				var prevId;

				$.each(menu, function(i, v){
					if(prevTop < centerOfWindow && i > centerOfWindow) {
						closest = prevId;
					}

					prevTop = i;
					prevId = v;
				});

				if(settings.activeDefault) {
					if($(window).scrollTop() < 10 && $(firstMenuItem).length) {
						closest = firstMenuItem;
					}
				}

				if(lastClosest != closest) {
					changeActive('a[href='+closest+']');
					lastClosest = closest;

					//history.pushState(null, null, closest);
				}
			}
		}).trigger('scroll');


		/////////////////
		// Mobile menu //
		/////////////////


		if(isMobile) {
			var menuToggle = 
				$("<a href='#' class='onepager-menu-toggle'>"+settings.mobileToggleIcon+"</a>")
					.addClass(settings.mobileToggleFloat);

			var onePagerTitle = wrapper.find('.onepager-title');

			wrapper
				.prepend(menuToggle)
				.prepend(onePagerTitle);

			//////////////////
			// Position TOP //
			//////////////////

			if(settings.mobilePosition == 'top') {
				ul.addClass('onepager-position-top');

				menuToggle.click(function(e){
					e.preventDefault();
					if(!settings.mobileMenuFixed) wrapper.toggleClass('onepager-menu-fixed');
					ul.slideToggle('fast');
				});

				wrapper.find('a').not('.onepager-menu-toggle').click(function(){
					ul.slideUp('fast');
				});


			/////////////////////////
			// Position LEFT/RIGHT //
			/////////////////////////

			} else if(settings.mobilePosition == 'left' || settings.mobilePosition == 'right') {
				var overlay = $("<div class='onepager-menu-overlay'></div>");

				if(!$('.onepager-page-wrapper').length) {
					body
						.prepend(overlay)
						.wrapInner("<div class='onepager-page-wrapper'></div>")
						.prepend($('header')); // TODO
				} else {
					overlay = $('.onepager-menu-overlay');
				}

				var pageWrapper = 
					$('.onepager-page-wrapper')
					.css({
						'width': '100%'
					});

				$('html').css({
					'overflow-x': 'hidden'
				});

				ul.css({
					'width': settings.mobileMenuWidth,
					//'position': 'fixed',
					'left': '0',
					'bottom': '0',
					'padding': '0',
					//'height': '100%',
					'display': 'none'			
				}).addClass('onepager-position-leftright');

				if(settings.mobilePosition == 'right') {
					ul.css({'left': 'auto', 'right': '0'});
				}

				var isVisible = false;

				function hideMenu() {
					lockSlideDown = true;
					//ul.fadeOut('fast',function(){
					$('.onepager-menu').children('ul').fadeOut('fast', function(){ // TODO wrapper??

						pageWrapper.stop().animate({
							marginLeft: '0'
						},'fast', function(){
							lockSlideDown = false;
						});
					});
					overlay.fadeOut('fast');	
					isVisible = false;				
				}

				$('.onepager-action-hide-menu').click(hideMenu);

				menuToggle.click(function(e){
					e.preventDefault();
					$('.onepager-menu').children('ul').hide();
					if(!settings.mobileMenuFixed) wrapper.toggleClass('onepager-menu-fixed');

					if(isVisible) {
						hideMenu();
						if(settings.mobileToggleAnimate) 
							wrapper
								.find('.onepager-menu-toggle')
								.addClass('rotate-back')
								.removeClass('rotate'); // TODO move
					} else {
						// TODO add showMenu function.
						if(settings.mobileToggleAnimate) 
							wrapper
								.find('.onepager-menu-toggle')
								.addClass('rotate')
								.removeClass('rotate-back'); // TODO move

						if(settings.mobilePosition == 'left') {
							pageWrapper.stop().animate({
								marginLeft: settings.mobileMenuWidth
							},'fast', function(){
								ul.fadeIn();
							});
						} else if(settings.mobilePosition == 'right') {
							pageWrapper.stop().animate({
								marginLeft: '-'+settings.mobileMenuWidth
							},'fast', function(){
								ul.fadeIn();
							});							
						}

						overlay
							.stop()
							.fadeIn()
							.click(function(){
								hideMenu();
								isVisible = false;					
							});

						isVisible = true;
					}
				});

				wrapper.find('a').not('.onepager-menu-toggle').click(function(){
					isVisible = false;
					hideMenu();
				});
			}
		}

		return this;
	}
}(jQuery));