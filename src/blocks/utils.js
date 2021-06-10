import React from 'react'
import {Button} from 'react-bootstrap' 


export default function ConnectButton(props){
    return(
        <Button
          ref = {props.childComponentRef}
          type= {props.position}
          variant="outline-primary"
          className={`btn btn-light p-2 rounded-circle btn-lg ${props.cssStyle}`}
          id={Math.random()}
          onMouseDown={e=>{e.stopPropagation();e.nativeEvent.stopImmediatePropagation();        
          }}
          onClick={e=>{e.preventDefault(); props.parentCallbackDraw(e, props.childComponentRef) }}>            
        </Button>
    )
}
