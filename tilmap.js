console.log('tilmap.js loaded')

tilmap=function(){
    // ini
    tilmap.div=document.body.querySelector('#tilmapDiv')
    if(tilmap.div){tilmap.ui()}
}

tilmap.parms={
    range:50
}

tilmap.ui=function(div){
    div=div||tilmap.div // default div
    h='<table><tr><td style="vertical-align:top"><h3 style="color:maroon">Til Maps</h3>'
    h+='from tumor type <select id="selTumorType"></select> select tissue <select id="selTumorTissue"></select>'
    /*
    var url = "https://quip1.bmi.stonybrook.edu:8443/camicroscope/osdCamicroscope.php?tissueId=TCGA-2F-A9KO-01Z-00-DX1"
    if(tilmap.selTumorTissue){
        url='https://quip1.bmi.stonybrook.edu:8443/camicroscope/osdCamicroscope.php?tissueId='+tilmap.selTumorTissue.value.replace('.png','')
    }
    */
    h+='<div id="tilShowImgDiv"></div></td><td style="vertical-align:top"><iframe id="caMicrocopeIfr" width="800px" height="800px"></td></tr></table>'
    div.innerHTML=h
    tilmap.selTumorType=div.querySelector('#selTumorType')
    tilmap.selTumorTissue=div.querySelector('#selTumorTissue')
    tilmap.tilShowImgDiv=div.querySelector('#tilShowImgDiv')
    tilmap.selTumorType.style.backgroundColor='lime'
    tilmap.selTumorTissue.style.backgroundColor='orange'
    tilmap.getJSON().then(x=>{
        tilmap.index(x) // build TissueIndex
        for(var t in tilmap.tumorIndex){
            var op = document.createElement('option')
            tilmap.selTumorType.appendChild(op)
            op.textContent=t


            //debugger
        }
        tilmap.optTissue()
        tilmap.showTIL()
    })
    tilmap.selTumorType.onchange=()=>{ // update tissue list
        tilmap.optTissue();
        tilmap.showTIL()
    }
    tilmap.selTumorTissue.onchange=tilmap.showTIL
    tilmap.selTumorType.onclick=tilmap.selTumorTissue.onclick=function(){
        if(rangePlay.textContent=="Stop"){
            rangePlay.click()
        }

        //debugger
    }
    setTimeout(tilmap.showTIL,1000)
}

tilmap.optTissue=function(){ // fill Tissues once type is chosen
    tilmap.selTumorTissue.innerHTML="" // reset options
    for(var c in tilmap.tumorIndex[tilmap.selTumorType.value]){
        var op = document.createElement('option')
        op.textContent=c
        tilmap.selTumorTissue.appendChild(op)
    }
    //debugger
}

tilmap.getJSON=async function(url){
    url=url||'dir.json'
    return (await fetch(url)).json()
}

tilmap.index=function(x){
    tilmap.tissueIndex={}
    tilmap.tumorIndex=x.PNGs
    for(var t in tilmap.tumorIndex){
        //tilmap.tissueIndex[c]={} // tumor type
        console.log('indexing '+t)
        tilmap.tumorIndex[t]
        for(var c in tilmap.tumorIndex[t]){
            tilmap.tumorIndex[t][c]={
                size:tilmap.tumorIndex[t][c],
                tumorType:t
            }
            tilmap.tissueIndex[c]=t // indexing tissue c to tumor type t
        }
    }
    return tilmap.tissueIndex
}

tilmap.showTIL=function(){ // get image and display it
    var url='PNGs/'+tilmap.selTumorType.value+'/'+tilmap.selTumorTissue.value
    var h='<div><img id="imgTIL" src='+url+'></div><div><a href="'+url+'" target="_blank">'+url+'</a></div>'

    var h = '<div id="imgTILDiv"><img id="imgTIL" src='+url+'></div><a href="'+url+'" target="_blank" style="font-size:small">'+url+'</a></div><div id="calcTIL">...</div>'
    tilmap.tilShowImgDiv.innerHTML=h
    tilmap.tilShowImgDiv.style.color='navy'
    var dt=tilmap.tumorIndex[tilmap.selTumorType.value][tilmap.selTumorTissue.value]

    //var h2 ='<h3>Interactive Analytics</h3>'
    var h2 =''
    var url2='https://quip1.bmi.stonybrook.edu:8443/camicroscope/osdCamicroscope.php?tissueId='+tilmap.selTumorTissue.value.replace('.png','')
    if(!tilmap.selTumorTissue.value.match('-')){ // to accomodate Han's new slides
        let id = tilmap.selTumorTissue.value.match(/\d+/)[0]
        url2="https://quip3.bmi.stonybrook.edu/camicroscope/osdCamicroscope.php?tissueId="+id
    }
    caMicrocopeIfr.src=url2
    //var url2='http://quip1.uhmc.sunysb.edu:443/camicroscope/osdCamicroscope.php?tissueId='+tilmap.selTumorTissue.value.replace('.png','')
    h2 += '<div id="calcTILdiv">CaMicroscope</div>'
    var td = tilmap.div.querySelector('#calcTIL')
    td.innerHTML=h2
    tilmap.calcTILdiv=tilmap.div.querySelector('#calcTILdiv')
    var imgTILDiv = document.getElementById('imgTILDiv')
    if(typeof(jmat)!=="undefined"){
        tilmap.calcTILfun()
    }else{
        var s = document.createElement('script')
        s.src="https://jonasalmeida.github.io/jmat/jmat.js"
        s.onload=tilmap.calcTILfun
        document.head.appendChild(s)
    }
}

tilmap.zoom2loc=function(){ // event listener pointing to zoom2loc's code
    imgTILDiv.onclick=function(ev){
    //tilmap.img.onclick=function(ev){
        if(typeof(zoom2loc)=="undefined"){
            var s=document.createElement('script')
            s.src="zoom2loc.js"
            s.onload=function(){zoom2loc(ev)}
            document.head.appendChild(s)
        }else{zoom2loc(ev)}
    }
    return tilmap.calcTILdiv
}

tilmap.calcTILfun=function(){
    //var h=' Decode RGB maps:'
    var h=''
    h += '<p> <button id="calcTILred" style="background-color:red"> Red channel </button></span> '
    h += '<span> <button id="calcTILgreen" style="background-color:green"> Green channel </button></span> '
    h += '<span> <button id="calcTILblue" style="background-color:cyan"> Blue channel </button></span> '
    h += '<span> <button id="calcTIL0" style="background-color:white"> original png </button></p> '
    h += '<p> <input id="cancerTilRange" type="range" style="width:200px"> <button id="rangePlay" style="background-color:lime">Play</button>'
    h += '<br>Cancer  &#8592 (prediction) &#8594 TIL</p>'
    h += '<p> <input id="segmentationRange" type="range" style="width:200px"> <button id="rangeSegmentBt" style="background-color:lime">Segment</button>'
    h += '<br>0 &#8592 (threshold) &#8594 1'
    h += '<br> <input id="transparencyRange" type="range" style="width:200px" value=20>'
    h += '<br>0 &#8592 (transparency) &#8594 1</p>'

    tilmap.calcTILdiv.innerHTML=h
    tilmap.zoom2loc()
    cancerTilRange.value=tilmap.parms.range
    rangeSegmentBt.onclick=tilmap.segment
    rangePlay.onclick=function(){
        if(this.textContent=="Play"){
            this.textContent="Stop"
            this.style.backgroundColor="orange"
            if(this.value==""){cancerTilRange.value=tilmap.parms.range}
            tilmap.parms.t = setInterval(function(){
                cancerTilRange.value=parseInt(cancerTilRange.value)+5
                cancerTilRange.onchange()
                //console.log(cancerTilRange.value)
                if(parseInt(cancerTilRange.value)>=100){
                    cancerTilRange.value="0"
                }
            },100)
        }else{
            clearInterval(tilmap.parms.t)
            this.textContent="Play"
            this.style.backgroundColor="lime"
        }
    }
    // read the image data
    tilmap.img = tilmap.div.querySelector('#imgTIL')
    tilmap.img.onload=function(){
        tilmap.cvBase=document.createElement('canvas');
        //tilmap.cvBase.onclick=tilmap.img.onclick
        tilmap.cvBase.hidden=true
        tilmap.cvBase.width=tilmap.img.width
        tilmap.cvBase.height=tilmap.img.height
        tilmap.cvBase.id="cvBase"
        tilmap.img.parentElement.appendChild(tilmap.cvBase)
        tilmap.ctx=tilmap.cvBase.getContext('2d');
        tilmap.ctx.drawImage(this,0,0);
        tilmap.imgData=jmat.imread(tilmap.cvBase);
        // extract RGB
        tilmap.imgDataR=tilmap.imSlice(0)
        tilmap.imgDataG=tilmap.imSlice(1)
        tilmap.imgDataB=tilmap.imSlice(2)
        calcTILred.onclick=function(){tilmap.from2D(tilmap.imSlice(0))}
        calcTILgreen.onclick=function(){tilmap.from2D(tilmap.imSlice(1))}
        calcTILblue.onclick=function(){tilmap.from2D(tilmap.imSlice(2))}
        calcTIL0.onclick=function(){
            tilmap.img.hidden=false
            tilmap.cvBase.hidden=true
        }
        //debugger
        tilmap.cvBase.onclick=tilmap.img.onclick
        cancerTilRange.onclick=function(){
            if(rangePlay.textContent=="Stop"){
                rangePlay.click()
            }
        }
        cancerTilRange.onchange=function(){
            //debugger
            tilmap.cvBase.hidden=false
            tilmap.img.hidden=true
            var cm=jmat.colormap()
            var k = parseInt(this.value)/100 //slider value
            tilmap.parms.range=this.value
            var ddd = tilmap.imgData.map(function(dd){
                return dd.map(function(d){
                    var r = k*d[0]/255
                    var g = (1-k)*d[1]/255
                    return cm[Math.round((r+g)*63)].map(x=>Math.round(x*255)).concat(d[2])
                    //debugger
                })
            })
            jmat.imwrite(tilmap.cvBase,ddd)
            //debugger
        }
        cancerTilRange.onchange()
        //setTimeout(function(){cancerTilRange.onchange()},1000)
        //cancerTilRange.onchange() // <-- start with the 50% mix
        tilmap.cvTop=document.createElement('canvas')
        tilmap.cvTop.width=tilmap.img.width
        tilmap.cvTop.height=tilmap.img.height
        tilmap.cvTop.id="cvTop"
        tilmap.img.parentElement.appendChild(tilmap.cvTop)
        tilmap.cvTop.style.position='absolute'
        tilmap.canvasAlign()
    }
    segmentationRange.onchange=rangeSegmentBt.onclick
    transparencyRange.onchange=tilmap.transpire
    //tilmap.img.onload() // start image
    //cancerTilRange.onchange() // start range


    //setTimeout(function(){cancerTilRange.onchange()},1000)
}

tilmap.from2D=function(dd){
    tilmap.cvBase.hidden=false
    tilmap.img.hidden=true
    tilmap.cv2D=dd // keeping current value 2D slice
    var cm=jmat.colormap()
    var k = 63/255 // png values are between 0-255 and cm 0-63
    var ddd = dd.map(function(d){
        return d.map(function(v){
            return cm[Math.round(v*k)].map(x=>Math.round(x*255)).concat(255)
        })
    })
    //tilmap.ctx.putImageData(jmat.data2imData(ddd),0,0)
    //jmat.imwrite(tilmap.img,ddd)
    jmat.imwrite(tilmap.cvBase,ddd)
    //debugger
}

tilmap.imSlice=function(i){ // slice ith layer of imgData matrix
    i=i||0
    return tilmap.imgData.map(x=>{
        return x.map(y=>{
            return y[i]
        })
    })
}

tilmap.segment=function(){
    //alert('under development')
    // create top canvas if it doesn't exist already


    // generate mask
    var k = parseInt(cancerTilRange.value)/100 // range value
    var sv = 2.55*parseInt(segmentationRange.value) // segmentation value
    var tp = Math.round(2.55*parseInt(transparencyRange.value)) // range value
    tilmap.segMask = tilmap.imgData.map(dd=>{
          return dd.map(d=>{
              //return (d[0]*(k)+d[1]*(1-k))>sv
              return (d[0]*(k)+d[1]*(1-k))>sv
          })
    })
    // find neighbors
    var n = tilmap.imgData.length
    var m = tilmap.imgData[0].length
    tilmap.segNeig = [...Array(n)].map(_=>{
        return [...Array(m)].map(_=>[0])
    })
    var dd=tilmap.segMask
    for(var i=1;i<(n-1);i++){
        for(var j=1;j<(m-1);j++){
            tilmap.segNeig[i][j]=[dd[i-1][j-1],dd[i-1][j],dd[i-1][j+1],dd[i][j-1],dd[i][j],dd[i][j+1],dd[i+1][j-1],dd[i+1][j],dd[i+1][j+1]]
        }
    }
    //tilmap.segNeig=
    /*
    tilmap.segNeig = tilmap.segMask.map(dd,i)=>{
        dd.map((d,j)=>{
            //return [dd[i-1][j-1],dd[i-1][j],dd[i-1][j+1],dd[i][j-1],dd[i][j],dd[i][j+1],dd[i+1][j-1],dd[i+1][j],dd[i+1][j+1]]
        })
    })
    */


    // find edges
    tilmap.segEdge = tilmap.segNeig.map(dd=>{
        return dd.map(d=>{
            var s=d.reduce((a,b)=>a+b)
            return (s>3 & s<7)
            //return d.reduce((a,b)=>Math.max(a,b))!=d.reduce((a,b)=>Math.min(a,b))
        })
    })
    tilmap.transpire()
    /*
    var clrEdge = [255,255,0,255-tp] // yellow
    var clrMask = [255,255,255,tp]
    jmat.imwrite(tilmap.cvTop,tilmap.segEdge.map((dd,i)=>{
        return dd.map((d,j)=>{
            var c =[0,0,0,0]
            if(d){
                c=clrEdge
            }else if(!tilmap.segMask[i][j]){
                c=clrMask
            }
            return c
            //return [255,255,255,255].map(v=>v*d) // white
        })
    }))
    */

    //console.log(tilmap.segNeig,tilmap.segEdge)

}

tilmap.transpire=function(){
    var tp = Math.round(2.55*parseInt(transparencyRange.value)) // range value
    var clrEdge = [255,255,0,255-tp] // yellow
    var clrMask = [255,255,255,tp]
    jmat.imwrite(tilmap.cvTop,tilmap.segEdge.map((dd,i)=>{
        return dd.map((d,j)=>{
            var c =[0,0,0,0]
            if(d){
                c=clrEdge
            }else if(!tilmap.segMask[i][j]){
                c=clrMask
            }
            return c
            //return [255,255,255,255].map(v=>v*d) // white
        })
    }))
}

tilmap.canvasAlign=function(){
    tilmap.cvTop.style.top=tilmap.cvBase.getBoundingClientRect().top
    tilmap.cvTop.style.left=tilmap.cvBase.getBoundingClientRect().left
}


window.onload=tilmap


// MIS

tilmap.getRelative = async function(id,xy){ // converts relative to absolute coordinates
    var url='https://quip1.bmi.stonybrook.edu:8443/camicroscope/api/Data/getImageInfoByCaseID.php?case_id='+id
    return (await fetch(url)).json().then(info=>[xy[0]*info[0].width,xy[1]*info[0].height].map(c=>parseInt(c)))
}

