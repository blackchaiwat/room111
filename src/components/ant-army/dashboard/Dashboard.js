import React, { Fragment, useEffect, useState } from 'react';
import BreadCrumb from '../../../layout/Breadcrumb'
import { Container, Row, Col, Card, CardBody, CardHeader, CardFooter, Table } from 'reactstrap'
import DataTable from 'react-data-table-component'
import { getYearOld, toFixed } from '../../../util/helpper';
import { BoxCustomDate, BoxCustomType, BoxFilter, BoxSearch } from '../criteria/Criteria';
import Chart from 'react-apexcharts'
import tc1 from '../../../assets/images/dashboard/sale-product-1.png'
import tc2 from '../../../assets/images/dashboard/sale-product-2.png'
import tc3 from '../../../assets/images/dashboard/sale-product-3.png'
import tc4 from '../../../assets/images/dashboard/sale-product-4.png'

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

function mappingData(data){
    const list = [];

    data.forEach((m, i) => {
        list.push({
            no: i + 1,
            firstname: m.firstname,
            lastname: m.lastname,
            tiktokaccount: m.tiktokaccount,
            follower: toFixed(m.follower),
            like: toFixed(m.like),
            heart: toFixed(m.heart),
            vdo: toFixed(m.vdo),
            share: toFixed(m.share),
            engagement: toFixed(m.engagement),
            registerdate: m.registerdate,
            location: m.location,
            gender: m.gender,
            year: getYearOld(m.birthdate),
        });
    })
    
    return list;
}

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState({
        register: 1304000,
        receive: 50000,
        commission: 200000,
        commissionTiktok: 8888888,
        amount: 888888888
    });

    const [criteria, setCriteria] = useState({
        customType: 'month',
        startDate: '',
        endDate: '',
    })

    useEffect(() => {
        setData(mappingData(demo));
    }, [])

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

    const seriesYearOld = [
        {
            name: 'หญิง',
            data: [44, 55, 57, 56, 61, 100]
        }, {
            name: 'ชาย',
            data: [76, 85, 101, 98, 87, 105]
        }, {
            name: 'LGBTQ+',
            data: [35, 41, 36, 26, 45, 48]
        }
    ]

    const seriesGender = [300, 200, 150]

    const seriesGraph = [{
        name: "จำนวนคน",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
    }]

    return (
        <Fragment>
            <BreadCrumb parent="Home" subparent="Dashboard" title="Dashboard" />
            <Container fluid={true}>
                <Row>
                    <Col>
                        <Card style={{ background: '#FFC3C4', maxWidth: 230 }}>
                            <CardBody className='box-card'>
                                <div className='box-card-title'>
                                    <p>จำนวนคนที่สมัครทั้งหมด (คน)</p>
                                </div>
                                <h3 style={{ fontWeight: 600 }}>{toFixed(total.register)}</h3>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col>
                        <Card style={{ background: '#FFDEAF', maxWidth: 230 }}>
                            <CardBody className='box-card'>
                                <div className='box-card-title'>
                                    <p>จำนวนคนที่รับงาน (คน)</p>
                                </div>
                                <h3 style={{ fontWeight: 600 }}>{toFixed(total.receive)}</h3>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="bg-primary" style={{ maxWidth: 230 }}>
                            <CardBody className='box-card'>
                                <div className='box-card-title'>
                                    <p>จำนวนค่าจ้างทำงานจากพร้อมขายทั้งหมด (THB)</p>
                                </div>
                                <h3 style={{ fontWeight: 600 }}>{toFixed(total.commission)}</h3>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col>
                        <Card style={{ background: '#FFFFBB', maxWidth: 230 }}>
                            <CardBody className='box-card'>
                                <div className='box-card-title'>
                                    <p>ค่าคอมจากการติดตระกร้าทั้งหมด (THB) ข้อมูลจาก Tiktok</p>
                                </div>
                                <h3 style={{ fontWeight: 600 }}>{toFixed(total.commissionTiktok)}</h3>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col>
                        <Card style={{ background: '#B5FFBD', maxWidth: 230 }}>
                            <CardBody className='box-card'>
                                <div className='box-card-title'>
                                    <p>ยอดขายสินค้าทั้งหมด (THB) ข้อมูลจาก Tiktok</p>
                                </div>
                                <h3 style={{ fontWeight: 600 }}>{toFixed(total.amount)}</h3>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col sm="12" xl="8">
                        <Card>
                            <CardHeader>
                                <h5>จำนวนคนที่สมัคร (คน)</h5>
                            </CardHeader>
                            <CardBody>
                                <Row className="mb-4 dashboard-btn-groups">
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
                                <Row>
                                    {optionsGraph && seriesGraph && (
                                        <Chart 
                                            options={optionsGraph}
                                            series={seriesGraph}
                                            type="line"
                                            height={434}
                                        />
                                    )}
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>

                    <Col sm="12" xl="4">
                        <Card>
                            <CardHeader>
                                <h5>Top 5 แคมเปญ </h5>
                            </CardHeader>
                            <CardBody className="p-0">
                                <div className="sales-product-table table-responsive">
                                    <Table borderless>
                                        <tbody>
                                            <tr>
                                                <td><img className="img-fluid" src={tc1} alt="" /></td>
                                                <td><span>{"Latest"} </span><span className="d-block">{"Niky Black shoes"}</span></td>
                                                <td><span className="badge rounded-pill pill-badge-secondary">{"21,562"}</span></td>
                                            </tr>
                                            <tr>
                                                <td><img className="img-fluid" src={tc2} alt="" /></td>
                                                <td><span>{"Latest Men"} </span><span className="d-block">{"Shirt"}</span></td>
                                                <td><span className="badge rounded-pill pill-badge-secondary">{"21,562"}</span></td>
                                            </tr>
                                            <tr>
                                                <td><img className="img-fluid" src={tc3} alt="" /></td>
                                                <td><span>{"Latest Women "}</span><span className="d-block">{"Purse"}</span></td>
                                                <td><span className="badge rounded-pill pill-badge-secondary">{"21,562"}</span></td>
                                            </tr>
                                            <tr>
                                                <td><img className="img-fluid" src={tc4} alt="" /></td>
                                                <td><span>{"Latest"} </span><span className="d-block">{"Women Sandals"}</span></td>
                                                <td><span className="badge rounded-pill pill-badge-secondary">{"21,562"}</span></td>
                                            </tr>
                                            <tr>
                                                <td><img className="img-fluid" src={tc4} alt="" /></td>
                                                <td><span>{"Latest"} </span><span className="d-block">{"Women Sandals"}</span></td>
                                                <td><span className="badge rounded-pill pill-badge-secondary">{"21,562"}</span></td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>
                            </CardBody>
                            <CardFooter className="sales-product-table-footer">
                                <div className="media">
                                    <a href="#!" className="btn btn-outline-light">{"Last Week"}<i className="fa fa-angle-double-right ms-2"></i></a>
                                    <div className="media-body"><a href="#!" className="pull-right">View More Reports</a></div>
                                </div>
                            </CardFooter>
                        </Card>
                    </Col>

                    <Col sm="12" xl="4">
                        <Card>
                            <CardHeader>
                                <h5>เพศ</h5>
                            </CardHeader>
                            <CardBody style={{ height: 324 }}>
                                <div id="gender-chart">
                                    {optionsGender && seriesGender && (
                                        <Chart 
                                            options={optionsGender}
                                            series={seriesGender}
                                            type="donut"
                                            height={250}
                                        />
                                    )}
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col sm="12" xl="8">
                        <Card>
                            <CardHeader>
                                <h5>อายุ</h5>
                            </CardHeader>
                            <CardBody>
                                <div id="year-old-chart">
                                    {optionsYearOld && seriesYearOld && (
                                        <Chart 
                                            options={optionsYearOld}
                                            series={seriesYearOld}
                                            type="bar"
                                            height={250}
                                        />
                                    )}
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );
};

export default Dashboard;

const optionsGraph = {
    chart: {
        height: 250,
        type: 'line',
        zoom: {
          enabled: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'straight'
    },
    grid: {
        row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0.5
        },
    },
    yaxis: {
        title: {
            text: 'จำนวน(คน)'
        },
    },
    tooltip: {
        style: {
            fontFamily: 'Prompt, sans-serif  !important',
        },
    },
    xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    }
}

const optionsGender = {
    chart: {
      type: 'donut',
      height: 250
    },
    colors:['#544FFF', '#51BB25', '#FB2D63'],
    labels: ['หญิง', 'ชาย', 'LGBTQ+'],
    plotOptions: {
        pie: {
            donut: {
                size: '40%'
            }
        }
    },
    tooltip: {
        style: {
            fontFamily: 'Prompt, sans-serif  !important',
        },
    },
    responsive: [{
        breakpoint: 480,
        options: {
            chart: {
                width: 300
            },
            legend: {
                position: 'bottom'
            }
        }
    }]
}

const optionsYearOld = {
    chart: {
        type: 'bar',
        height: 250
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
        },
    },
    dataLabels: {
        enabled: false
    },
    colors:['#544FFF', '#51BB25', '#FB2D63'],
    stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
    },
    xaxis: {
        categories: ['<18', '18-24', '25-34', '35-44', '45-54', '55+'],
    },
    yaxis: {
        title: {
            text: 'จำนวน(คน)'
        },
    },
    fill: {
        opacity: 1
    },
    tooltip: {
        style: {
            fontFamily: 'Prompt, sans-serif  !important',
        },
        y: {
            formatter: function (val) {
                return "" + val + ""
            }
        }
    }
};


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