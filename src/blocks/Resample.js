import { FaTrash } from 'react-icons/fa';
import ConnectButton, { connectButton } from './utils';
import { Button, Form, Col, Row } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';

export default function Resample(props) {

    const [sample, setSample] = useState(props.currParams.sample)
    const [stat, setStat] = useState(props.currParams.resampleFun)

    useEffect(() => {
        props.paramsCallBack({ 'sample': sample, 'resampleFun': stat })
    }, []);

    const onChangeSample = (event) => {
        setSample(event.target.value)
        props.paramsCallBack({ 'sample': event.target.value, 'resampleFun': stat })
    }

    const onChangeStat = (event) => {
        setStat(event.target.value)
        props.paramsCallBack({ 'sample': sample, 'resampleFun': event.target.value })
    }

    const renderSelectionSample = () => {
        //const samples = ["year", "month", "day", "hour", "minute"]
        var samples = []
        // get date length
        if (props.value) {
            const date_length = props.value.getRow(0).get('date').length
            // check valid resamples
            if (date_length >= 16) { samples.push('minute') }
            if (date_length >= 13) { samples.push('hour') }
            if (date_length >= 10) { samples.push('day') }
            if (date_length >= 7) { samples.push('month') }
            if (date_length >= 4) { samples.push('year') }
        }



        return <select id="dropdownSample" onChange={onChangeSample} defaultValue={sample}>
            {samples.map((s) => <option value={s}>{s}</option>)}
        </select>
    }

    const renderSelectionStat = () => {
        const stats = ['sum', 'min', 'max', 'mean']
        return <select id="dropdownStat" onChange={onChangeStat} defaultValue={stat}>
            {stats.map((s) => <option value={s}>{s}</option>)}
        </select>
    }

    return (
        <div className='block-div-agg'>
            <p>Resample</p>
            {renderSelectionSample()}
            {renderSelectionStat()}
        </div>
    )



}