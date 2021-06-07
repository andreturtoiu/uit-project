import React from 'react'
import '../styles/css/draggable.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { parseTransform } from '../utils/utils_block';
import { getStyle } from '../blocks/utils';

class BlockClass extends React.Component {
    constructor(props){        
        super(props); 
        this.handleRef = React.createRef()
    }
    //setHandleRef = ref => {this.handleRef = ref;}
      
    /*
    * Handler mouse down event 
    */
    handleMouseDown = event => {
        const {target, clientX, clientY} = event; //position of pointer inside the box relative to the view    
        const { offsetTop, offsetLeft } = target; //the start position of the box relative to the view
        const { left, top } = this.handleRef.current.getBoundingClientRect(); //position of the box relative to the view - changes
        this.dragStartLeft = left - offsetLeft;
        this.dragStartTop = top - offsetTop;
        this.dragStartX = clientX;
        this.dragStartY = clientY;
        if(!this.props.dragZone){ //Drop area
            this.props.parentCallbackRefBlock(this.handleRef.current)
        } 
        if(this.props.dragZone) //Drag area
            this.props.parentCallbackAddToDrag(Math.random())
        window.addEventListener('mousemove', this.handleMouseMove, false);
        window.addEventListener('mouseup', this.handleMouseUp, false);    
    }

    /*
    * Avoid blocks to go out of drag-zone
    */  
    checkBoundingMove(x,y){
        var drop = document.getElementById('drop-zone') //drag-zone
        var bounding = this.handleRef.current.getBoundingClientRect()
        var left = bounding.left
        var right = bounding.right    
        var top = bounding.top
        var bottom = bounding.bottom
        var offsetRight = drop.offsetWidth+drop.offsetLeft
        if(!this.props.dragZone ){           
            if(left<drop.offsetLeft) //Left border of drop-zone
                this.handleRef.current.style.transform = `translate(${x+(drop.offsetLeft+10-left)}px, ${y}px)`
            if(right>offsetRight) //right border of drop-zone = offsetleft+offsetright            
                this.handleRef.current.style.transform = `translate(${x-(right-offsetRight+20)}px, ${y}px)`
            if(top<drop.offsetTop) //sottrarre da y quanto sto sforando
                this.handleRef.current.style.transform = `translate(${x}px, ${y-(top-drop.offsetTop-10)}px)`
            if(bottom>drop.offsetHeight)//aggiungere il tanto che sto sforando
                this.handleRef.current.style.transform = `translate(${x}px, ${y+(drop.offsetHeight-bottom-20)}px)`
            if(left<drop.offsetLeft && top<drop.offsetTop) // Left-top
                this.handleRef.current.style.transform = `translate(${x+(drop.offsetLeft+10-left)}px, ${y-(top-drop.offsetTop-10)}px)`
            if(right>offsetRight && top<drop.offsetTop) //Right-top
                this.handleRef.current.style.transform = `translate(${x-(right-offsetRight+20)}px, ${y-(top-drop.offsetTop-10)}px)`
            if(bottom>drop.offsetHeight&&left<drop.offsetLeft) //Bottom-left
                this.handleRef.current.style.transform = `translate(${x+(drop.offsetLeft+10-left)}px, ${y+(drop.offsetHeight-bottom-20)}px)`
            if(bottom>drop.offsetHeight&&right>offsetRight) //Bottom-right
            this.handleRef.current.style.transform = `translate(${x-(right-offsetRight+20)}px, ${y+(drop.offsetHeight-bottom-20)}px)`            
            this.props.parentCallbackOnMove(parseTransform(this.handleRef.current.style.transform))
        }    
    }

    //moves block on mouse move
    handleMouseMove = ({ clientX, clientY }) => {
        var x = this.dragStartLeft + clientX - this.dragStartX
        var y = this.dragStartTop + clientY - this.dragStartY    
        this.handleRef.current.style.transform = `translate(${x}px, ${y}px)`;
        this.checkBoundingMove(x,y)
    }

    handleMouseUp = (ev) => {
        const dragZone = document.getElementById('drag-zone')    
        const dragZoneWidht = dragZone.clientWidth           
        if(this.props.dragZone){
            if(ev.clientX>dragZoneWidht){
                var x_y = parseTransform(this.handleRef.current.style.transform)
                // x - offset of the drag zone - avoids translate into drop zone from x_start_drop + x_offset_drag
                var style = `translate(${x_y[0]-dragZone.offsetWidth+10}px, ${x_y[1]}px)`
                //Pass style because it lost the ref to this div and create a new one that should have same style
                this.props.parentCallbackAttachToDrop(parseFloat(this.handleRef.current.id.split('-')[2]), style, this.props.block_type)
            }else this.props.parentCallbackDeleteDragBlock(parseFloat(this.handleRef.current.id.split('-')[2]))
        }       
        window.removeEventListener('mousemove', this.handleMouseMove, false)
        window.removeEventListener('mouseup', this.handleMouseUp, false)
    }  
    
    prova(){
        console.log('PROVA')
    }


    render(args){
        return (
            <div
            id={this.props.id}
            key={this.props.key}
            block_type = {this.props.block_type}
            className={`${this.props.dragZone? ('start-node-drag '+ this.props.block_type): 'start-node-drop'}`}
            onMouseDown={e=>this.handleMouseDown(e)}
            ref={this.handleRef}>
                {!this.props.dragZone&&<div>{args}</div>}
                <div style={{height:'90%'}}>
                    {this.props.dragZone&&
                    <p style={{
                            fontWeight:'bold',
                            fontSize:'1em',
                            color:'white'}}>
                        {this.props.block_type}
                    </p>}
                </div>
            </div>
            )
        }
}


export default BlockClass;
