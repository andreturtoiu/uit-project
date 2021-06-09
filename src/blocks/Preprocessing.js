import { FaTrash } from 'react-icons/fa';
import ConnectButton, { connectButton } from './utils';
import { Button, Form, Col, Row } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';

export default function Preprocessing(props) {

  const [prpFun, setPrpFun] = useState(props.currParams.prpFun)
  const [labels, setLabels] = useState(props.currParams.labels)

  useEffect(() => {
    props.paramsCallBack({ 'prpFun': prpFun, 'labels': labels })
  }, [prpFun, labels]);

  const onChangeFun = (event) => {
    setPrpFun(event.target.value)
  }

  const renderSelection = () => {
    const funs = ["log", "exp"]
    return <select id="dropdown" onChange={onChangeFun} defaultValue={prpFun}>
      {funs.map((fun) => <option value={fun}>{fun}</option>)}
    </select>
  }

  return (
    <div className='block-div-agg'>
      <p>Preprocessing</p>
      {renderSelection()}
    </div>
  )

}