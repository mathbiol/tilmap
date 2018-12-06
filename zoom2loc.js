console.log('zoom2loc.js loaded');

/**
 * This code is run when someone clicks on the png file.
 * It changes the location, zooming in the slide viewer.
 * NOTE: FOR SEER IMAGES, YOU MUST BE LOGGED IN.
 */
zoom2loc = function (event) {

    // Get click position
    let clickPos = {};
    clickPos.x = event.offsetX ? (event.offsetX) : event.pageX - document.getElementById("imgTILDiv").offsetLeft;
    clickPos.y = event.offsetY ? (event.offsetY) : event.pageY - document.getElementById("imgTILDiv").offsetTop;
    //console.log("clickPos", clickPos);

    // Get image size
    let canvases = document.getElementsByTagName("canvas");
    let imgDim = {};
    for (let i = 0; i < canvases.length; i++) {
        if (canvases[i].width > 0) {
            imgDim.w = canvases[i].width;
            imgDim.h = canvases[i].height;
            //console.log("imgDim", imgDim.w, imgDim.h);
            break;
        }
    }

    const ifrm = document.getElementById('caMicrocopeIfr');
    const ifrmLoc = new URL(ifrm.src);

    promiseA = async function (id) {

        const winLoc = window.location;
        // Build query url
        let queryLoc;
        if (ifrmLoc.protocol !== winLoc.protocol) {
            // Match protocol
            queryLoc = winLoc.protocol;
        } else {
            queryLoc = ifrmLoc.protocol;
        }
        queryLoc += `//${ifrmLoc.hostname}`;
        // If quip1, then use port.
        if (queryLoc.includes('quip1')) {
            queryLoc += ':443';
        }
        queryLoc += `/quip-findapi?limit=10&db=quip&collection=images&find={"case_id":"${id}"}`;
        console.log('queryLoc', queryLoc);
        return (await fetch(queryLoc)).json()
    };

    let slide = tilmap.selTumorTissue.value.slice(0, -4);
    // Patch to correct slide name
    if (slide.includes("til_cancer"))
    {
        let arr = slide.split("_");
        slide = arr[0];
    }
    promiseB = promiseA(slide, [clickPos.x, clickPos.y]);

    // Get slide dimensions
    //zoom2loc.getFile('slidemeta.json').then(result => {
    promiseB.then(function (result) {

        // Build new iFrame src
        let slideDim = {};
        slideDim.width = result[0].width;
        slideDim.height = result[0].height;
        //console.log("slideDim", slideDim);
        let newIfrmLoc = ifrmLoc.href;
        let scale = {};
        scale.w = slideDim.width / imgDim.w;
        scale.h = slideDim.height / imgDim.h;
        //console.log("scale", scale);
        // Strip existing x,y search parameters and set new ones
        if (newIfrmLoc.indexOf('&x=') > -1) {
            newIfrmLoc = newIfrmLoc.substring(0, newIfrmLoc.indexOf('&x='));
        }
        ifrm.src = `${newIfrmLoc}&x=${Math.ceil(clickPos.x * scale.w)}&y=${Math.ceil(clickPos.y * scale.h)}&zoom=5`;
        console.log('ifrm.src:', ifrm.src);

    });

};
