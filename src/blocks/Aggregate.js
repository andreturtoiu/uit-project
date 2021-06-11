import { FaTrash } from 'react-icons/fa';
import ConnectButton, { connectButton } from './utils';
import { Button, Form, Col, Row } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';

export default function Aggregate(props){
  const [labels, setLabels] = useState(props.currParams.labels)
  const [aggFun, setAggFun] = useState(props.currParams.aggFun)

  const isChecked = (col) => {
    return col === 'date' || labels.some((label) => label === col)
  }

  useEffect(() => {
    props.paramsCallBack({ 'labels': labels, 'aggFun': aggFun })
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
    setLabels(newLabels)
    props.paramsCallBack({ 'labels': newLabels, 'aggFun': aggFun })
  }

  const renderOptions = () => {
    return <Form>
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
  }

  const onChangeFun = (event) => {
    setAggFun(event.target.value)
    props.paramsCallBack({ 'labels': labels, 'aggFun': event.target.value })
  }

  const renderSelection = () => {
    const funs = ["sum", "min"]
    return <select id="dropdown" onChange={onChangeFun} defaultValue={aggFun}>
      {funs.map((fun) => <option value={fun}>{fun}</option>)}
    </select>
  }

  return (
    <div className='block-div-agg'>
      <p>Select</p>
      {renderOptions()}
      {renderSelection()}
    </div>
  )

}