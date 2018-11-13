console.log('zoom2loc.js loaded');

/**
 * This code is run when someone clicks on the png file.
 * It changes the location, zooming in the slide viewer.
 */
zoom2loc = function (event) {

    // Get click position
    pos_x = event.offsetX ? (event.offsetX) : event.pageX - document.getElementById("imgTILDiv").offsetLeft;
    pos_y = event.offsetY ? (event.offsetY) : event.pageY - document.getElementById("imgTILDiv").offsetTop;
    console.log("(pos_x, pos_y)", pos_x, pos_y);

    // Image Size is on the canvas
    let canvases = document.getElementsByTagName("canvas");
    let imgWidth;
    let imgHeight;
    for (let i = 0; i < canvases.length; i++) {
        if (canvases[i].width > 0) {
            imgWidth = canvases[i].width;
            imgHeight = canvases[i].height;
            console.log("(imgWidth, height)", imgWidth, imgHeight);
            break;
        }
    }

    // Get slide dimensions
    zoom2loc.getFile('slidemeta.json').then(x => {
        let slide = tilmap.selTumorTissue.value.slice(0, -4);
        let slideDim = x[slide];
        console.log("(slide width, height)", slideDim.width, slideDim.height);

        // Get current url
        let ifrm = document.getElementById('caMicrocopeIfr');
        let loc = ifrm.src;

        if (slideDim.width) {
            let scaleWidth = slideDim.width / imgWidth;
            let scaleHeight = slideDim.height / imgHeight;
            // Strip existing parameters
            if (loc.indexOf('&x=') > -1)
                loc = loc.substring(0, loc.indexOf('&x='));
            // Set url
            let url = loc + "&x=" + Math.ceil(pos_x * scaleWidth) + "&y=" + Math.ceil(pos_y * scaleHeight) + "&zoom=5";
            ifrm.src = url;
            console.log('URL:', url);
        }
        else {
            ifrm.src = loc; // Refresh.
            console.log("*** CHECK SLIDE " + slide + "***");
        }

    });

};

zoom2loc.getFile = async function (url) {
    url = url || 'slidemeta.json';
    return (await fetch(url)).json()
};
