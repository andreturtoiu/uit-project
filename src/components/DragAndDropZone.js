import React, { createRef } from "react";
import { FaInfoCircle } from "react-icons/fa";
import Block from '../draggable-nodes/Block'
import '../styles/css/homepage.css'
import { connectElements, deleteArrowById, getFirstPositionArrow, setMousePosition } from '../utils/utils_arrows'
import {changeColor, checkBlocksAlreadyConnected, deleteArrowsConnectingBlock } from '../utils/utils_block'
import Messages from "./Messages";
import OverlayBlocks from '../blocks/overlayInfo'

const DRAG_TYPE = ['BEGIN','PREPROCESSING','COMBINE','FILTER', 'RESAMPLE', 'SELECT', 'MERGE','END']
const DRAG_IDS = DRAG_TYPE.map(x=>Math.random())

export class DragAndDropZone extends React.Component{
    constructor(props){        
        super(props)
        DRAG_IDS.map(x=>this[x]=React.createRef()) //Create ref for each block rendered in drag zone
        this.refDropZone = React.createRef()
        this.refDragZone = React.createRef()
        this.refSvg = React.createRef()
        this.messages = React.createRef()
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
            x1:0, x2:0, y1:0, y2:0,
            messages: []
        }
    }

    componentDidUpdate(_prevProps, prevState){
        //Sets focus on last messagge in TERMINAL
        this.messages.current.scrollTop = this.messages.current.scrollHeight - this.messages.current.clientHeight;        
    }


    //Create element to add to drag
    callbackAddtoDrag=(value)=>{
        var childs = this.state.childrenDrag
        childs.push(value)
        this[value]=React.createRef() //create ref for the new node
        this.setState({childrenDrag:childs})
    }

    //Attach new moved one to drop zone
    callbackAttachToDrop=(value, style, type)=>{
        var date = new Date()
        var style_block=this.state.dropStyle        
        var childs_drag = this.state.childrenDrag
        var childs_drop = this.state.childrenDrop
        var childs_drop_type = this.state.childrenDropType
        childs_drop_type[value]=type
        var new_childs_drag = childs_drag.filter(x=>x!==value)        
        childs_drop.push(value)        
        style_block[value]=style
        var messages = this.state.messages        
        messages.push([
            date.toLocaleTimeString() + ': '
            +this.state.childrenDropType[value] + ' added', 'message'])
        
        this.setState({childrenDrag: new_childs_drag,
            conn_click:[],
            conn_blocks:[],
            button_refs:[], 
            childrenDrop: childs_drop,
            dropStyle:style_block,
            messages:messages,
            childrenDropType:childs_drop_type})
        
    }

    //Save block ref dragging now 
    callbackRefBlock=(block)=>{
        this.setState({refBlockId:parseFloat(block.id.split('-')[2]),refBlock:block})
    } 
    
    callbackDeleteDropBlock=(block_id)=>{
        var date = new Date()
        var childs_drop = this.state.childrenDrop
        var new_childs_drop = childs_drop.filter(x=>x!==block_id)
        var messages = this.state.messages
        messages.push([
            date.toLocaleTimeString()
            +': '+this.state.childrenDropType[block_id]+' deleted', 'message'])
        if(Object.keys(this.state.arrows).length>0 && this.state.block_arrows[block_id]){
            var new_state = deleteArrowsConnectingBlock(
                this.state.arrows,
                this.state.block_arrows,
                this.state.arrows_blocks, 
                block_id)
            this.setState(Object.assign({},new_state,{childrenDrop:new_childs_drop, messages:messages}))
        }else 
            this.setState({childrenDrop:new_childs_drop, messages:messages})
        
    }

    //Delete block
    callbackDeleteDragBlock=(value)=>{
        var childs_drag = this.state.childrenDrag
        var new_childs_drag = childs_drag.filter(x=>x!==value)
        this.setState({childrenDrag:new_childs_drag})
    }

    drawLine(conn_click, button_refs, id_b1, id_b2, block_click){
        var date = new Date()
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
        var messages = this.state.messages
        messages.push([
            date.toLocaleTimeString()
                +': Connected '+this.state.childrenDropType[id_b1]+ ' with '+this.state.childrenDropType[id_b2], 'message'])
        this.setState({
            messages:messages,
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
        var date = new Date()
        var conn_click = this.state.conn_click        
        var block_click = this.state.conn_blocks
        var button_refs = this.state.button_refs
        var messages = this.state.messages
        //check n. of click for connect
        if(conn_click.length===0 && block_click.length===0){ //NO  BLOCK
            conn_click.push(button)
            block_click.push(blockRef)
            button_refs.push(buttonRef)
            const pos_arrow_1 = getFirstPositionArrow(button, this.refDropZone)
            this.setState({firstClick:true, x1:pos_arrow_1.x1, y1:pos_arrow_1.y1})
        }else if(conn_click.length===1 && conn_click.length<2){ //1 Block     
            conn_click.push(button)
            block_click.push(blockRef)
            button_refs.push(buttonRef)        
            if(button_refs[0]===button_refs[1] || block_click[0]===blockRef){  //HAVE CLICKED ON THE SAME BLOCK                 
                changeColor(button_refs[0],button_refs[1])
                messages.push([
                date.toLocaleTimeString() + 
                ': You are trying to connect the same block.', 'error'])                
                this.setState({conn_click:[], conn_blocks: [], button_refs:[], messages:messages, firstClick:false})
                
            }else{  //TWO DIFFERENT BLOCK CLICKED
                //check if there is already an arrow between these blocks
                const id_b1 = parseFloat(block_click[0].id.split('-')[2])
                const id_b2 = parseFloat(block_click[1].id.split('-')[2])                            
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
                            else{       
                                changeColor(button_refs[0],button_refs[1])                         
                                messages.push(
                                    [date.toLocaleTimeString() + 
                                    ': Just the MERGE block allows multiple input connections.', 
                                    'error'])
                                this.setState({messages:messages, firstClick:false})
                            } 
                        }
                        this.setState({
                            x2:0, y2:0,
                            firstClick:false})
                    }
                    else{
                        changeColor(button_refs[0],button_refs[1])
                        messages.push(
                            [date.toLocaleTimeString() + 
                            ': You are trying to connect incompatible buttons ', 'error'])
                        this.setState({ button_refs:[], conn_click:[], conn_blocks:[], messages:messages,x2:0, y2:0, firstClick:false})}
                }else{
                    changeColor(button_refs[0],button_refs[1])
                    messages.push(
                        [date.toLocaleTimeString() + 
                        ': Blocks already connected ', 'error'])
                    this.setState({ button_refs:[], conn_click:[], conn_blocks:[], messages:messages,x2:0, y2:0, firstClick:false})
                }
            }
        }else{ //there are already two clicks, refresh state
            conn_click=[]
            conn_click.push(button)
            block_click=[]
            block_click.push(blockRef)
            button_refs=[]
            button_refs.push(buttonRef)
            this.setState({conn_click:conn_click, conn_blocks:block_click, button_refs:button_refs, firstClick:false})
        }     
    }


    callbackOnMove=(transform, ref)=>{        
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
                        arrow.x1 = transform[0] + ref.clientWidth 
                        arrow.y1 = transform[1] + ref.clientHeight/2
                    }else{//otherwise block 2 of the arrow is moving
                        button_ref = arrows_refs[arrow_id][1]
                        arrow.x2 = transform[0] - button_ref.offsetWidth - button_ref.clientWidth+25
                        arrow.y2 = transform[1] + ref.clientHeight/2 
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

    getParentNodesRef(item){      
        if(this.state.block_arrows[item]){
            var arrows = this.state.block_arrows[item] //arrows for this node
            var parents = []
            arrows.forEach(a=>{                
                if(item === this.state.arrows_blocks[a][1]) //If item is a childs
                    parents.push(this[this.state.arrows_blocks[a][0]]) //Get its parent ref
            }) //for each arrow take the child
            return parents
        }
        return []
    }

    openParamsModalOnHomePage = (callerRef, params, setParams) =>{
        this.props.parentCallbackOpenParamsModal(this[callerRef], params, setParams)
    } 

    openGraphModalOnHomePage = (callerRef, params, setParams) =>{        
        const value = this[callerRef].current.getValue() 
        const date = new Date()
        const block_type = this[callerRef].current.props.block_type
        var messages = this.state.messages
        var error = ""
        if(!value){
            if(block_type === 'BEGIN')
                error = "No dataset provided. Please load a proper csv file"
            else
                error = "Encountered errors in previous blocks. Please check parameters"
            messages.push([ date.toLocaleTimeString()+': '+error, 'error' ])
        }
        else if(typeof value === 'string'){
            messages.push([ date.toLocaleTimeString()+': '+value, 'error' ])
        }
        else if(value.listColumns().length < 2){
            error = "No available data to display"
            messages.push([ date.toLocaleTimeString()+': '+error, 'error' ])
        }
        
        this.setState({ messages:messages })
        this.props.parentCallbackOpenGraphModal(this[callerRef], params, setParams)
    } 

  
    onMouseMove=(e)=>{            
        e.preventDefault()
        if(this.state.firstClick){
            this.setState({x2:e.clientX - this.refDragZone.current.clientWidth, y2:e.clientY})
        }
    }

    onClickSvg=(e)=>{
        e.preventDefault()
        this.setState({
            x2:0, y2:0,
            button_refs:[],
            conn_click:[],
            conn_blocks:[],
            firstClick:false})
    }

    render(){
        return(<>
                <div>
                    <div className='message-header'>                        
                        <h5 style={{textAlign:'center', paddingTop:'0.3em'}}>List of draggable blocks</h5>
                        <OverlayBlocks/>
                    </div>
                    <div id='drag-zone' ref={this.refDragZone} style={{display:'flex', flexDirection:'column'}}>
                        
                        {this.state.childrenDrag.map((item, index) => (
                        <Block                             
                            id={`start-node-${item}`}
                            ref={this[item]}
                            block_type={DRAG_TYPE[index]}
                            key={item}
                            dragZone={true}                            
                            parentCallbackDeleteDragBlock={this.callbackDeleteDragBlock}
                            parentCallbackAddToDrag={this.callbackAddtoDrag} 
                            parentCallbackAttachToDrop={this.callbackAttachToDrop}/>))
                        }
                    </div>
                    <Messages inner={this.messages} messages={this.state.messages}/>
                </div>
                <div id='drop-zone' ref={this.refDropZone}>
                    {this.state.childrenDrop.map((item) => (
                        <Block
                            id={`start-node-${item}`}
                            ref={this[item]}
                            parentRefs={this.getParentNodesRef(item)}
                            block_type={this.state.childrenDropType[item]}
                            parentCallbackRefBlock={this.callbackRefBlock}
                            parentCallbackDeleteDropBlock={this.callbackDeleteDropBlock}
                            parentCallbackDraw = {this.callbackDraw}
                            parentCallbackOnMove = {this.callbackOnMove}
                            parentCallbackOpenParamsModal = {this.openParamsModalOnHomePage}
                            parentCallbackOpenGraphModal = {this.openGraphModalOnHomePage}
                            style_block={{transform:this.state.dropStyle[item], position:'fixed'}}
                            key={item}
                            dragZone={false}/>
                    ))}
                     <svg width='100%'height='100%' ref={this.refSvg} className='svg-container'
                      onClick={e=>this.onClickSvg(e)}
                      onMouseMove={e=>this.onMouseMove(e)}
                      >
                     <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7"
                        refX="0" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" />
                        </marker>
                        <marker id="arrowhead2" markerWidth="10" markerHeight="7"
                        refX="0" refY="3.5" orient="auto" fill='#b5b7ba' stroke='#b5b7ba'>
                        <polygon points="0 0, 10 3.5, 0 7" />
                        </marker>
                    </defs>
                        {Object.keys(this.state.arrows).map(item=>(
                        <line
                            className='arrow'
                            key={item}
                            onMouseOver={(e)=>{
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
                        {this.state.firstClick&&this.state.x1&&this.state.x2&&this.state.y1&&this.state.y2&&
                        <line
                            className='arrow-temp'
                            stroke-dasharray="4"
                            key={Math.random()}                           
                            stroke='#b5b7ba'
                            x1={this.state.x1} 
                            y1={this.state.y1}
                            x2={this.state.x2}
                            y2={this.state.y2}
                            strokeWidth='2.5'
                            markerEnd={`url(#arrowhead2)`}/>
                        }
                        <text style={this.state.text_line_style} x={this.state.left_text} y={this.state.top_text}>Click to delete</text>
                    </svg>
                </div>
                
            </>
        )
    }

}
export default DragAndDropZone