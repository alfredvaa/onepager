(function($){
	$.fn.onepager = function(options) {
		/** 
		 * ´this´ is the nav containing an ul list containing li elements with a elements in.
		 *  
		 * Usage:
		 * Name the href attributes of the menu links to the same id as the section it refers 
		 * to and the menu should be generated. use class onepager-title on the li title 
		 * element to exclude it from the animations: <li class="onepager-title">.
		 *
		 * Example:
		 * <a href="/#home">Go to home</a>
		 * 
		 * <section id="home"></section>
		 *
		 * Author: Alfred Yrelin
		 * URL: soon
		 */

		var wrapper = this;
		var isAnimatied = false;
		var lockSlideDown = false;

		var body = $('body');

		/**
		* SETTINGS
		*
		* mobile:
		*	Width where mobile menu is toggled.
		* 
		* type:
		* 	bar - show a color bar as active indicator
		* 	color - highlight active link with color
		* 
		*/
		var settings = $.extend({
			mobile: 768,
			type: 'bar',
			mobileType: 'top',
			mobileFloat: 'left',
			mobileMenuWidth: '70%',
			mobileMenuFixed: false,
			customWrapperClass: 'onepager-menu',
			menuToggleCustom:  "<span class='onepager-menu-bar'></span>\
								<span class='onepager-menu-bar'></span>\
								<span class='onepager-menu-bar'></span>"
		}, options);

		wrapper.addClass(settings.customWrapperClass);

		var isMobile = $(window).width() < settings.mobile;

		if(isMobile) wrapper.addClass('mobile');

		if(settings.type == 'bar' && !isMobile) {
			var indicator = $("<div class='active-indicator'></div>");
			$('body').prepend(indicator);  

			
			// Set options
			indicator.css({
				'height': '5px',
				'width': '1px',
				'top': '0',
				'position': 'fixed',
				'z-index': '99999999999'
			});
		}

		// Change the active menu item and move indicator
		function changeActive(newActive) {
			wrapper.find('a').removeClass('active');

			if($(newActive).length){
				wrapper.find(newActive).addClass('active');

				if(settings.type == 'bar' && !isMobile) {
					indicator.stop().animate({
						'left': $(newActive).offset().left,
						'width': $(newActive).outerWidth()			
					});
				}
			}
		}

		// move indicator & slide down
		wrapper.find('a').click(function(e){
			e.preventDefault();

			isAnimatied = true;
			var link = this;

			if(!$(this).parent().hasClass('onepager-title')) {
				changeActive(link);
			}

			var toPos = $(link).attr('href');

			if(toPos.charAt(0) == '#') { 
				distanceTop = $(toPos).offset().top-$('body').offset().top+'px';
			} else {
				distanceTop = '0px';
			}

			$('html, body').animate({scrollTop: distanceTop}, function(){
				isAnimatied = false;
			});

			history.pushState(null, null, $(this).attr('href'));
		});

		// Autoslide
		var menu = {}

		wrapper.find('a').each(function() {
			if(!$(this).parent().hasClass('onepager-title')) {
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

				if($(window).scrollTop() < 10 && $(firstMenuItem).length) {
					closest = firstMenuItem;
				}

				if(lastClosest != closest) {
					changeActive('a[href='+closest+']');
					lastClosest = closest;

					//history.pushState(null, null, closest);
				}
			}
		}).trigger('scroll');


		/////////////////
		// mobile menu //
		/////////////////


		if($(window).width() < settings.mobile) {
			var ul = wrapper.find('ul').first();
			var menuToggle = $("<a href='#' class='onepager-menu-toggle'>"+settings.menuToggleCustom+"</a>");

			var onePagerTitle = wrapper.find('.onepager-title');

			wrapper.prepend(menuToggle).prepend(onePagerTitle);

			menuToggle.css({
				'cursor': 'pointer'
			});

			if(settings.mobileFloat == 'right') {
				menuToggle.addClass('right');
			} else {
				menuToggle.addClass('left');
			}

			ul.find('li').css({
				'width': '100%;',
				'display': 'block'
			});

			if(settings.mobileType == 'top') {
				ul.hide().css({
					'position': 'absolute',
					'left': '0',
					'right': '0',
					'margin': '0',
					'padding': '0'
				});

				menuToggle.click(function(e){
					e.preventDefault();
					ul.slideToggle('fast');
				});

				wrapper.find('a').not('.onepager-menu-toggle').click(function(){
					ul.slideUp('fast');
				});


			} else if(settings.mobileType == 'left' || settings.mobileType == 'right') {
				var overlay = 
					$("<div class='onepager-menu-overlay'></div>")
					.css({
						'width': '100%',
						'height': '100%',
						'position': 'fixed',
						'background': '#000000',
						'z-index':'9999999',
						'opacity': '0.5',
						'display': 'none'
					});

				if(!$('.onepager-page-wrapper').length) {
					body
						.prepend(overlay)
						.wrapInner("<div class='onepager-page-wrapper'></div>")
						.prepend($('header')); // TODO
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
				});

				if(settings.mobileType == 'right') {
					ul.css({'left': 'auto', 'right': '0'});
				}

				/*if(settings.mobileMenuFixed) {
					ul.css('margin-top', wrapper.height());
				}*/

				var isVisible = false;

				function hideMenu() {
					lockSlideDown = true;
					//ul.fadeOut('fast',function(){
					$('.onepager-menu').children('ul').fadeOut('fast', function(){

						pageWrapper.stop().animate({
							marginLeft: '0'
						},'fast', function(){
							lockSlideDown = false;
						});
					});
					overlay.fadeOut('fast');					
				}

				menuToggle.click(function(e){
					e.preventDefault();
					$('.onepager-menu').children('ul').hide();

					if(isVisible) {
						hideMenu();
						$('.onepager-menu-toggle').addClass('rotate-back').removeClass('rotate');

						isVisible = false;
					} else {
						// TODO add showMenu function.
						$('.onepager-menu-toggle').addClass('rotate').removeClass('rotate-back');

						if(settings.mobileType == 'left') {
							pageWrapper.stop().animate({
								marginLeft: settings.mobileMenuWidth
							},'fast', function(){
								ul.fadeIn();
							});
						} else if(settings.mobileType == 'right') {
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