/*--------------------------------------------------
S E E J A Y   S O C I A L   W A L L
Website by Websolute
--------------------------------------------------*/


/*--------------------------------------------------
SocialWall
--------------------------------------------------*/
var $socialWallGrid = $('.social-wall-grid'),
  socialWall = {

    init: function () {

      $('.social-wall-grid').each(function (i, e) {

        var options = {
          codiceSocialWall: e.dataset.code,
          accessToken: e.dataset.token, // '634737799ba786bbfe74ff48a52b3f54725782e5eab78',
          maxFeed: e.dataset.maxFeed || 10,
          withMasonry: e.dataset.Masonry || 'false',
          currentFeed: 0,
          tooManyFeeds: false,
          media: [],
          loadedImages: 0,
          $data: null,
        };


        $.ajax({
          url: 'http://www.seejay.co/api/v1.0/wall/content/' + options.codiceSocialWall + '?access_token=' + options.accessToken,
          dataType: 'json',
          sync: true,
          cache: false,
          crossDomain: true,
          success: function (data) {
            options.$data = data;

            if (options.withMasonry === 'true') {
              socialWall.masonry();
            }

            socialWall.loadImages(e, options);
          }
        });
      });

    },

    loadImages: function (el, options) {

      for (i = options.currentFeed; i < options.maxFeed; i++) {
        if (typeof options.$data.data.items[i] != 'undefined') {

          var feed = options.$data.data.items[i],
              media = feed.media || undefined;

          var img = new Image();
          options.media.push(media.url);

          img.onload = function () {
            options.loadedImages++;
            // console.log(socialWall.loadedImages);
            if (options.loadedImages == options.maxFeed - 1) {

              switch (el.dataset.socialwallType) {
                case 'stories': socialWall.storiesGrid(el, options);
                break; 
                case 'alladececco': socialWall.alladececcoGrid(el, options);
                break;
                default: console.warn('Aggiungere attributo data-socialwall-type');
              }
              
            }
          }
          img.onerror = function () {
            inArray = $.inArray(this.src, options.media);
            options.$data.data.items.splice(inArray, 1);
          }
          img.src = media.url;

        }

      }
    },

    storiesGrid: function (elem, options) {

      if (options.$data.data.items.length < options.maxFeed) {
        options.maxFeed = options.$data.data.items.length;
        options.tooManyFeeds = true;
      }

      for (i = options.currentFeed; i < options.maxFeed; i++) {

        if (typeof options.$data.data.items[i] != 'undefined') {

          var feed = options.$data.data.items[i],
            source = (function () {
              switch (feed.source) {
                case 'PT':
                  return 'pinterest';
                  break;
                case 'IG':
                  return 'instagram';
                  break;
                case 'FB':
                  return 'facebook';
                  break;
                case 'TW':
                  return 'twitter';
                  break;
              }
            }()),
            // feedID = feed.id,
            // date = new Date(parseInt(feed.date)),
            dataRellaxSpeed = (function () {
              if (i === 1) { return 2; }
              else { return .1 + (i / 10); }
            }()),
            text = urlify(feed.text),
            media = feed.media || undefined,
            user = feed.user,
            avatar = user.avatar.replace('https', 'http'),
            userPermalink = user.permalink,
            icon,
            socialUrl,
            $item = $(
              '<a href="' + feed.permalink + '" class="stories__item rellax--stories" target="_blank" title="" data-rellax-speed="' + dataRellaxSpeed + '" style="background-image:url(' + media.url + ')"> \
                  <img src="' + media.url + '" alt="" title=""> \
                  <div class="stories__inner-wrapper"> \
                    <div class="stories__text"> \
                      <div> \
                        <span class="fa fa-' + source + '" aria-hidden="true"></span> \
                        <div class="stories__author my-2">' + user.id + '</div> \
                        <div class="stories__copy">' + text + '</div> \
                      </div> \
                    </div> \
                  </div> \
                </a>'
            )
            // $item = $('<div class="grid-item"><div class="grid-wrap"><div class="box"></div></div></div>'),
           
          ;


          // Se non è Google Plus e contiene foto
          if (source != 'GP' && typeof media != 'undefined') {
            

            // append
            $item.appendTo(elem);

            
            options.currentFeed++;

          } else {
            if (!options.tooManyFeeds) {
              options.maxFeed++;
            }
          }

        }
      }

      // Parallax Setup 
      var rellax = new Rellax('.rellax--stories', {
        speed: -2,
        center: true,
        round: false,
      });

      // Zoom effect setup
      $('.stories__item', elem).each(function(i,e) {
        $(e).hover(
          function() {
            var newStyle = this.getAttribute('style').replace(/(transform:[^;]*)/ig, '$1 scale(1.02)');
            this.setAttribute('style', newStyle);
          }, 
          function () {
            var newStyle = this.getAttribute('style').replace(/(scale\([^\)]*\))/ig, '');
            this.setAttribute('style', newStyle);
          }
        );
      })

    },

    alladececcoGrid: function (elem, options) {
      
      if (options.$data.data.items.length < options.maxFeed) {
        options.maxFeed = options.$data.data.items.length;
        options.tooManyFeeds = true;
      }

      for (i = options.currentFeed; i < options.maxFeed; i++) {

        if (typeof options.$data.data.items[i] != 'undefined') {

          var feed = options.$data.data.items[i],
              source = feed.source,
              feedID = feed.id,
              permalink = feed.permalink,
              date = new Date(parseInt(feed.date)),
              text = urlify(feed.text),
              media = feed.media || undefined,
              user = feed.user,
              avatar = user.avatar.replace('https', 'http'),
              userPermalink = user.permalink,
              icon,
              socialUrl,
              
              $item = $(
                '<a href="' + permalink + '" class="alladececco__post col-sm-4 mb-5 mb-md-0" title="" target="_blank">  \
                  <div class="alladececco__post__image mb-3" style="background-image: url(' + media.url + ')"></div> \
                  <h4 class="alladececco__post__author mb-3"> \
                    <img src="' + avatar + '" alt=""> \
                    <strong>' + user.id + '</strong> \
                  </h4>	 \
                  <div class="alladececco__post__copy">' + text + '</div> \
                </a>'
              )
            
            
          ;


          // Se non è Google Plus e contiene foto
          if (source != 'GP' && typeof media != 'undefined') {    
            
            // append
            $item.appendTo(elem);

            options.currentFeed++;

          } else {
            if (!options.tooManyFeeds) {
              options.maxFeed++;
            }
          }

        }
      }
          
      

    },

    masonry: function (elem, selector) {
      var $wall = $(elem).masonry({
        itemSelector: selector
      });

      $wall.imagesLoaded().progress(function () {
        $wall.masonry('layout');
      });

    }
  }


/*--------------------------------------------------
Urlify
--------------------------------------------------*/
function urlify(text) {
  var urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, function (url) {
    return '<a href="' + url + '" target="_blank">' + url + '</a>';
  })
}


/*--------------------------------------------------
DOC READY
--------------------------------------------------*/
$(function () {
  socialWall.init();

});
