(function(){

    /* 
    *
    *   we will define the URL Addresses from our preferates RSS-Feeds
    *   we save our DOM Element in one variable (in cache) -> performance reasons
    */
    var id = 0;
    var DOMelem = $("#feed");
    var RSSAddress = {
        heiseAllNews : "http://www.heise.de/newsticker/heise-atom.xml",
        itTalentsBlog : "https://www.it-talents.de/blog/rss",
        heiseTopNews : "http://www.heise.de/newsticker/heise-top-atom.xml",
        t3nRSS : "http://t3n.de/feed/feed.atom"
    };

    (function(exp){

        DOMelem.rss( RSSAddress.t3nRSS,
            {
                limit: 25,
                entryTemplate: "{manipulated}",
                tokens: {
                    manipulated: function(entry, tokens) {
                        return exp.manipulateEntry(entry);
                        //return new Date(entry.publishedDate).getFullYear()
                    }
                },
                success : function(){
                    $(".spinner").hide(1000);
                    exp.goToAddress();
                    exp.btnsEvents();
                }
            }
        );

        exp.manipulateEntry = function(data){

            if(data.link === undefined){
                /*
                *   i don't think that i am blind but IT-Talents RSS Feed hasn't any URL Address in the RSS Feed Object for the articles
                *   i see that the title of the article is part of the URL and signs like "! , . and <>" should be before 
                *   eliminated from the string. Even like that we cannot be sure if the final URL will be 100% correct.
                *   So we send the user to the main URL "https://www.it-talents.de/blog/"
                */    
                data.link = "https://www.it-talents.de/blog/";
            }

            var html = "<div class='col-xs-12 col-lg-4 col-sm-6'>";
                html += "<div class='panel panel-info caption'>";
                html += "<div class='panel-heading clickable' data-href='"+data.link+"'>"+data.title+"</div>";
                html += "<div class='panel-body'><span class='initial'>"+data.contentSnippet+"</span>";
                html += "<span class='complete' id='complete_"+id+"'>"+data.content+"</span>";
                html += "<span class='more'>     mehr...</span>";
                html += "</div>";
                html += "<div class='panel-footer'>"+data.author+"<span> hat am </span><span>"+exp.parseDate(data.publishedDate)+"</span><span> ver&ouml;ffentlicht</span></div>";  
                html += "</div>";
                html += "</div>";
            
            id++;

            return html;
        };

        exp.goToAddress = function(){
            var clickable = $(".clickable");

            clickable.off("click");
            clickable.on("click",function(){
                window.location.href = $(this).attr("data-href");
                //console.log($(this).attr("data-href"));
            });
        };

        exp.btnsEvents = function(){

            $("#menu-toggle").off("click");
            $("#menu-toggle").on("click",function(e) {
                e.preventDefault();
                console.log($(this).attr("class"));
                $("#wrapper").toggleClass("toggled");
            });

            $(".toggle").off("click");
            $(".toggle").on("click",function() {
                $( '#barOne' ).toggleClass( "left1" );
                $( '#barTwo' ).toggleClass( "right1" );
                $( '#barThree' ).toggleClass( "down" );
            });

            $(".more").off("click");
            $(".more").on("click",function(e){

                var that = $(this);
                var completeId = $(this).siblings(".complete").attr("id");

                $("#"+completeId).toggle("fast",function(){

                    that.text(" weniger...");

                    if($(this).css("display") === 'none'){
                        that.text(" mehr...");
                    }
                });
            });

            $("#new_news").off("click");
            $("#new_news").on("click",function(){
                var fieldVal = $("#user_rss").val();

                if(fieldVal !== ""){
                    exp.wrapperLinksCall(fieldVal);
                    $("#user_rss").val("");
                }
            });
        };

        exp.parseDate = function(date){

            var weekday = new Array(7);
                weekday[0]=  "Sonntag";
                weekday[1] = "Montag";
                weekday[2] = "Dienstag";
                weekday[3] = "Mittwoch";
                weekday[4] = "Donnerstag";
                weekday[5] = "Freitag";
                weekday[6] = "Samstag";


            var date = new Date(date),
                year = date.getFullYear(),
                month = date.getMonth(),
                dayName = weekday[date.getDay()],
                dayNr = date.getDate();

                return dayName+" , "+ dayNr + "/" + month + "/" + year; 
        }

        exp.wrapperLinksCall = function(address){
            console.log(address);
            $(".spinner").show();
            DOMelem.empty();
            DOMelem.rss( address,
            {
                limit: 15,
                entryTemplate: "{manipulated}",
                tokens: {
                    manipulated: function(entry, tokens) {
                        return exp.manipulateEntry(entry);
                        //return new Date(entry.publishedDate).getFullYear()
                    }
                },
                success : function(){
                    $(".spinner").hide(1000);
                    exp.goToAddress();
                    exp.btnsEvents();
                },
                error : function(){
                    window.location.reload();
                }
            }
        );
        }

})(man = {});

console.log(man);

})();