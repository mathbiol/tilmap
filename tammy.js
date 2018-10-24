console.log('tammy.js loaded');

tammy = function (event) {
    // this code is run when someone clicks on the png file
    // and it changes the location, zooming and draws polygon in

    var clickPositionX = event.clientX;
    var clickPositionY = event.clientY;
    var ifrm = document.getElementById('caMicrocopeIfr');
    var url = getUrl(clickPositionX, clickPositionY, ifrm);
    console.log('url', url);
    //Uncomment when ready
    //ifrm.src = url;

};

function getUrl(clickPositionX, clickPositionY, ifrm) {

    // Domain could change in main program, so get existing url
    var loc = ifrm.src;
    console.log("loc", loc);
    // If we added location parameters already
    if (loc.indexOf('&x=') > -1)
        loc = loc.substring(0, loc.indexOf('&x='));
    var coords = getCoordinates(clickPositionX, clickPositionY);
    return loc + "&x=" + coords.x + "&y=" + coords.y;

}

function getCoordinates(clickPositionX, clickPositionY) {

    // Image Size
    var img = document.getElementsByTagName('canvas')[0];
    var imgWidth = img.width;

    // Convert to viewport coordinates
    var viewportX = clickPositionX / imgWidth;
    var viewportY = clickPositionY / imgWidth;

    // TODO: GET SLIDE DATA
    var imgWidth = 135168;
    var imgHeight = 105472;

    var xx = imgWidth * viewportX;
    var yy = imgHeight * viewportY;

    return {'x': Math.round(xx), 'y': Math.round(yy)};

}