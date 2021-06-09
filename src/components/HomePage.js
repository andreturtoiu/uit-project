import React from 'react'
import '../styles/css/homepage.css'
import Chart from "react-apexcharts";
import DragAndDropZone from './DragAndDropZone'
import Modal from 'react-bootstrap/Modal'
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
            case "BEGIN": return <Begin/>
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

    renderParamsModal() {
        return <Modal show={this.state.showParamsModal} onHide={() => this.setState({showParamsModal: false })}>
            <Modal.Header closeButton>
                <Modal.Title>Set Parameters</Modal.Title>
            </Modal.Header>
            <Modal.Body>{this.renderForm()}</Modal.Body>
            <Modal.Footer>
                <button variant="primary" onClick={() => {
                    this.state.setCallerParams(this.state.callerParams)
                    this.setState({showModal: false })
                    }}>
                    Save
                </button>
                <button variant="secondary" onClick={() => this.setState({showParamsModal: false })}>
                    Close
                </button>

            </Modal.Footer>
        </Modal>
    }

    renderGraph(){
        const graph = this.state.callerModal.current.getValue()        
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
              type="line"
              width="100%"
            />
            <p>PARAMS: {JSON.stringify(params)}</p>
        </div>
    }

    renderGraphModal() {
        return (
            <Modal size='lg' show={this.state.showGraphModal} onHide={() => this.setState({showGraphModal: false })}>
                <Modal.Header closeButton>
                    <Modal.Title>Show Graph</Modal.Title>
                </Modal.Header>
                <Modal.Body>{this.renderGraph()}</Modal.Body>
                <Modal.Footer>
                    <button variant="secondary" onClick={() => this.setState({showGraphModal: false })}>
                        Close
                    </button>

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