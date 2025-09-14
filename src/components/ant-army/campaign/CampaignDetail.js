import React, { Fragment, useEffect, useState } from 'react';
import BreadCrumb from '../../../layout/Breadcrumb'
import { Container, Row, Col, Card, CardBody, Button, Modal, ModalBody, ModalFooter } from 'reactstrap'
import DataTable from 'react-data-table-component'
import { getDate, toDateStr, toFixed } from '../../../util/helpper';
import { BoxFilter, BoxSearch } from '../criteria/Criteria';
import Rating from 'react-rating';
import { useParams } from 'react-router';
import { getApproveJob, getJobList } from '../../../util/job';
import { CampaignDetailById } from './CampaignList';
import { BoxError, BoxLoading, BoxSuccess } from '../criteria/BoxAlert';

const customStyles = {
    headCells: {
        style: {
          justifyContent: "center",
          textAlign: "center",
        },
    },
};

const CampaignDetail = () => {
    const { id } = useParams();
    const [data, setData] = useState({});
    const [dataList, setDataList] = useState([]);
    const [criteria, setCriteria] = useState({
        keyword: '',
        status: '',
    })

    const [openStatus, setOpenStatus] = useState(false);
    const [profileid, setProfileid] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const fetch = async () => {      
        const res = await getJobList({ page: 1, itemperpage: 10000, JobID: id });
        const find = (res?.list || []).find((f) => f.jobid === id);
        console.log("get campaign view", find);
        if (find) {
            setData({ 
                ...find,
            });
        }
    }
    
    useEffect(() => {
        if (id && id !== 'create') {
            fetch();
        }
    }, [id])

    const onClickOpenStatus = (_id) => {
        setProfileid(_id);
        setOpenStatus(true);
    }

    function mappingData(data){
        const list = [];
    
        data.forEach((m, i) => {
            list.push({
                no: i + 1,
                firstname: m?.firstname || '',
                lastname: m?.lastname || '',
                tiktokaccount: <a href={`https://www.tiktok.com/@${m?.tiktokuser}`} target='_blank' style={{ textDecoration: 'underline' }}>{m?.tiktokuser || ''}</a>,
                created: getDate(m?.jobacceptdate || ''),
                jobsubmit: !m?.jobsubmit ? (
                    <span style={{ color: '#FF0700' }}>wating</span>
                ) : (
                    <span>{getDate(m?.jobsubmit || '')}{` `} 
                        <a href={m?.videourl || `https://www.tiktok.com/@${m?.tiktokuser}`} target='_blank' style={{ textDecoration: 'underline' }}>Link</a>
                    </span>
                ),
                approved: !m?.jobsubmit ? (
                    <span style={{ color: '#FF0700' }}>wating</span>
                ) : !m?.approvestatus ? (
                    <Button onClick={() => onClickOpenStatus(m.profileid)} color="primary" className='px-2 py-1'>select status</Button>
                ) : (
                    <div className='flex'>
                        <img alt="approved" src={require('../../../assets/images/approved.png')} style={{ width:'auto', height: 'auto', maxHeight: '20px' }} />
                        <span style={{ color: m?.approvestatus === 'approve' ? '#0B9E51' : '#FF0700', marginLeft: '7px' }}>{getDate(m?.approvedate || '')}</span>
                    </div>
                ),
                rating:  !m?.rating ? (
                    <span style={{ color: '#FF0700' }}>wating</span>
                ) : (
                    <Rating
                        initialRating={m?.rating || 0}
                        emptySymbol={
                            <i className="fa fa-star-o" style={{ fontSize: "20px", color: "#0B9E51" }}></i>
                        }
                        fullSymbol={
                            <i className="fa fa-star" style={{ fontSize: "20px", color: "#0B9E51" }}></i>
                        }
                        readonly
                    />
                ),
                totalearning: !m?.earning ? (
                    <span style={{ color: '#FF0700' }}>wating</span>
                ) : (
                    <span style={{ color: '#0B9E51' }}>{toFixed(m?.earning || 0)}</span>
                ),
                paymentdate: !m?.paymentdate ? (
                    <span style={{ color: '#FF0700' }}>wating</span>
                ) : (
                    <span style={{ color: '#0B9E51' }}>{getDate(m?.paymentdate || '')}</span>
                ),
                totalcommission: !m?.commission ? (
                    <span style={{ color: '#FF0700' }}>wating</span>
                ) : (
                    <span style={{ color: '#0B9E51' }}>{toFixed(m?.commission || 0)}</span>
                ),
                totalsell: !m?.sell ? (
                    <span style={{ color: '#FF0700' }}>wating</span>
                ) : (
                    <span style={{ color: '#0B9E51' }}>{toFixed(m?.sell || 0)}</span>
                ),
                status: m?.status || ''
            });
        })
        
        return list;
    }

    const fetchList = async (_criteria) => {
        const formValue = {
            page: 1,
            itemperpage: 10000,
            filtername: _criteria?.keyword || '',
            filterstatus: _criteria?.status || '',
            JobID: id
        }

        const res = await getJobList({ ...formValue });
        const find = (res?.list || []).find((f) => f.jobid === id);
        setDataList(mappingData(find?.kollist || []));
    }

    useEffect(() => {
        if (id && id !== 'create') {
            fetchList(criteria);
        }
    }, [id, criteria])

    const onChangeCriteria = (name, value) => {
        if (name === 'status') {
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

    const onSaveStatus = async (status, rating) => {
        setOpenStatus(false);
        setLoading(true);
        const formValue = {
            jobid: id,
            profileid,
            approvestatus: status,
            rating
        }
        const res = await getApproveJob({ ...formValue });
        setLoading(false);
        if (res?.result === 'error') {
            setError(true);
        } else {
            setSuccess(true);
            fetchList(criteria);
        }
    }

    const onSubmitSuccess = () => {
        setSuccess(false);
    }

    return (
        <Fragment>
            <ModalStatus
                open={openStatus}
                setOpen={setOpenStatus}
                onSave={onSaveStatus}
            />

            <BoxLoading open={loading} setOpen={setLoading} />
            <BoxError open={error} setOpen={setError} />
            <BoxSuccess open={success} setOpen={onSubmitSuccess} />
            
            <BreadCrumb parent="Home" subparent="Campaign" title={data?.title || ''} key={data?.title || ''} />
            <Container fluid={true}>
                <Row className='mb-4'>
                    <Col sm='12' className='mb-2'>
                        <h4 style={{ fontWeight: 600 }}>{data?.title || ''}</h4>
                    </Col>
                    <Col sm='3' md='3' lg='3'>
                       {data?.imgurl && (
                            <img alt="Campaign" src={`${data?.imgurl}`} style={{ maxWidth: '100%', height: 'auto', width: 'auto' }} />
                        )}
                    </Col>
                    <Col sm='9' md='9' lg='9'>
                        <h5 style={{ fontWeight: 600, marginBottom: '10px' }}>{data?.description || ''}</h5>
                        
                        <div style={{ display: 'flex', marginBottom: '7px' }}>
                            <h6 style={{ marginRight: '14px' }}>ค่าคอมมิชชัน</h6>
                            <h6 style={{ marginRight: '24px', color: '#FF0202' }}>{data?.commission || ''}%</h6>
                            <h6 style={{ marginRight: '14px' }}>ประเภทสินค้า</h6>
                            <h6 style={{ color: '#FF0202' }}>{data?.producttype || ''}</h6>
                        </div>

                        <div style={{ display: 'flex', marginBottom: '7px' }}>
                            <h6 style={{ marginRight: '14px' }}>ลิงค์ติดตระกร้า</h6>
                            <h6>{data?.utm === "Utm" ? "UTM Link" : data?.utm === 'Tab' ? "Unique Link" : ""}</h6>
                        </div>

                        <div style={{ display: 'flex', color: '#83706F' }}>
                            <p style={{ marginRight: '14px' }}>Link</p>
                            <p>{data?.tiktoktaburl || ''}</p>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ padding: '7px 10px', textAlign: 'center', background: '#D9D9D9', borderRadius: '14px' }}>
                                <p style={{ margin: 0 }}>วันเริ่มแคมเปญ {toDateStr(data?.validbegin || '', data?.validend || '') || '-'}</p>
                            </div>
                            <div style={{ padding: '7px 10px', textAlign: 'center', color: 'white', background: '#0353B9', borderRadius: '14px' }}>
                                <p style={{ margin: 0 }}>ส่งการบ้าน {toDateStr(data?.submitbegin || '', data?.submmitend || '') || '-'}</p>
                            </div>
                            <div style={{ padding: '7px 10px', textAlign: 'center', background: '#D9D9D9', borderRadius: '14px' }}>
                                <p style={{ margin: 0 }}>อนุมัติ {toDateStr(data?.approvebegin || '', data?.approveend || '') || '-'}</p>
                            </div>    
                        </div>
                    </Col>
                </Row>

                <Row style={{ marginTop: '40px', marginBottom: '20px' }}>
                    <Col lg='12'>
                        <div className='gap-5' style={{ display: 'flex', alignItems: 'center' }}>
                            <h6 style={{ fontWeight: 600, margin: 0 }}>Status</h6>
                            
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

                <Card>
                    <CardBody style={{ paddingBottom: '0px' }}>
                        <CampaignDetailById data={data} />
                    </CardBody>
                </Card>
                
                <Row style={{ marginTop: '40px', marginBottom: '20px' }}>
                    <Col lg='12' xl='6'>
                        <h6 className='mb-2'>เลือก</h6>
                        <div className='box-filter gap-3'>
                            <BoxFilter 
                                text='งานที่กดรับ'
                                isActive={criteria.status === 'งานที่กดรับ'}
                                onChange={() => onChangeCriteria('status', 'งานที่กดรับ')}
                            />

                            <BoxFilter 
                                text='งานที่ส่งการบ้าน'
                                isActive={criteria.status === 'งานที่ส่งการบ้าน'}
                                onChange={() => onChangeCriteria('status', 'งานที่ส่งการบ้าน')}
                            />

                            <BoxFilter 
                                text='งานที่รอการอนุมัติ'
                                isActive={criteria.status === 'งานที่รอการอนุมัติ'}
                                onChange={() => onChangeCriteria('status', 'งานที่รอการอนุมัติ')}
                            />

                            <BoxFilter 
                                text='งานที่รอการจ่ายค่าจ้างทำงาน'
                                isActive={criteria.status === 'งานที่รอการจ่ายค่าจ้างทำงาน'}
                                onChange={() => onChangeCriteria('status', 'งานที่รอการจ่ายค่าจ้างทำงาน')}
                            />

                            <BoxFilter 
                                text='งานที่จ่ายค่าจ้างทำงานแล้ว'
                                isActive={criteria.status === 'งานที่จ่ายค่าจ้างทำงานแล้ว'}
                                onChange={() => onChangeCriteria('status', 'งานที่จ่ายค่าจ้างทำงานแล้ว')}
                            />
                        </div>
                    </Col>
                    <Col lg='12' xl='6'>
                        <div className="pull-right mt-4">
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
                                        data={dataList}
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

export default CampaignDetail;

const ModalStatus = ({ open, setOpen, onSave }) => {
    const [status, setStatus] = useState('');
    const [rating, setRating] = useState(0);
    const [errorStatus, setErrorStatus] = useState(false);
    const [errorRating, setErrorRating] = useState(false);

    useEffect(() => {
        setStatus('');
        setRating(0);
        setErrorStatus(false);
        setErrorRating(false);
    }, [open])

    const onSubmit = () => {
        if (!status) {
            setErrorStatus(true);
            return;
        }

        if (status === 'approve' && rating === 0) {
            setErrorRating(true);
            return;
        }

        onSave(status, rating);
    }

    const styles = {
        width: '100%',
        borderRadius: '20px',
        fontSize: '16px',
        color: 'white',
        textAlign: 'center',
        padding: '4px',
        cursor: 'pointer'
    }

    return (<Modal isOpen={open} toggle={() => setOpen(false)} centered>
        <ModalBody style={{ paddingTop: '30px', paddingBottom: '20px' }}>
            <h5>Please select</h5>

            <Row className='mt-3'>
                <Col xs='6'>
                    <div style={{
                        ...styles,
                        background: status === 'reject' ? '#034BB9' : '#686868'
                    }}
                        onClick={() => { 
                            setStatus('reject');
                            setErrorStatus(false);
                        }}
                    >
                        Reject
                    </div>
                </Col>
                <Col xs='6'>
                    <div style={{
                        ...styles,
                        background: status === 'approve' ? '#034BB9' : '#686868'
                    }}
                        onClick={() => { 
                            setStatus('approve');
                            setErrorStatus(false);
                        }}
                    >
                        Approve
                    </div>
                </Col>
            </Row>

            {errorStatus && (
                <div style={{ textAlign: 'center', color: '#FF0700', marginTop: '20px' }}>
                    <h6>กรุณาเลือกสถานะ</h6>
                </div>
            )}

            {status === 'approve' && (
                <div style={{ marginTop: '20px' }}>
                    <h5>Rating</h5>

                    <div style={{ display: 'flex', marginTop: '10px' }}>
                        <Rating
                            initialRating={rating}
                            emptySymbol={
                                <i className="fa fa-star-o" style={{ fontSize: "30px", color: "#0B9E51" }}></i>
                            }
                            fullSymbol={
                                <i className="fa fa-star" style={{ fontSize: "30px", color: "#0B9E51" }}></i>
                            }
                            onChange={(e) => setRating(e)}
                        />

                        <h4 style={{ marginLeft: '20px', marginTop: '5px' }}>{rating}</h4>
                    </div>
                </div>
            )}

            {errorRating && (
                <div style={{ textAlign: 'center', color: '#FF0700', marginTop: '20px' }}>
                    <h6>กรุณาเลือก Rating</h6>
                </div>
            )}
    
        </ModalBody> 
        <ModalFooter>
            <Button color="primary" onClick={() => onSubmit()}>ตกลง</Button>
            <Button color="light" onClick={() => setOpen(false)}>ยกเลิก</Button>
        </ModalFooter>  
    </Modal>)
}

const columns = [
    {
        name: "No.",
        selector: (row) => row["no"],
        sortable: true,
        center: true,
        minWidth: "80px",
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
        name: "วันที่กดรับงาน",
        selector: (row) => row["created"],
        sortable: true,
        center: true,
        minWidth: "150px",
    },
    {
        name: "วันที่ส่งงาน",
        selector: (row) => row["jobsubmit"],
        sortable: true,
        center: true,
        minWidth: "150px",
    },
    {
        name: "Approved",
        selector: (row) => row["approved"],
        sortable: true,
        center: true,
        minWidth: "200px",
    },
    {
        name: "Rating",
        selector: (row) => row["rating"],
        sortable: true,
        center: true,
        minWidth: "130px",
    },
    {
        name: "ได้รับค่าจ้างจาก Ant Army",
        selector: (row) => row["totalearning"],
        sortable: true,
        center: true,
        minWidth: "240px",
    },
    {
        name: "วันที่ได้รับค่าจ้าง",
        selector: (row) => row["paymentdate"],
        sortable: true,
        center: true,
        minWidth: "200px",
    },
    {
        name: "ค่าคอมจาก Tiktok",
        selector: (row) => row["totalcommission"],
        sortable: true,
        center: true,
        minWidth: "200px",
    },
    {
        name: "ยอดขายจาก Tiktok",
        selector: (row) => row["totalsell"],
        sortable: true,
        center: true,
        minWidth: "200px",
    },
    {
        name: "Status",
        selector: (row) => row["status"],
        sortable: true,
        center: true,
        minWidth: "150px",
    },
]