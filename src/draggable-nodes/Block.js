import { Button } from 'react-bootstrap';
import React from 'react';
import BlockClass from './BlockClass';
import Begin from '../blocks/Begin';
import End from '../blocks/End';
import Select from '../blocks/Select';
import Filter from '../blocks/Filter';
import Resample from '../blocks/Resample';
import Preprocessing from '../blocks/Preprocessing';
import Aggregate from '../blocks/Aggregate';
import { FaTrash, FaSearch, FaEdit } from 'react-icons/fa';
import ConnectButton, { getStyle } from '../blocks/utils';


class Block extends BlockClass{
    constructor(props){        
        super(props); 
        this.top_button = React.createRef()
        this.bottom_button = React.createRef()
        this.blockRef = this.handleRef
        this.state={
            blockRef:this.handleRef,
            parentRefs: this.props.parentRefs
        }      
    }
    
    componentDidUpdate(){
        console.log(this.props.parentRefs)
    }
   
    trashCallback=()=>{        
        this.props.parentCallbackDeleteDropBlock(parseFloat(this.handleRef.current.id.split('-')[2]))
    }

    drawCallback=(e,ref)=>{
        this.props.parentCallbackDraw(this.blockRef.current,e,ref.current,parseFloat(this.handleRef.current.id.split('-')[2]) )
    }

    prova =()=>{console.log('prova')}

    getBlockByType(type){     
    const { params, value } = this.state
    switch (type) {
        case "BEGIN": return (
        <Begin 
            value={value} 
            parentCallbackTrash={this.trashCallback} 
            parentCallbackDraw={this.drawCallback}/>)
        case "END": return (
        <End 
            value={value} 
            parentCallbackTrash={this.trashCallback} 
            parentCallbackDraw={this.drawCallback}/>)
        case "SELECT": return (
        <Select 
            value={value} 
            parentCallbackTrash={this.trashCallback} 
            parentCallbackDraw={this.drawCallback}/>)
        case "FILTER": return (
        <Filter 
            value={value}
            parentCallbackTrash={this.trashCallback} 
            parentCallbackDraw={this.drawCallback}/>)
        case "RESAMPLE": return  (
        <Resample
            blockRef={this.handleRef}
            value={value}
            parentCallbackTrash={this.trashCallback} 
            parentCallbackDraw={this.drawCallback}/>)
        case "PREPROCESSING": return (
        <Preprocessing
            blockRef={this.handleRef}
            value={value}
            parentCallbackTrash={this.trashCallback} 
            parentCallbackDraw={this.drawCallback}/>)
        case "AGGREGATE":  return (
        <Aggregate
            blockRef={this.handleRef}
            value={value}
            parentCallbackTrash={this.trashCallback} 
            parentCallbackDraw={this.drawCallback}/>)
        default: return <p>DEFAULT</p>  
        }
    }

    renderContentByType(){
         {/*!this.props.dragZone&&
                this.getBlockByType(this.props.block_type)*/}
    }  

 

    renderBlock(type){
        return (
            <div className={`general-block ${this.props.block_type}`}              
                onClick={e=>{ e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}
                onDoubleClick={e=>{ e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}
                >
                {this.props.block_type!=='BEGIN'&&
                <ConnectButton 
                    position='top'
                    cssStyle='conn-btn-top'
                    childComponentRef={this.top_button}
                    parentCallbackDraw={this.drawCallback}/>}
                <div>
                    <p style={{fontSize:'0.9em', fontWeight:900, color:'white'}}>{this.props.block_type}</p>
                    <div style={{display:'flex', justifyContent:'space-around'}}>
                    <FaTrash className='fa-icon'
                            block_id={this.props.blockRef?this.props.blockRef.id:''}                            
                            onMouseDown={e=>{ e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}
                            onClick={e=>{
                                e.preventDefault();
                                this.props.parentCallbackDeleteDropBlock(parseFloat(this.handleRef.current.id.split('-')[2]))
                            }}/>
                        <FaSearch className='fa-icon' onClick={e=>{e.preventDefault();console.log('oo')}}/>
                        <FaEdit className='fa-icon'/>
                    </div>
                </div>
                {this.props.block_type!=='END'&&
                <ConnectButton 
                    position='bottom'                    
                    cssStyle={`${this.props.block_type!=='BEGIN' ? 'conn-btn-bottom' : 'conn-btn-begin-bottom'}`}
                    childComponentRef={this.bottom_button}
                    parentCallbackDraw={this.drawCallback}/>}
            </div>
        )
    }

    render(){
        return (
            super.render(this.renderBlock())
        )
        
    }    
    
    
}

export default Block
