import React, { useEffect, useState } from 'react';
import { Row, Col, Button } from 'reactstrap'
import { toFixed } from '../../../util/helpper';
import { Upload } from 'react-feather';

export default function BoxCountry({ data }){
    const [result, setResult] = useState([]);

    useEffect(() => {
        const list = (data?.dashboard_country?.stat || []).sort((a, b) => b.value - a.value).filter((f, i) => i < 10);
        setResult(list);
    }, [data])

    const maxValue = result?.[0]?.value || 0 || 100;
    const total = result.map((m) => m.value).reduce((a, b) => a + b, 0);

    return (<div>
        <div style={{ display: 'flex', marginBottom: '14px', justifyContent: 'space-between', alignItems: 'center' }}>
            <h5 style={{ fontWeight: 600 }}>City : Top 10</h5>
            <Button color="primary" outline className='btn-js1 text-center' style={{ maxWidth: 300, display: 'flex', alignItems: 'center' }}><Upload size={18} style={{ marginRight: '5px' }} /> Generate Report</Button>
        </div>
        <div id="country-chart">
            {result.map((m, i) => {
                const percent = (m.value / total) * 100;
                const radio = (m.value / maxValue) * 100;
                return (
                    <Row className='mb-2 g-2'>
                        <Col xs="4">
                            <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <p style={{ fontSize: 14, margin: 0, marginRight: '7px' }}>{m.title}</p>
                            </div>
                        </Col>
                        <Col>
                            <div style={{ width: `${radio}%` }}>
                                <p style={{ textAlign: 'right', margin: 0 }}>{toFixed(percent)}% {m.value} คน</p>
                                <div style={{ width: '100%', height: '14px', background: '#419FF9' }} />
                            </div>
                        </Col>
                    </Row>
                )
            })}
        </div>
    </div>)
}
