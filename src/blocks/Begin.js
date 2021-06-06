
import { Button, Form } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import ConnectButton, { connectButton } from './utils';

export default function Begin(props){
    const callbackDraw=(e)=> {
      props.parentCallbackDraw(e)
    }     

    return(
      <div className='block-div-begin'>
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
          <Form>
            <Form.Group>
              <Form.File id="exampleFormControlFile1" label="Example file input" />
            </Form.Group>
          </Form>       
        </div>     
        <ConnectButton cssStyle='conn-btn-begin' parentCallbackDraw={callbackDraw}/>
    </div>
    
    )
  }