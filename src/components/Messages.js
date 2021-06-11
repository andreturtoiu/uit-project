export default function Messages(props){
    return(
        <div>
        <div className='state-header'>
            <h5 style={{textAlign:'center', paddingTop:'0.3em'}}>State of program</h5>
        </div>
        <div className='messages-zone' style={{display:'flex', flexDirection:'column'}} ref={props.inner}>
            
            {props.messages&&
                props.messages.map((message) => <p key={Math.random()} className='message' style={{color:message[1]==='error'? 'red':'black'}}>{message[0]}</p>)}                
        </div>
        </div>
    )
}