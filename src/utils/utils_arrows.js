import React from "react"

/**
 * Defines coordinates for the line taking start and end position of buttons 
 * @param {*} startElem 
 * @param {*} endElem 
 * @returns 
 */
export function connectElements(startElem,endElem,drop){ 
    var leftOffset = drop.current.offsetLeft
    var startCoordLeft = startElem.clientX-leftOffset
    var startCoordTop = startElem.clientY
    var endCoordLeft = endElem.clientX-leftOffset -35
    var endCoordTop = endElem.clientY
    return {x1:startCoordLeft, y1:startCoordTop, x2:endCoordLeft, y2:endCoordTop}
}


export function getFirstPositionArrow(startElem,drop){
    var leftOffset = drop.current.offsetLeft
    var startCoordLeft = startElem.clientX-leftOffset
    var startCoordTop = startElem.clientY
    return {x1:startCoordLeft, y1:startCoordTop}
    
}

/**
 * Deletes arrows when user clicks on arrow
 * @param {*} arrow 
 * @param {*} arrows 
 * @param {*} arrows_blocks 
 * @param {*} block_arrows 
 * @returns new state
 */
export function deleteArrowById(arrow, arrows, arrows_blocks, block_arrows){
    var filtered_keys = Object.keys(arrows).filter(x=>x!== arrow)
    var new_block_arrows = {}, new_arrows_block = {}, new_arrows = {}
    filtered_keys.forEach(key=>{
        new_arrows_block[key] = arrows_blocks[key]
        new_arrows[key]=arrows[key]
    })
    Object.keys(block_arrows).forEach(block=>{
        var app=block_arrows[block].filter(x=>x!==arrow)
        new_block_arrows[block]=app
    })
    return {
        arrows: new_arrows,
        arrows_blocks: new_arrows_block,
        block_arrows: new_arrows_block
    }
}

