﻿/*--------------------------------------------------
S E E J A Y   S O C I A L   W A L L
Website by Websolute
--------------------------------------------------*/


/*--------------------------------------------------
SocialWall
--------------------------------------------------*/
var socialWall = {
    codiceSocialWall: 'b17d6114643f2627f53de462565fda5e',
    accessToken: '634737799ba786bbfe74ff48a52b3f54725782e5eab78',
    maxFeed: 10,
    tooManyFeeds: false,
    withMasonry: false,
    loadMore: true,
    $grid: $('.social-wall-grid'),
    actualFeed: 0,
    $data: null,
    init: function () {
        $.ajax({
            url: 'http://www.seejay.co/api/v1.0/wall/content/' + socialWall.codiceSocialWall + '?access_token=' + socialWall.accessToken,
            dataType: 'json',
            sync: true,
            cache: false,
            crossDomain: true,
            success: function (data) {
                socialWall.$data = data;

                if (socialWall.withMasonry) {
                    socialWall.masonry();
                }

                socialWall.createGrid(socialWall.actualFeed, socialWall.maxFeed);


            }
        });
    },
    createGrid: function (from, to) {

        if (socialWall.$data.data.items.length < socialWall.maxFeed) {
            socialWall.maxFeed = socialWall.$data.data.items.length;
            socialWall.tooManyFeeds = true;
        }


        for (i = from; i < to; i++) {

            if (typeof socialWall.$data.data.items[i] != 'undefined') {

                var feed = socialWall.$data.data.items[i],
                    $box = $('<div class="grid-item"><div class="grid-wrap"><div class="box"></div></div></div>'),
                    source = feed.source,
                    feedID = feed.id,
                    date = feed.date,
                    text = urlify(feed.text),
                    media = feed.media || undefined,
                    user = feed.user,
                    avatar = user.avatar.replace('https', 'http'),
                    id = user.id,
                    name = user.name,
                    icon,
                    socialUrl;

                switch (source) {
                    case 'PT':
                        icon = '<i class="fa fa-pinterest" aria-hidden="true"></i>';
                        socialUrl = 'https://www.pinterest.com/';
                        break;
                    case 'IG':
                        icon = '<i class="fa fa-instagram" aria-hidden="true"></i>';
                        socialUrl = 'http://instagram.com/';
                        break;
                    case 'FB':
                        icon = '<i class="fa fa-facebook" aria-hidden="true"></i>';
                        socialUrl = 'http://facebook.com/';
                        break;
                    case 'TW':
                        icon = '<i class="fa fa-twitter" aria-hidden="true"></i>';
                        socialUrl = 'https://twitter.com/';
                        break;
                }

                $('.box', $box).addClass('box-' + source);

                // Se non è Google Plus e contiene foto
                if (source != 'GP' && typeof media != 'undefined') {

                    // media
                    $media = $('<div class="media"><figure><img src="' + media.url + '" /></figure></div>').appendTo($('.box', $box));

                    // author 
                    $avatar = $('<div class="author"><a href="' + (socialUrl + id) + '" target="_blank"><figure class="img"><img src="' + avatar + '" onError="$(this).remove();" class="avatar" /></figure><span class="author-name">' + name + '</span> <span class="author-username">' + id + '</span></a></div>').appendTo($('.box', $box));;

                    // text
                    $text = $('<div class="text"></div>').html(text).appendTo($('.box', $box));

                    // extra
                    $source = $('<div class="source"><span class="source">' + icon + '</span></div>').appendTo($('.box', $box));

                    // append
                    $box.appendTo(socialWall.$grid);

                    if (socialWall.withMasonry) {
                        $wall.masonry('appended', $box);
                        $wall.imagesLoaded().progress(function () {
                            $wall.masonry('layout');
                        });
                    }

                    socialWall.actualFeed++;

                } else {
                    if (!socialWall.tooManyFeeds) {
                        socialWall.maxFeed++;
                    }
                }

            }
        }

    },
    masonry: function () {
        $wall = socialWall.$grid.masonry({
            itemSelector: '.grid-item'
        });

        $wall.imagesLoaded().progress(function () {
            $wall.masonry('layout');
        });

        if (socialWall.loadMore) {
            $('<div class="load-more"><button class="btn social-wall-load-more">Load more</button></div>').insertAfter(socialWall.$grid);
        }

        $(document).on('click', '.social-wall-load-more', function () {
            socialWall.createGrid(socialWall.actualFeed, socialWall.actualFeed * 2);
            setTimeout(function () {
                $wall.masonry('layout');
            }, 300);

            if (socialWall.actualFeed >= socialWall.$data.data.items.length) {
                $('.load-more').remove();
            }
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