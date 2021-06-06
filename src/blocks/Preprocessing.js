import { FaTrash } from 'react-icons/fa';
import ConnectButton, { connectButton } from './utils';
import { Button, Form, Col, Row } from 'react-bootstrap';

export default function Preprocessing(props){
  const callbackDraw=(e)=> {
    props.parentCallbackDraw(e)
  }     
console.log(props)
  return(
    <div className='block-div-agg'>      
    <ConnectButton cssStyle='conn-btn-agg-top' parentCallbackDraw={callbackDraw}/>
    <div>      
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
      <p>Preprocessing select function</p>
      <div>
        <select id = "dropdown" defaultValue={'log'}>
          {['log', 'exp'].map((fun) => <option value={fun}>{fun}</option>)}
        </select>
      </div>
  </div>
      <ConnectButton cssStyle='conn-btn-agg-bottom' parentCallbackDraw={callbackDraw}/>
  </div>)

}