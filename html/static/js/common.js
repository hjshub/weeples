//
//-----------------------------------------------------------------
//페이지 공통 스크립트
//-----------------------------------------------------------------
//

'use strict'

var _gb = function(){
	this.wW =  window.innerWidth;
	this.wH =  window.innerHeight;
	this.html =  $('html');
	this.body =  $('body');
	this.main = $('#main');
	this.header = $('header');
	this.menuAll = $('.menu-all');
	this.filter = $('.filter');
	this.sideMenu = $('.side-menu');
	this.dropDown = $('.dropDown');
	this.dropDown2 = $('.dropDown2');
	this.tabMenu = $('.tab--active');
	this.tabCtsWrap = $('.tabCts-wrap');
	this.dimmed = $('<div class="dimmed"></div>');
	this.isMobile = this.wW <= 850 ? true : false;
},

gb = new _gb();

$(function(){
	commonFunction().init();
});

function commonFunction(){
	var commonFunction = new gb.CommonFunction();

	return commonFunction;
}

(function($){
	gb.CommonFunction = function(){
		var menuOn = function(){ // 상단 전체메뉴
			gb.menuAll.find('> a').on('click', function(e){
				e.preventDefault();
				e.stopPropagation();

				gb.menuAll.toggleClass('open');

				if(gb.menuAll.hasClass('open')){
					gb.menuAll.find('> div')
					.stop().fadeIn('300', function(){
						if(gb.main.length){
							$.fn.fullpage.setAllowScrolling(false);
						}else{
							gb.body.css({
								'height': '100vh',
								'overflow' : 'hidden' 
							});
						}
					});
					gb.menuAll.find('> div ul')
					.addClass('animation--start');
				}else {
					gb.menuAll.find('> div')
					.stop().fadeOut('300', function(){
						if(gb.main.length){
							$.fn.fullpage.setAllowScrolling(true);
						}else{
							gb.body.css({
								'height': 'auto',
								'overflow' : 'auto' 
							});
						}
					});
					gb.menuAll.find('> div ul')
					.removeClass('animation--start');
				}
			});
		},

		tabMenu = function(){
			gb.tabMenu.find('a').on('click', function(e){
				e.preventDefault();
				e.stopPropagation();

				var trg = $(this),
						id = trg.attr('href').substr(1),
						tabCtsWrap = trg.closest(gb.tabMenu).next(gb.tabCtsWrap);

				trg.closest('li').addClass('selected');
				gb.tabMenu.find('a').not(trg).closest('li').removeClass('selected');

				tabCtsWrap.find('.tabCts').css('display', 'none');
				tabCtsWrap.find('.tabCts#' + id).css('display', 'block');
			});
		},

		filter = function(){ // 프로젝트 리스트 필터
			var radio = gb.filter.find('.sort-wrap input[type=radio]'),
			checkbox = gb.filter.find('.sort-wrap input[type=checkbox]');

			gb.workArea = new Array;

			radio.each(function(){
				var trg = $(this),
				txt_value = trg.next('label').text();
				if(trg.prop('checked')){
					trg.closest('dl').find('dt em').html(txt_value);
				}

				trg.on('change', function(){
					txt_value = trg.next('label').text();
					if(trg.prop('checked')){
						trg.closest('dl').find('dt em').html(txt_value);
					}
				});
			});

			checkbox.each(function(){
				var trg = $(this),
				txt_value = trg.next('label').text();

				if(trg.prop('checked')){
					gb.workArea.push(txt_value);
				}
				trg.closest('dl').find('dt em').html(gb.workArea.join(', '));

				trg.on('change', function(){
					txt_value = trg.next('label').text();
					if(trg.prop('checked')){
						gb.workArea.push(txt_value);
					}else{
						var idx = gb.workArea.indexOf(txt_value);
						gb.workArea.splice(idx, 1);
					}
					trg.closest('dl').find('dt em').html(gb.workArea.join(', '));
				});
			});
		},

		dropDown = function(){
			gb.dropDown.each(function(){
				var trg = $(this);

				if(trg.find('.task input').prop('checked')){
					trg.find('.dropDown-list').css('display','block');
				}

				trg.find('.task input').on('change', function(){
					if($(this).prop('checked')){
						trg.find('.dropDown-list').stop().slideDown(300);
					}else{
						trg.find('.dropDown-list').stop().slideUp(300);
					}
				});
			});
		},

		dropDown2 = function(){
			gb.dropDown2.find('dt > a').on('click', function(){
				var trg = $(this);

				if(trg.hasClass('active')){
					trg
					.removeClass('active')
					.closest('dt').next('dd').stop().slideUp(300);
				}else {
					trg
					.addClass('active')
					.closest('dt').next('dd').stop().slideDown(300);

					gb.dropDown2.find('dt > a').not(trg)
					.removeClass('active')
					.closest('dt').next('dd').stop().slideUp(300);
				}
			});
		},

		addList = function(t){ // 리스트 추가
			var Item = $(t).closest('.add-list-wrap').find('.list-item'),
					cloneItem = $(Item[0]).clone();

			cloneItem.find('select').prop('selectedIndex',0);
			cloneItem.find('input').val('');
			cloneItem.find('.fileName').html('');
			cloneItem.find('.delete-list').css('display', 'inline-block');

			$(t).next('button').css('display', 'inline-block');
			$(t).closest('.list-item').after(cloneItem);

			setTimeout(function(){
				var Item_ = $(t).closest('.add-list-wrap').find('.list-item');

				Item_.each(function(idx){
					var selectWrap = $(this).find('.select-wrap'),
					textWrap = $(this).find('.text-wrap'),
					fileWrap = $(this).find('.file-wrap');

					// select id 초기화
					for(var i=0; i < selectWrap.length; i++){

						var label = $(selectWrap[i]).find('label'),
								select = $(selectWrap[i]).find('select'),
								label_for = label.attr('for').split('_'),
								select_Id = select.attr('id').split('_');

						label.attr('for',label_for[0] + '_' + (parseInt(idx) + 1));
						select.attr('id',select_Id[0] + '_' + (parseInt(idx) + 1));
					}

					// input text id 초기화
					for(var k=0; k < textWrap.length; k++){

						var text = $(textWrap[k]).find('input[type=text]'),
						text_Id = text.attr('id').split('_');

						text.attr('id',text_Id[0] + '_' + (parseInt(idx) + 1));
					}

					// input file id 초기화
					for(var j=0; j < fileWrap.length; j++){

						var file = $(fileWrap[j]).find('input[type=file]'),
						file_label = $(fileWrap[j]).find('label'),
						file_Id = file.attr('id').split('_'),
						file_label_for = file_label.attr('for').split('_');

						file.attr('id',file_Id[0] + '_' + (parseInt(idx) + 1));
						file_label.attr('for',file_label_for[0] + '_' + (parseInt(idx) + 1));
					}
				});

				$(document).find("input.datePick").removeClass('hasDatepicker').datepicker();
			},100);
		},

		removeList = function(t){ // 리스트 제거
			var Item = $(t).closest('.add-list-wrap').find('.list-item');

			$(t).closest('.list-item').remove();

			if(Item.length <= 2){
				$(Item).find('.delete-list').css('display', 'none');
			}
		},

		fileUpload = function(el, type){
		  var pathpoint = el.value.lastIndexOf('.'),
	    		filepoint = el.value.substring(pathpoint + 1, el.length),
	    		filetype = filepoint.toLowerCase(); // 업로드 파일 확장자

	    if(window.FileReader){ // modern browser				 
				var fileReader = new FileReader(),
						fileName = $(el)[0].files[0].name, // 첨부 파일 명
			 			filesize = $(el)[0].files[0].size; // 첨부 파일 용량

				fileReader.readAsDataURL($(el)[0].files[0]);		
	    }

	    if(type == 'image'){ // 이미지 업로드
	    	if(filetype =='jpg' || filetype =='gif' || filetype =='png' || filetype =='jpeg' || filetype=='bmp'){ // 정상적인 이미지 확장자 파일일 경우
					fileReader.onload = function(e){
						$(el).siblings('img').attr('src', e.target.result);
					}	
				}else{
	        alert('이미지 파일만 선택 할 수 있습니다.');
	        parentObj  = el.parentNode
	        node = parentObj.replaceChild(el.cloneNode(true),el);
	        return false;
		    }		
	    }else{
	    	$(el).closest('.file-wrap').next('em').html(fileName);
	    }
		},

		calendar = function(){
			$('.datePick').datepicker({
				showOn: "both",
			  buttonImageOnly: true,
			  buttonImage: "../static/img/icon/ico-calendar.png",
			   dateFormat: "yy-mm-dd"
			});
		},

		toolTip = function(){ // 툴팁
			$('.anchor-toolTip').on({
				'mouseenter focusin' : function(){
					var trgAnchor = $(this),
					dataToolTip = trgAnchor.attr('data-toolTip'),
					currentToolTip = $('.toolTip#' + dataToolTip),
					anchorOffsetTop = trgAnchor.offset().top,
					anchorOffsetLeft = trgAnchor.offset().left,
					currentScrollTop = document.documentElement.scrollTop,
					clientHeight = document.documentElement.clientHeight,
					scrollHeight = currentScrollTop + clientHeight,
					_clientY = anchorOffsetTop - currentScrollTop,
					clientY = scrollHeight - anchorOffsetTop,
					clientX = anchorOffsetLeft + trgAnchor.width() / 2;

					if(_clientY >= clientY){
						currentToolTip
						.removeClass('up')
						.addClass('down')
						.css({
							'top' : _clientY - 20 + 'px',
							'bottom' : 'auto',
							'left' : clientX + 'px'
						})
						.stop().fadeIn(300);
					}else {
						currentToolTip
						.removeClass('down')
						.addClass('up')
						.css({
							'bottom' : clientY - (trgAnchor.height() + 20) + 'px',
							'top' : 'auto',
							'left' : clientX + 'px'
						})
						.stop().fadeIn(300);
					}
				},
				'mouseleave focusout' : function(){
					var trgAnchor_ = $(this),
					dataToolTip_ = trgAnchor_.attr('data-toolTip'),
					currentToolTip_ = $('.toolTip#' + dataToolTip_);

					currentToolTip_.stop().fadeOut(300);
				}
			});
		},

		motion = function(){
			gsap.to(".bg-area", {width:0, opacity:0, duration:0.7});
			gsap.fromTo("h2", {opacity:0, y:100, scale:1.3}, {opacity:1, duration:1.5, delay:0.7});
			gsap.delayedCall(1.5, addMotion);

			function addMotion(){
				gsap.to("h2", {y:0, scale:1});
				gsap.fromTo(".section-wrap-01 dl dt", {
					opacity:0, 
					y:100
				}, {
					opacity:1, 
					y:0, 
					duration:1, 
					delay:0.4, 
					onComplete:function(){
						$('.section-wrap-01 dl dt').addClass('active')
					}
				});
				gsap.fromTo(".section-wrap-01 dl dd", {
					opacity:0,
					y:100
				}, {
					opacity:1, 
					y:0, 
					duration:1, 
					delay:0.4
				});
			}
		},

		mainSwiper = function(){ // 메인 스와이퍼
			if(gb.introSwiper == undefined){
				gb.introSwiper = new Swiper('.presentation > div', {
					// Optional parameters
					loop : true,
					speed : 600,
					centeredSlides : true,
					effect : 'fade',
					fadeEffect: {
						crossFade: true
					},
					pagination: {
	          el: ".swiper-pagination",
	          clickable: true,
	          renderBullet: function (index, className) {
	            return '<span class="' + className + '">' + '0' + (index + 1) + "</span>";
	          },
	        },
					slidesPerView: 1,
					debugger: true, // Enable debugger

					// Auto play
					/*
						autoplay: {
						delay: 3000,
						disableOnInteraction : false,
						pauseOnMouseEnter : true
					},
					*/
				});
			}
		},

		prjSwiper = function(){ // 프로젝트 스와이퍼
			if(gb.prjSwiper == undefined){
				gb.prjSwiper = new Swiper('.project-list > div', {
					// Optional parameters
					loop : true,
					speed : 600,
					direction : 'horizontal',
					slidesPerView: 4,
        	slidesPerGroup: 4,
					spaceBetween : 0,
					centeredSlides : false,
					debugger: true, // Enable debugger
					pagination: {
	          el: ".swiper-pagination2",
	          clickable: true,
	        },
	        navigation: {
						nextEl: ".swiper-nxt",
          	prevEl: ".swiper-prev",
        	},
        	//breakpoints: {
			    //when window width is >= 320px
			    //320: {
			    //  slidesPerView: 4,
        	//	slidesPerGroup: 4,
			    //},
				});
			}
		},

		ntcSwiper = function(){ // 공지 스와이퍼
			if(gb.ntcSwiper == undefined){
				gb.ntcSwiper = new Swiper('.notice-swiper', {
					// Optional parameters
					loop : true,
					speed : 600,
					direction : 'vertical',
					slidesPerView: 1,
					centeredSlides : false,
					debugger: true, // Enable debugger
					pagination: false,
					navigation: {
						nextEl: ".swiper-nxt",
          	prevEl: ".swiper-prev",
        	},

					// Auto play
					autoplay: {
						delay: 3000,
						disableOnInteraction : false,
						pauseOnMouseEnter : false
					},
				});
			}
		},

		wheelStart = function(){ // 메인 fullpage 호출
			gb.main.fullpage({
				//이동
				lockAnchors: true,
				navigation: false,
				showActiveTooltip: false,
				slidesNavigation: false,

				//스크롤
				css3: true,
				scrollingSpeed: 700,
				autoScrolling: true,
				scrollBar: false,
				fitToSection: false,
				fitToSectionDelay: 1000,
				easing: 'easeInOutCubic',
				easingcss3: 'ease-in-out',
				offsetSection:true,
				resetSliders: false,
				touchSensitivity: 15,
				bigSectionsDestination: null,
				resize:false,
		 
				//접근성
				keyboardScrolling: true,
				animateAnchor: true,
				recordHistory: true,
		 
				//디자인
				controlArrows: true,
				verticalCentered: false,
				responsiveWidth: 850,
				responsiveHeight: 0,
				responsiveSlides: false,
		 
				//맞춤 선택자
				sectionSelector: '.section-view',
				slideSelector: '.slide-view',

				lazyLoading: false,
		 
				//이벤트
				onLeave: function(origin, destination, direction){
					if(destination != 1){
						if(!gb.html.hasClass('activeScroll')){
							gb.html.addClass('activeScroll');

							if(!gb.isMobile){
								gsap.set(gb.header,{top:0, bottom:'auto'});
								gsap.from(gb.header, 0.5,{
									top:'-90px'
								});
							}else{
								gsap.set(gb.header,{bottom:0, top:'auto'});
								gsap.from(gb.header, 0.5,{
									bottom:'-90px'
								});
							}
							setTimeout(function(){
								$('.main-section-wrap-02').addClass('motion');
							},300);
						}
					}else {
						gb.html.removeClass('activeScroll');
						$('.main-section-wrap-02').removeClass('motion');
					}

					if(destination != 5){
						$('.main-section-wrap-0' + origin).find('.animate').removeClass('animation--start');
						setTimeout(function(){
							$('.main-section-wrap-0' + destination).find('.animate').addClass('animation--start');
						},500);
					}
				}
			})
		},

		contextMenu_cancel = function(){ // 우 클릭, 드래그 방지
			$(document).on('contextmenu selectstart dragstart', function(){
				return false;
			});
		},

		init = function(){
			menuOn();
			filter();
			dropDown();
			dropDown2();
			calendar();
			toolTip();
			tabMenu();
			//contextMenu_cancel();
		}

		return {
			init : init,
			wheelStart : wheelStart,
			mainSwiper : mainSwiper,
			prjSwiper : prjSwiper,
			ntcSwiper : ntcSwiper,
			addList : addList,
			removeList : removeList,
			fileUpload : fileUpload,
			motion : motion
		}
	}
	/*
	window.addEventListener('resize', function(){
		gb.isMobile = window.innerWidth <= 850 ? true : false;

		if(!gb.isMobile){
			gsap.set(gb.header,{top:0, bottom:'auto'});
			gsap.from(gb.header, 0.5,{
				top:'-90px'
			});
		}else{
			gsap.set(gb.header,{bottom:0, top:'auto'});
			gsap.from(gb.header, 0.5,{
				bottom:'-90px'
			});
		}
	});
	*/

	if(!gb.main.length){
		window.addEventListener('scroll', function(){
			if(document.documentElement.scrollTop >= gb.header.height()){
				gb.html.addClass('activeScroll');
			}else {
				gb.html.removeClass('activeScroll');
			}
		});
	}

	if(gb.sideMenu.length){
		window.addEventListener('scroll', function(){
			if(document.documentElement.scrollTop >= $('.contents-wrap').offset().top - gb.header.height()){
				gb.sideMenu.addClass('l-fixed');
			}else{
				gb.sideMenu.removeClass('l-fixed');
			}
		});
	}

	if(gb.html.hasClass('motion')){
		$('.animate').each(function(){
			var trg = $(this);

			window.addEventListener('scroll', function(){
				var trgTop = trg.offset().top;

				if(document.documentElement.scrollTop + document.documentElement.clientHeight - gb.header.height() >= trgTop){
					trg.addClass('animation--start');
				}else {
					trg.removeClass('animation--start');
				}
			});
		});	
	}

})(jQuery);

// 쿠키설정
function setCookie(cName, cValue, cDay){
	var expire = new Date();

	expire.setDate(expire.getDate() + cDay);
	cookies = cName + '=' + escape(cValue) + '; path=/ '; // 한글 깨짐을 막기위해 escape(cValue)를 합니다.
	if(typeof cDay != 'undefined') cookies += ';expires=' + expire.toGMTString() + ';';
    	document.cookie = cookies;
}
 
function getCookie(cName) {
    cName = cName + '=';
    var cookieData = document.cookie;
    var start = cookieData.indexOf(cName);
    var cValue = '';
    if(start != -1){
        start += cName.length;
        var end = cookieData.indexOf(';', start);
        if(end == -1)end = cookieData.length;
        cValue = cookieData.substring(start, end);
    }
    return unescape(cValue);
}