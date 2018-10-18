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
    h += '<iframe id="caMicrocopeIfr" width="100%" height="100%" src="http://quip1.uhmc.sunysb.edu:443/camicroscope/osdCamicroscope.php?tissueId='+tilmap.selTumorTissue.value.replace('.png','')+'">'
    tilmap.tilShowImgDiv.innerHTML=h
    tilmap.tilShowImgDiv.style.color='navy'
    var dt=tilmap.tumorIndex[tilmap.selTumorType.value][tilmap.selTumorTissue.value]

    var h2 ='<h3>Interactive Analytics</h3>'
    var url2='https://quip1.bmi.stonybrook.edu:8443/camicroscope/osdCamicroscope.php?tissueId='+tilmap.selTumorTissue.value.replace('.png','')
    //var url2='http://quip1.uhmc.sunysb.edu:443/camicroscope/osdCamicroscope.php?tissueId='+tilmap.selTumorTissue.value.replace('.png','')
    h2 += '<p>CaMicroscope</p>'
    var td = tilmap.div.querySelector('#calcTIL')
    td.innerHTML=h2

    //http://quip1.uhmc.sunysb.edu:443/camicroscope/osdCamicroscope.php?tissueId=TCGA-05-4244-01Z-00-DX1


    //debugger
}


window.onload=tilmap
