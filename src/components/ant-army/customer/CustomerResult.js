import React, { Fragment, useEffect, useState } from 'react';
import BreadCrumb from '../../../layout/Breadcrumb'
import { Container, Row, Col, Card, CardBody, CardHeader, Button, Collapse, CardFooter } from 'reactstrap'
import DataTable from 'react-data-table-component'
import { getFilterDate, toFixed } from '../../../util/helpper';
import { Filters } from '../../../constant';
import { BoxCriteriaDate, BoxSearch } from '../criteria/Criteria';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Upload } from 'react-feather';
import { getCustomerList } from '../../../util/customer';
import CustomerHistory from './CustomerHistory';

const customStyles = {
    headCells: {
        style: {
          justifyContent: "center",
          textAlign: "center",
        },
    },
};

const channels = [
    { id: 'Shopee', name: 'Shopee' }
];

const repeacts = [];
const spendings = [];
const warehouses = [];
const statusTransfers = [];
const statusPayments = [];

const filterList = [
    {
        title: 'Order Channel',
        name: 'channels',
        list: channels
    },
    {
        title: 'Repeact purchase',
        name: 'repeacts',
        list: repeacts
    },
    {
        title: 'Spending',
        name: 'spendings',
        list: spendings
    },
    {
        title: 'Warehouse',
        name: 'warehouses',
        list: warehouses
    },
    {
        title: 'Status จัดส่ง',
        name: 'statusTransfers',
        list: statusTransfers
    },
    {
        title: 'Status ชำระเงิน',
        name: 'statusPayments',
        list: statusPayments
    },
]

const init = {
    channels: [],
    repeacts: [],
    spendings: [],
    warehouses: [],
    statusTransfers: [],
    statusPayments: [],
}

const CustomerResult = () => {
    const [data, setData] = useState([]);
    const [isFilter, setIsFilter] = useState(false);
    const [filter, setFilter] = useState({ ...init });
    const [isHealth, setIsHealth] = useState(true);
    const [resetPagination, setResetPagination] = useState(false);


    const [isOpen, setIsOpen] = useState(false);
    const [history, setHistory] = useState([]);

    const [criteria, setCriteria] = useState({
        customType: '',
        keyword: '',
        startDate: '',
        endDate: '',
        ...init
    })

    const onClickDetail = (_list) => {
        setHistory(_list);
        setIsOpen(true);
    }
        
    function mappingData(data){
        const list = [];
    
        data.forEach((m, i) => {
            list.push({
                action: (
                    <div>
                      <span onClick={() => onClickDetail(m.orderhistory)}>
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
                customerid: m?.customerid || '',
                customername: m?.customername || '',
                phone: m?.phone || '',
                address: m?.address || '',
                totalspent: toFixed(m?.totalspent || 0, 2),
                totalpurchase: toFixed(m?.totalpurchase || 0),
                totalaverage: toFixed(m?.totalaverage || 0, 2),
                product: m?.product || '',
                orderchannel: m?.orderchannel || '',
            });
        })
        
        return list;
    }

    const fetch = async (_criteria) => { 
        const filterDate = getFilterDate(_criteria);

        const formValue = {
            page: 1,
            itemperpage: 10000,
            filterbegin: filterDate?.startDate || '',
            filterend: filterDate?.endDate || '',
            keyword: _criteria?.keyword || '',
        }

        const res = await getCustomerList({ ...formValue });
        setData(mappingData(res?.list || []));
        setResetPagination(prev => !prev);
    }

    useEffect(() => {
        fetch(criteria);
    }, [criteria])

    const onChangeCriteria = (name, value) => {
        if (name === 'startDate' || name === 'endDate') {
        setCriteria({
            ...criteria,
            [name]: value,
        })
        } else if (name === 'customType') {
            setCriteria({
                ...criteria,
                [name]: criteria[name] === value ? '' : value,
                startDate: '',
                endDate: ''
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
            <BreadCrumb 
                parent="Home"
                subparent="Dashboard"
                title="Customer"
                isHealth={isHealth}
                setIsHealth={setIsHealth}
            />

            <CustomerHistory 
                isOpen={isOpen}
                datalist={history}
                setOpen={() => setIsOpen(false)}
            />

            <Container fluid={true} style={{ marginTop: '30px' }}>
                <Row style={{ marginBottom: '34px', background: '#F1F1F1', margin: '0px 4px 20px' }}>
                    <Col sm="12" md="6" lg="4">
                        <BoxSearch 
                            value={criteria.keyword}
                            onChange={onChangeCriteria}
                        />
                    </Col>
                    <Col sm="12" md="6" lg="8">
                        <BoxCriteriaDate
                            type={criteria.customType}
                            startDate={criteria.startDate}
                            endDate={criteria.endDate}
                            onChange={onChangeCriteria}
                            onClear={onClearDate}
                        />
                    </Col>
                </Row>

                {/* <Row>
                    <Col md='12' lg="12" xl="8">
                        <div className="default-according style-1 faq-accordion" id="accordionoc">
                            <Card style={{ boxShadow: 'none' }}>
                                <CardHeader style={{ boxShadow: 'none' }}>
                                    <h5 className="mb-0">
                                        <Button color="link ps-0" data-toggle="collapse" onClick={() => setIsFilter(!isFilter)}
                                            data-target="#collapseicon" aria-expanded={isFilter} aria-controls="collapseicon">{Filters}</Button>
                                    </h5>
                                </CardHeader>
                                <Collapse isOpen={isFilter}>
                                    <CardBody className="animate-chk" style={{ boxShadow: 'none' }}> 
                                        {filterList.map((item, i) => (
                                            <Row className='mb-3' key={i}>
                                                <Col xs='4' sm='4' md='4' lg='3' xl='3'>
                                                    <div className='pull-right' style={{ textAlign: 'right' }}>
                                                        <p style={{ fontSize: 13, margin: 0, marginTop: item.name === 'provinces' ? '7px' : 0 }}>{item.title} :</p>
                                                    </div>
                                                </Col>
                                                <Col xs='8' sm='8' md='8' lg='9' xl='9'>
                                                    <div>
                                                        <Typeahead
                                                            id="multiple-typeahead"
                                                            clearButton
                                                            labelKey="name"
                                                            multiple
                                                            options={item.list}
                                                            placeholder="Please select"
                                                            selected={filter[item.name]}
                                                            onChange={(e) => onChangeFilter(item.name, e)}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                        ))}    
                                    </CardBody>
                                    <CardFooter className='flex text-center gap-3'>
                                        <Button color="default" className='text-center' style={{ maxWidth: 150, textDecoration: 'underline' }} onClick={() => onClearFilter()}>Clear</Button>
                                        <Button color='dark' className='text-center' style={{ maxWidth: 150 }} onClick={() => onSubmitFilter()}>Search</Button>
                                    </CardFooter>
                                </Collapse>
                            </Card>
                        </div>
                    </Col>
                </Row> */}
                <Row>
                    <Col sm="12">
                        <Card style={{ boxShadow: 'none' }}>
                            <CardHeader>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h5>{`Result ${toFixed(data.length)} record`}</h5>
                                    <Button color="primary" outline className='btn-js1 text-center' style={{ display: 'flex', alignItems: 'center' }}><Upload size={18} style={{ marginRight: '5px' }} /> Generate Report</Button>
                                </div>
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
                                        paginationResetDefaultPage={resetPagination}
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

export default CustomerResult;

const columns = [
    {
        name: "ID No.",
        selector: (row) => row["customerid"],
        sortable: true,
        center: true,
        wrap: true,
        minWidth: "200px",
    },
    {
        name: "ลูกค้า ชื่อ - นามสกุล",
        selector: (row) => row["customername"],
        sortable: true,
        center: false,
        wrap: true,
        minWidth: "200px",
    },
    {
        name: "เบอร์ติดต่อ",
        selector: (row) => row["phone"],
        sortable: true,
        center: true,
        wrap: true,
        minWidth: "150px",
    },
    {
        name: "Zip code",
        selector: (row) => row["address"],
        sortable: true,
        center: false,
        wrap: true,
        minWidth: "400px",
    },
    {
        name: "จำนวนเงิน (รวม)",
        selector: (row) => row["totalspent"],
        sortable: true,
        center: true,
        wrap: true,
        minWidth: "200px",
    },
    {
        name: "จำนวนการซื้อ",
        selector: (row) => row["totalpurchase"],
        sortable: true,
        center: true,
        wrap: true,
        minWidth: "130px",
    },
    {
        name: "จำนวนเงิน (เฉลี่ยต่อการซื้อ)",
        selector: (row) => row["totalaverage"],
        sortable: true,
        center: true,
        wrap: true,
        minWidth: "240px",
    },
    {
        name: "สินค้า",
        selector: (row) => row["product"],
        sortable: true,
        center: false,
        wrap: true,
        minWidth: "400px",
    },
    {
        name: "ช่องทางการซื้อ",
        selector: (row) => row["orderchannel"],
        sortable: true,
        center: true,
        wrap: true,
        minWidth: "200px",
    },
    {
        name: "ประวัติการสั่งซื้อ",
        selector: (row) => row["action"],
        sortable: true,
        center: true,
        wrap: true,
        minWidth: "150px",
    },
]