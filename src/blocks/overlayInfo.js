import { ListGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaInfoCircle } from "react-icons/fa";

export default function OvelayBlocks(props) {
    return (

        <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={<Tooltip id="button-tooltip" {...props} >
                <div className='tooltip-div'>
                    <ListGroup>
                        <ListGroup.Item style={{backgroundColor:'#c70202', color:'white'}}><p><span style={{fontWeight:'bold'}}>BEGIN</span>:  upload you csv dataset</p></ListGroup.Item>
                        <ListGroup.Item style={{backgroundColor:'#FF7B89', color:'white'}}><p><span style={{fontWeight:'bold'}}>COMBINE</span>: combine two or more columns in one</p></ListGroup.Item>
                        <ListGroup.Item style={{backgroundColor:'#34124d', color:'white'}}><p><span style={{fontWeight:'bold'}}>PREPROCESSING</span>: apply exp or log functions</p></ListGroup.Item>
                        <ListGroup.Item style={{backgroundColor:'#e78300', color:'white'}}><p><span style={{fontWeight:'bold'}}>FILTER</span>: filter your dataset between two dates</p></ListGroup.Item>
                        <ListGroup.Item style={{backgroundColor:'#990f77', color:'white'}}><p><span style={{fontWeight:'bold'}}>RESAMPLE</span>: aggregate data based on time sample</p></ListGroup.Item>
                        <ListGroup.Item style={{backgroundColor:'#878787', color:'white'}}><p><span style={{fontWeight:'bold'}}>SELECT</span>: select which columns you want</p></ListGroup.Item>
                        <ListGroup.Item style={{backgroundColor:'#0082b5', color:'white'}}><p><span style={{fontWeight:'bold'}}>MERGE</span>: merge two or more flows output</p></ListGroup.Item>
                        <ListGroup.Item style={{backgroundColor:'#4b8008', color:'white'}}><p><span style={{fontWeight:'bold'}}>END</span>: this could help you to better understand where a flow finishes</p></ListGroup.Item>
                    </ListGroup>
                    <p>Eeach block shows you a chart</p>
                </div>
            </Tooltip>
            }
        >
            <FaInfoCircle />
        </OverlayTrigger>
    )
}