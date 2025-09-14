import React, { Fragment, useEffect, useState } from 'react';
import BreadCrumb from '../../../layout/Breadcrumb'
import { Container, Row, Col, Card, CardBody, CardHeader } from 'reactstrap'
import DataTable from 'react-data-table-component'
import { getDate, getFilterDate, toFixed } from '../../../util/helpper';
import { BoxCustomDate, BoxCustomType, BoxFilter, BoxSearch } from '../criteria/Criteria';
import { getInfluList } from '../../../util/influ';

const customStyles = {
    headCells: {
        style: {
          justifyContent: "center",
          textAlign: "center",
        },
    },
};

const FriendList = () => {
    const [data, setData] = useState([]);
    const [criteria, setCriteria] = useState({
        customType: '',
        keyword: '',
        status: '',
        startDate: '',
        endDate: '',
    })

    function mappingData(data){
        const list = [];
    
        data.forEach((m, i) => {
            list.push({
                no: i + 1,
                firstname: m?.firstname || '',
                lastname: m?.lastname || '',
                tiktokaccount: m?.tiktokprofile?.user || '',
                completeddate: getDate(m?.completeddate || ''),
                commissiondate: getDate(m?.commissiondate || ''),
                commission: toFixed(m?.commission || 0),
                status: m?.status || '',
                paydate: getDate(m?.paydate || ''),
                detail: ''
            });
        })
        
        return list;
    }

    const fetch = async (_criteria) => {
        const filterDate = getFilterDate(_criteria);
        
        const formValue = {
            page: 1,
            itemperpage: 10000,
            filterregisterbegin: filterDate?.startDate || '',
            filterregisterend: filterDate?.endDate || '',
            filtername: _criteria?.keyword || '',
            filterstatus: _criteria?.status || '',
        }

        const res = await getInfluList({ ...formValue });
        setData(mappingData(res?.list || []));
    }

    useEffect(() => {
        fetch(criteria);
    }, [criteria])

    const onChangeCriteria = (name, value) => {
        if (name === 'startDate' || name === 'endDate') {
            setCriteria({
                ...criteria,
                [name]: value,
                customType: ''
            })
        } else if (name === 'customType' || name === 'status') {
            setCriteria({
                ...criteria,
                [name]: criteria[name] === value ? '' : value,
            })
        } else {
            setCriteria({
                ...criteria,
                [name]: value
            })
        }
    }

    const onClearDate = () => {
        setCriteria({
            ...criteria,
            startDate: '',
            endDate: ''
        })
    }

    return (
        <Fragment>
            <BreadCrumb parent="Home" subparent="Commission" title="Friend get Friend" />
            <Container fluid={true}>
                <Row className="mb-4 btn-group-showcase">
                    <Col lg="6">
                        <BoxCustomType 
                            value={criteria.customType}
                            onChange={onChangeCriteria}
                        />
                    </Col>
                    <Col lg="6">
                        <BoxCustomDate 
                            startDate={criteria.startDate}
                            endDate={criteria.endDate}
                            onChange={onChangeCriteria}
                            onClear={onClearDate}
                        />
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col md='6'>
                        <h6 className='mb-2'>เลือก</h6>
                        <div className='box-filter gap-3'>
                            <BoxFilter 
                                text='จ่ายแล้ว'
                                isActive={criteria.status === 'pay'}
                                onChange={() => onChangeCriteria('status', 'pay')}
                            />

                            <BoxFilter 
                                text='รอการจ่าย'
                                isActive={criteria.status === 'unpay'}
                                onChange={() => onChangeCriteria('status', 'unpay')}
                            />
                        </div>
                    </Col>
                    <Col md='6'>
                        <div className="pull-right">
                            <BoxSearch 
                                value={criteria.keyword}
                                onChange={onChangeCriteria}
                            />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col sm="12">
                        <Card>
                            <CardBody>
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
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );
};

export default FriendList;

const columns = [
    {
        name: "No.",
        selector: (row) => row["no"],
        sortable: true,
        center: true,
        minWidth: "100px",
    },
    {
        name: "ชื่อ",
        selector: (row) => row["firstname"],
        sortable: true,
        center: false,
        minWidth: "150px",
    },
    {
        name: "นามสกุล",
        selector: (row) => row["lastname"],
        sortable: true,
        center: false,
        minWidth: "150px",
    },
    {
        name: "Tiktok Account",
        selector: (row) => row["tiktokaccount"],
        sortable: true,
        center: true,
        minWidth: "200px",
    },
    {
        name: "วันที่ทำสำเร็จ",
        selector: (row) => row["completeddate"],
        sortable: true,
        center: true,
        minWidth: "130px",
    },
    {
        name: "วันจ่ายค่าคอม",
        selector: (row) => row["commissiondate"],
        sortable: true,
        center: true,
        minWidth: "130px",
    },
    {
        name: "ค่าคอมทั้งหมด",
        selector: (row) => row["commission"],
        sortable: true,
        center: true,
        minWidth: "160px",
    },
    {
        name: "Status",
        selector: (row) => row["status"],
        sortable: true,
        center: true,
        minWidth: "130px",
    },
    {
        name: "จ่ายเมื่อวันที่",
        selector: (row) => row["paydate"],
        sortable: true,
        center: true,
        minWidth: "130px",
    },
    {
        name: "ข้อมูล",
        selector: (row) => row["detail"],
        sortable: true,
        center: true,
        minWidth: "150px",
    },
]