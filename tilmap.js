console.log('tilmap.js loaded')

tilmap=function(){
    // ini
    tilmap.div=document.body.querySelector('#tilmapDiv')
    if(tilmap.div){tilmap.ui()}
}

tilmap.parms={
    cancerRange:100,
    tilRange:100,
    transparency:20,
    threshold:0
}

tilmap.ui=function(div){
    div=div||tilmap.div // default div
    h='<table><tr><td style="vertical-align:top"><h3 style="color:maroon">Til Maps <span id="slideLink" style="color:blue;font-size:small;cursor:pointer">Link</span></h3>'
    h+='<br><input id="searchInput" value="search" style="color:gray"> <span id="searchResults" style="font-size:small">...</span>'
    h+='<br>from tumor type <select id="selTumorType"></select> select tissue <select id="selTumorTissue"></select>'
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
        if(cancerRangePlay.style.backgroundColor=="orange"){
            cancerRangePlay.click()
        }
        if(tilRangePlay.style.backgroundColor=="orange"){
            tilRangePlay.click()
        }

        //debugger
    }
    setTimeout(tilmap.showTIL,1000)
    searchInput.onkeyup=searchInput.onclick=tilmap.search
    if(location.hash.length>3){
        var ts = location.hash.slice(1).split('/')
        setTimeout(function(){
            tilmap.selTumorType.value=ts[0]
            tilmap.selTumorType.onchange()
            setTimeout(function(){
                tilmap.selTumorTissue.value=ts[1]
                tilmap.selTumorTissue.onchange()
            },0)
                
            //debugger
        },1000)
        //debugger
    }
    slideLink.onclick=function(){
        location.hash=`${location.hash=tilmap.selTumorType.value}/${tilmap.selTumorTissue.value}`
        tilmap.copyToClipboard(location.href)
    }

}

tilmap.search=function(){
    if(this.style.color=="gray"){
        this.style.color="navy"
        this.value=""
    }else{
        if(this.value.length>2){
            var res=[] // results
            for(let t in tilmap.tumorIndex){
                for(let s in tilmap.tumorIndex[t]){
                    if(s.match(RegExp(this.value,'i'))){
                        res.push(`<a href="#${t}/${s}" target="_blank">${t}/${s.replace('.png','')}</a>`)
                    }
                    //debugger
                }   
            }
            if(res.length>0){
                searchResults.innerHTML=res.join(', ')
            }else{
                searchResults.innerHTML=' no matches'
            }
            tilmap.canvasAlign()
        }
        
    }
    //debugger
}

tilmap.copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  slideLink.textContent='Link copied'
  setTimeout(function(){
      slideLink.textContent='Link'
  },1000)
};

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
        //s.src="https://jonasalmeida.github.io/jmat/jmat.js"
        s.src="jmat.js"
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
    h += '<p><span><input id="cancerRange" type="range" style="width:200px"> <button id="cancerRangePlay" style="background-color:lime">Cancer</button></span>'
    h += '<br><input id="tilRange" type="range" style="width:200px"> <button id="tilRangePlay" style="background-color:lime">TIL</button></p>'
    
    h += '<span style="font-size:small;color:gray">... additional classifications will be available here ...</span>'
    // h += '<br>Cancer  &#8592 (prediction) &#8594 TIL</p>'
    h += '<p> <input id="segmentationRange" type="range" style="width:200px" value='+tilmap.parms.threshold+'> <button id="rangeSegmentBt" style="background-color:lime">Segment</button>'
    h += '<br>&nbsp;&nbsp;&nbsp;<span style="font-size:small"> 0 &#8592(segmentation threshold)&#8594 1</span>'
    h += '<br> <input id="transparencyRange" type="range" style="width:200px" value='+tilmap.parms.transparency+'>'
    h += '<br><span style="font-size:small">&nbsp; 0 &#8592 (segmentation transparency) &#8594 1<s/pan></p>'
    h += '<hr> <select><option>add more classifications</option><option>(under development)</option></select>'

    tilmap.calcTILdiv.innerHTML=h
    tilmap.zoom2loc()
    cancerRange.value=tilmap.parms.cancerRange
    tilRange.value=tilmap.parms.tilRange
    rangeSegmentBt.onclick=tilmap.segment
    cancerRangePlay.onclick=tilRangePlay.onclick=function(){
        // make sure the other play is stopped
        if((this.id=="cancerRangePlay")&(tilRangePlay.style.backgroundColor=="orange")){
            tilRangePlay.click()
        }
        if((this.id=="tilRangePlay")&(cancerRangePlay.style.backgroundColor=="orange")){
            cancerRangePlay.click()
        } 


        var range = document.getElementById(this.id.slice(0,-4)) // range input for this button
        if(this.style.backgroundColor=="lime"){
            this.style.backgroundColor="orange"
            if(range.value==""){range.value=tilmap.parms[range.id]}
            tilmap.parms.t = setInterval(function(){
                range.value=parseInt(range.value)+5
                //console.log(cancerTilRange.value)
                if(parseInt(range.value)>=100){
                    range.value="0"
                }
                tilmap.parms[range.id]=range.value
                range.onchange()
            },100)
        }else{
            clearInterval(tilmap.parms.t)
            //this.textContent="Play"
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
        
        cancerRange.onchange=tilRange.onchange=function(){
            //debugger
            tilmap.cvBase.hidden=false
            tilmap.img.hidden=true
            var cm=jmat.colormap()
            //var k = parseInt(this.value)/100 //slider value
            var cr=parseInt(cancerRange.value)/100
            var tr=parseInt(tilRange.value)/100
            tilmap.parms[this.id]=this.value
            var ddd = tilmap.imgData.map(function(dd){
                return dd.map(function(d){
                    //var r = k*d[0]/255
                    //var g = (1-k)*d[1]/255
                    //return cm[Math.round((r+g)*63)].map(x=>Math.round(x*255)).concat(d[2])
                    return cm[Math.round((Math.max(d[1]*cr,d[0]*tr)/255)*63)].map(x=>Math.round(x*255)).concat(d[2])
                    //debugger
                })
            })
            jmat.imwrite(tilmap.cvBase,ddd)
            //debugger
        }

        // making sure clicking stops play and actas as onchange
        cancerRange.onclick=function(){
            if(cancerRangePlay.style.backgroundColor=="orange"){
                cancerRangePlay.onclick()
            }
            cancerRange.onchange()
        }
        tilRange.onclick=function(){
            if(tilRangePlay.style.backgroundColor=="orange"){
                tilRangePlay.onclick()
            }
            tilRange.onchange()
        }

        cancerRange.onchange()
        //setTimeout(function(){cancerTilRange.onchange()},1000)
        //cancerTilRange.onchange() // <-- start with the 50% mix
        tilmap.cvTop=document.createElement('canvas')
        tilmap.cvTop.width=tilmap.img.width
        tilmap.cvTop.height=tilmap.img.height
        tilmap.cvTop.id="cvTop"
        tilmap.img.parentElement.appendChild(tilmap.cvTop)
        tilmap.cvTop.style.position='absolute'
        tilmap.canvasAlign()
        tilmap.segment()
    }
    segmentationRange.onchange=tilmap.segment //rangeSegmentBt.onclick
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
    // generate mask
    //var k = parseInt(cancerRange.value)/100 // range value
    var cr=parseInt(cancerRange.value)/100
    var tr=parseInt(tilRange.value)/100
    var sv = 2.55*parseInt(segmentationRange.value) // segmentation value
    var tp = Math.round(2.55*parseInt(transparencyRange.value)) // range value
    tilmap.segMask = tilmap.imgData.map(dd=>{
          return dd.map(d=>{
              //return (d[0]*(k)+d[1]*(1-k))>sv
              //return (d[0]*(k)+d[1]*(1-k))>=sv
              return (Math.max(d[1]*cr,d[0]*tr))>=sv
              //return cm[Math.round((Math.max(d[1]*cr,d[0]*tr)/255)*63)].map(x=>Math.round(x*255)).concat(d[2])
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
    // find edges
    tilmap.segEdge = tilmap.segNeig.map(dd=>{
        return dd.map(d=>{
            var s=d.reduce((a,b)=>a+b)
            return (s>3 & s<7)
            //return d.reduce((a,b)=>Math.max(a,b))!=d.reduce((a,b)=>Math.min(a,b))
        })
    })
    tilmap.transpire()
    tilmap.parms.threshold=segmentationRange.value

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
    tilmap.parms.transparency=transparencyRange.value
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

