import React, { Fragment, useEffect, useState } from 'react';
import BreadCrumb from '../../../layout/Breadcrumb'
import { Container, Row, Col, Card, CardBody, CardHeader, Button, Collapse, CardFooter } from 'reactstrap'
import DataTable from 'react-data-table-component'
import { getFilterDate, toFixed } from '../../../util/helpper';
import { Filters } from '../../../constant';
import { BoxCriteriaDate, BoxSearch } from '../criteria/Criteria';
import { useNavigate } from 'react-router';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Upload } from 'react-feather';
import { getProductList, getProductMaster } from '../../../util/product';

const customStyles = {
    headCells: {
        style: {
          justifyContent: "center",
          textAlign: "center",
        },
    },
};

const filterList = [
    {
        title: 'Category',
        name: 'category',
        list: []
    },
    {
        title: 'Status',
        name: 'status',
        list: []
    },
]

const init = {
    category: [],
    status: []
}

const OrderShopeeResult = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [isFilter, setIsFilter] = useState(false);
    const [filter, setFilter] = useState({ ...init });
    const [isHealth, setIsHealth] = useState(true);

    const [category, setCategory] = useState([]);
    const [status, setStatus] = useState([]);

    useEffect(() => {
        getMasterData();
    }, [])

    const getMasterData = async () => {
        const res = await getProductMaster({});
        setCategory(
            (res?.data?.categories || []).map((m) => ({ id: m, name: m }))
        );
        setStatus(
            (res?.data?.statuses || []).map((m) => ({ id: m, name: m }))
        );
    }

    const [criteria, setCriteria] = useState({
        customType: '',
        keyword: '',
        startDate: '',
        endDate: '',
        ...init
    })

    const onClickDetail = (id) => {

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
                id: m?.id || '',
                name: m?.name || '',
                sku: m?.sku || '',
                category: m?.category || '',
                saleprice: m?.saleprice || '',
                stock: m?.stock || '',
                status: m?.status === 1 ? 'Active' : 'Inactive',
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
            category: _criteria.category.map((m) => m.id) || '',
            status: _criteria.status.map((m) => m.id) || '',
        }

        const res = await getProductList({ ...formValue });
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
                title="Stock"
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
                                                                item.name === "category" ? category
                                                                : item.name === "status" ? status
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

export default OrderShopeeResult;

const columns = [
    {
        name: "ID No.",
        selector: (row) => row["id"],
        sortable: true,
        center: true,
        wrap: true,
        minWidth: "150px",
    },
    {
        name: "Name",
        selector: (row) => row["name"],
        sortable: true,
        center: false,
        wrap: true,
        minWidth: "400px",
    },
    {
        name: "SKU",
        selector: (row) => row["sku"],
        sortable: true,
        center: false,
        wrap: true,
        minWidth: "200px",
    },
    {
        name: "Category",
        selector: (row) => row["category"],
        sortable: true,
        center: true,
        wrap: true,
        minWidth: "200px",
    },
    {
        name: "Sale price",
        selector: (row) => row["saleprice"],
        sortable: true,
        center: true,
        wrap: true,
        minWidth: "200px",
    },
    {
        name: "Stock",
        selector: (row) => row["stock"],
        sortable: true,
        center: true,
        wrap: true,
        minWidth: "200px",
    },
    {
        name: "Status",
        selector: (row) => row["status"],
        sortable: true,
        center: true,
        wrap: true,
        minWidth: "100px",
    },
]