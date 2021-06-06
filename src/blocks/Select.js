import { FaTrash } from 'react-icons/fa';
import ConnectButton, { connectButton } from './utils';
import { Button, Form, Col, Row } from 'react-bootstrap';
import { useRef } from 'react';

export default function Select(props){
  const top_button = useRef(null)
  const bottom_button = useRef(null)
  
  const callbackDraw=(e, ref)=> {        
    props.parentCallbackDraw(e,ref.current)
  }     
  return(
    <div className='block-div-agg'>      
    <ConnectButton childComponentRef={top_button} cssStyle='conn-btn-agg-top' parentCallbackDraw={callbackDraw}/>
    <div>
      <p>Select columns</p>
      <Button
          block_id={props.blockRef?props.blockRef.id:''}
          variant="light"
          style={{marginTop:0}}
          onMouseDown={e=>{ e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}
          onClick={e=>{
            e.preventDefault();
            props.parentCallbackTrash()
          }
          }><FaTrash className='fa-trash'/>
      </Button>
    <Form>
    <div className='row' style={{justifyContent:'space-between', marginTop:'1rem'}}>
    {['x', 'y','z', 'w'].map((type) => (
      <div key={`default-${type}`} className="mb-3">
        <Form.Check 
          type={'checkbox'}
          id={`default-${type}`}
          label={type}
        />
      </div>
    ))}
    </div>
  </Form>
  </div>
      <ConnectButton childComponentRef={bottom_button} cssStyle='conn-btn-agg-bottom' parentCallbackDraw={callbackDraw}/>
  </div>)

}