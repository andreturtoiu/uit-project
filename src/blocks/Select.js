import { FaTrash } from 'react-icons/fa';
import ConnectButton, { connectButton } from './utils';
import { Button, Form, Col, Row } from 'react-bootstrap';
import { useRef } from 'react';
import React, { useState, useEffect } from 'react';

export default function Select(props) {
  const [labels, setLabels] = useState(props.currParams.labels)

  useEffect(() => {
    props.paramsCallBack({'labels': labels})
  }, []);

  const handleChange = (event) => {
    const col = event.target.name
    var newLabels = labels
    if (!labels.some((label) => label === col)) {
      newLabels = [...newLabels, col]
    }
    else if (col !== 'date' && labels.some((label) => label === col)) {
      newLabels = newLabels.filter((label) => label !== col)
    }
    if(!newLabels.some(l=>l==='date')){
      newLabels = ['date', ...newLabels]
    }
    setLabels(newLabels)
    props.paramsCallBack({'labels': newLabels})
  }

const showForm = () => {
  if(!props.value){
    return <p>Nessuna opzione</p>
  }
  return (
    <div className='block-div-agg'>

      <p>Select columns</p>
      <Form>
        <div className='row' style={{ justifyContent: 'space-between', marginTop: '1rem' }}>
          {props.value.listColumns().filter((label) => label !== 'date').map((col) => (
            <div key={`default-${col}`} className="mb-3">
              <Form.Check
                type={'checkbox'}
                id={`default-${col}`}
                label={col}
                name={col}
                defaultChecked={labels.some((label)=> label === col)}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>

      </Form>


    </div>)
  }

  return(showForm())

}