import { FaTrash } from 'react-icons/fa';
import ConnectButton, { connectButton } from './utils';
import { Button, Form, Col, Row } from 'react-bootstrap';

export default function Filter(props){
  const callbackDraw=(e)=> {
    props.parentCallbackDraw(e)
  }     

  return(
    <div className='block-div-filter'>      
    <ConnectButton cssStyle='conn-btn-filter-top' parentCallbackDraw={callbackDraw}/>
      <div>
        <Button
            variant="light"
            onMouseDown={e=>{ e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}
            onClick={e=>{
              e.preventDefault();
              props.parentCallbackTrash()
            }
            }><FaTrash className='fa-trash'/>
        </Button>
        <Form style={{width:'15rem'}}>
          <Form.Group as={Row} controlId="formPlaintextEmail">
            <Form.Label column sm="2">
              From
            </Form.Label>
            <Col sm="10">
            <Form.Control type="date" name="dob" placeholder="From" />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formPlaintextPassword">
          <Form.Label column sm="2">
            To
          </Form.Label>
          <Col sm="10">
            <Form.Control type="date" name="dob" placeholder="From" />
          </Col>
          </Form.Group>
        </Form>
      </div>
      <ConnectButton cssStyle='conn-btn-filter-bottom' parentCallbackDraw={callbackDraw}/>
  </div>)

}