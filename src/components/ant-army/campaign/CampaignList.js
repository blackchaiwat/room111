import React, { Fragment, useEffect, useState } from 'react';
import BreadCrumb from '../../../layout/Breadcrumb'
import { Container, Row, Col, Card, CardBody, CardHeader, Button, Collapse, CardFooter } from 'reactstrap'
import { getFilterDate, getFilterMinMax, toDateStr, toFixed } from '../../../util/helpper';
import { Filters } from '../../../constant';
import { BoxCustomDate, BoxCustomType, BoxFilter, BoxSearch } from '../criteria/Criteria';
import { getJobList } from '../../../util/job';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

const ranges = ['0-100,000', '100,001-500,000', '500,001-1,000,000', '1,000,001-2,000,000', '2,000,000 ขึ้นไป'];

const filterList = [
    {
        title: 'จำนวนคนสมัคร',
        name: 'registers',
        list: ['คนสมัครเต็มจำนวนแล้ว', 'คนสมัคร < 50%']
    },
    {
        title: 'จำนวนคนส่งการบ้าน',
        name: 'homeworks',
        list: ['คนส่งการบ้าน > 50%', 'คนส่งการบ้าน < 50%', 'คนส่งการบ้านครบ']
    },
    {
        title: 'ค่าจ้างทำงานของพร้อมขาย',
        name: 'commissions',
        list: ranges
    },
    {
        title: 'ค่าคอมจาก Tiktok',
        name: 'tiktoks',
        list: ranges
    },
    {
        title: 'ยอดจากการขายของแคมเปญ',
        name: 'amounts',
        list: ranges
    },
]

const init = {
    registers: [],
    homeworks: [],
    commissions: [],
    tiktoks: [],
    amounts: [],
}

const CampaignList = ({ isCampaignActive = false }) => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [isFilter, setIsFilter] = useState(false);
    const [filter, setFilter] = useState({ ...init });
    const [total, setTotal] = useState({
        totalcommission: 0,
        totalcompletejobs: 0,
        totalearning: 0,
        totalrunningjobs: 0,
        totalsell: 0
    });

    const [criteria, setCriteria] = useState({
        customType: '',
        keyword: '',
        startDate: '',
        endDate: '',
        ...init
    })

    const onClickDetail = (id) => {
        navigate(`${process.env.PUBLIC_URL}/campaign/detail/${id}`);
    }

    const onClickEdit = (id) => {
        navigate(`${process.env.PUBLIC_URL}/campaign/form/${id}`);
    }
    
    const fetch = async (_criteria) => {
        const filterDate = getFilterDate(_criteria);
        
        const formValue = {
            page: 1,
            itemperpage: 10000,
            filterregisterbegin: filterDate?.startDate || '',
            filterregisterend: filterDate?.endDate || '',
            filtername: _criteria?.keyword || '',
            filterregisters: getFilterMinMax(criteria.registers),
            filterhomeworks: getFilterMinMax(criteria.homeworks),
            filtercommissions: getFilterMinMax(criteria.commissions),
            filtertiktoks: getFilterMinMax(criteria.tiktoks),
            filteramounts: getFilterMinMax(criteria.amounts),
        }
        const res = await getJobList({ ...formValue });
        setData(res?.list || []);

        setTotal({
            totalcommission: res?.totalcommission || 0,
            totalcompletejobs: res?.totalcompletejobs || 0,
            totalearning: res?.totalearning || 0,
            totalrunningjobs: res?.totalrunningjobs || 0,
            totalsell: res?.totalsell || 0,
        })
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
        } else if (name === 'customType') {
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

    const onSelect = (name, value) => {
        const find = filter[name].find((f) => f === value);
        if (find) {
            setFilter({
                ...filter,
                [name]: filter[name].filter((f) => f !== value)
            })
        } else {
            setFilter({
                ...filter,
                [name]: [...filter[name], value]
            })
        }
    }

    const onSubmitFilter = () => {
        setCriteria({ ...criteria, ...filter });
        setIsFilter(false);
    }

    const onClearFilter = () => {
        setFilter({ ...init });
        setCriteria({ ...criteria, ...init });
        setIsFilter(false);
    }

    return (
        <Fragment>
            <BreadCrumb parent="Home" subparent="Campaign" title="แคมเปญ" />
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

                {!isCampaignActive && (
                    <Row>
                        <Col xs='12' sm='6' md='6' lg='3'>
                            <Card style={{ background: '#AFF4FF' }}>
                                <CardBody className='box-card2'>
                                    <div className='box-card-title'>
                                        <h6 style={{ fontWeight: 600 }}>แคมเปญที่รัน (แคมเปญ) </h6>
                                    </div>
                                    <h3 style={{ fontWeight: 600 }}>{toFixed(total.totalrunningjobs)}</h3>
                                    <span style={{ fontSize: 14, marginTop: '10px' }}>แคมเปญที่ปิดแล้ว {toFixed(total.totalcompletejobs)}</span>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xs='12' sm='6' md='6' lg='3'>
                            <Card style={{ background: '#FFDEAF' }}>
                                <CardBody className='box-card2'>
                                    <div className='box-card-title'>
                                        <h6 style={{ fontWeight: 600 }}>ค่าจ้างทั้งหมดที่ทำงาน<br />จากพร้อมขาย (THB) </h6>
                                    </div>
                                    <h3 style={{ fontWeight: 600 }}>{toFixed(total.totalearning)}</h3>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xs='12' sm='6' md='6' lg='3'>
                            <Card style={{ background: '#FFFFBB' }}>
                                <CardBody className='box-card2'>
                                    <div className='box-card-title'>
                                        <h6 style={{ fontWeight: 600 }}>ยอดขายจากการติดตระกร้าทั้งหมด<br />(THB) ข้อมูลจาก Tiktok</h6>
                                    </div>
                                    <h3 style={{ fontWeight: 600 }}>{toFixed(total.totalcommission)}</h3>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xs='12' sm='6' md='6' lg='3'>
                            <Card style={{ background: '#B5FFBD' }}>
                                <CardBody className='box-card2'>
                                    <div className='box-card-title'>
                                        <h6 style={{ fontWeight: 600 }}>ยอดขายสินค้าทั้งหมด (THB)<br />ข้อมูลจาก Tiktok</h6>
                                    </div>
                                    <h3 style={{ fontWeight: 600 }}>{toFixed(total.totalsell)}</h3>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                )}
                
                <Row>
                    <Col md='12' lg='12' xl='8'>
                        <div className="default-according style-1 faq-accordion job-accordion" id="accordionoc">
                            <Card>
                                <CardHeader>
                                    <h5 className="mb-0">
                                        <Button color="link ps-0" data-toggle="collapse" onClick={() => setIsFilter(!isFilter)}
                                            data-target="#collapseicon" aria-expanded={isFilter} aria-controls="collapseicon">{Filters}</Button>
                                    </h5>
                                </CardHeader>
                                <Collapse isOpen={isFilter}>
                                    <CardBody className="animate-chk"> 
                                        {filterList.map((item, i) => (
                                            <Row className='mb-3' key={i}>
                                                <Col lg='3' xl='2'>
                                                    <div className='pull-right' style={{ textAlign: 'right' }}>
                                                        <p style={{ fontSize: 13, margin: 0 }}>{item.title} :</p>  
                                                    </div>
                                                </Col>
                                                <Col lg='9' xl='10'>
                                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                                                        {item.list.map((m) => (
                                                            <BoxFilter
                                                                key={m}
                                                                text={m}
                                                                isActive={filter[item.name].indexOf(m) > -1}
                                                                onChange={() => onSelect(item.name, m)}
                                                            />
                                                        ))}
                                                    </div>
                                                </Col> 
                                            </Row>
                                        ))}    
                                    </CardBody>
                                    <CardFooter className='flex text-center gap-3'>
                                        <Button color="default" className='text-center' style={{ maxWidth: 150, textDecoration: 'underline' }} onClick={() => onClearFilter()}>ล้างทั้งหมด</Button>
                                        <Button color='primary' className='text-center' style={{ maxWidth: 150 }} onClick={() => onSubmitFilter()}>ตกลง</Button>
                                    </CardFooter>
                                </Collapse>
                            </Card>
                        </div>
                    </Col>
                    <Col lg='12' xl='4'>
                        <div className="pull-right">
                            <BoxSearch 
                                value={criteria.keyword}
                                onChange={onChangeCriteria}
                            />
                        </div>
                    </Col>
                </Row>
                <Row className='mb-4'>
                    <h5 style={{ fontWeight: 600 }}>จำนวน {data.length} แคมเปญ</h5>
                </Row>
                <Row className='mb-4'>
                    <Col lg='12'>
                        <div className='gap-5' style={{ display: 'flex', alignItems: 'center' }}>

                            <div className='gap-2' style={{ display: 'flex', alignItems: 'center' }}>
                                <img src={require("../../../assets/images/Group 83.png")} style={{ height: 'auto', width: 'auto', maxHeight: '30px' }} />
                                <h6 style={{ fontWeight: 600, margin: 0 }}>จำนวนคนที่สมัคร</h6>
                            </div>

                            <div className='gap-2' style={{ display: 'flex', alignItems: 'center' }}>
                                <img src={require("../../../assets/images/Group 82.png")} style={{ height: 'auto', width: 'auto', maxHeight: '30px' }} />
                                <h6 style={{ fontWeight: 600, margin: 0 }}>จำนวนคนที่ส่งการบ้าน</h6>
                            </div>

                            <div className='gap-2' style={{ display: 'flex', alignItems: 'center' }}>
                                <img src={require("../../../assets/images/Group 79.png")} style={{ height: 'auto', width: 'auto', maxHeight: '30px' }} />
                                <h6 style={{ fontWeight: 600, margin: 0 }}>จำนวนคนที่ผ่านการอนุมัติ</h6>
                            </div>
                        </div>          
                    </Col> 
                </Row>

                {data.map((m, i) => {
                    return(<Row key={i}>
                        <Col sm="12">
                            <Card>
                                <CardBody style={{ paddingBottom: '4px' }}>
                                    <Row style={{ marginBottom: '20px' }}>
                                        <Col sm='12' md='12' lg='12' xl='6'>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <h5 className='link-title' onClick={() => onClickDetail(m.jobid)}>{m.title || ''}</h5>
                                                {!isCampaignActive && (
                                                    <div>
                                                        <span onClick={() => onClickEdit(m.jobid)} style={{ cursor: 'pointer' }}>
                                                            <i
                                                                className="fa fa-pencil"
                                                                style={{
                                                                    width: 35,
                                                                    fontSize: 16,
                                                                    padding: '4px 11px',
                                                                    color: "rgb(40, 167, 69)",
                                                                }}
                                                            ></i>
                                                            แก้ไข
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </Col>
                                    </Row>
                                    <CampaignDetailById data={m} />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                )})}
            </Container>
        </Fragment>
    );
};

export default CampaignList;


export const CampaignDetailById = ({ data }) => {
    const total = data?.kollimit || 0;
    const approved = data?.totalkolapprove || 0;
    const send = data?.totalkoljobsubmit || 0;
    const register = data?.totalkolaccept || 0;

    const rRegister = (register / total) * 100;
    const rSend = (send / total) * 100;
    const rApproved = (approved / total) * 100;

    return (<Row className="g-3">
        <Col sm='12' md='12' lg='12' xl='6'>
            <div style={{ marginTop: '10px', marginBottom: '30px' }}>
                <div style={{ 
                    position: 'relative',
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'flex-end',
                }}>
                    <p>{toFixed(total)} คน</p>

                    <div style={{
                        position: 'absolute',
                        display: 'flex',
                        top: 0,
                        left: `${rRegister - 4}%`,
                    }}>
                        <p>{toFixed(register)} คน</p>
                    </div>
                    
                    {(data?.totalkoljobsubmit || 0) > 0 && (
                        <div style={{
                            position: 'absolute',
                            display: 'flex',
                            top: 0,
                            left: `${rSend - 4}%`,
                        }}>
                            <p>{toFixed(send)} คน</p>
                        </div>
                    )}
                    
                    {(data?.totalkolapprove || 0) > 0 && (
                        <div style={{
                            position: 'absolute',
                            display: 'flex',
                            top: 0,
                            left: `${rApproved - 4}%`,
                        }}>
                            <p>{toFixed(approved)} คน</p>
                        </div>
                    )}
                </div>
                
                <div style={{ 
                    position: 'relative',
                    display: 'flex',
                    height: '10px',
                    borderRadius: '30px',
                    width: '100%',
                    background: '#EBEBEB',
                }}>
                    <div style={{
                        position: 'absolute',
                        display: 'flex',
                        top: 0,
                        left: 0,
                        height: '10px',
                        borderRadius: '30px',
                        width: `${rRegister}%`,
                        background: '#848484',
                    }} />

                    <div style={{ 
                        position: 'absolute',
                        display: 'flex',
                        top: '-10px',
                        left: `${rRegister - 3}%`,
                    }}>
                        <img src={require("../../../assets/images/Group 83.png")} style={{ height: 'auto', width: 'auto', maxHeight: '30px' }} />
                    </div>

                    {(data?.totalkoljobsubmit || 0) > 0 && (
                        <div style={{ 
                            position: 'absolute',
                            display: 'flex',
                            top: '-10px',
                            left: `${rSend - 3}%`,
                        }}>
                            <img src={require("../../../assets/images/Group 82.png")} style={{ height: 'auto', width: 'auto', maxHeight: '30px' }} />
                        </div>
                    )}

                    {(data?.totalkolapprove || 0) > 0 && (
                        <div style={{ 
                            position: 'absolute',
                            display: 'flex',
                            top: '-10px',
                            left: `${rApproved - 3}%`,
                        }}>
                            <img src={require("../../../assets/images/Group 79.png")} style={{ height: 'auto', width: 'auto', maxHeight: '30px' }} />
                        </div>
                    )}
                </div>
            </div>

            <Row className="g-3">
                <Col sm='4'>
                    <div style={{ padding: '7px 0px', textAlign: 'center', background: '#D9D9D9', borderRadius: '7px' }}>
                        <p style={{ margin: 0 }}>วันเริ่มแคมเปญ</p>
                        <p style={{ margin: 0 }}>{toDateStr(data?.validbegin || '', data?.validend || '') || '-'}</p>
                    </div>
                </Col>
                <Col sm='4'>
                    <div style={{ padding: '7px 0px', textAlign: 'center', color: 'white', background: '#0353B9', borderRadius: '7px' }}>
                        <p style={{ margin: 0 }}>ส่งการบ้าน</p>
                        <p style={{ margin: 0 }}>{toDateStr(data?.submitbegin || '', data?.submmitend || '') || '-'}</p>
                    </div>
                </Col>
                <Col sm='4'>
                <div style={{ padding: '7px 0px', textAlign: 'center', background: '#D9D9D9', borderRadius: '7px' }}>
                        <p style={{ margin: 0 }}>อนุมัติ</p>
                        <p style={{ margin: 0 }}>{toDateStr(data?.approvebegin || '', data?.approveend || '') || '-'}</p>
                    </div>
                </Col>       
            </Row>
        </Col>

        <Col sm='12' md='12' lg='12' xl='6'>
            <Row className="g-3">
                <Col xs='12' sm='4' md='4' lg='4'>
                    <Card style={{ background: '#FFDEAF' }}>
                        <CardBody className='box-card'>
                            <div className='box-card-title2'>
                                <p style={{ fontSize: 12 }}>ค่าจ้างทั้งหมดที่ทำงานจากพร้อมขาย (THB)</p>
                            </div>
                            <h4 style={{ fontWeight: 600 }}>{toFixed(data?.totalearning || 0)}</h4>
                        </CardBody>
                    </Card>
                </Col>
                <Col xs='12' sm='4' md='4' lg='4'>
                    <Card style={{ background: '#FFFFBB' }}>
                        <CardBody className='box-card'>
                            <div className='box-card-title2'>
                                <p style={{ fontSize: 12 }}>ยอดขายจากการติดตระกร้าทั้งหมด (THB) ข้อมูลจาก Tiktok</p>
                            </div>
                            <h4 style={{ fontWeight: 600 }}>{toFixed(data?.totalcommission || 0)}</h4>
                        </CardBody>
                    </Card>
                </Col>
                <Col xs='12' sm='4' md='4' lg='4'>
                    <Card style={{ background: '#B5FFBD' }}>
                        <CardBody className='box-card'>
                            <div className='box-card-title2'>
                                <p style={{ fontSize: 12 }}>ยอดขายสินค้าทั้งหมด (THB) ข้อมูลจาก Tiktok</p>
                            </div>
                            <h4 style={{ fontWeight: 600 }}>{toFixed(data?.totalsell || 0)}</h4>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Col>
    </Row>)
}
