console.log('zoom2loc.js loaded');

/**
 * This code is run when someone clicks on the png file.
 * It changes the location, zooming in the slide viewer.
 */
zoom2loc = function (event) {

    // Get click position
    let clickPos = {};
    clickPos.x = event.offsetX ? (event.offsetX) : event.pageX - document.getElementById("imgTILDiv").offsetLeft;
    clickPos.y = event.offsetY ? (event.offsetY) : event.pageY - document.getElementById("imgTILDiv").offsetTop;
    console.log("clickPos", clickPos);

    // Image Size is on the canvas
    let canvases = document.getElementsByTagName("canvas");
    let imgDim = {};
    for (let i = 0; i < canvases.length; i++) {
        if (canvases[i].width > 0) {
            imgDim.w = canvases[i].width;
            imgDim.h = canvases[i].height;
            console.log("imgDim", imgDim.w, imgDim.h);
            break;
        }
    }

    // Get slide dimensions
    zoom2loc.getFile('slidemeta.json').then(x => {
        let slide = tilmap.selTumorTissue.value.slice(0, -4);
        let slideDim = x[slide];
        console.log("slideDim", slideDim);

        // Get current url
        let ifrm = document.getElementById('caMicrocopeIfr');
        let loc = ifrm.src;

        if (slideDim.width) {
            let scale = {};
            scale.w = slideDim.width / imgDim.w;
            scale.h = slideDim.height / imgDim.h;
            console.log("scale", scale);
            // Strip existing parameters
            if (loc.indexOf('&x=') > -1)
                loc = loc.substring(0, loc.indexOf('&x='));
            // Set url
            let url = loc + "&x=" + Math.ceil(clickPos.x * scale.w) + "&y=" + Math.ceil(clickPos.y * scale.h) + "&zoom=5";
            ifrm.src = url;
            console.log('URL:', url);
        } else {
            ifrm.src = loc; // Refresh.
            console.log("*** CHECK SLIDE " + slide + "***");
        }

    });

};

zoom2loc.getFile = async function (url) {
    url = url || 'slidemeta.json';
    return (await fetch(url)).json()
};
