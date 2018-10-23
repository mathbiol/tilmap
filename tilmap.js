console.log('tilmap.js loaded')

tilmap=function(){
    // ini
    tilmap.div=document.body.querySelector('#tilmapDiv')
    if(tilmap.div){tilmap.ui()}
}

tilmap.ui=function(div){
    div=div||tilmap.div // default div
    h='<h3 style="color:maroon">Til Maps</h3>'
    h+='from tumor type <select id="selTumorType"></select> select tissue <select id="selTumorTissue"></select>'
    h+='<div id="tilShowImgDiv"></div>'
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
    //setTimeout(tilmap.showTIL,1000)
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
    tilmap.tumorIndex=x.TIL_maps_before_thres_v2
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
    var url=location.href+'TIL_maps_before_thres_v2/'+tilmap.selTumorType.value+'/'+tilmap.selTumorTissue.value
    var h='<div><img id="imgTIL" src='+url+'></div><div><a href="'+url+'" target="_blank">'+url+'</a></div>'
    var h = '<table>'
    h += '<tr><td style="vertical-align:top"><img id="imgTIL" src='+url+'></td><td id="calcTIL" style="vertical-align:top">... interactive analytics goes here ...</td></tr>'
    h += '<tr><td><a href="'+url+'" target="_blank" style="font-size:small">'+url+'</a></td><td>'+Date().slice(0,24)+'</td></tr>'
    h += '</table>'
    //h += '<iframe id="caMicrocopeIfr" width="100%" height="100%" src="http://quip1.uhmc.sunysb.edu:443/camicroscope/osdCamicroscope.php?tissueId='+tilmap.selTumorTissue.value.replace('.png','')+'">'
    h += '<iframe id="caMicrocopeIfr" width="100%" height="100%" src="https://quip1.bmi.stonybrook.edu:8443/camicroscope/osdCamicroscope.php?tissueId='+tilmap.selTumorTissue.value.replace('.png','')+'">'
    tilmap.tilShowImgDiv.innerHTML=h
    tilmap.tilShowImgDiv.style.color='navy'
    var dt=tilmap.tumorIndex[tilmap.selTumorType.value][tilmap.selTumorTissue.value]

    var h2 ='<h3>Interactive Analytics</h3>'
    var url2='https://quip1.bmi.stonybrook.edu:8443/camicroscope/osdCamicroscope.php?tissueId='+tilmap.selTumorTissue.value.replace('.png','')
    //var url2='http://quip1.uhmc.sunysb.edu:443/camicroscope/osdCamicroscope.php?tissueId='+tilmap.selTumorTissue.value.replace('.png','')
    h2 += '<div id="calcTILdiv">CaMicroscope</div>'
    var td = tilmap.div.querySelector('#calcTIL')
    td.innerHTML=h2
    tilmap.calcTILdiv=tilmap.div.querySelector('#calcTILdiv')
    if(typeof(jmat)!=="undefined"){
        tilmap.calcTILfun()
    }else{
        var s = document.createElement('script')
        s.src="https://jonasalmeida.github.io/jmat/jmat.js"
        s.onload=tilmap.calcTILfun
        document.head.appendChild(s)
    }
}

tilmap.calcTILfun=function(){
    var h=' Decode RGB maps:'
    h += '<p><button id="calcTILred" style="background-color:red"> Red channel </button></p>'
    h += '<p><button id="calcTILgreen" style="background-color:green"> Green channel </button></p>'
    h += '<p><button id="calcTILblue" style="background-color:cyan"> Blue channel </button></p>'
    h += '<p><button id="calcTIL0" style="background-color:white"> original png </button></p>'
    h += '<p><input id="cancerTilRange" type="range" style="width:200px"><br>Tumor <---(prediction)---> TIL</p>'
    tilmap.calcTILdiv.innerHTML=h
    // read the image data
    tilmap.img = tilmap.div.querySelector('#imgTIL')
    tilmap.img.onload=function(){
        tilmap.cvBase=document.createElement('canvas');
        //tilmap.cvBase.onclick=tilmap.img.onclick
        tilmap.cvBase.hidden=true
        tilmap.cvBase.width=tilmap.img.width
        tilmap.cvBase.height=tilmap.img.height
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
        cancerTilRange.onclick=cancerTilRange.onchange=function(){
            tilmap.cvBase.hidden=false
            tilmap.img.hidden=true
            var cm=jmat.colormap()
            var k = parseInt(this.value)/100 //slider value
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
        setTimeout(function(){cancerTilRange.onchange()},100)
        //cancerTilRange.onchange() // <-- start with the 50% mix
    }
    tilmap.img.onload() // start image
    //cancerTilRange.onchange() // start range
    tilmap.img.onclick=function(ev){
        if(typeof(tammy)=="undefined"){
            var s=document.createElement('script')
            s.src="tammy.js"
            s.onload=function(){tammy(ev)} 
            document.head.appendChild(s)
        }else{tammy(ev)}
    }
    setTimeout(function(){cancerTilRange.onchange()},1000)
}

tilmap.from2D=function(dd){
    tilmap.cvBase.hidden=false
    tilmap.img.hidden=true
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

window.onload=tilmap
