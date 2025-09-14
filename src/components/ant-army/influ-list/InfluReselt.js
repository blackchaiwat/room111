import React, { Fragment, useEffect, useState } from 'react';
import BreadCrumb from '../../../layout/Breadcrumb'
import { Container, Row, Col, Card, CardBody, CardHeader, Button, Collapse, CardFooter } from 'reactstrap'
import DataTable from 'react-data-table-component'
import { getDate, getFilterDate, getFilterMinMax, getGender, getYearOld, toFixed } from '../../../util/helpper';
import { Filters } from '../../../constant';
import { BoxCustomDate, BoxCustomType, BoxFilter, BoxSearch } from '../criteria/Criteria';
import { useNavigate } from 'react-router';
import { getInfluList } from '../../../util/influ';
import useProvince from '../../../util/useProvince';
import useProductType from '../../../util/useProductType';
import { Typeahead } from 'react-bootstrap-typeahead';

const customStyles = {
    headCells: {
        style: {
          justifyContent: "center",
          textAlign: "center",
        },
    },
};

const ranges = ['0-1,000', '1,001-3,000', '3,001-5,000', '5,001-10,000', '10,001-50,000', '50,001-100,000', '100,001-500,000', '500,001-1,000,000', '1,000,000 +'];

const filterList = [
    {
        title: 'จำนวนผู้ติดตาม',
        name: 'followers',
        list: ranges
    },
    {
        title: 'Like',
        name: 'likes',
        list: ranges
    },
    {
        title: 'VDO',
        name: 'vdos',
        list: ranges
    },
    {
        title: 'Heart',
        name: 'hearts',
        list: ranges
    },
    {
        title: 'Share',
        name: 'shares',
        list: ranges
    },
    {
        title: 'Engagement',
        name: 'engagements',
        list: ranges
    },
    {
        title: 'อายุ',
        name: 'years',
        list: [
            {
                id: '0-17',
                name: '<18'
            },
            {
                id: '18-24',
                name: '18-24'
            },
            {
                id: '25-34',
                name: '25-34'
            },
            {
                id: '35-44',
                name: '35-44'
            },
            {
                id: '45-54',
                name: '45-54'
            },
            {
                id: '55-99',
                name: '55+'
            },
        ]
    },
    {
        title: 'เพศ',
        name: 'genders',
        list: [
            { id: 'MALE', name: 'ชาย' },
            { id: 'FEMALE', name: 'หญิง' },
            { id: 'LGBTQ+', name: 'LGBTQ+' },
        ]
    },
    {
        title: 'จังหวัด',
        name: 'provinces',
    },
    {
        title: 'ประเภทสินค้าที่เคยรับ',
        name: 'types',
    },
    {
        title: 'ค่าจ้างทำงานที่ได้รับ',
        name: 'earnings',
        list: ranges
    },
    {
        title: 'ค่าคอมที่ได้รับ',
        name: 'commissions',
        list: ranges
    },
    {
        title: 'ยอดขาย',
        name: 'amounts',
        list: ['0-10,000', '10,001-50,000', '50,001-100,000', '100,001-500,000', '500,001-1,000,000', '1,000,000 +']
    },
    {
        title: 'สถานะ',
        name: 'status',
        list: ['Active', 'Block']
    },
]

const init = {
    followers: [],
    likes: [],
    vdos: [],
    hearts: [],
    shares: [],
    engagements: [],
    years: [],
    genders: [],
    types: [],
    earnings: [],
    commissions: [],
    amounts: [],
    status: [],
    provinces: []
}

const InfluResult = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [isFilter, setIsFilter] = useState(false);
    const [filter, setFilter] = useState({ ...init });

    const masterProvince = useProvince();
    const masterProductType = useProductType();

    const [criteria, setCriteria] = useState({
        customType: '',
        keyword: '',
        startDate: '',
        endDate: '',
        ...init
    })

    const onClickDetail = (id) => {
        navigate(`${process.env.PUBLIC_URL}/influ/detail/${id}`);
    }
        
    function mappingData(data){
        const list = [];
    
        data.forEach((m, i) => {
            list.push({
                action: (
                    <div>
                      <span onClick={() => onClickDetail(m.profileid)}>
                        <i
                          className="fa fa-eye"
                          style={{
                            width: 35,
                            fontSize: 16,
                            padding: 11,
                            color: "#034bb9",
                            cursor: 'pointer',
                          }}
                        ></i>
                      </span>
                    </div>
                ),
                no: i + 1,
                firstname: m?.firstname || '',
                lastname: m?.lastname || '',
                tiktokaccount: m?.tiktokprofile?.user || '',
                follower: toFixed(m?.tiktokprofile?.followercount || 0),
                like: toFixed(m?.tiktokprofile?.likecount || 0),
                heart: toFixed(m?.tiktokprofile?.heartcount || 0),
                vdo: toFixed(m?.tiktokprofile?.videocount || 0),
                share: toFixed(m?.tiktokprofile?.sharecount || 0),
                engagement: toFixed(m?.tiktokprofile?.engagementcount || 0),
                registerdate: getDate(m?.created || ''),
                location: m?.address?.province || '',
                gender: getGender(m?.gender || ''),
                year: getYearOld(m?.bhd || ''),
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
            filterfollower: getFilterMinMax(_criteria.followers),
            filterlike: getFilterMinMax(_criteria.likes),
            filtervideo: getFilterMinMax(_criteria.vdos),
            filterheart: getFilterMinMax(_criteria.hearts),
            filtershare: getFilterMinMax(_criteria.shares),
            filterengagement: getFilterMinMax(_criteria.engagements),
            filterearning: getFilterMinMax(_criteria.earnings),
            filtercommission: getFilterMinMax(_criteria.commissions),
            filtersell: getFilterMinMax(_criteria.amounts),
            filterage: getFilterMinMax(_criteria.years),
            filtergender: _criteria?.genders || '',
            filterprovince: _criteria.provinces.map((m) => m.name) || '',
            filterproducttype: _criteria?.types || '',
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
            if (name === 'types' && (filter[name].length) === 3) {

            } else {
                setFilter({
                    ...filter,
                    [name]: [...filter[name], value]
                })
            }
        }
    }

    const onChangeFilter = (name, value) => {
        setFilter({
            ...filter,
            [name]: value
        })
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
            <BreadCrumb parent="Home" subparent="Register Profile" title="INFLU LIST" />
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
                <Row className='mb-4'>
                    <Col lg='12'>
                        <div className="pull-right">
                            <BoxSearch 
                                value={criteria.keyword}
                                onChange={onChangeCriteria}
                            />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md='12'>
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
                                                <Col xs='3' sm='2' md='2' lg='3' xl='2'>
                                                    <div className='pull-right' style={{ textAlign: 'right' }}>
                                                        <p style={{ fontSize: 13, margin: 0, marginTop: item.name === 'provinces' ? '7px' : 0 }}>{item.title} :</p>
                                                        {item.name === 'types' && (
                                                            <p style={{ fontSize: 10, margin: 0  }}>เลือกได้สูงสุด 3</p>
                                                        )}
                                                        {item.name === 'earnings' && (
                                                            <p style={{ fontSize: 10, margin: 0  }}>จากพร้อมขาย</p>
                                                        )}
                                                        {item.name === 'commissions' && (
                                                            <p style={{ fontSize: 10, margin: 0  }}>จาก Tiktok</p>
                                                        )}
                                                    </div>
                                                </Col>
                                                <Col xs='9' sm='10' md='10' lg='9' xl='10'>
                                                    {(item.name === 'genders' || item.name === 'years') ? (
                                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                                                            {item.list.map((m) => (
                                                                <BoxFilter
                                                                    key={m.id}
                                                                    text={m.name}
                                                                    isActive={filter[item.name].indexOf(m.id) > -1}
                                                                    onChange={() => onSelect(item.name, m.id)}
                                                                />
                                                            ))}
                                                        </div>
                                                    ) : item.name === 'provinces' ? (
                                                        <div>
                                                            <Typeahead
                                                                id="multiple-typeahead"
                                                                clearButton
                                                                labelKey="name"
                                                                multiple
                                                                options={masterProvince}
                                                                placeholder="กรุณาเลือกจังหวัด"
                                                                selected={filter.provinces}
                                                                onChange={(e) => onChangeFilter('provinces', e)}
                                                            />
                                                        </div>
                                                    ) : item.name === 'types' ? (
                                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                                                            {masterProductType.map((m) => (
                                                                <BoxFilter
                                                                    key={m.id}
                                                                    text={m.name}
                                                                    isActive={filter[item.name].indexOf(m.id) > -1}
                                                                    onChange={() => onSelect(item.name, m.id)}
                                                                />
                                                            ))}
                                                        </div>
                                                    ) : (
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
                                                    )}
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
                </Row>
                <Row>
                    <Col sm="12">
                        <Card>
                            <CardHeader>
                                <h5>{`ทั้งหมด ${toFixed(data.length)} คน`}</h5>
                            </CardHeader>
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

export default InfluResult;

const columns = [
    {
        name: "",
        selector: (row) => row["action"],
        sortable: true,
        center: true,
        minWidth: "100px",
    },
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
        name: "Follower",
        selector: (row) => row["follower"],
        sortable: true,
        center: true,
        minWidth: "130px",
    },
    {
        name: "Like",
        selector: (row) => row["like"],
        sortable: true,
        center: true,
        minWidth: "130px",
    },
    {
        name: "Heart",
        selector: (row) => row["heart"],
        sortable: true,
        center: true,
        minWidth: "130px",
    },
    {
        name: "VDO",
        selector: (row) => row["vdo"],
        sortable: true,
        center: true,
        minWidth: "130px",
    },
    {
        name: "Share",
        selector: (row) => row["share"],
        sortable: true,
        center: true,
        minWidth: "130px",
    },
    {
        name: "Engagement",
        selector: (row) => row["engagement"],
        sortable: true,
        center: true,
        minWidth: "150px",
    },
    {
        name: "วันที่สมัคร",
        selector: (row) => row["registerdate"],
        sortable: true,
        center: true,
        minWidth: "150px",
    },
    {
        name: "Location",
        selector: (row) => row["location"],
        sortable: true,
        center: true,
        minWidth: "130px",
    },
    {
        name: "เพศ",
        selector: (row) => row["gender"],
        sortable: true,
        center: true,
        minWidth: "130px",
    },
    {
        name: "อายุ",
        selector: (row) => row["year"],
        sortable: true,
        center: true,
        minWidth: "130px",
    },
]