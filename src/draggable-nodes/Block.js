import { Tooltip, OverlayTrigger } from 'react-bootstrap';
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
            value: null
        }      
    }
    
    
    setBeginValue = (df, file) => {
        this.setState({value: df, fileName: file})
    }
    
    componentDidMount(){
        console.log("COMPONENT DID MOUNT")
        var default_params = {
            'labels': [],
            'begin': '2000-01-01 00:00:00', 
            'end': '2100-01-01 00:00:00', 
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
        var {params} = this.state
        //console.log("CALLING SYNCPARAMS", params, parent_params)
        if(!params){
            return
        }
        const parent_values = this.getParentValues()
        if(!parent_values){
            return
        }
        const parent_value = parent_values[0]
        if(!parent_value){
            return
        }
       // console.log("SYNCED PARAMS")
       if(params.labels){
        params.labels = params.labels.filter(l => parent_value.listColumns().some(pl => pl === l))
        
       }
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
        console.log("INIZIO GET VALUE")
        if(this.props.block_type === "BEGIN"){
            return this.state.value
        }
        const parent_values = this.getParentValues()
        console.log("PARENT VALUES", parent_values)
        //console.log("PARENT VALUES", parent_values)
        if(!parent_values){
            console.log("NO PARENT VALUES, RETURN!")
            return []
        }
        const value = parent_values[0]
        console.log("VALUE", value)
        if(!value){
            return null
        }
        
        const {params} = this.state
        switch (this.props.block_type) {
            case "END": return value
            case "SELECT": return evalSelect(value, params)
            case "FILTER": return evalFilter(value, params)
            case "RESAMPLE": return evalResample(value, params)
            case "PREPROCESSING": return evalPreprocessing(value, params)
            case "AGGREGATE": return evalAggregate(value, params)
            case "MERGE": return evalMerge(parent_values)
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

    renderTooltip = (props) => (        
        <Tooltip id="button-tooltip" {...props}>
          <div className='tooltip-div'>
            {this.state.params&&
                <div>
                    <h5>Setted params</h5>
                    <p>Click on magnifying glass button to see more</p>
                </div>}
            {this.state.params&&this.renderParamsOnTooltip()}
          </div>
        </Tooltip>
      );

    renderParamsOnTooltip = () => {
        const {params} = this.state
        switch(this.props.block_type){
        case "BEGIN": return <p>File selected: {this.state.fileName || "None"}</p>
            case "SELECT": return <p>Columns selected: {params.labels.map(l => <p>{l}</p>)}</p>
            case "PREPROCESSING": return <p>Function selected: {params.prpFun}</p>
            case "AGGREGATE": return <p>
                Executed "{params.aggFun}" on: {params.labels.map(l => <p>{l}</p>)}
            </p>
            case "FILTER": return <p>Filtered from {params.begin} to {params.end}</p>
            case "RESAMPLE": return <p>Resampled on {params.sample} as {params.resampleFun}</p>
            default: return <p></p>
        }
    
    }

    getInputFileName = () => {
        return this.state.fileName
    }

    renderBlock(type){
        return (
            <div className={`general-block ${this.props.block_type}`}              
                onClick={e=>{ e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}
                onDoubleClick={e=>{ e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}
                >                
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
                        <OverlayTrigger
                            placement="right"
                            delay={{ show: 250, hide: 400 }}
                            overlay={this.renderTooltip}
                        >
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
                        </OverlayTrigger>
                        {this.props.block_type!=='MERGE' && this.props.block_type!=='END' && <FaEdit className='fa-icon'
                        onMouseDown={e=>{ e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}
                        onMouseMove={e=>{ e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}
                        onClick={e=>{
                            e.preventDefault(); 
                            this.syncParamsFromParent()
                            this.props.parentCallbackOpenParamsModal(this.handleRef.current.id.split('-')[2], this.state.params, this.setParams)
                            }}
                        />}
                    </div>
                </div>
                {this.props.block_type!=='BEGIN'&& this.props.block_type!=='END' && 
                <ConnectButton 
                    position='top'
                    cssStyle='conn-btn-top'
                    childComponentRef={this.top_button}
                    parentCallbackDraw={this.drawCallback}/>}
                {this.props.block_type!=='END'&&
                <ConnectButton 
                    position='bottom'                    
                    cssStyle={`${this.props.block_type!=='BEGIN' ? 'conn-btn-bottom' : 'conn-btn-begin-bottom'}`}
                    childComponentRef={this.bottom_button}
                    parentCallbackDraw={this.drawCallback}/>}
                {this.props.block_type==='END'&&
                <ConnectButton 
                    position='top'                    
                    cssStyle='conn-btn-end-top'
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
