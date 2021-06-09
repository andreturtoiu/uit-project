import { Button } from 'react-bootstrap';
import React from 'react';
import BlockClass from './BlockClass';
import { FaTrash, FaSearch, FaEdit } from 'react-icons/fa';
import ConnectButton, { getStyle } from '../blocks/utils';
import DataFrame from 'dataframe-js';
import { evalSelect, evalFilter, evalResample, evalPreprocessing, evalAggregate, evalMerge } from '../blocks/Evaluations';

const data = [
    { 'date': '2021-01-01 10:03:18', 'x': 1, 'y': 2, 'z': 8 },
    { 'date': '2021-01-01 10:05:18', 'x': 3, 'y': 5, 'z': 9 },
    { 'date': '2021-01-02 10:02:18', 'x': 5, 'y': 7, 'z': 4 },
    { 'date': '2021-01-02 10:03:18', 'x': 6, 'y': 8, 'z': 2 },
    { 'date': '2021-01-03 10:04:18', 'x': 8, 'y': 3, 'z': 1 },
]
const df = new DataFrame(data)

class Block extends BlockClass{
    constructor(props){        
        super(props); 
        this.top_button = React.createRef()
        this.bottom_button = React.createRef()
        this.blockRef = this.handleRef

        this.state={
            blockRef:this.handleRef,
            parentRefs: this.props.parentRefs,
            params: {},
            value: df
        }      
    }
    
    
    componentDidMount(){
        
        var default_params = {
            'labels': df.listColumns(),
            'begin': df.select('date').toArray()[0][0], 
            'end': df.select('date').toArray().reverse()[0][0],
            'sample': 'day',
            'resampleFun': 'sum',
            'prpFun': 'log',
            'aggFun': 'sum'
        }
        this.setState({params: default_params})
    }

    getParentParams = () => {
        //console.log("PARENT REFS", this.props.parentRefs)
        if(this.props.parentRefs){
            return this.props.parentRefs.map(p => p.current.getParams())
        }
        else{
            return [{}]
        }
    }
    
    syncParamsFromParent = () => {
        const parent_params = this.getParentParams()[0]
        var {params} = this.state
        //console.log("CALLING SYNCPARAMS", params, parent_params)
        if(!params || !parent_params){
            return
        }
       // console.log("SYNCED PARAMS")
        params.labels = params.labels.filter(l => parent_params.labels.some(pl => pl === l))
        this.setParams(params)
    }

    componentDidUpdate(prevProps){
        if(prevProps.parentRefs!=this.props.parentRefs){
            this.syncParamsFromParent()
        }
    }

    trashCallback=()=>{        
        this.props.parentCallbackDeleteDropBlock(parseFloat(this.handleRef.current.id.split('-')[2]))
    }
    
    drawCallback=(e,ref)=>{
        this.props.parentCallbackDraw(this.blockRef.current,e, ref.current)
    }

    prova =()=>{console.log('chiamato da HomePage: prova')}

    getParentValues = () => {
        //console.log("PARENT REFS", this.props.parentRefs)
        if(this.props.parentRefs){
            return this.props.parentRefs.map(p => p.current.getValue())
        }
        else{
            return []
        }
    }
    
    getValue = () => {
        const parent_values = this.getParentValues()
        //console.log("PARENT VALUES", parent_values)
        if(!parent_values){
            return []
        }
        const value = parent_values[0]
        const {params} = this.state
        switch (this.props.block_type) {
            case "BEGIN": return this.state.value
            case "END": return this.state.value
            case "SELECT": return evalSelect(value, params)
            case "FILTER": return evalFilter(value, params)
            case "RESAMPLE": return evalResample(value, params)
            case "PREPROCESSING": return evalPreprocessing(value, params)
            case "AGGREGATE": return evalAggregate(value, params)
            case "MERGE": return evalMerge(parent_values[0], parent_values[1])
            default: return this.state.value
        }

    }

    getParams = () => {
        return this.state.params
    }

    setParams = (params) => {
        this.setState({params: params})
    }

    showGraph = () => {
        console.log(this.getValue())
    }

    showParams = () => {
        console.log(this.state.params)
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
                            onMouseMove={e=>{ e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}
                            onClick={e=>{
                                e.preventDefault();
                                this.props.parentCallbackDeleteDropBlock(parseFloat(this.handleRef.current.id.split('-')[2]))
                            }}/>
                        <FaSearch className='fa-icon'
                            onMouseDown={e=>{ e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}
                            onMouseMove={e=>{ e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}
                            onMouseOver={e=>{
                                e.stopPropagation(); 
                                e.nativeEvent.stopImmediatePropagation(); 
                                this.showParams();
                            }}
                            onClick={e=>{
                                e.preventDefault(); 
                                this.props.parentCallbackOpenGraphModal(this.handleRef.current.id.split('-')[2], this.state.params, this.setParams)
                                }}/>
                        <FaEdit className='fa-icon'
                        onMouseDown={e=>{ e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}
                        onMouseMove={e=>{ e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}
                        onClick={e=>{
                            e.preventDefault(); 
                            this.syncParamsFromParent()
                            this.props.parentCallbackOpenParamsModal(this.handleRef.current.id.split('-')[2], this.state.params, this.setParams)
                            }}
                        />
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
