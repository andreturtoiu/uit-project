import React from "react";
import Block from '../draggable-nodes/Block'
import '../styles/css/homepage.css'
import { connectElements, deleteArrowById } from '../utils/utils_arrows'
import { checkBlocksAlreadyConnected, deleteArrowsConnectingBlock } from '../utils/utils_block'

const DRAG_TYPE = ['BEGIN','PREPROCESSING','AGGREGATE','FILTER', 'RESAMPLE', 'SELECT', 'MERGE','END']
const DRAG_IDS = DRAG_TYPE.map(x=>Math.random())

export class DragAndDropZone extends React.Component{
    constructor(props){        
        super(props)
        this.refDropZone = React.createRef()
        this.refDragZone = React.createRef()
        this.refSvg = React.createRef()
        this.state={
            placeHolder:false,
            childrenDragType:DRAG_TYPE,
            childrenDrag:DRAG_IDS, //list of Drag drops 
            dropStyle:{},
            childrenDrop:[], //List of dropped blocks
            childrenDropType:{},
            conn_click:[], //buttons evetns clicked to connect
            conn_blocks:[], //blocks clicked to connect
            button_refs:[], //button refs clicked to connect
            blocks_refs:[], //connected blocks refs
            arrows: {}, //arrows to render
            block_arrows:{},//each block refered to his line {block1: [linea1, linea3], block2:[linea1]}
            arrows_blocks:{},//each line refered to connecting block linea1:[block1, block2]
            arrows_blocks_refs:{},
            
        }
    }

    //Create element to add to drag
    callbackAddtoDrag=(value)=>{
        var childs = this.state.childrenDrag
        childs.push(value)
        this.setState({childrenDrag:childs})
    }

    //Attach new moved one to drop zone
    callbackAttachToDrop=(value, style, type)=>{
        var style_block=this.state.dropStyle        
        var childs_drag = this.state.childrenDrag
        var childs_drop = this.state.childrenDrop
        var childs_drop_type = this.state.childrenDropType
        childs_drop_type[value]=type
        var new_childs_drag = childs_drag.filter(x=>x!==value)        
        childs_drop.push(value)        
        style_block[value]=style
        this.setState({childrenDrag: new_childs_drag, childrenDrop: childs_drop, dropStyle:style_block, childrenDropType:childs_drop_type})
    }

    //Save block ref dragging now 
    callbackRefBlock=(block)=>{
        this.setState({refBlockId:parseFloat(block.id.split('-')[2]),refBlock:block})
    } 
    
    callbackDeleteDropBlock=(block_id)=>{
        var childs_drop = this.state.childrenDrop
        var new_childs_drop = childs_drop.filter(x=>x!==block_id)    
        if(Object.keys(this.state.arrows).length>0 && this.state.block_arrows[block_id]){
            var new_state = deleteArrowsConnectingBlock(
                this.state.arrows,
                this.state.block_arrows,
                this.state.arrows_blocks, 
                block_id)
            this.setState(Object.assign({},new_state,{childrenDrop:new_childs_drop}))
        }else 
            this.setState({childrenDrop:new_childs_drop})
    }

    //Delete block
    callbackDeleteDragBlock=(value)=>{
        var childs_drag = this.state.childrenDrag
        var new_childs_drag = childs_drag.filter(x=>x!==value)
        this.setState({childrenDrag:new_childs_drag})
    }

    drawLine(conn_click, button_refs, id_b1, id_b2, block_click){
        const line_id = Math.random() 
        var arrows = this.state.arrows
        var arrows_blocks_refs = this.state.arrows_blocks_refs
        arrows[line_id] = connectElements(conn_click[0], conn_click[1], this.refDropZone)
        arrows_blocks_refs[line_id] = button_refs
        var b_arrows = this.state.block_arrows                    
        var a_blocks = this.state.arrows_blocks
        b_arrows[id_b1] ? b_arrows[id_b1].push(line_id) : b_arrows[id_b1] = [line_id]
        b_arrows[id_b2] ? b_arrows[id_b2].push(line_id) : b_arrows[id_b2] = [line_id]
        a_blocks[line_id] = [id_b1,id_b2]
        var blocks_refs = this.state.blocks_refs
        blocks_refs[id_b1] = block_click[0]
        blocks_refs[id_b2] = block_click[1]
        this.setState({
            arrows:arrows,
            block_arrows: b_arrows,
            arrows_blocks: a_blocks,
            arrows_blocks_refs:arrows_blocks_refs,
            button_refs:[],
            blocks_refs: blocks_refs,
            conn_click:[],
            conn_blocks:[]})
    }

    //Connects two block
    callbackDraw=(blockRef, button, buttonRef)=>{      
        var conn_click = this.state.conn_click        
        var block_click = this.state.conn_blocks
        var button_refs = this.state.button_refs
        //check n. of click for connect
        if(conn_click.length===0 && block_click.length===0){ //NO  BLOCK
            conn_click.push(button)
            block_click.push(blockRef)
            button_refs.push(buttonRef)
        }else if(conn_click.length===1 && conn_click.length<2 && block_click[0]!== blockRef ){ //1 Block
            conn_click.push(button)
            block_click.push(blockRef)
            button_refs.push(buttonRef)
            if(conn_click[0].target.id===conn_click[1].target.id){  //HAVE CLICKED ON THE SAME BLOCK                                
                this.setState({conn_click:[], conn_blocks: [], button_refs:[]})
            }else{  //TWO DIFFERENT BLOCK CLICKED
                //check if there is already an arrow between this blocks
                const id_b1 = parseFloat(block_click[0].id.split('-')[2])
                const id_b2 = parseFloat(block_click[1].id.split('-')[2])
                console.log(id_b1)
                if(!checkBlocksAlreadyConnected(this.state.block_arrows,id_b1,id_b2)){
                    if(button_refs[0].attributes.type.value ==='bottom' && button_refs[1].attributes.type.value ==='top'){
                        const b2_arrows = this.state.block_arrows[id_b2]
                        var count = 0
                        if(b2_arrows){
                            b2_arrows.forEach(arrow=>{if(this.state.arrows_blocks[arrow][1] === id_b2) count+=1})
                        }
                        if(count===0)
                            this.drawLine(conn_click, button_refs, id_b1, id_b2, block_click)
                        else{
                            if(this.state.childrenDropType[id_b2]==='MERGE')
                                this.drawLine(conn_click, button_refs, id_b1, id_b2, block_click)
                            else console.log('SET ERROR FOR MULTIPLE INPUT')
                        }
                    }
                    else this.setState({ button_refs:[], conn_click:[], conn_blocks:[]})                    
                }
            }
        }else{ //there are already two clicks, refresh state
            conn_click=[]
            conn_click.push(button)
            block_click=[]
            block_click.push(blockRef)
            button_refs=[]
            button_refs.push(buttonRef)
            this.setState({conn_click:conn_click, conn_blocks:block_click, button_refs:button_refs})
        }        
    }


    callbackOnMove=(transform)=>{
        var block = this.state.refBlockId //this block
        var arrow_ids = this.state.block_arrows[block] //arrows connected to this block
        var arrows = this.state.arrows
        var arrows_refs = this.state.arrows_blocks_refs
        if(arrow_ids){
            arrow_ids.forEach(arrow_id=>{
                if(Object.keys(this.state.arrows).length>=1 && arrow_id){
                    var arrows_blocks  = this.state.arrows_blocks[arrow_id]
                    //check if block 1 of the arrow is moving                
                    var arrow = arrows[arrow_id] //This arrow
                    if(arrows_blocks[0]===block){                        
                        var button_ref = arrows_refs[arrow_id][0]                        
                        arrow.x1 = transform[0] + button_ref.offsetLeft + button_ref.offsetWidth/2
                        arrow.y1 = transform[1] + button_ref.offsetTop + button_ref.offsetHeight + button_ref.offsetHeight/2
                    }else{//otherwise block 2 of the arrow is moving
                        button_ref = arrows_refs[arrow_id][1]
                        arrow.x2 = transform[0] + button_ref.offsetLeft + button_ref.offsetWidth/2
                        arrow.y2 = transform[1]  - button_ref.offsetHeight -button_ref.offsetHeight/2
                    }
                    arrows[arrow_id] = arrow
                }
            })
            this.setState({arrows: arrows})
        }
    }

    deleteArrow(arrow){
        var new_state = deleteArrowById(
            arrow,
            this.state.arrows,
            this.state.arrows_blocks,
            this.state.block_arrows)
        this.setState(Object.assign({},new_state,{text_line_style:{display:'none'}}))
        
    }

    getChildNodeRef(item){      
        if(this.state.block_arrows[item]){
            var arrows = this.state.block_arrows[item] //arrows for this node
            var parents = []
            arrows.forEach(a=>{
                if(item === this.state.arrows_blocks[a][1]) //If item is a childs
                    parents.push(this.state.blocks_refs[this.state.arrows_blocks[a][0]]) //Get its parent 
            }) //for each arrow take the child
            return parents
        }
        return []
    }

    render(){
        return(<>            
                <div id='drag-zone' ref={this.refDragZone}>                    
                {this.state.childrenDrag.map((item, index) => (
                <Block                             
                    id={`start-node-${item}`}                            
                    block_type={DRAG_TYPE[index]}
                    key={item}
                    dragZone={true}                            
                    parentCallbackDeleteDragBlock={this.callbackDeleteDragBlock}
                    parentCallbackAddToDrag={this.callbackAddtoDrag} 
                    parentCallbackAttachToDrop={this.callbackAttachToDrop}/>))
                }
                </div>              
                <div id='drop-zone' ref={this.refDropZone}>                    
                    {this.state.childrenDrop.map((item) => (
                        <Block
                            id={`start-node-${item}`}
                            childsRef={this.getChildNodeRef(item)}
                            block_type={this.state.childrenDropType[item]}
                            parentCallbackRefBlock={this.callbackRefBlock}
                            parentCallbackDeleteDropBlock={this.callbackDeleteDropBlock}
                            parentCallbackDraw = {this.callbackDraw}
                            parentCallbackOnMove = {this.callbackOnMove}
                            style_block={{transform:this.state.dropStyle[item]}}
                            key={item}
                            dragZone={false}/>
                    ))}
                     <svg width='100%' height='100%' ref={this.refSvg} className='svg-container'>
                     <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                        refX="0" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" />
                        </marker>
                    </defs>
                        {Object.keys(this.state.arrows).map(item=>(
                        <line
                            className='arrow'
                            key={item}
                            onMouseOver={(e)=>{
                                console.log(e.clientX)
                                var offsetLeft = this.refDragZone.current.offsetWidth
                                this.setState({text_line_style:{display:'block'}, left_text:e.clientX-offsetLeft, top_text:e.clientY - 10})
                            }}
                            onMouseLeave={(e)=>{
                                this.setState({text_line_style:{display:'none'}})
                            }}
                            onClick={()=>this.deleteArrow(item)}
                            stroke='black'
                            x1={this.state.arrows[item].x1} 
                            y1={this.state.arrows[item].y1}
                            x2={this.state.arrows[item].x2}
                            y2={this.state.arrows[item].y2}
                            strokeWidth='2.5'
                            markerEnd={`url(#arrowhead)`}/>
                        ))}
                        <text style={this.state.text_line_style} x={this.state.left_text} y={this.state.top_text}>Click to delete</text>
                    </svg>
                </div>
                
            </>
        )
    }

}
export default DragAndDropZone