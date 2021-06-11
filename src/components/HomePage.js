import React from 'react'
import '../styles/css/homepage.css'
import Chart from "react-apexcharts";
import DragAndDropZone from './DragAndDropZone'
import Modal from 'react-bootstrap/Modal'
import {Button, Form} from 'react-bootstrap'
import Begin from '../blocks/Begin'
import Select from '../blocks/Select'
import Filter from '../blocks/Filter'
import Resample from '../blocks/Resample'
import Preprocessing from '../blocks/Preprocessing'
import Aggregate from '../blocks/Aggregate'
import { convertToChart } from '../utils/show_utils'
import ReactApexChart from 'react-apexcharts';

export class HomePage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showModal: false,
            callerModal: null,
            callerParams: {},
            blockValueCallbacks: {},
            chartType: 'line'
        }
    }

    renderForm() {
        const { callerModal, callerParams } = this.state
        const value = callerModal.current.getParentValues()[0]

        switch (callerModal.current.props.block_type) {
            case "BEGIN": return <Begin fileName={callerModal.current.getInputFileName()} valueCallBack={(df, name) => this.setHomePageValue(df, name)} />
            case "END": return <p>END</p>//<End value={value} />
            case "SELECT": return <Select value={value} currParams={callerParams} paramsCallBack={(params) => this.setHomePageParams(params)} />
            case "FILTER": return <Filter value={value} currParams={callerParams} paramsCallBack={(params) => this.setHomePageParams(params)} />
            case "RESAMPLE": return <Resample value={value} currParams={callerParams} paramsCallBack={(params) => this.setHomePageParams(params)} />
            case "PREPROCESSING": return <Preprocessing value={value} currParams={callerParams} paramsCallBack={(params) => this.setHomePageParams(params)} />
            case "COMBINE": return <Aggregate value={value} currParams={callerParams} paramsCallBack={(params) => this.setHomePageParams(params)} />
            case "MERGE": return <p>MERGING</p>
            default: return <p>DEFAULT</p>
        }
    }


    setHomePageParams = (params) => { this.setState({ callerParams: params }) }

    setHomePageValue = (value, name) => { this.setState({ value: value, fileName: name }) }

    renderParamsModal() {
        return <Modal show={this.state.showParamsModal} onHide={() => this.setState({ showParamsModal: false })}>
            <Modal.Header closeButton>
                <Modal.Title>Set Parameters</Modal.Title>
            </Modal.Header>
            <Modal.Body>{this.renderForm()}</Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => {
                    if (this.state.callerModal.current.props.block_type === "BEGIN")
                        this.state.callerModal.current.setBeginValue(this.state.value, this.state.fileName)
                    else this.state.setCallerParams(this.state.callerParams)                    
                    this.setState({ showParamsModal: false})
                }}>
                    Save
                </Button>
                <Button variant="secondary" onClick={() => this.setState({ showParamsModal: false})}>
                    Close
                </Button>

            </Modal.Footer>
        </Modal>
    }

    renderSingleTypeChart(series, categories) {
        var options = {
            stroke:{ show: true,width: 1},
            xaxis: {
                categories: categories
            },
            dataLabels: { enabled: false},
              
        }
        return (
            <div style={{marginLeft:'4em'}}> 
                {this.state.chartType&&
                <ReactApexChart
                    type={this.state.chartType}
                    options={options}
                    series={series}
                    width="100%"
                />}
                {this.getSingleFormChartType()}
            </div>
        )
    }

    getSingleFormChartType() {
        return (
            <Form>
                <Form.Check
                    inline
                    type='radio'
                    id='line'
                    label='Line'
                    name='type'
                    checked={this.state.chartType === 'line'}
                    onChange={this.handleRadioChange}
                />
                <Form.Check
                    inline
                    type='radio'
                    id='bar'
                    label='Bar'
                    name='type'
                    checked={this.state.chartType === 'bar'}
                    onChange={this.handleRadioChange}
                />
            </Form>)
    }


    renderGraph() {
        const block_type = this.state.callerModal.current.props.block_type
        const graph = this.state.callerModal.current.getValue()
        if (!graph) {
            if(block_type === "BEGIN"){
                return <p>No dataset provided. Please load a proper csv file</p>
            }
            return <p>Encountered errors in previous blocks. Please check parameters</p>
        }
        if (typeof graph === 'string') {
            return <p>{graph}</p>
        }
        if (graph.listColumns().length < 2) {
            return <p>No available data to display</p>
        }
        const chart_data = convertToChart(graph)
        var series = chart_data.series
        //options.series = chart_data.series
        const params = this.state.callerParams
        var chart = this.renderSingleTypeChart(series, chart_data.categories)
        return <div>
            {chart}           
            <div style={{marginTop:'2em'}}>
            {this.renderParamsOnGraphModal(params, this.state.callerModal.current.props.block_type)}
            </div>            
        </div>
    }

    handleRadioChange=(e)=>{console.log("RADIO CHANGE", e.target.id);this.setState({chartType:e.target.id})}

    renderParamsOnGraphModal = (params, block_type) => {
        switch (block_type) {
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
            <Modal size='lg' show={this.state.showGraphModal} onHide={() => this.setState({ showGraphModal: false, chartType: 'line'  })}>
                <Modal.Header closeButton>
                    <Modal.Title>Show Graph</Modal.Title>
                </Modal.Header>
                <Modal.Body>{this.renderGraph()}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.setState({ showGraphModal: false, chartType: 'line'  })}>
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
            setCallerParams: setCallerParams
        })
    }

    openGraphModal = (callerRef, callerParams) => {
        this.setState({
            showGraphModal: true,
            callerModal: callerRef,
            callerParams: callerParams
        })
    }

    render() {
        return (

            <div style={{ display: 'flex', flexDirection: 'row' }}>
                {this.state.showParamsModal && this.state.callerModal && this.renderParamsModal()}
                {this.state.showGraphModal && this.state.callerModal && this.renderGraphModal()}
                <DragAndDropZone
                    parentCallbackOpenParamsModal={this.openParamsModal}
                    parentCallbackOpenGraphModal={this.openGraphModal}
                />
            </div>
        )
    }
}
export default HomePage