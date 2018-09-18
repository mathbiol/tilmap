console.log('tilmap.js loaded')

tilmap=function(){
    // ini
    tilmap.div=document.body.querySelector('#tilmapDiv')
    if(tilmap.div){tilmap.ui()}
}

tilmap.ui=function(div){
    div=div||tilmap.div // default div
    h='<h3 style="color:maroon">Til Maps</h3>'
    h+='from cancer type <select id="selCancerType"></select> case <select id="selCancerCase"></select>'
    div.innerHTML=h
    tilmap.selCancerType=div.querySelector('#selCancerType')
    tilmap.selCancerCase=div.querySelector('#selCancerCase')
    tilmap.getJSON().then(x=>{
        tilmap.index(x) // build caseIndex
        for(var t in tilmap.tumorIndex){
            var op = document.createElement('option')
            tilmap.selCancerType.appendChild(op)
            op.textContent=t


            //debugger
        }
        tilmap.optCase()
    })
}

tilmap.optCase=function(){ // fill cases once type is chosen
    tilmap.selCancerCase.innerHTML="" // reset options
    for(var c in tilmap.tumorIndex[tilmap.selCancerType.value]){
        var op = document.createElement('option')
        op.textContent=c
        tilmap.selCancerCase.appendChild(op)
    }
    //debugger

}

tilmap.getJSON=async function(url){
    url=url||'dir.json'
    return (await fetch(url)).json()
}

tilmap.index=function(x){
    tilmap.caseIndex={}
    tilmap.tumorIndex=x.TIL_maps_before_thres_v2
    for(var t in tilmap.tumorIndex){
        //tilmap.caseIndex[c]={} // tumor type
        console.log('indexing '+t)
        tilmap.tumorIndex[t]
        for(var c in tilmap.tumorIndex[t]){
            tilmap.tumorIndex[t][c]={
                size:tilmap.tumorIndex[t][c],
                tumorType:t
            }
            tilmap.caseIndex[c]=t // indexing case c to tumor type t
        }
    }
    return tilmap.caseIndex
}


window.onload=tilmap
