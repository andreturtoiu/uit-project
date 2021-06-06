import React from 'react'
import Block from '../draggable-nodes/Block'
import '../styles/css/homepage.css'
import { connectElements, deleteArrowById } from '../utils/utils_arrows'
import { checkBlocksAlreadyConnected, deleteArrowsConnectingBlock } from '../utils/utils_block'
import DragAndDropZone from './DragAndDropZone'

const DRAG_TYPE = ['BEGIN','PREPROCESSING','AGGREGATE','FILTER', 'RESAMPLE', 'SELECT', 'MERGE','END']
const DRAG_IDS = DRAG_TYPE.map(x=>Math.random())
export class HomePage extends React.Component{
    constructor(props){        
        super(props)      
    }


    render(){
        return(
            <div style={{display:'flex', flexDirection:'row'}}>
               <DragAndDropZone/>                
            </div>
        )
    }
}
export default HomePage
