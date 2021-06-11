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

class Block extends BlockClass {
    constructor(props) {
        super(props);
        this.top_button = React.createRef()
        this.bottom_button = React.createRef()
        this.blockRef = this.handleRef

        this.state = {
            blockRef: this.handleRef,
            parentRefs: this.props.parentRefs,
            params: {},
            value: null
        }
    }


    setBeginValue = (df, file) => {
        this.setState({ value: df, fileName: file })
    }

    componentDidMount() {
        var default_params = {
            'labels': [],
            'resampleFun': 'sum',
            'prpFun': 'log',
            'aggFun': 'sum'
        }
        this.setState({ params: default_params })
    }



    getParentParams = () => {
        if (this.props.parentRefs) {
            return this.props.parentRefs.map(p => p.current.getParams())
        }
        else {
            return [{}]
        }
    }

    syncParamsFromParent = () => {
        var { params } = this.state
        if (!params) {
            return
        }
        const parent_values = this.getParentValues()
        if (!parent_values) {
            return
        }
        const parent_value = parent_values[0]
        if (!parent_value) {
            return
        }
        // console.log("SYNCED PARAMS")
        if (params.labels) {
            params.labels = params.labels.filter(l => parent_value.listColumns().some(pl => pl === l))
        }

        if (this.props.block_type === 'FILTER') {
            const dates = parent_value.select('date')
            const parent_begin = dates.getRow(0).get('date')
            parent_value.show()
            const parent_end = dates.sortBy('date', true).getRow(0).get('date')
            parent_value.show()
            if (params.begin) 
                params.begin = params.begin < parent_begin ? parent_begin : params.begin
            else params.begin = parent_begin 

            if (params.end)  params.end = params.end < parent_end ? parent_end : params.end 
            else params.end = parent_end
        }

        if(this.props.block_type === 'RESAMPLE') {
            const date_length = parent_value.getRow(0).get('date').length
            const curr_sample = params.sample
            var valid_samples = []
            // check valid resamples
            if (date_length >= 16) { valid_samples.push('minute') }
            if (date_length >= 13) { valid_samples.push('hour') }
            if (date_length >= 10) { valid_samples.push('day') }
            if (date_length >= 7) { valid_samples.push('month') }
            if (date_length >= 4) { valid_samples.push('year') }
            // check if curr_sample is ok
            if(!valid_samples.some(s => s === curr_sample)){
                // our current sample is not ok, we have to update it
                if (date_length === 16) { params.sample = 'minute' }
                if (date_length === 13) { params.sample = 'hour' }
                if (date_length === 10) { params.sample = 'day' }
                if (date_length === 7) { params.sample = 'month' }
                if (date_length === 4) { params.sample = 'year' }
            }
        }

        this.setParams(params)

    }

    componentDidUpdate(prevProps) {
        if (prevProps.parentRefs != this.props.parentRefs) 
            this.syncParamsFromParent()
        
    }

    trashCallback = () => {
        this.props.parentCallbackDeleteDropBlock(parseFloat(this.handleRef.current.id.split('-')[2]))
    }

    drawCallback = (e, ref) => {
        this.props.parentCallbackDraw(this.blockRef.current, e, ref.current)
    }

    getParentValues = () => {
        if (this.props.parentRefs) 
            return this.props.parentRefs.map(p => p.current.getValue())        
        else return []        
    }

    getValue = () => {
        if (this.props.block_type === "BEGIN") return this.state.value    
        const parent_values = this.getParentValues()
        //check if string error
        const errors = parent_values.filter(p => typeof p === 'string')
        if (errors.length > 0) return errors[0]
        if (!parent_values)  return []

        const value = parent_values[0]
        
        if (!value)  return null
        
        const { params } = this.state
        
        switch (this.props.block_type) {
            case "END": return value
            case "SELECT": return evalSelect(value, params)
            case "FILTER": return evalFilter(value, params)
            case "RESAMPLE": return evalResample(value, params)
            case "PREPROCESSING": return evalPreprocessing(value, params)
            case "COMBINE": return evalAggregate(value, params)
            case "MERGE": return evalMerge(parent_values)
            default: return this.state.value
        }

    }

    getParams = () => { return this.state.params  }
    setParams = (params) => { this.setState({ params: params }) }

    renderTooltip = (props) => (        
        <Tooltip id="button-tooltip" {...props} >
          <div className='tooltip-div'>
            {this.state.params&&<p style={{fontSize:'1.2em'}}>Setted params:</p>}
            {this.state.params&&this.renderParamsOnTooltip()}
            <p style={{fontSize:'0.8rem',fontStyle:'italic'}}>Hint: Click on magnifying glass button to see more</p>
          </div>
        </Tooltip>
      );

    renderParamsOnTooltip = () => {
        const {params} = this.state
        switch(this.props.block_type){
        case "BEGIN": return <><p>Uploaded file: <span style={{fontWeight:800}}>{this.state.fileName || "None"}</span></p></>
            case "SELECT": return <><p>Selected columns: {params.labels.lenght>1 ?  params.labels.map(l => <span style={{fontWeight:800}}>{l}</span>): <span style={{fontWeight:800}}>None</span>}</p></>
            case "PREPROCESSING": return <p>Function selected: <span style={{fontWeight:800}}>{params.prpFun}</span></p>
            case "COMBINE": return <p>
                Executed "{params.aggFun}" on: {params.labels.lenght>1 ? params.labels.map(l => <span style={{fontWeight:800}}>{l}</span>): <span style={{fontWeight:800}}>None</span>}
            </p>
            case "FILTER": return <p>Filtered from <span style={{fontWeight:800}}>{params.begin}</span> to <span style={{fontWeight:800}}>{params.end}</span></p>
            case "RESAMPLE": return <p>Resampled on <span style={{fontWeight:800}}>{params.sample ? params.sample : 'undefined'}</span> as <span style={{fontWeight:800}}>{params.resampleFun}</span></p>
            default: return <p></p>
        }
    
    }

    getInputFileName = () => {
        return this.state.fileName
    }

    renderBlock(type) {
        return (
            <div className={`general-block ${this.props.block_type}`}
                onClick={e => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}
                onDoubleClick={e => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}
            >
                <div>
                    <p style={{ fontSize: '0.9em', fontWeight: 900, color: 'white' }}>{this.props.block_type}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <FaTrash className='fa-icon'
                            block_id={this.props.blockRef ? this.props.blockRef.id : ''}
                            onMouseDown={e => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}
                            onMouseMove={e => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}
                            onClick={e => {
                                e.preventDefault();
                                this.props.parentCallbackDeleteDropBlock(parseFloat(this.handleRef.current.id.split('-')[2]))
                            }} />
                        <OverlayTrigger
                            placement="right"
                            delay={{ show: 250, hide: 400 }}
                            overlay={this.renderTooltip}
                        >
                            <FaSearch className='fa-icon'
                                onMouseDown={e => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}
                                onMouseMove={e => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}
                                onMouseOver={e => {
                                    e.stopPropagation();
                                    e.nativeEvent.stopImmediatePropagation();
                                    this.showParams();
                                }}
                                onClick={e => {
                                    e.preventDefault();
                                    this.props.parentCallbackOpenGraphModal(this.handleRef.current.id.split('-')[2], this.state.params, this.setParams)
                                }} />
                        </OverlayTrigger>
                        {this.props.block_type !== 'MERGE' && this.props.block_type !== 'END' && <FaEdit className='fa-icon'
                            onMouseDown={e => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}
                            onMouseMove={e => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}
                            onClick={e => {
                                e.preventDefault();
                                this.syncParamsFromParent()
                                this.props.parentCallbackOpenParamsModal(this.handleRef.current.id.split('-')[2], this.state.params, this.setParams)
                            }}
                        />}
                    </div>
                </div>
                {this.props.block_type !== 'BEGIN' && this.props.block_type !== 'END' &&
                    <ConnectButton
                        position='top'
                        cssStyle='conn-btn-top'
                        childComponentRef={this.top_button}
                        parentCallbackDraw={this.drawCallback} />}
                {this.props.block_type !== 'END' &&
                    <ConnectButton
                        position='bottom'
                        cssStyle={`${this.props.block_type !== 'BEGIN' ? 'conn-btn-bottom' : 'conn-btn-begin-bottom'}`}
                        childComponentRef={this.bottom_button}
                        parentCallbackDraw={this.drawCallback} />}
                {this.props.block_type === 'END' &&
                    <ConnectButton
                        position='top'
                        cssStyle='conn-btn-end-top'
                        childComponentRef={this.bottom_button}
                        parentCallbackDraw={this.drawCallback} />}
            </div>
        )
    }

    render() {
        return (
            super.render(this.renderBlock())
        )

    }


}

export default Block
