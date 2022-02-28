//
//-----------------------------------------------------------------
//페이지 공통 스크립트
//-----------------------------------------------------------------
//

'use strict'

var _gb = function(){
	this.wW =  window.innerWidth;
	this.wH =  window.innerHeight;
	this.window =  $(window);
	this.html =  $('html');
	this.body =  $('body');
	this.main = $('#main');
	this.header = $('header');
	this.menuAll = $('.menu-all');
	this.filter = $('.filter');
	this.dropDown = $('.dropDown'),
	this.tabMenu = $('.tab-menu'),
	this.tabCtsWrap = $('.tabCts-wrap'),
	this.dimmed = $('<div class="dimmed"></div>');
	this.fpCreated = false;
	this.isMobile = window.outerWidth <= 768 ? true : false;
	this.isMain = this.main.length;
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
						if(gb.isMain){
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
						if(gb.isMain){
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

		filterOn = function(){ // 프로젝트 리스트 필터
			gb.filter.find('dt > a').on('click', function(){
				var trg = $(this);

				if(trg.hasClass('active')){
					trg
					.removeClass('active')
					.closest('dt').next('dd').stop().slideUp(300);
				}else {
					trg
					.addClass('active')
					.closest('dt').next('dd').stop().slideDown(300);

					gb.filter.find('dt > a').not(trg)
					.removeClass('active')
					.closest('dt').next('dd').stop().slideUp(300);
				}
			});

			gb.filter.find('li a').on('click', function(){
				$(this).closest('li').addClass('selected');

				if(!$(this).closest('ul').hasClass('work-area')) 
					$(this).closest('li').siblings().removeClass('selected');
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
			$('.anchor-toolTip').on('mouseenter focusin', function(){
				var trgAnchor = $(this),
				dataToolTip = trgAnchor.attr('data-toolTip'),
				currentToolTip = $('#toolTip-' + dataToolTip),
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
						'top' : _clientY - 40 + 'px',
						'bottom' : 'auto',
						'left' : clientX + 'px'
					})
					.stop().fadeIn(300);
				}else {
					currentToolTip
					.removeClass('down')
					.addClass('up')
					.css({
						'bottom' : clientY - (trgAnchor.height() + 40) + 'px',
						'top' : 'auto',
						'left' : clientX + 'px'
					})
					.stop().fadeIn(300);
				}
			});

			$('.anchor-toolTip').on('mouseleave focusout', function(){
				var trgAnchor_ = $(this),
				dataToolTip_ = trgAnchor_.attr('data-toolTip'),
				currentToolTip_ = $('#toolTip-' + dataToolTip_);

				currentToolTip_.stop().fadeOut(300);
			});
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
					autoplay: {
						delay: 3000,
						disableOnInteraction : false,
						pauseOnMouseEnter : true
					},
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
			if(!gb.fpCreated){
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
					scrollOverflow: true,
					scrollBar: false,
					fitToSection: true,
					fitToSectionDelay: 1000,
					easing: 'easeInOutCubic',
					easingcss3: 'ease-in-out',
					//dragAndMove: false,
					offsetSection:true,
					normalScrollElements:'.scrollable',
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
					responsiveWidth: 0,
					responsiveHeight: 0,
					responsiveSlides: false,
			 
					//맞춤 선택자
					sectionSelector: '.section-view',
					slideSelector: '.slide-view',

					lazyLoading: false,
			 
					//이벤트
					onLeave: function(origin, destination, direction){
						if(destination != 1){
							$('.main-section-wrap-02').addClass('motion');
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
								gb.html.addClass('activeScroll');
							},500);
						}else{
							setTimeout(function(){
								gb.html.removeClass('activeScroll');
								$('.main-section-wrap-02').removeClass('motion');
							},700);
						}
					},

					afterRender: function(){
						gb.fpCreated = true;

						window.addEventListener('resize', function(){
							var section2offSet = $('.main-section-wrap-02').offset().top;

							if(gb.fpCreated){
								gb.fpCreated = false;
								$.fn.fullpage.destroy('all');
							}else {
								setTimeout(function(){
									commonFunction().wheelStart();
									gb.fpCreated = true;
									gb.isMobile = window.outerWidth <= 768 ? true : false;
								}, 100);
							}

							if(document.documentElement.scrollTop >= section2offSet){
								gb.html.addClass('activeScroll');
								$('.main-section-wrap-02').addClass('motion');	
							}else {
								gb.html.removeClass('activeScroll');
								$('.main-section-wrap-02').removeClass('motion');
							}
						});
					},
					//afterLoad: function(origin, destination, direction){},
					// afterResize: function(width, height){},
					// afterReBuild: function(){},
					// afterResponsive: function(isResponsive){},
					// afterSlideLoad: function(section, origin, destination, direction){},
					// onSlideLeave: function(section, origin, destination, direction){}
				})
			}
		},

		contextMenu_cancel = function(){ // 우 클릭, 드래그 방지
			$(document).on('contextmenu selectstart dragstart', function(){
				return false;
			});
		},

		init = function(){
			menuOn();
			filterOn();
			dropDown();
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
			fileUpload : fileUpload
		}
	}

	if(!gb.isMain){
		window.addEventListener('scroll', function(){
			if(document.documentElement.scrollTop >= $('.contents-wrap').offset().top - gb.header.height()){
				gb.html.addClass('activeScroll');
				$('.side-menu').addClass('l-fixed');
			}else{
				gb.html.removeClass('activeScroll');
				$('.side-menu').removeClass('l-fixed');
			}
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