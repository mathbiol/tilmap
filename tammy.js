console.log('tammy.js loaded');

tammy = function (event) {
    // this code is run when someone clicks on the png file
    // and it changes the location, zooming and draws polygon in

    var clickPositionX = event.clientX;
    var clickPositionY = event.clientY;
    var ifrm = document.getElementById('caMicrocopeIfr');

    // Domain could change in main program, so get existing url
    var loc = ifrm.src;

    // Reset the URL if we already added location parameters
    if (loc.indexOf('&x=') > -1)
        loc = loc.substring(0, loc.indexOf('&x='));

    // Calculate position coordinates

    // Image Size
    var img = document.getElementsByTagName('canvas')[0];
    var imgWidth = img.width;
    var imgHeight = img.height;

    // Get slide dimensions
    tammy.getFile('slidemeta.json').then(x => {
        var tissue = tilmap.selTumorTissue.value.slice(0, -4);
        var w_h = x[tissue];
        var factor1 = w_h.width / imgWidth;
        var factor2 = w_h.height / imgHeight;
        var url = loc + "&x=" + Math.ceil(clickPositionX * factor1) + "&y=" + Math.ceil(clickPositionY * factor2) + "&zoom=2";
        console.log('URL:', url);
        ifrm.src = url;
        return url;

    });

};

tammy.getFile = async function (url) {
    url = url || 'slidemeta.json';
    return (await fetch(url)).json()
};

