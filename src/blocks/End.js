import { FaTrash } from 'react-icons/fa';
import ConnectButton, { connectButton } from './utils';
import { Button } from 'react-bootstrap';

export default function End(props){
  const callbackDraw=(e)=> {
    props.parentCallbackDraw(e)
  }     

  return(
  <div className='block-div-end'>    
    <ConnectButton cssStyle='conn-btn-end' parentCallbackDraw={callbackDraw}/>
    <div>
      <Button
          className='trash-button'
          variant="light"
          onMouseDown={e=>{ e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}
          onClick={e=>{
            e.preventDefault();
            props.parentCallbackTrash()
          }
          }><FaTrash className='fa-trash'/>          
      </Button>
      <p style={{color:'white', fontWeight:'bold'}}>END</p>
    </div>
    
  </div>
  
  )
}