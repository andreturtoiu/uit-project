
import { Form } from 'react-bootstrap';

export default function Begin(props){
    return(
      <div className='block-div-begin'>
        <div>  
          <Form>
            <Form.Group>
              <Form.File id="exampleFormControlFile1" label="Example file input" />
            </Form.Group>
          </Form>       
        </div>     
    </div>
    
    )
  }