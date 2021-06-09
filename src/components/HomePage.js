import React from 'react'
import Block from '../draggable-nodes/Block'
import '../styles/css/homepage.css'
import { connectElements, deleteArrowById } from '../utils/utils_arrows'
import { checkBlocksAlreadyConnected, deleteArrowsConnectingBlock } from '../utils/utils_block'
import DragAndDropZone from './DragAndDropZone'
import Modal from 'react-bootstrap/Modal'
import Begin from '../blocks/Begin'
import Select from '../blocks/Select'
import Filter from '../blocks/Filter'
import Resample from '../blocks/Resample'
import Preprocessing from '../blocks/Preprocessing'
import Aggregate from '../blocks/Aggregate'

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

    renderModal() {
        return <Modal show={this.state.showModal} onHide={() => this.setState({showModal: false })}>
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
                <button variant="secondary" onClick={() => this.setState({showModal: false })}>
                    Close
                </button>

            </Modal.Footer>
        </Modal>
    }

    openModal = (callerRef, callerParams, setCallerParams) => {
        this.setState({
            showModal: true, 
            callerModal: callerRef, 
            callerParams: callerParams, 
            setCallerParams: setCallerParams})
    }

    render(){
        return(
            
            <div style={{display:'flex', flexDirection:'row'}}>
                {this.state.showModal && this.state.callerModal && this.renderModal()}
               <DragAndDropZone parentCallbackOpenModal = {this.openModal} />                
            </div>
        )
    }
}
export default HomePage
