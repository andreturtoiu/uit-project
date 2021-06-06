
/**
 * Parse transform style string ex. translate(10px, 10px)
 * @param {*} value 
 * @returns 
 */
export function parseTransform(value){
    //type of positions in input : translate(10px, 10px) or translate(10px)
    var positions = value.split(',')
    var x = parseFloat(positions[0].split('(')[1].split('px')[0])
    var y = 0
    
    if(positions.length>1){        
        var y = parseFloat(positions[1].split('px')[0])
    }
    return [x,y]
}

/**
 *  Checks if two blocks are already connected
 * @param {*} block_arrows 
 * @param {*} block1 
 * @param {*} block2 
 * @returns boolean
 */
export function checkBlocksAlreadyConnected(block_arrows,  block1, block2){
    if(Object.keys(block_arrows).length===0) return false //no blocks
    else if(!block_arrows[block1] || !block_arrows[block2]) return false //no arrows
    else if(block_arrows[block1].length===0 || block_arrows[block2].length===0 ) return false //block does not have arrows    
    else if(block_arrows[block1].some(r=>block_arrows[block2].includes(r))) return true  //block have an arrow in common    
    else return false
}


/**
 * On block delete, deletes arrows connecting them
 * @param {*} arrows
 * @param {*} block_arrows  
 * @param {*} arrows_blocks 
 * @param {*} id_block 
 * @returns new state of inputs
 */
export function deleteArrowsConnectingBlock(arrows, block_arrows, arrows_blocks, id_block){   
    var lines = block_arrows[id_block]//pick the lines to delete    
    var new_arrows = {}, new_arrows_blocks = {}
    var new_blocks = {} //block1:[line1,line2]
    var k_arrows_filtered = Object.keys(arrows)
    lines.forEach(line=>{
        k_arrows_filtered = k_arrows_filtered.filter(x=>x!==line.toString())
    })
    k_arrows_filtered.forEach(line=>{
        Object.keys(block_arrows).forEach(block=>{
            if(block !== id_block.toString()){
                //each block's list of lines -> block1:[line1,line2] 
                var app_lines = block_arrows[block].filter(x=>x===parseFloat(line))
                if(app_lines.length>0)
                    new_blocks[block] = app_lines
            }
        })
        Object.keys(arrows_blocks).forEach(arrow=>{
            if(line.toString()===arrow)
                new_arrows_blocks[arrow]=arrows_blocks[arrow]        
        })
    })    
    
    k_arrows_filtered.forEach(k=>{new_arrows[k]=arrows[k]}) //Deleted the line 
    return {arrows:new_arrows, block_arrows: new_blocks, arrows_blocks: new_arrows_blocks}

}

