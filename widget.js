(function() {

    // Localize jQuery variable
    var jQuery;

    /******** Load jQuery if not present *********/
    if (window.jQuery === undefined || window.jQuery.fn.jquery !== '1.4.2') {
        var script_tag = document.createElement('script');
        script_tag.setAttribute("type", "text/javascript");
        script_tag.setAttribute("src",
            "http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js");
        if (script_tag.readyState) {
            script_tag.onreadystatechange = function() { // For old versions of IE
                if (this.readyState == 'complete' || this.readyState == 'loaded') {
                    scriptLoadHandler();
                }
            };
        } else {
            script_tag.onload = scriptLoadHandler;
        }
        // Try to find the head, otherwise default to the documentElement
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
    } else {
        // The jQuery version on the window is the one we want to use
        jQuery = window.jQuery;
        main();
    }

    /******** Called once jQuery has loaded ******/
    function scriptLoadHandler() {
        // Restore $ and window.jQuery to their previous values and store the
        // new jQuery in our local jQuery variable
        jQuery = window.jQuery.noConflict(true);
        // Call our main function
        main();
    }

    /******** Our main function ********/
    function main() {
        var obj;
        var page;
        var videos;
        var html;

        jQuery(document).ready(function($) {
            /******* Load CSS *******/
            var css_link = $("<link>", {
                rel: "stylesheet",
                type: "text/css",
                href: "style.css"
            });
            css_link.appendTo('head');

            /******* Load HTML *******/
            page = 0;
            loadjson(page++);

        });

        //This controls the infinite scroll, loads a new page of json when the end of the page is reached
        $(window).scroll(function() {
            if (document.documentElement.clientHeight +
                $(document).scrollTop() >= document.body.offsetHeight) {
                loadjson(page++);
            }
        });

        //shows the modal window for the videos, and adds the proper video source
        $(".wrap").on('click', '.likes', function() {
            $("#simpleModal").addClass("show");
            $(".wrap").fadeTo("slow", 0.3, function() {});
            var url = $(this).text();
            $('#simpleModal').attr('src', url);
            /*document.querySelector("#simpleModal").src = url;*/
            return false;
        });

        //closes video modal
        $(".wrap").click(function() {
            $("#simpleModal").removeClass("show");
            $(".wrap").fadeTo("fast", 1, function() {});
            $('#simpleModal')[0].pause();
            return false;
        });
    }

    /*Loads JSON from local files, and runs the function to append it in a proper div
    originally I had a get request to the JSON server, but because of access control headers, I had
    to resort to local files.  This DOES NOT WORK IN CHROME because of its security features.  You will
    have to use safari*/
    function loadjson(page) {
        $.getJSON(page + ".json", function(data) {
            obj = data;
            videos = obj.response.feed_info;
            addvids(videos);
        });
    }

    //Adds a video with the data from the json
    function addvids(videos) {
        var html;
        html = '';

        for (var i = 0; i < 20; i++) {

            html = '<div class="box">\
                    <div class="boxInner">\
                        <div class="thumbnail-overlay">\
                            <h5 class="likes">\
                                <div class="hidden">' + videos[i].video_urls.encoded[0].url + '</div>\
                            </h5>\
                            <span class="likesc">' + videos[i].interaction_counts.comments + '</span>\
                            <span class="likesl">' + videos[i].interaction_counts.likes + '</span>\
                        </div>\
                        <span class="thumbnail">\
                            <img src="' + videos[i].thumbnail_urls.regular.url + '">\
                            <span class="time">' + secondstotime(videos[i].duration) + '</span>\
                        </span>\
                        <span class="info">\
                            <span class="icon"></span>\
                            <h3>' + videos[i].title + '</h3>\
                            <span class="sub-info">' + videos[i].display_item_info[0][0] + ' - ' + videos[i].display_item_info[0][1] + '</span>\
                        </span>\
                    </div>\
                </div>';

            $('.wrap').append(html);

        }


    }

    /*These are just functions to convert the seconds to a properly formatted time.
    Awfully long, but they do the trick*/
    function secondstotime(duration) {

        duration = Number(duration);
        var h = Math.floor(duration / 3600);
        var m = Math.floor(duration % 3600 / 60);
        var s = Math.floor(duration % 3600 % 60);
        var hr = format(h);
        var min = format(m);
        var sec = format(s);
        if (hr == 00)
            val = min + ':' + sec;
        else
            val = hr + ':' + min + ':' + sec;
        return val;
    }

    function format(num) {

        if (num > 0) {
            if (num >= 10)
                val = num;
            else
                val = '0' + num;
        } else
            val = '00';

        return val;

    }

})();