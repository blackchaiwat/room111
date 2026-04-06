import React from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap'
import { toFixed } from '../../../util/helpper';

export default function DashboardTotal({ data }) {

    return ( <Row style={{ marginBottom: '20px' }} className='g-4'>
        <Col xs="6" sm="6" md="6" lg="3" xl="3">
            <BoxTotal 
                label="จำนวนคำสั่งซื้อทั้งหมด"
                value={data?.stat_summary?.totalpurchasecount || 0}
            />
        </Col>
        <Col xs="6" sm="6" md="6" lg="3" xl="3">
            <BoxTotal 
                label="จำนวนที่ส่งสำเร็จ"
                value={data?.stat_summary?.totalsuccesscount || 0}
            />
        </Col>
        <Col xs="6" sm="6" md="6" lg="3" xl="3">
            <BoxTotal 
                label="คำสั่งซื้อจาก Shopee"
                value={(data?.stat_summary_by_channel || []).find((f) => (f?.channel || '').toLowerCase() === "shopee")?.count || 0}
                bgColor='#EA2507'
            />
        </Col>
        <Col xs="6" sm="6" md="6" lg="3" xl="3">
            <BoxTotal 
                label="คำสั่งซื้อจาก Lazada"
                value={(data?.stat_summary_by_channel || []).find((f) => (f?.channel || '').toLowerCase() === "lazada")?.count || 0}
                bgColor='#276CBB'
            />
        </Col>
    </Row>
    )
}

function BoxTotal({ label = "", text = 'คำสั่งซื้อ', value = 0, bgColor = '#000000' }) {
    return (
         <Card style={{ background: bgColor, color: 'white' }}>
            <CardBody className='box-card2'>
                <div style={{ minHeight: '40px '}}>
                    <h6 style={{ fontWeight: 500 }}>{label}</h6>
                </div>
                <h3 style={{ fontWeight: 600 }}>{toFixed(value)}</h3>
                <p style={{ fontSize: 14, marginTop: '14px' }}>{text}</p>
            </CardBody>
        </Card>
    )
}
