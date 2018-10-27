console.log('tammy.js loaded');

/**
 * This code is run when someone clicks on the png file.
 * It changes the location, zooming in the slide viewer.
 */
tammy = function (event) {

    // Get click position
    pos_x = event.offsetX ? (event.offsetX) : event.pageX - document.getElementById("imgTILDiv").offsetLeft;
    pos_y = event.offsetY ? (event.offsetY) : event.pageY - document.getElementById("imgTILDiv").offsetTop;

    // Calculate target coordinates
    // Image Size
    let img = document.getElementsByTagName('canvas')[0];
    let imgWidth = img.width;
    let imgHeight = img.height;

    // Get slide dimensions
    tammy.getFile('slidemeta.json').then(x => {
        let tissue = tilmap.selTumorTissue.value.slice(0, -4);
        let w_h = x[tissue];
        let factor1 = w_h.width / imgWidth;
        let factor2 = w_h.height / imgHeight;
        // Get current url
        let ifrm = document.getElementById('caMicrocopeIfr');
        let loc = ifrm.src;
        // Strip location parameters (if exist)
        if (loc.indexOf('&x=') > -1)
            loc = loc.substring(0, loc.indexOf('&x='));

        let url = loc + "&x=" + Math.ceil(pos_x * factor1) + "&y=" + Math.ceil(pos_y * factor2) + "&zoom=5";
        console.log('URL:', url);
        ifrm.src = url;

    });

};

tammy.getFile = async function (url) {
    url = url || 'slidemeta.json';
    return (await fetch(url)).json()
};

