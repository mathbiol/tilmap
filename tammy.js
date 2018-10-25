console.log('tammy.js loaded');

tammy = function (event) {
    // this code is run when someone clicks on the png file
    // and it changes the location, zooming and draws polygon in

    var clickPositionX = event.clientX;
    var clickPositionY = event.clientY;
    var ifrm = document.getElementById('caMicrocopeIfr');
    var url = getUrl(clickPositionX, clickPositionY, ifrm);
    console.log('URL:', url);
    //Uncomment when ready
    //ifrm.src = url;

};

function getUrl(clickPositionX, clickPositionY, ifrm) {

    // Domain could change in main program, so get existing url
    var loc = ifrm.src;
    console.log("loc", loc);

    // Reset the URL if we already added location parameters
    if (loc.indexOf('&x=') > -1)
        loc = loc.substring(0, loc.indexOf('&x='));

    // Calculate position coordinates

    // Image Size
    var img = document.getElementsByTagName('canvas')[0];
    var imgWidth = img.width;
    var imgHeight = img.height;

    // iFrame size
    var frmWidth = ifrm.width;
    var frmHeight = ifrm.height;

    // Cross-Domain not allowed.
    //console.log("scrollHeight", ifrm.contentWindow.document.body.scrollHeight);

    var factor1 = frmWidth / imgWidth;
    var factor2 = frmHeight / imgHeight;

    // Convert to viewport coordinates
    var viewportPtX = clickPositionX * factor1;
    var viewportPtY = clickPositionY * factor2;

    // {'x': Math.round(xx), 'y': Math.round(yy)};

    return loc + "&x=" + viewportPtX + "&y=" + viewportPtY;

}

