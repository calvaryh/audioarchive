// Put your custom code here
$(document).ready(function () {
    //loadShelves();
    loadBooks();
    $("#searchall").focus();
});

var currentAlbum = "";
var currentShelf = "";
var prevTitle = "";
var prevBookPath = "";

$.mobile.loadingMessageTextVisible = true;
//generic event handlers 
jQuery.ajaxSetup({
    beforeSend: function () {
        $.mobile.showPageLoadingMsg();
    },
    complete: function () {
        $.mobile.hidePageLoadingMsg();
    },
    success: function () { }
});



//searchallcats
$("#searchall").live('keydown', function (e) {

    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13 || code == 9) {
        e.preventDefault();
        $('#shelveslist').html('');
        SearchAllShelves($("#searchall").val(), '#shelveslist');
    }
});


$("#searchalbumkeywords").live('keydown', function (e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13 || code == 9) {
        e.preventDefault();
        $('#messagelist').html('');
        //loop thru all books and all messages
        ShowSearchBook($("#searchalbumkeywords").val(), 'messagedata/' + currentAlbum + '.xml', '#messagelist');
    }
});

$("#searchshelfkeywords").live('keydown', function (e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13 || code == 9) {
        e.preventDefault();
        $('#bookslist').html('');
        //loop thru all books and all messages
        SearchShelf($("#searchshelfkeywords").val(), currentShelf, '#bookslist');
    }
});

function SearchAllShelves(searchvalue,contentlist) {
    $.ajax({
        type: "GET",
        url: "home.xml",
        dataType: "xml",
        success: function (xml) {
            $(xml).find('site').each(function () {
                var shelfname = $(this).find('shelfname').text();
                SearchShelf(searchvalue, shelfname, contentlist);
            });
        }
    });
}

function SearchShelf(searchvalue, searchshelf, contentlist) {
    var xmlFileName = searchshelf + '.xml';
    $.ajax({
        type: "GET",
        url: xmlFileName,
        dataType: "xml",
        success: function (xml) {
            $(xml).find('site').each(function () {
                var album = $(this).find('title').text();
                ShowSearchBook(searchvalue, 'messagedata/' + album + '.xml', contentlist);
            });
        }
    });
}


$(document).bind("pagebeforechange", function (e, data) {
    // only handle changePage() when loading a page by URL.
    if (typeof data.toPage === "string") {
        // Handle URLs that request chapter page
        var url = $.mobile.path.parseUrl(data.toPage), regex = /^#books/;
        if (url.hash.search(regex) !== -1) {
            ShowBookList(url, data.options);
            // tell changePage() we've handled this 
            e.preventDefault()
            return;
        }
        url = $.mobile.path.parseUrl(data.toPage), regex = /^#messages/;
        if (url.hash.search(regex) !== -1) {
            ShowMessageList(url, data.options);
            // tell changePage() we've handled this 
            e.preventDefault()
            return;
        }

        url = $.mobile.path.parseUrl(data.toPage), regex = /^#messagedetail/;
        if (url.hash.search(regex) !== -1) {
            ShowMessageDetail(url, data.options);
            // tell changePage() we've handled this 
            e.preventDefault()
            return;
        }

       
    }
});

function setFile(audio_url_inside) {
    $("#jquery_jplayer_1").jPlayer("destroy"); //this will destroy previous jplayer content and then if you again call this function it will add the new url of you audio song to the jplayer

    //var audio_url_inside = "media/Genesis/02-Genesis2-3_1.mp3";

    $('#jquery_jplayer_1').jPlayer({

        ready: function (event) {

            $(this).jPlayer("setMedia", {

                mp3: audio_url_inside,

                oga: audio_url_inside

            });   //attemp to play media

        },

        swfPath: "scripts",
        Default: "html,flash",
        supplied: "mp3,m4a, oga",
        wmode: "window"

    });
}

function playFile(audio_url_inside) {

    $("#jquery_jplayer_1").jPlayer("destroy"); //this will destroy previous jplayer content and then if you again call this function it will add the new url of you audio song to the jplayer

    //var audio_url_inside = "media/Genesis/02-Genesis2-3_1.mp3";

    $('#jquery_jplayer_1').jPlayer({

        ready: function (event) {

            $(this).jPlayer("setMedia", {

                mp3: audio_url_inside,

                oga: audio_url_inside

            }).jPlayer("play");   //attemp to play media

        },

        swfPath: "scripts",
        Default: "html,flash",
        supplied: "mp3,m4a, oga",
        wmode: "window"

    });

}

function ShowMessageDetail(url, options) {
    var params = hashParams(url.hash);
    var $page = $('#messagedetail');

    var book = params['book'];
    var idpassed = params['id'];
    var bookpath = params['bookpath'];
   
    var xmlFileName = 'messagedata/' + bookpath;

    //alert(xmlFileName);
    var iHtml = "";
    $.ajax({
        type: "GET",
        url: xmlFileName,
        dataType: "xml",
        success: function (xml) {

            var title = "";
            var artist = "";
            var series = "";
            var songlength = 0;
            var path = "";
            var keywords = "";
            var iHtml = "";
            $(xml).find('Song').each(function () {
                var id = $(this).attr('id');
                if (id == idpassed) {
                    title = $(this).find('Title').text();
                    artist = $(this).find('PerformingArtist').text();
                    series = $(this).find('ContainedInAlbum').text();
                    keywords = $(this).find('keywords').text();
                    //var shelfname = $(this).find('shelfname').text();
                    songlength = $(this).find('SongLength').text();
                    //$('<div class="items" id="link_' + id + '"></div>').html('<a href="' + url + '">' + title + '</a>').appendTo('#page-wrap');
                    path = "";
                    $(this).find('Location').each(function () {
                        path = $(this).find('Path').text();

                        //    var long = $(this).find('long').text();
                        //    $('<div class="brief"></div>').html(brief).appendTo('#link_' + id);
                        //    $('<div class="long"></div>').html(long).appendTo('#link_' + id);
                    });
                
                    //iHtml += "<li>" + title + "</li>";
                    iHtml = '<h2>' + title + '</H2><strong><P>Speaker: ' + artist + '</P></strong><P>Series: ' + series + '.  Length (mins): ' + songlength + '</P>';
                    //iHtml += '<p>Keywords: ' + keywords + '</p>';
                    var filename = "media/" + book + "/" + path.substr(path.lastIndexOf('\\')+1);
                    iHtml += '<a href="' + filename + '" target="_newone">Download</a>&nbsp;&nbsp;&nbsp;';
                    iHtml += '<a href="http://calvaryh.securegive.com" target="_blank"><span style="color:red">Donate</span></a>&nbsp;&nbsp;&nbsp;';
                    //iHtml += '<a href="javascript:playFile(\'' + filename + '\');">Play Now</a>';
                    setFile(filename);

                }
            });

            // Get the header for the page to set it
            $header = $page.children(":jqmData(role=header)");
            var messagedetail = 'Message ' + title;
            $header.find("h1").html(messagedetail);
            $("#messagedetailcontent").html(iHtml);
            //alert(params['book']);
            // update data-url that shows up in the browser location
            options.dataUrl = url.href;
            // make sure it updates browser location!
            options.allowSamePageTransition = true;
            // no transition effect
            options.transition = 'none';


            $.mobile.changePage($page, options)
            
        }
    });

    $.mobile.changePage($page, options);
}

function ShowSearchBook(userkeywords, xmlFileName, ContentList) {

    var iHtml = "";
    $.ajax({
        type: "GET",
        url: xmlFileName,
        dataType: "xml",
        success: function (xml) {
            $(xml).find('Song').each(function () {
                var keywords = $(this).find('keywords').text();
                var re = new RegExp(userkeywords, "i");
                var pos = keywords.search(re);
                var book = $(this).find('ContainedInAlbum').text();
                if (pos !== -1) {
                    var id = $(this).attr('id');
                    var title = $(this).find('Title').text();
                    var artist = $(this).find('PerformingArtist').text();
                    var songlength = $(this).find('SongLength').text();
                    iHtml += '<li><A href="#messagedetail?book=' + book + '&id=' + id + '"> <H2>' + title + '</H2> <P>' + keywords + '</P><P class=ui-li-aside><STRONG>' + songlength + '</STRONG></P></A></li>';
                }
            });
           // if (iHtml.length == 0)
           //     iHtml = '<li>No results in ' + xmlFileName.substr(xmlFileName.lastIndexOf('\\') + 1) + '.</li>';
           
            var totHtml = $(ContentList).html() + iHtml;
            $(ContentList).html(totHtml).listview('refresh');
            
        }
    });
}

function ShowMessageList(url, options) {
    var params = hashParams(url.hash);
    //alert(params['book']);

    // Get the empty page we are going to insert our content into.
    var $page = $('#messages');

    var sBook = params['book'];
    var sPath = params['path'];
    if (url.hash == "#messages") //back button pressed
    {
        sBook = currentAlbum;
        sPath = prevBookPath;
    }

    // Get the header for the page to set it
    $header = $page.children(":jqmData(role=header)");
    $header.find("h1").html(sBook);
    //alert(params['book']);
    // update data-url that shows up in the browser location
    options.dataUrl = url.href;
    // make sure it updates browser location!
    options.allowSamePageTransition = true;
    // no transition effect
    options.transition = 'none';

    var xmlFileName = 'messagedata/' + sPath;
    currentAlbum = sBook;
    prevBookPath = sPath;
    //alert(xmlFileName);
    var iHtml = "";
    $.ajax({
        type: "GET",
        url: xmlFileName,
        dataType: "xml",
        success: function (xml) {
            $(xml).find('Song').each(function () {
                var book = $(this).find('ContainedInAlbum').text();
                //alert(book);
               
                    var id = $(this).attr('id');
                    var title = $(this).find('Title').text();
                    var artist = $(this).find('PerformingArtist').text();
                    var keywords = $(this).find('keywords').text();
                    //var shelfname = $(this).find('shelfname').text();
                    var songlength = $(this).find('SongLength').text();
                //$('<div class="items" id="link_' + id + '"></div>').html('<a href="' + url + '">' + title + '</a>').appendTo('#page-wrap');
                    var path = "";
                    $(this).find('Location').each(function () {
                        path = $(this).find('Path').text();
                    
                    //    var long = $(this).find('long').text();
                    //    $('<div class="brief"></div>').html(brief).appendTo('#link_' + id);
                    //    $('<div class="long"></div>').html(long).appendTo('#link_' + id);
                    });
                    //iHtml += "<li>" + title + "</li>";
                    iHtml += '<li><A href="#messagedetail?bookpath=' + sPath + '&book=' + book + '&id=' + id + '"> <H2>' + title + '</H2><P class=ui-li-aside><STRONG>' + songlength + '</STRONG></P></A></li>';
               
            });

            //$('#bookslist').html(iHtml);
            //alert('hello');
            // switch to the page we just modified.
            $.mobile.changePage($page, options)
            $('#messagelist').html(iHtml).listview('refresh');
        }
    });
}

function ShowBookList(url, options) {
    var params = hashParams(url.hash);
    //alert(params['book']);

    // Get the empty page we are going to insert our content into.
    var $page = $('#books');

    var sTitle = params['title'];
    var sShelf = params['shelf'];

    if (url.hash == "#books") //back button pressed
    {
        sShelf = currentShelf;
        sTitle = prevTitle;
    }

    // Get the header for the page to set it
    $header = $page.children(":jqmData(role=header)");
    $header.find("h1").html(sTitle);

    // update data-url that shows up in the browser location
    options.dataUrl = url.href;
    // make sure it updates browser location!
    options.allowSamePageTransition = true;
    // no transition effect
    options.transition = 'none';

    var xmlFileName = sShelf;
    currentShelf = sShelf;
    prevTitle = sTitle;
    //alert(xmlFileName);
    var iHtml = "";
    $.ajax({
        type: "GET",
        url: xmlFileName,
        dataType: "xml",
        success: function (xml) {
            $(xml).find('site').each(function () {
                var id = $(this).attr('id');
                var title = $(this).find('title').text();
                var path = $(this).find('path').text();
                var imagepath = $(this).find('imagepath').text();
                var longdesc = $(this).find('longdesc').text();
                //var longdesc = '';
                var shelfname = $(this).find('shelfname').text();
                var messagecount = $(this).find('messagecount').text();
                //$('<div class="items" id="link_' + id + '"></div>').html('<a href="' + url + '">' + title + '</a>').appendTo('#page-wrap');
                //$(this).find('desc').each(function () {
                //    var brief = $(this).find('brief').text();
                //    var long = $(this).find('long').text();
                //    $('<div class="brief"></div>').html(brief).appendTo('#link_' + id);
                //    $('<div class="long"></div>').html(long).appendTo('#link_' + id);
                //});
                //iHtml += "<li>" + title + "</li>";
                iHtml += '<li><A href="#messages?book=' + title + '&path=' + path + '"><IMG src="' + imagepath + '"> <H2>' + title + '</H2> <P>' + longdesc + '</P><P class=ui-li-aside><STRONG>' + messagecount + '</STRONG></P></A></li>';
            });

            //$('#bookslist').html(iHtml);

            // switch to the page we just modified.
            $.mobile.changePage($page, options)
            $('#bookslist').html(iHtml).listview('refresh');
        }
    });
}

function loadBooks() {
    var iHtml = "";
    $.ajax({
        type: "GET",
        url: "allbooks.xml",
        dataType: "xml",
        success: function (xml) {
            $(xml).find('site').each(function () {
                var id = $(this).attr('id');
                var title = $(this).find('title').text();
                var path = $(this).find('path').text();
                var imagepath = $(this).find('imagepath').text();
                var longdesc = $(this).find('longdesc').text();
               // var longdesc = "";
                var shelfname = $(this).find('shelfname').text();
                var messagecount = $(this).find('messagecount').text();
                //$('<div class="items" id="link_' + id + '"></div>').html('<a href="' + url + '">' + title + '</a>').appendTo('#page-wrap');
                //$(this).find('desc').each(function () {
                //    var brief = $(this).find('brief').text();
                //    var long = $(this).find('long').text();
                //    $('<div class="brief"></div>').html(brief).appendTo('#link_' + id);
                //    $('<div class="long"></div>').html(long).appendTo('#link_' + id);
                //});
                //iHtml += "<li>" + title + "</li>";
                iHtml += '<li><A href="#messages?book=' + title + '&path=' + path + '"><IMG src="' + imagepath + '"> <H2>' + title + '</H2> <P>' + longdesc + '</P><P class=ui-li-aside><STRONG>' + messagecount + '</STRONG></P></A></li>';
            });

            //$('#bookslist').html(iHtml);

            // switch to the page we just modified.
            //$.mobile.changePage($page, options)
            $('#bookslist').html(iHtml).listview('refresh');
        }
    });
}

function loadShelves() {
    // show loading icon
    //$.mobile.showPageLoadingMsg();
    var iHtml = "";
    // load book xml file and call showChapter again
    $.ajax({
        type: "GET",
        url: "home.xml",
        dataType: "xml",
        success: function (xml) {
            $(xml).find('site').each(function () {
                var id = $(this).attr('id');
                var title = $(this).find('title').text();
                var imagepath = $(this).find('imagepath').text();
                //var longdesc = $(this).find('longdesc').text();
                var longdesc = "";
                var shelfname = $(this).find('shelfname').text();
                //$('<div class="items" id="link_' + id + '"></div>').html('<a href="' + url + '">' + title + '</a>').appendTo('#page-wrap');
                //$(this).find('desc').each(function () {
                //    var brief = $(this).find('brief').text();
                //    var long = $(this).find('long').text();
                //    $('<div class="brief"></div>').html(brief).appendTo('#link_' + id);
                //    $('<div class="long"></div>').html(long).appendTo('#link_' + id);
                //});
                //iHtml += "<li>" + title + "</li>";
                iHtml += '<li><A href="#books?shelf=' + shelfname + '&title=' + title + '"><IMG src="' + imagepath + '"> <H2>' + title + '</H2> <P>' + longdesc + '</P></A></li>';
            });

            $('#shelveslist').html(iHtml).listview('refresh');
        }
    });
};

// parse params in hash
function hashParams(hash) {
    var ret = {};
    var match;
    var plus = /\+/g;
    var search = /([^\?&=]+)=([^&]*)/g;
    var decode = function (s) {
        return decodeURIComponent(s.replace(plus, " "));
    };
    while (match = search.exec(hash)) ret[decode(match[1])] = decode(match[2]);

    return ret
};