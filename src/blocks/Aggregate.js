import { FaTrash } from 'react-icons/fa';
import ConnectButton, { connectButton } from './utils';
import { Button, Form, Col, Row } from 'react-bootstrap';

export default function Aggregate(props){
  const callbackDraw=(e)=> {
    props.parentCallbackDraw(e)
  }     
console.log(props)
  return(
    <div className='block-div-agg'>      
    <ConnectButton cssStyle='conn-btn-agg-top' parentCallbackDraw={callbackDraw}/>
    <div>
      <p>Aggregate by columns</p>
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
      <ConnectButton cssStyle='conn-btn-agg-bottom' parentCallbackDraw={callbackDraw}/>
  </div>)

}