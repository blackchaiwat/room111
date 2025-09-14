import React, { Fragment, useEffect, useState } from 'react';
import BreadCrumb from '../../../layout/Breadcrumb'
import { Container, Row, Col, Card, CardBody } from 'reactstrap'
import DataTable from 'react-data-table-component'
import { getDate, getGender, getYearOld, toFixed } from '../../../util/helpper';
import { BoxCount, BoxCustomDate, BoxCustomType, BoxFilter, BoxInfo, BoxSearch } from '../criteria/Criteria';
import { useNavigate, useParams } from 'react-router';
import { getInfluDetail } from '../../../util/influ';
import useBank from '../../../util/useBank';
import Rating from 'react-rating';

const demo = [
    {
        firstname: 'Pokpok',
        lastname: 'Pokpok',
        tiktokaccount: 'pok Walker',
        follower: 50000,
        like: 50000,
        heart: 50000,
        vdo: 50000,
        share: 50000,
        engagement: 150000,
        registerdate: '11/03/2025',
        location: 'กทม',
        gender: 'หญิง',
        birthdate: '11/03/1995'
    }
];

const customStyles = {
    headCells: {
        style: {
          justifyContent: "center",
          textAlign: "center",
        },
    },
};

const statusList = [
    { id: '', name: 'ทั้งหมด' },
    { id: 'งานที่กดรับ', name: 'งานที่กดรับ' },
    { id: 'งานที่ส่งการบ้าน', name: 'งานที่ส่งการบ้าน' },
    { id: 'งานที่รอการอนุมัติ', name: 'งานที่รอการอนุมัติ' },
    { id: 'งานที่รอการจ่ายค่าจ้างทำงาน', name: 'งานที่รอการจ่ายค่าจ้างทำงาน' },
    { id: 'งานที่จ่ายค่าจ้างทำงานแล้ว', name: 'งานที่จ่ายค่าจ้างทำงานแล้ว' },
]

const InfluDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [data, setData] = useState({});
    const [dataList, setDataList] = useState([]);
    const [tab, setTab] = useState(1);

    const masterBank = useBank();

    const [criteria, setCriteria] = useState({
        customType: '',
        keyword: '',
        startDate: '',
        endDate: '',
        status: ''
    })

    const fetch = async () => {
        const res = await getInfluDetail({ profileid: id, jobstatus: "" });
        setData({ ...res?.item });
        console.log(res?.item);
    }

    function mappingData(data){
        const list = [];
    
        data.forEach((m, i) => {
            list.push({
                no: i + 1,
                jobtitle: m?.jobtitle || '',
                created: getDate(m?.created || ''),
                jobsubmit: !m?.jobsubmit ? (
                    <span style={{ color: '#FF0700' }}>wating</span>
                ) : (
                    <span>{getDate(m?.jobsubmit || '')}{` `} 
                        <a href={m?.videourl || ''} target='_blank' style={{ textDecoration: 'underline' }}>Link</a>
                    </span>
                ),
                approvedate: !m?.approvedate ? (
                    <span style={{ color: '#FF0700' }}>wating</span>
                ) : (
                    <div className='flex'>
                        <img alt="approved" src={require('../../../assets/images/approved.png')} style={{ width:'auto', height: 'auto', maxHeight: '20px' }} />
                        <span style={{ color: '#0B9E51', marginLeft: '7px' }}>{getDate(m?.approvedate || '')}</span>
                    </div>
                ),
                rating: !m?.rating ? (
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
                totalearning: !m?.totalearning ? (
                    <span style={{ color: '#FF0700' }}>wating</span>
                ) : (
                    <span style={{ color: '#0B9E51' }}>{toFixed(m?.totalearning || 0)}</span>
                ),
                paymentdate: !m?.paymentdate ? (
                    <span style={{ color: '#FF0700' }}>wating</span>
                ) : (
                    <span style={{ color: '#0B9E51' }}>{getDate(m?.paymentdate || '')}</span>
                ),
                totalcommission: !m?.totalcommission ? (
                    <span style={{ color: '#FF0700' }}>wating</span>
                ) : (
                    <span style={{ color: '#0B9E51' }}>{toFixed(m?.totalcommission || 0)}</span>
                ),
                totalsell: !m?.totalsell ? (
                    <span style={{ color: '#FF0700' }}>wating</span>
                ) : (
                    <span style={{ color: '#0B9E51' }}>{toFixed(m?.totalsell || 0)}</span>
                ),
            });
        })        
        return list;
    }

    const fetchJob = async (_criteria) => {
        const res = await getInfluDetail({ profileid: id, jobstatus: _criteria.status });
        setDataList(mappingData(res?.item?.jobs || []));
    }

    useEffect(() => {
        if (id && id !== 'create') {
            fetchJob(criteria);
        }
    }, [id, criteria])
    
    useEffect(() => {
        if (id && id !== 'create') {
            fetch();
        }
    }, [id])

    const onChangeCriteria = (name, value) => {
        setCriteria({
            ...criteria,
            [name]: value
        })
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
            <BreadCrumb parent="Home" subparent="Register Profile" title="Influ Detail" />

            <Container fluid={true}>
                <Row className='mb-4'>
                    <Col lg='12' xl='6'>
                        <Row>
                            <Col sm='3'>
                                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                    <img alt="profile" src={data?.tiktokprofile?.avatarurl || ''} style={{ width: '100%', height: 'auto', borderRadius: '50%'  }} />
                                </div>
                            </Col>
                            <Col sm='9'>
                                <div style={{ display: 'flex' }}>
                                    <h4>{data?.firstname || ''} {data?.lastname || ''}</h4>
                                    {data?.firstname && (
                                        <h6 style={{ marginLeft: '14px', marginTop: '6px' }}>ผู้แนะนำ : {data?.firstname || ''}</h6>
                                    )}
                                </div>

                                <div style={{ display: 'flex', marginTop: '7px' }}>
                                    <div>
                                        <img alt="tt" src={require('../../../assets/images/tiktok_title.png')} style={{ width:'auto', height: 'auto', maxHeight: '30px' }} />
                                        <p style={{ marginTop: '-7px' }}>Username</p>
                                    </div>
                                    <h5 style={{ marginTop: '10px', marginLeft: '10px' }}><strong>{data?.tiktokprofile?.displayname || ''}</strong></h5>
                                </div>

                                <Row>
                                    <Col xs='4'>
                                        <BoxCount 
                                            text='Followers'
                                            value={(data?.tiktokprofile?.followercount || 0)}
                                        />
                                    </Col>
                                    <Col xs='4'>
                                        <BoxCount 
                                            text='Following'
                                            value={(data?.tiktokprofile?.followingcount || 0)}
                                        />
                                    </Col>
                                    <Col xs='4'>
                                        <BoxCount 
                                            text='Likes'
                                            value={(data?.tiktokprofile?.likecount || 0)}
                                        />
                                    </Col>
                                    <Col xs='4'>
                                        <BoxCount 
                                            text='Heart'
                                            value={(data?.tiktokprofile?.heartcount || 0)}
                                        />
                                    </Col>
                                    <Col xs='4'>
                                        <BoxCount 
                                            text='VDO'
                                            value={(data?.tiktokprofile?.videocount || 0)}
                                        />
                                    </Col>
                                    <Col xs='4'>
                                        <BoxCount 
                                            text='Share'
                                            value={(data?.tiktokprofile?.sharecount || 0)}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        <Row className='mt-2'>
                            <Col lg='11'>
                                <Row>
                                    <Col sm='4' md='4'>
                                        <div className={`profile-select ${tab === 1 ? 'active' : ''}`} onClick={() => setTab(1)}>
                                            <img src={require(tab === 1 ? '../../../assets/images/profile11.png' : '../../../assets/images/profile10.png')} style={{ width: 'auto', height: 'auto', maxHeight: '30px' }} />
                                            <p>ข้อมูลส่วนตัว</p>
                                        </div>
                                    </Col>
                                    <Col sm='4' md='4'>
                                        <div className={`profile-select ${tab === 2 ? 'active' : ''}`} onClick={() => setTab(2)}>
                                            <img src={require(tab === 2 ? '../../../assets/images/profile21.png' : '../../../assets/images/profile20.png')} style={{ width: 'auto', height: 'auto', maxHeight: '30px' }} />
                                            <p>ที่อยู่</p>
                                        </div>
                                    </Col>
                                    <Col sm='4' md='4'>
                                        <div className={`profile-select ${tab === 3 ? 'active' : ''}`} onClick={() => setTab(3)}>
                                            <img src={require(tab === 3 ? '../../../assets/images/profile31.png' : '../../../assets/images/profile30.png')} style={{ width: 'auto', height: 'auto', maxHeight: '30px' }} />
                                            <p>บัญชีธนาคาร</p>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row className='mb-4'>
                            <Col lg='11'>
                                {tab === 1 && (
                                    <Row className='mt-4'>
                                        <BoxInfo 
                                            text='ชื่อ-นามสกุล'
                                            value={`${data?.firstname || ''} ${data?.lastname || ''}`}
                                        />
                                        <BoxInfo 
                                            text='เพศ'
                                            value={getGender(data?.gender || '')}
                                        />
                                        <BoxInfo 
                                            text='อายุ'
                                            value={getYearOld(data?.bhd || '')}
                                        />
                                        <BoxInfo 
                                            text='เบอร์ติดต่อ'
                                            value={data?.mobile || ''}
                                        />
                                        <BoxInfo 
                                            text='รหัสไปรษณีย์'
                                            value={data?.address?.postal || ''}
                                        />
                                        <BoxInfo 
                                            text='อีเมล'
                                            value={data?.email || ''}
                                        />
                                        <BoxInfo 
                                            text='Line ID'
                                            value={data?.lineid || ''}
                                        />
                                    </Row>
                                )}
                               
                                {tab === 2 && (
                                    <Row className='mt-4'>
                                        <BoxInfo 
                                            text='ที่อยู่'
                                            value={data?.address?.address || ''}
                                        />
                                        <BoxInfo 
                                            text='ตำบล'
                                            value={data?.address?.tumbon || ''}
                                        />
                                        <BoxInfo 
                                            text='อำเภอ'
                                            value={data?.address?.district || ''}
                                        />
                                        <BoxInfo 
                                            text='จังหวัด'
                                            value={data?.address?.province || ''}
                                        />
                                        <BoxInfo 
                                            text='รหัสไปรษณีย์'
                                            value={data?.address?.postal || ''}
                                        />
                                    </Row>
                                )}

                                {tab === 3 && (
                                    <Row className='mt-4'>
                                        <BoxInfo 
                                            text='ธนาคาร'
                                            value={data?.accountbank ? masterBank.find((f) => f.id === data?.accountbank)?.name || '' : ''}
                                        />
                                        <BoxInfo 
                                            text='เลขที่บัญชี'
                                            value={data?.accountnumber || ''}
                                        />
                                        <BoxInfo 
                                            text='เลขบัตรประชาชน'
                                            value={data?.idcard || ''}
                                        />
                                        <Col xs='12'>
                                            <Row className='mt-3'>
                                                <Col xs='12'>
                                                    {data?.accountimage && (
                                                        <img src={data?.accountimage || ''} style={{ width: 'auto', height: 'auto', maxHeight: '250px' }} />
                                                    )}
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                )}
                            </Col>
                        </Row>
                    </Col>

                    <Col lg='12' xl='6'>
                        <Row className="g-3 px-3">
                            <Col xs='12' sm='6'>
                                <Card style={{ background: '#FFC3C4' }}>
                                    <CardBody className='box-card'>
                                        <div style={{ minHeight: '34px' }}>
                                            <p style={{ fontSize: 14 }}>จำนวนงานปัจจุบัน</p>
                                        </div>
                                        <h3 style={{ fontWeight: 600 }}>{toFixed(data?.totaljobactive || 0)}</h3>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col xs='12' sm='6'>
                                <Card style={{ background: '#FFDEAF' }}>
                                    <CardBody className='box-card'>
                                        <div style={{ minHeight: '34px' }}>
                                            <p style={{ fontSize: 14 }}>จำนวนงานที่รับค่าจ้าง</p>
                                        </div>
                                        <h3 style={{ fontWeight: 600 }}>{toFixed(data?.totaljobearning || 0)}</h3>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>

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

                        <Row>
                            <Col lg="12">
                                <h6>ประเภทสินค้าที่รับทำไปแล้ว</h6>
                            </Col>
                            <Col md='12' className='mt-2'>
                                <div className='box-filter gap-3'>
                                    {(data?.producttype || []).filter((f) => f !== "").map((m, i) => (
                                        <BoxFilter 
                                            key={i}
                                            text={m}
                                            isView
                                        />
                                    ))}
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {/* <Row className="mb-4 btn-group-showcase">
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
                <Row className='mb-4'>
                    <Col lg='12'>
                        <div className="pull-right">
                            <BoxSearch 
                                value={criteria.keyword}
                                onChange={onChangeCriteria}
                            />
                        </div>
                    </Col>
                </Row> */}
                <Row className="mb-4">
                    <Col md='12'>
                        <h6 className='mb-2'>เลือก</h6>
                        <div className='box-filter gap-3'>
                            {statusList.map((m) => (
                                <BoxFilter 
                                    key={m.id}
                                    text={m.name}
                                    isActive={criteria.status === m.id}
                                    onChange={() => onChangeCriteria('status', m.id)}
                                />
                            ))}
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

export default InfluDetail;

const columns = [
    {
        name: "No.",
        selector: (row) => row["no"],
        sortable: true,
        center: true,
        minWidth: "30px",
    },
    {
        name: "ชื่อแคมเปญ",
        selector: (row) => row["jobtitle"],
        sortable: true,
        center: false,
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
        selector: (row) => row["approvedate"],
        sortable: true,
        center: true,
        minWidth: "150px",
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
]