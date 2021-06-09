import { FaTrash } from 'react-icons/fa';
import ConnectButton, { connectButton } from './utils';
import { Button, Form, Col, Row } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';

export default function Filter(props) {

  const [begin, setBegin] = useState(props.currParams.begin)
  const [end, setEnd] = useState(props.currParams.end)

  useEffect(() => {
    props.paramsCallBack({ 'begin': begin, 'end': end })
  }, [begin, end]);
  //}, [props]);

  const onChangeBegin = (event) => setBegin(event.target.value)
  const onChangeEnd = (event) => setEnd(event.target.value)


  return (
    <div className='block-div-filter'>

      <div>
        <Form style={{ width: '15rem' }}>
          <Form.Group as={Row} controlId="formPlaintextEmail">
            <Form.Label column sm="2">
              From
            </Form.Label>
            <Col sm="10">
              <Form.Control type="date" name="dob" placeholder="From" 
              onChange={onChangeBegin} defaultValue={begin}/>
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formPlaintextPassword">
            <Form.Label column sm="2">
              To
          </Form.Label>
            <Col sm="10">
              <Form.Control type="date" name="dob" placeholder="To" 
              onChange={onChangeEnd} defaultValue={end}/>
            </Col>
          </Form.Group>
        </Form>
      </div>
    </div>)

}