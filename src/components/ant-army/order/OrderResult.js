import { Fragment, useEffect, useState } from 'react';
import BreadCrumb from '../../../layout/Breadcrumb'
import { Container, Row, Col, Card, CardBody, CardHeader, Button, Collapse, CardFooter } from 'reactstrap'
import DataTable from 'react-data-table-component'
import { getDate, getDateTime, getFilterDate, toFixed } from '../../../util/helpper';
import { Filters } from '../../../constant';
import { BoxCriteriaDate, BoxSearch } from '../criteria/Criteria';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Upload } from 'react-feather';
import { getOrderList, getOrderMaster } from '../../../util/order';

const customStyles = {
    headCells: {
        style: {
          justifyContent: "center",
          textAlign: "center",
        },
    },
};

const channels = [
    { id: 'Shopee', name: 'Shopee' },
    { id: 'TIKTOK', name: 'TIKTOK' },
];

const repeacts = [];
const spendings = [];

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
        list: []
    },
    {
        title: 'Status จัดส่ง',
        name: 'statusTransfers',
        list: []
    },
    {
        title: 'Status ชำระเงิน',
        name: 'statusPayments',
        list: []
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

const OrderResult = () => {
    const [data, setData] = useState([]);
    const [isFilter, setIsFilter] = useState(false);
    const [filter, setFilter] = useState({ ...init });
    const [isHealth, setIsHealth] = useState(true);

    const [warehouses, setWarehouses] = useState([]);
    const [statusTransfers, setStatusTransfers] = useState([]);
    const [statusPayment, setStatusPayment] = useState([]);

    useEffect(() => {
        getMasterData();
    }, [])

    const getMasterData = async () => {
        const res = await getOrderMaster({});
        setWarehouses(
            (res?.data?.warehouses || []).map((m) => ({ id: m, name: m }))
        );
        setStatusTransfers(
            (res?.data?.deliverystatuses || []).map((m) => ({ id: m, name: m }))
        );
        setStatusPayment(
            (res?.data?.paymentstatuses || []).map((m) => ({ id: m, name: m }))
        );
    }

    const [criteria, setCriteria] = useState({
        customType: '',
        keyword: '',
        startDate: '',
        endDate: '',
        ...init
    })

    function mappingData(data){
        const list = [];
    
        data.forEach((m, i) => {
            list.push({
                orderid: m?.orderid || '',
                orderno: m?.orderno || '',
                orderchannel: m?.orderchannel || '',
                orderdate: getDate(m?.orderdate || ''),
                paymentdate: getDateTime(m?.paymentdate || ''),
                product: m?.product || '',
                paymentamount: toFixed(m?.paymentamount || 0, 2),
                warehouse: m?.warehouse || '',
                invoiceno: m?.invoiceno || '',
                receiptno: m?.receiptno || '',
                trackingcode: m?.trackingcode || '',
                deliverydate: getDateTime(m?.deliverydate || ''),
                statusdelivery: m?.deliverystatus || '',
                paymentstatus: m?.paymentstatus,
                paymentchannel: m?.paymentchannel || '',
                customername: m?.customername || '',
                customerphone: m?.customerphone || '',
                customeraddress: m?.customeraddress || '',
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
            orderchannel: _criteria.channels.map((m) => m.id) || '',
            repeacts: _criteria.repeacts.map((m) => m.id) || '',
            spendings: _criteria.spendings.map((m) => m.id) || '',
            warehouse: _criteria.warehouses.map((m) => m.id) || '',
            deliverystatus: _criteria.statusTransfers.map((m) => m.id) || '',
            paymentstatus: _criteria.statusPayments.map((m) => m.id) || '',
        }

        const res = await getOrderList({ ...formValue });
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
                title="Order"
                isHealth={isHealth}
                setIsHealth={setIsHealth}
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

                <Row>
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
                                                            options={
                                                                item.name === "warehouses" ? warehouses
                                                                : item.name === "statusTransfers" ? statusTransfers
                                                                : item.name === "statusPayments" ? statusPayment
                                                                : item.list
                                                            }
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
                </Row>
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

export default OrderResult;

const columns = [
    {
        name: "ID No.",
        selector: (row) => row["orderid"],
        sortable: true,
        center: true,
        wrap: true,
        minWidth: "150px",
    },
    {
        name: "Order No",
        selector: (row) => row["orderno"],
        sortable: true,
        center: false,
        wrap: true,
        minWidth: "250px",
    },
    {
        name: "ช่องทางการขาย",
        selector: (row) => row["orderchannel"],
        sortable: true,
        center: true,
        wrap: true,
        minWidth: "150px",
    },
    {
        name: "วันที่สั่งซื้อ",
        selector: (row) => row["orderdate"],
        sortable: true,
        center: true,
        wrap: true,
        minWidth: "150px",
    },
    {
        name: "วันที่ชำระ",
        selector: (row) => row["paymentdate"],
        sortable: true,
        center: true,
        wrap: true,
        minWidth: "200px",
    },
    {
        name: "สินค้า",
        selector: (row) => row["product"],
        sortable: true,
        center: false,
        wrap: true,
        minWidth: "300px",
    },
    {
        name: "จำนวนเงิน",
        selector: (row) => row["paymentamount"],
        sortable: true,
        center: true,
        wrap: true,
        minWidth: "130px",
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
        name: "Invoice No",
        selector: (row) => row["invoiceno"],
        sortable: true,
        center: false,
        wrap: true,
        minWidth: "200px",
    },
    {
        name: "Receipt No",
        selector: (row) => row["receiptno"],
        sortable: true,
        center: false,
        wrap: true,
        minWidth: "200px",
    },
    {
        name: "Delivery No",
        selector: (row) => row["trackingcode"],
        sortable: true,
        center: false,
        wrap: true,
        minWidth: "200px",
    },
    {
        name: "Delivery date",
        selector: (row) => row["deliverydate"],
        sortable: true,
        center: true,
        wrap: true,
        minWidth: "200px",
    },
    {
        name: "Status จัดส่ง",
        selector: (row) => row["deliverystatus"],
        sortable: true,
        center: true,
        wrap: true,
        minWidth: "200px",
    },
    {
        name: "Status ชำระเงิน",
        selector: (row) => row["paymentstatus"],
        sortable: true,
        center: true,
        wrap: true,
        minWidth: "200px",
    },
    {
        name: "ช่องทางชำระเงิน",
        selector: (row) => row["paymentchannel"],
        sortable: true,
        center: true,
        wrap: true,
        minWidth: "200px",
    },
      {
        name: "ลูกค้า",
        selector: (row) => row["customername"],
        sortable: true,
        center: false,
        wrap: true,
        minWidth: "200px",
    },
      {
        name: "เบอร์ติดต่อ",
        selector: (row) => row["customerphone"],
        sortable: true,
        center: false,
        wrap: true,
        minWidth: "200px",
    },
      {
        name: "Zip Code",
        selector: (row) => row["customeraddress"],
        sortable: true,
        center: false,
        wrap: true,
        minWidth: "400px",
    },
]