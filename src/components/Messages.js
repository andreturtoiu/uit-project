export default function Messages(props){
    return(
        <div>
        <div className='message-header'>
            TERMINAL
        </div>
        <div className='messages-zone' style={{display:'flex', flexDirection:'column'}} ref={props.inner}>
            
            {props.messages&&
                props.messages.map((message) => <p className='message' style={{color:message[1]==='error'? 'red':'black'}}>{message[0]}</p>)}                
        </div>
        </div>
    )
}