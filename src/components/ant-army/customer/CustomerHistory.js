import React, { Fragment, useEffect, useState } from 'react';
import { Row, Col, Card, CardBody, CardHeader, Button, Modal, ModalHeader, ModalBody } from 'reactstrap'
import DataTable from 'react-data-table-component'
import { getDate, getDateTime, toFixed } from '../../../util/helpper';
import { Upload } from 'react-feather';
import { getCustomerList } from '../../../util/customer';

const customStyles = {
    headCells: {
        style: {
          justifyContent: "center",
          textAlign: "center",
        },
    },
};

const CustomerHistory = ({ isOpen = false, datalist = [], setOpen }) => {
    const [data, setData] = useState([]);

    const [scrollingmodal, setscrollingModal] = useState(false);
    const Scrollmodaltoggle = () => setscrollingModal(!scrollingmodal);

    function mappingData(data){
        const list = [];
    
        data.forEach((m, i) => {
            list.push({
                orderid: m?.orderid || '',
                orderno: m?.orderno || '',
                orderdate: getDate(m?.orderdate),
                warehouse: m?.warehouse || '',
                channel: m?.channel || '',
                amount: toFixed(m?.amount || 0, 2),
                paymentstatus: m?.paymentstatus || '',
                paymentdate: getDateTime(m?.paymentdate),
                deliverystatus: m?.deliverystatus || '',
                trackingcode: m?.trackingcode || '',
            });
        })
        
        return list;
    }

    useEffect(() => {
        setData(mappingData(datalist || []));
    }, [datalist])

    return (
        <Modal isOpen={isOpen} toggle={setOpen} size="xl">
            <ModalHeader toggle={setOpen}>
                ประวัติการสั่งซื้อ
            </ModalHeader>
            <ModalBody>
                <Row>
                    <Col sm="12">
                        <div className="table-responsive support-table">
                            <DataTable
                                columns={columns}
                                data={data}
                                striped={true}
                                center={true}
                                pagination
                                customStyles={customStyles} 
                                noDataComponent={
                                    <div style={{ padding: '10px', fontSize: '16px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        ไม่มีข้อมูลแสดงในขณะนี้
                                    </div>
                                }
                                persistTableHead
                            />
                        </div>
                    </Col>
                </Row>
            </ModalBody>
        </Modal>
    );
};

export default CustomerHistory;

const columns = [
    {
        name: "ID No.",
        selector: (row) => row["orderid"],
        sortable: true,
        center: true,
        wrap: true,
        minWidth: "200px",
    },
    {
        name: "Order No",
        selector: (row) => row["orderno"],
        sortable: true,
        center: true,
        wrap: true,
        minWidth: "200px",
    },
    {
        name: "Order Date",
        selector: (row) => row["orderdate"],
        sortable: true,
        center: true,
        wrap: true,
        minWidth: "200px",
    },
    {
        name: "ช่องทางการซื้อ",
        selector: (row) => row["channel"],
        sortable: true,
        center: true,
        wrap: true,
        minWidth: "200px",
    },
    {
        name: "รหัสคลัง/สาขา",
        selector: (row) => row["warehouse"],
        sortable: true,
        center: true,
        wrap: true,
        minWidth: "200px",
    },
    {
        name: "จำนวนเงิน",
        selector: (row) => row["amount"],
        sortable: true,
        center: true,
        wrap: true,
        minWidth: "200px",
    },
    {
        name: "Payment Status",
        selector: (row) => row["paymentstatus"],
        sortable: true,
        center: true,
        wrap: true,
        minWidth: "200px",
    },
    {
        name: "Payment Date",
        selector: (row) => row["paymentdate"],
        sortable: true,
        center: true,
        wrap: true,
        minWidth: "240px",
    },
    {
        name: "Delivery Status",
        selector: (row) => row["deliverystatus"],
        sortable: true,
        center: true,
        wrap: true,
        minWidth: "200px",
    },
    {
        name: "Tracking No.",
        selector: (row) => row["trackingcode"],
        sortable: true,
        center: true,
        wrap: true,
        minWidth: "200px",
    },
]