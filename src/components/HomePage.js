import React from 'react'
import '../styles/css/homepage.css'
import Chart from "react-apexcharts";
import DragAndDropZone from './DragAndDropZone'
import Modal from 'react-bootstrap/Modal'
import {Button} from 'react-bootstrap'
import Begin from '../blocks/Begin'
import Select from '../blocks/Select'
import Filter from '../blocks/Filter'
import Resample from '../blocks/Resample'
import Preprocessing from '../blocks/Preprocessing'
import Aggregate from '../blocks/Aggregate'
import { convertToChart } from '../utils/show_utils'

const DRAG_TYPE = ['BEGIN','PREPROCESSING','AGGREGATE','FILTER', 'RESAMPLE', 'SELECT', 'MERGE','END']
const DRAG_IDS = DRAG_TYPE.map(x=>Math.random())
export class HomePage extends React.Component{
    constructor(props){        
        super(props)      
        this.state = {
            showModal: false,
            callerModal: null,
            callerParams: {},
            blockValueCallbacks: {},
        }
    }

    renderForm() {
        //const { type, params, value } = this.state
        const {callerModal, callerParams} = this.state
        const value = callerModal.current.getParentValues()[0]
        console.log("CALLER ATTRIBUTES", callerModal)
        
        switch (callerModal.current.props.block_type) {            
            case "BEGIN": return <Begin fileName={callerModal.current.getInputFileName()} valueCallBack={(df, name) => this.setHomePageValue(df, name)}/>
            case "END": return <p>END</p>//<End value={value} />
            case "SELECT": return <Select value={value} currParams={callerParams} paramsCallBack={(params) => this.setHomePageParams(params)} />
            case "FILTER": return <Filter value={value} currParams={callerParams} paramsCallBack={(params) => this.setHomePageParams(params)} />
            case "RESAMPLE": return <Resample value={value} currParams={callerParams} paramsCallBack={(params) => this.setHomePageParams(params)} />
            case "PREPROCESSING": return <Preprocessing value={value} currParams={callerParams} paramsCallBack={(params) => this.setHomePageParams(params)} />
            case "AGGREGATE": return <Aggregate value={value} currParams={callerParams} paramsCallBack={(params) => this.setHomePageParams(params)} />
            case "MERGE": return <p>MERGING</p>
            default: return <p>DEFAULT</p>
        }
    }


    setHomePageParams = (params) => {
        this.setState({callerParams: params})
    }

    setHomePageValue = (value, name) => {
        console.log("SETHOMEPAGEVALUE", value.listColumns())
        value.show()
        this.setState({value: value, fileName: name})
    }

    renderParamsModal() {
        return <Modal show={this.state.showParamsModal} onHide={() => this.setState({showParamsModal: false })}>
            <Modal.Header closeButton>
                <Modal.Title>Set Parameters</Modal.Title>
            </Modal.Header>
            <Modal.Body>{this.renderForm()}</Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => {
                    console.log("ON CLICK SAVE")
                    if(this.state.callerModal.current.props.block_type === "BEGIN"){
                        console.log("IF BEGIN", this.state.callerModal.current.props.block_type)
                        this.state.callerModal.current.setBeginValue(this.state.value, this.state.fileName)
                    }
                    else{
                        console.log("ELSE BEGIN", this.state.callerModal.current.props.block_type)
                        this.state.setCallerParams(this.state.callerParams)
                    }
                    console.log("DONE")
                    this.setState({showParamsModal: false })
                    }}>
                    Save
                </Button>
                <Button variant="secondary" onClick={() => this.setState({showParamsModal: false })}>
                    Close
                </Button>

            </Modal.Footer>
        </Modal>
    }

    renderGraph(){
        console.log("RENDER GRAPH PRE VALUE")
        const graph = this.state.callerModal.current.getValue() 
        console.log("RENDER GRAPH", graph)
        if(!graph){
            return <p>Nessun valore da mostrare</p>
        }
        if(graph.listColumns().length < 2){
            return <p>Nessun valore da mostrare</p>
        }
        console.log("CALLER VALUES", graph)       
        const chart_data = convertToChart(graph)

        var options =  {
            chart: {
              id: "line"
            },
            xaxis: {
              categories: chart_data.categories
            }
          }
        var series  =  chart_data.series
        //options.series = chart_data.series
        const params = this.state.callerParams
        console.log(params)
        return <div>
            <Chart
              options={options}
              series={series}
              type="line"  //TODO: aggiungere switch tra "line" e "bar"
              width="100%"
            />
            {this.renderParamsOnGraphModal(params, this.state.callerModal.current.props.block_type)}
        </div>
    }

    renderParamsOnGraphModal = (params, block_type) => {
        switch(block_type){
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

    renderGraphModal() {
        return (
            <Modal size='lg' show={this.state.showGraphModal} onHide={() => this.setState({showGraphModal: false })}>
                <Modal.Header closeButton>
                    <Modal.Title>Show Graph</Modal.Title>
                </Modal.Header>
                <Modal.Body>{this.renderGraph()}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.setState({showGraphModal: false })}>
                        Close
                    </Button>

                </Modal.Footer>
            </Modal>)
    }

    openParamsModal = (callerRef, callerParams, setCallerParams) => {
        this.setState({
            showParamsModal: true, 
            callerModal: callerRef, 
            callerParams: callerParams, 
            setCallerParams: setCallerParams})
    }

    openGraphModal = (callerRef, callerParams) => {
        this.setState({
            showGraphModal: true, 
            callerModal: callerRef, 
            callerParams: callerParams})
    }

    render(){
        return(
            
            <div style={{display:'flex', flexDirection:'row'}}>
                {this.state.showParamsModal && this.state.callerModal && this.renderParamsModal()}
                {this.state.showGraphModal && this.state.callerModal && this.renderGraphModal()}
               <DragAndDropZone 
                    parentCallbackOpenParamsModal = {this.openParamsModal}
                    parentCallbackOpenGraphModal = {this.openGraphModal}
                />                
            </div>
        )
    }
}
export default HomePage