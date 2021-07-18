"use strict"
//WebP ----------------------------------------
function testWebP(callback) {

   var webP = new Image();
   webP.onload = webP.onerror = function () {
      callback(webP.height == 2);
   };
   webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}
testWebP(function (support) {

   if (support == true) {
      document.querySelector('body').classList.add('webp');
   }
   else {
      document.querySelector('body').classList.add('no-webp');
   }
});
//---------------------------------------------------------------------
// ----------------------------------------------------

function ibg() {
      let ibg = document.querySelectorAll(".ibg");
      for (var i = 0; i < ibg.length; i++) {
         if (ibg[i].querySelector('img')) {
            ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
         }
      }
}

ibg();



// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
// e.x. data-da=".item,992,2"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle

"use strict";

function DynamicAdapt(type) {
	this.type = type;
}

DynamicAdapt.prototype.init = function () {
	const _this = this;
	// массив объектов
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	// массив DOM-элементов
	this.nodes = document.querySelectorAll("[data-da]");

	// наполнение оbjects объктами
	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}

	this.arraySort(this.оbjects);

	// массив уникальных медиа-запросов
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});

	// навешивание слушателя на медиа-запрос
	// и вызов обработчика при первом запуске
	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];

		// массив объектов с подходящим брейкпоинтом
		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};

const da = new DynamicAdapt("max");
da.init();
console.log('kjfd')
// console.log('swiper')
/* <script src="https://unpkg.com/swiper/swiper-bundle.min.js"></script> */
/* <link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css" /> */

let sliders = document.querySelectorAll('._swiper');
console.log(sliders)

if (sliders) {
   for (let index = 0; index < sliders.length; index++) {
      let slider = sliders[index];
      if (!slider.classList.contains('swiper-bild')) {
         let slider_items = slider.children;
         if (slider_items) {
            for (let index = 0; index < slider_items.length; index++) {
               let el = slider_items[index];
               el.classList.add('swiper-slide');
            }
         }
         let slider_content = slider.innerHTML;
         let slider_wrapper = document.createElement('div');
         slider_wrapper.classList.add('swiper-wrapper');
         slider_wrapper.innerHTML = slider_content;
         slider.innerHTML = '';
         slider.appendChild(slider_wrapper);
         slider.classList.add('swiper-bild');
      }
      if (slider.classList.contains('_gallery')) {
         //slider.data('LightGallery').destroy(true);
      }
   }
   slider_bild_callback();
}



function slider_bild_callback(params) { }

if (document.querySelector('.slider-main__body')) {
   console.log("OK");
   let main_slider = new Swiper('.slider-main__body', {

      loop: true,
      observer: true,
      observeParents: true,
      //    // // Navigation arrows Стрелки навигации
      navigation: {
         nextEl: '.main-slider .slider-arrow_next',
         prevEl: '.main-slider .slider-arrow_prev',
      },
      pagination: {
         el: '.controls-slider-main__dotts',
         clickable: true,
      },
      //    autoHeight: true,
      slidesPerView: 1,//'auto'
      spaceBetween: 32,
      watchOverflow: true,
      speed: 800,
      loopAdditionalSlides: 5,
      preloadImage: false,
      parallax: true,



      //    // effect: 'coverflow',
      //    // coverflowEffect: {
      //    //    rotate: 20,
      //    //    stretch: 50,
      //    //    slideShadow: true,
      //    // },
      //    // breakpoints: {
      //    //    320: {
      //    //       autoHeight: true,
      //    //       //    slidesPerView: 1,
      //    //       // },
      //    //       480: {
      //    //          autoHeight: true,
      //    //          // slidesPerView: 2,
      //    //       },
      //    //       768: {
      //    //          autoHeight: true,
      //    //       },
      //    //       992: {
      //    //          // slidesPerView: 3,
      //    //       },
      //    //    },
      //    // }
      //    // on: {
      //    //    lazyImageReady: function () {
      //    //       ibg();
      //    //    },
      //    // }

      //    // zoom: {

      //    //    maxRatio: 5,
      //    //    minRatio: 1,
      //    // },

      //    // thumbs: {
      //    //    swiper: {
      //    //       el: '.image-mini-slider',
      //    //       slidesPerView: 5,
      //    //    }
      //    // },

   });

}
if (document.querySelector('.slider-rooms__body')) {
   let main_slider = new Swiper('.slider-rooms__body', {

      loop: true,
      observer: true,
      observeParents: true,
      //    // // Navigation arrows Стрелки навигации
      navigation: {
         nextEl: '.slider-rooms .slider-arrow_next',
         prevEl: '.slider-rooms .slider-arrow_prev',
      },
      pagination: {
         el: '.slider-rooms__dotts',
         clickable: true,
      },
      //    autoHeight: true,
      slidesPerView: 'auto',//'auto'
      spaceBetween: 24,
      watchOverflow: true,
      speed: 800,
      loopAdditionalSlides: 5,
      preloadImage: false,
      parallax: true,



      //    // effect: 'coverflow',
      //    // coverflowEffect: {
      //    //    rotate: 20,
      //    //    stretch: 50,
      //    //    slideShadow: true,
      //    // },
      //    // breakpoints: {
      //    //    320: {
      //    //       autoHeight: true,
      //    //       //    slidesPerView: 1,
      //    //       // },
      //    //       480: {
      //    //          autoHeight: true,
      //    //          // slidesPerView: 2,
      //    //       },
      //    //       768: {
      //    //          autoHeight: true,
      //    //       },
      //    //       992: {
      //    //          // slidesPerView: 3,
      //    //       },
      //    //    },
      //    // }
      //    // on: {
      //    //    lazyImageReady: function () {
      //    //       ibg();
      //    //    },
      //    // }

      //    // zoom: {

      //    //    maxRatio: 5,
      //    //    minRatio: 1,
      //    // },

      //    // thumbs: {
      //    //    swiper: {
      //    //       el: '.image-mini-slider',
      //    //       slidesPerView: 5,
      //    //    }
      //    // },

   });

}
if (document.querySelector('.slider-tips__body')) {
   let main_slider = new Swiper('.slider-tips__body', {

      loop: true,
      observer: true,
      observeParents: true,
      //    // // Navigation arrows Стрелки навигации
      navigation: {
         nextEl: '.slider-tips .slider-arrow_next',
         prevEl: '.slider-tips .slider-arrow_prev',
      },
      pagination: {
         el: '.slider-tips__dotts',
         clickable: true,
      },
      //    autoHeight: true,
      // slidesPerView: 3,//'auto'
      spaceBetween: 32,
      watchOverflow: true,
      speed: 800,
      // loopAdditionalSlides: 5,
      // preloadImage: false,
      // parallax: true,



      //    // effect: 'coverflow',
      //    // coverflowEffect: {
      //    //    rotate: 20,
      //    //    stretch: 50,
      //    //    slideShadow: true,
      //    // },
      breakpoints: {
         320: {
            slidesPerView: 1.1,
            spaceBetween: 15
         },
         768: {
            slidesPerView: 2,
            spaceBetween: 20
         },
         992: {
            slidesPerView: 3,
            spaceBetween: 32
         },
      },
   
      // on: {
      //    lazyImageReady: function () {
      //       ibg();
      //    },
      // }

      // zoom: {

      //    maxRatio: 5,
      //    minRatio: 1,
      // },

      // thumbs: {
      //    swiper: {
      //       el: '.image-mini-slider',
      //       slidesPerView: 5,
      //    }
      // },

   });

}
// let slider_quotes = new Swiper('.slider-quotes__body', {
//    loop: true,
//    navigation: {
//       nextEl: '.control-slider-quotes__link',
//    },
//    slidesPerView: 1,//'auto'
//    spaceBetween: 0,
//    speed: 1000,
//    effect: 'fade',
// });
// let firstMove = true;

// swiper.on('slideChange', function () {
//    if (firstMove) {
//       firstMove = false;
//       this.slideTo(0, 0);
//    }
// });


// "use strict"

const isMobile = {
   Android: function () {
      return navigator.userAgent.match(/Android/i);
   },
   BlackBerry: function () {
      return navigator.userAgent.match(/BlackBerry/i);
   },
   IOS: function () {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
   },
   Opera: function () {
      return navigator.userAgent.match(/Opera Mini/i);
   },
   Windows: function () {
      return navigator.userAgent.match(/IEMobile/i);
   },
   any: function () {
      return (
         isMobile.Android() ||
         isMobile.BlackBerry() ||
         isMobile.IOS() ||
         isMobile.Opera() ||
         isMobile.Windows()
      );
   }
};

if (isMobile.any()) {
   document.body.classList.add('_touch');

   // Иконка подменю 
   // let menuArrows = document.querySelectorAll('.menu__arrow');
   // if (menuArrows.length > 0) {
   //    for (let index = 0; index < menuArrows.length; index++) {
   //       const menuArrow = menuArrows[index];
   //       menuArrow.addEventListener("click", function (e) {
   //          menuArrow.parentElement.classList.toggle('_active');
   //       });
   //    }
   // }

}
else {
   document.body.classList.add('_pc');
}
// МЕНЮ БУРГЕР
const iconMenu = document.querySelector('.icon-menu');
// console.log(iconMenu);
const menuBody = document.querySelector('.menu__body');
if (iconMenu) {
   iconMenu.addEventListener("click", function () {
      document.body.classList.toggle('_lock')
      iconMenu.classList.toggle('_active')
      menuBody.classList.toggle('_active')

   })
}

// Прокрутка при скролле
const menuLinks = document.querySelectorAll('.menu__link[data-goto]');
console.log(menuLinks);

if (menuLinks.length > 0) {
   menuLinks.forEach(menuLink => {
      menuLink.addEventListener("click", onMenuLinkClick);
   });

   function onMenuLinkClick(e) {
      const menuLink = e.target;
      if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
         const gotoBlock = document.querySelector(menuLink.dataset.goto);
         const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset - document.querySelector('header').offsetHeight;

         if (iconMenu.classList.contains('_active')) {
            document.body.classList.remove('_lock')
            iconMenu.classList.remove('_active')
            menuBody.classList.remove('_active')
         }

         window.scrollTo({
            top: gotoBlockValue,
            behavior: "smooth"
         });
         e.preventDefault();
      }
   }
}
// ВЫПОДАЮШЕЕ МЕНЮ ----------------------------------------------------
// let user_icon = document.querySelector('.user-header__icon');
// user_icon.addEventListener("click", function (e) {
//    let user_menu = document.querySelector('.user-header__menu');
//    user_menu.classList.toggle('_active');
// });
// // закрывать подменю при клике на любую область
// document.documentElement.addEventListener("click", function (e) {
//    if (!e.target.closest('.user-header')) {
//       let user_menu = document.querySelector('.user-header__menu');
//       user_menu.classList.remove('_active');
//    }
// });




// _removeClasses(document.querySelectorAll('.menu__item._hover'), "._hover")
// console.log(document.querySelectorAll('.menu__item'));

console.log('Spollers');

const spollersArray = document.querySelectorAll('[data-spollers]');
if (spollersArray.length > 0) {
   const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
      // поиск data-атрибут(-spollers)
      return !item.dataset.spollers.split(",")[0];
   });
   console.log(spollersRegular);
   if (spollersRegular.length > 0) {
      initSpollers(spollersRegular);
   }

   const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
      return item.dataset.spollers.split(",")[0];


   });

   if (spollersMedia.length > 0) {
      const breakpointsArray = []
      spollersMedia.forEach(item => {
         const params = item.dataset.spollers;
         // console.log(params);
         const breakpoint = {};
         // console.log(breakpoint);
         const paramsArray = params.split(",");
         // console.log(paramsArray);

         breakpoint.value = paramsArray[0];
         breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
         breakpoint.item = item;
         breakpointsArray.push(breakpoint);
         console.log(breakpointsArray);

      });


      let mediaQueries = breakpointsArray.map(function (item) {
         return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
      });
      // console.log(mediaQueries);
      // Фильтрует одинаковые значения в массиве
      mediaQueries = mediaQueries.filter(function (item, index, self) {
         return self.indexOf(item) === index;


      });
      console.log(mediaQueries);
      mediaQueries.forEach(breakpoint => {
         const paramsArray = breakpoint.split(",");
         console.log(paramsArray);
         const mediaBreakpoint = paramsArray[1];
         console.log(mediaBreakpoint);
         const mediaType = paramsArray[2];
         console.log(mediaType);
         const matchMedia = window.matchMedia(paramsArray[0]);
         console.log(matchMedia);

         const spollersArray = breakpointsArray.filter(function (item) {
            if (item.value === mediaBreakpoint && item.type === mediaType) {
               return true;
            }
         });
         console.log(spollersArray);
         // console.log(matchMedia);

         matchMedia.addListener(function () {
            initSpollers(spollersArray, matchMedia);
         });
         initSpollers(spollersArray, matchMedia);
      });
   }



   function initSpollers(spollersArray, matchMedia = false) {
      // console.log(spollersArray);

      spollersArray.forEach(spollersBlock => {
         spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
         if (matchMedia.matches || !matchMedia) {
            spollersBlock.classList.add('_init');
            initSpollerBody(spollersBlock);
            spollersBlock.addEventListener("click", setSpollerAction);
            // console.log(spollersArray);

         }
         else {
            spollersBlock.classList.remove('_init');
            initSpollerBody(spollersBlock, false);
            spollersBlock.removeEventListener("click", setSpollerAction);
         }
      });
   }

   function initSpollerBody(spollersBlock, hideSpollersBody = true) {
      const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
      if (spollerTitles.length > 0) {
         spollerTitles.forEach(spollerTitle => {
            if (hideSpollersBody) {
               spollerTitle.removeAttribute('tabindex');
               if (!spollerTitle.classList.contains('_active')) {
                  spollerTitle.nextElementSibling.hidden = true;
               }

            }
            else {
               spollerTitle.setAttribute('tabindex', '-1');
               spollerTitle.nextElementSibling.hidden = false;
            }
         });
      }
   }

   function setSpollerAction(e) {
      const el = e.target;
      if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
         const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
         const spollersBlock = spollerTitle.closest('[data-spollers]');
         const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
         if (!spollersBlock.querySelectorAll('._slide').length) {
            if (oneSpoller && !spollerTitle.classList.contains('_active')) {
               hideSpollersBody(spollersBlock);
            }
            spollerTitle.classList.toggle('_active');
            _slideToggle(spollerTitle.nextElementSibling, 500);
         }
         e.preventDefault();
      }
   }
   function hideSpollersBody(spollersBlock) {
      const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
      if (spollerActiveTitle) {
         spollerActiveTitle.classList.remove('_active');
         _slideUp(spollerActiveTitle.nextElementSibling, 500);
      }
   }
}

// ===================================================================================================================

let _slideUp = (target, duration = 500) => {
   if (!target.classList.contains('_slide')) {
      target.classList.add('_slide');
      target.style.transitionProperty = 'height, margin, padding';
      target.style.transitionDuration = duration + 'ms';
      target.style.height = target.offsetHeight + 'px';
      target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      window.setTimeout(() => {
         target.hidden = true;
         target.style.removeProperty('height');
         target.style.removeProperty('padding-top');
         target.style.removeProperty('padding-bottom');
         target.style.removeProperty('margin-top');
         target.style.removeProperty('margin-bottom');
         target.style.removeProperty('overflow');
         target.style.removeProperty('transition-duration');
         target.style.removeProperty('transition-property');
         target.classList.remove('_slide');
      }, duration);
   }
}
let _slideDown = (target, duration = 500) => {
   if (!target.classList.contains('_slide')) {
      target.classList.add('_slide');
      if (target.hidden) {
         target.hidden = false;
      }
      let height = target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      target.offsetHeight;
      target.style.transitionProperty = 'height, margin, padding';
      target.style.transitionDuration = duration + 'ms';
      target.style.height = height + 'px';
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      window.setTimeout(() => {
         target.style.removeProperty('height');
         target.style.removeProperty('overflow');
         target.style.removeProperty('transition-duration');
         target.style.removeProperty('transition-property');
         target.classList.remove('_slide');
      }, duration);
   }
}
let _slideToggle = (target, duration = 500) => {
   if (target.hidden) {
      return _slideDown(target, duration);
   }
   else {
      return _slideUp(target, duration);
   }
}

// initSpollers


console.log("index=========");

function _removeClasses(collection, className) {
   collection.forEach(element => {
      element.classList.remove(className)
   });
}


window.onload = function () {
   document.addEventListener("click", documentActions);

   function documentActions(e) {
      const targetElement = e.target;

      if (window.innerWidth > 768 && isMobile.any()) {
         if (targetElement.classList.contains('menu__arrow')) {
            targetElement.closest('.menu__item').classList.toggle('_hover')
         }
         // У нажатого объекта недолжно быть класса .menu__item ии проверяем есть ли класс _hover у .menu__item
         if (!targetElement.closest('.menu__item') && document.querySelectorAll('.menu__item._hover').length > 0) {

            _removeClasses(document.querySelectorAll('.menu__item._hover'), "_hover")
         }
      }
      if (targetElement.classList.contains('search-form__icon')) {
         document.querySelector('.search-form').classList.toggle('_active')
      } else if (!targetElement.closest('.search-form') && document.querySelector('.search-form._active')) {
         document.querySelector('.search-form').classList.remove('_active')
      }
      if (targetElement.classList.contains('products__more')) {

         getProducts(targetElement);
         e.preventDefault();

      }
      if (targetElement.classList.contains('actions-product__button')) {
         const productId = targetElement.closest('.item-product').dataset.pid;
         addToCart(targetElement, productId);
         e.preventDefault();
      }

      if (targetElement.classList.contains('cart-header__icon') || targetElement.closest('.cart-header__icon')) {
         if (document.querySelector('.cart-list').children.length > 0) {
            document.querySelector('.cart-header').classList.toggle('_active');
         }
         e.preventDefault();
      }
      else if (!targetElement.closest('.cart-header') && !targetElement.classList.contains('actions-product__button')) {
         document.querySelector('.cart-header').classList.remove('_active');
      }
      if (targetElement.classList.contains('cart-list__delete')) {
         const productId = targetElement.closest('.cart-list__item').dataset.cartPid;
         updateCart(targetElement, productId, false);
         e.preventDefault();
      }


   }

   const headerElement = document.querySelector('.header');

   const callback = function (entries, observer) {

      if (entries[0].isIntersecting) {
         headerElement.classList.remove('_scroll')
      }
      else {
         headerElement.classList.add('_scroll')
      }
   }

   const headerObserver = new IntersectionObserver(callback);
   headerObserver.observe(headerElement);



   // Load
   async function getProducts(button) {
      if (!button.classList.contains('_hold')) {
         button.classList.add('_hold');
         const file = "json/product.json";
         let response = await fetch(file, {
            method: "GET"
         });
         if (response.ok) {
            let result = await response.json();
            console.log("ddddddddd");

            loadProducts(result);
            button.classList.remove('_hold');
            button.remove();
         }
         else {
            alert("Ошибка");
         }
      }
   }


   function loadProducts(data) {
      const productsItems = document.querySelector('.products__items');

      data.products.forEach(item => {
         const productId = item.id;
         const productUrl = item.url;
         const productImage = item.image;
         const productTitle = item.title;
         const productText = item.text;
         const productPrice = item.price;
         const productOldPrice = item.priceOld;
         const productShareUrl = item.shareUrl;
         const productLikeUrl = item.likeUrl;
         const productLabels = item.labels;

         let productTemplateStart = `<article data-pid="${productId}" class="products__item item-product">`;
         let productTemplateEnd = `</article>`;

         let productTemplateLabels = '';
         if (productLabels) {
            let productTemplateLabelsStart = `<div class="item-product__labels">`;
            let productTemplateLabelsEnd = `</div>`;
            let productTemplateLabelsContent = '';

            productLabels.forEach(labelItem => {
               productTemplateLabelsContent += `<div class="item-product__label item-product__label_${labelItem.type}">${labelItem.value}</div>`;
            });

            productTemplateLabels += productTemplateLabelsStart;
            productTemplateLabels += productTemplateLabelsContent;
            productTemplateLabels += productTemplateLabelsEnd;
         }

         let productTemplateImage = `
		<a href="${productUrl}" class="item-product__image ibg">
			<img src="img/products/${productImage}" alt="${productTitle}">
		</a>
	`;

         let productTemplateBodyStart = `<div class="item-product__body">`;
         let productTemplateBodyEnd = `</div>`;

         let productTemplateContent = `
		<div class="item-product__content">
			<h3 class="item-product__title">${productTitle}</h3>
			<div class="item-product__text">${productText}</div>
		</div>
	`;

         let productTemplatePrices = '';
         let productTemplatePricesStart = `<div class="item-product__prices">`;
         let productTemplatePricesCurrent = `<div class="item-product__price">Rp ${productPrice}</div>`;
         let productTemplatePricesOld = `<div class="item-product__price item-product__price_old">Rp ${productOldPrice}</div>`;
         let productTemplatePricesEnd = `</div>`;

         productTemplatePrices = productTemplatePricesStart;
         productTemplatePrices += productTemplatePricesCurrent;
         if (productOldPrice) {
            productTemplatePrices += productTemplatePricesOld;
         }
         productTemplatePrices += productTemplatePricesEnd;

         let productTemplateActions = `
		<div class="item-product__actions actions-product">
			<div class="actions-product__body">
				<a href="" class="actions-product__button btn btn_white">Add to cart</a>
				<a href="${productShareUrl}" class="actions-product__link _icon-share">Share</a>
				<a href="${productLikeUrl}" class="actions-product__link _icon-favorite">Like</a>
			</div>
		</div>
	`;

         let productTemplateBody = '';
         productTemplateBody += productTemplateBodyStart;
         productTemplateBody += productTemplateContent;
         productTemplateBody += productTemplatePrices;
         productTemplateBody += productTemplateActions;
         productTemplateBody += productTemplateBodyEnd;

         let productTemplate = '';
         productTemplate += productTemplateStart;
         productTemplate += productTemplateLabels;
         productTemplate += productTemplateImage;
         productTemplate += productTemplateBody;
         productTemplate += productTemplateEnd;

         productsItems.insertAdjacentHTML('beforeend', productTemplate)
         ibg();
      })
   }

   function addToCart(productButton, productId) {
      console.log("addToCart");

      if (!productButton.classList.contains('_hold')) {
         productButton.classList.add('_hold');
         productButton.classList.add('_fly');

         const cart = document.querySelector('.cart-header__icon');
         const product = document.querySelector(`[data-pid="${productId}"]`);

         const productImage = product.querySelector('.item-product__image');

         const productImageFly = productImage.cloneNode(true);

         const productImageFlyWidth = productImage.offsetWidth;
         const productImageFlyHeight = productImage.offsetHeight;
         const productImageFlyTop = productImage.getBoundingClientRect().top;
         const productImageFlyLeft = productImage.getBoundingClientRect().left

         productImageFly.setAttribute('class', '_flyImage ibg');
         productImageFly.style.cssText =
            `left: ${productImageFlyLeft}px;
             top: ${productImageFlyTop}px;
             width: ${productImageFlyWidth}px;
             height: ${productImageFlyHeight}px;
            `;

         document.body.append(productImageFly);

         ibg();

         const cartFlyLeft = cart.getBoundingClientRect().left;
         const cartFlyTop = cart.getBoundingClientRect().top;
         console.log(cartFlyLeft);
         console.log(cartFlyTop);


         productImageFly.style.cssText =
            `left: ${cartFlyLeft}px;
         top: ${cartFlyTop}px;
         width: 0px;
         height: 0px;
         opacity: 0;
         `;
         ibg();
         console.log(productImageFly);

         productImageFly.addEventListener('transitionend', () => {
            console.log("event");

            if (productButton.classList.contains('_fly')) {
               productImageFly.remove();
               console.log(productImageFly);
               console.log(productButton.classList.contains('_fly'));

               updateCart(productButton, productId);
               productButton.classList.remove('_fly');
               console.log(productButton.classList.contains('_fly'));


            }
            productButton.classList.remove('_fly');
         });


      }

   }


   function updateCart(productButton, productId, productAdd = true) {

      console.log(productId);

      const cart = document.querySelector('.cart-header');
      const cartIcon = cart.querySelector('.cart-header__icon');
      const cartQuantity = cartIcon.querySelector('span');
      const cartProduct = document.querySelector(`[data-cart-pid="${productId}"]`);
      console.log(cartProduct);

      const cartList = document.querySelector('.cart-list');
      console.log(cartList);

      console.log(productAdd);

      if (productAdd) {
         console.log(cartQuantity);
         if (!cartQuantity) {

            cartIcon.insertAdjacentHTML('beforeend', `<span>1</span>`);
            console.log(cartIcon);


         } else {
            console.log(cartQuantity.innerHTML);

            cartQuantity.innerHTML = ++cartQuantity.innerHTML;
            console.log(cartQuantity.innerHTML);
         }
         console.log(cartProduct);

         if (!cartProduct) {

            const product = document.querySelector(`[data-pid="${productId}"]`);
            console.log(product);

            const cartProductImage = product.querySelector('.item-product__image').innerHTML;
            console.log(cartProductImage);

            const cartProductTitle = product.querySelector('.item-product__title').innerHTML;
            const cartProductContent = `
            <a href="" class="cart-list__image ibg">${cartProductImage}</a>
            <div class="cart-list__body">
               <a href="" class="cart-list__title">${cartProductTitle}</a>
               <div class="cart-list__quantity">Quantity: <span>1</span></div>
               <a href="" class="cart-list__delete">Delete</a>
            </div>
            `;
            cartList.insertAdjacentHTML('beforeend', `<li data-cart-pid="${productId}" class="cart-list__item">${cartProductContent}</li>`)
         } else {
            const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
            console.log(cartProductQuantity);

            cartProductQuantity.innerHTML = ++cartProductQuantity.innerHTML;



         }
         productButton.classList.remove('_hold');
         ibg();
      }
      else {
         const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
         cartProductQuantity.innerHTML = --cartProductQuantity.innerHTML;
         if (!parseInt(cartProductQuantity.innerHTML)) {
            cartProduct.remove();
         }

         const cartQuantityValue = --cartQuantity.innerHTML;

         if (cartQuantityValue) {
            cartQuantity.innerHTML = cartQuantityValue;
         }
         else {
            cartQuantity.remove();
            cart.classList.remove('_active');
         }

      }
   }

   ibg();





   // Furniture Gallery


   const furniture = document.querySelector('.furniture__body');
   if (furniture && !isMobile.any()) {
      const furnitureItems = document.querySelector('.furniture__items');
      const furnitureColumn = document.querySelectorAll('.furniture__column');

      // Speed Animation
      const speed = furniture.dataset.speed;


      let positionX = 0;
      let coordXprocent = 0;

      function setMouseGalleryStyle() {
         let furnitureItemsWidth = 0;
         furnitureColumn.forEach(element => {
            furnitureItemsWidth += element.offsetWidth;
            // console.log(window.offsetWidth);
         });


         // console.log(furniture.offsetWidth)
         // console.log(furnitureItemsWidth);

         const furnitureDifferent = furnitureItemsWidth - furniture.offsetWidth;
         // console.log(furnitureDifferent);

         const distX = Math.floor(coordXprocent - positionX);
         // console.log(distX);

         positionX = positionX + (distX * speed);
         let position = furnitureDifferent / 200 * positionX;
         // console.log(positionX);
         // console.log(position);

         furnitureItems.style.cssText = `transform: translate3d(${-position}px,0,0);`;
         // console.log(Math.abs(distX));

         if (Math.abs(distX) > 0) {
            requestAnimationFrame(setMouseGalleryStyle);
         }
         else {
            furniture.classList.remove('_init');
         }
      }
      //  console.log(speed);
      furniture.addEventListener("mousemove", function (e) {
         // Получение ширины
         const furnitureWidth = furniture.offsetWidth;

         // Ноль по середине
         const coordX = e.pageX - furnitureWidth / 2;
         console.log(coordX);
         // console.log(e);

         console.log(e.pageX);

         // Получаем проценты
         coordXprocent = coordX / furnitureWidth * 200;

         if (!furniture.classList.contains('_init')) {
            requestAnimationFrame(setMouseGalleryStyle);
            furniture.classList.add('_init');
         }
      })
   }
}






