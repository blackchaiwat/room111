import React, { Fragment, useEffect, useState } from 'react';
import BreadCrumb from '../../../layout/Breadcrumb'
import { Container, Row, Col } from 'reactstrap'
import DataTable from 'react-data-table-component'
import { fDate, getFilterDate, toFixed } from '../../../util/helpper';
import { BoxCustomDate, BoxCustomType, BoxFilter, BoxSearch } from '../criteria/Criteria';
import { getTargetList } from '../../../util/audience';
import { useNavigate } from 'react-router';

const customStyles = {
    headCells: {
        style: {
          justifyContent: "center",
          textAlign: "center",
        },
    },
};

const AudienceList = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [criteria, setCriteria] = useState({
        customType: '',
        keyword: '',
        sort: '',
        startDate: '',
        endDate: '',
    })

    const fetch = async (_criteria) => {
        const filterDate = getFilterDate(_criteria);
        
        const formValue = {
            page: 1,
            itemperpage: 10000,
            filterbegindate: filterDate?.startDate || '',
            filterenddate: filterDate?.endDate || '',
            filtertitle: _criteria?.keyword || '',
            sortfield: _criteria?.sort || '',
            sortorder: _criteria?.sort === 'title' ? "asc" : _criteria?.sort === "created" ? "desc" : ""
        }

        const res = await getTargetList({ ...formValue });
        setData(mappingData(res?.list || []));
    }

    useEffect(() => {
        fetch(criteria);
    }, [criteria])

    const onClickEdit = (id) => {
        navigate(`${process.env.PUBLIC_URL}/audience/audience-form/${id}`);
    }

    function mappingData(data){
        const list = [];
    
        data.forEach((m, i) => {
            list.push({
                no: i + 1,
                name: m.title,
                createDate: fDate(m.created),
                influCount: toFixed(m.totalinfluencer ?? 0),
                action: (
                    <div>
                      <span>
                        <i
                          className="fa fa-trash"
                          style={{ cursor: 'pointer', width: 35, fontSize: 16, padding: 11, color: "#e4566e" }}
                        ></i>
                      </span>
                      <span onClick={() => onClickEdit(m.audienceid)}>
                        <i
                          className="fa fa-pencil"
                          style={{
                            width: 35,
                            fontSize: 16,
                            padding: 11,
                            color: "rgb(40, 167, 69)",
                            cursor: 'pointer',
                          }}
                        ></i>
                      </span>
                    </div>
                )
            });
        })
        
        return list;
    }

    const onChangeCriteria = (name, value) => {
        if (name === 'startDate' || name === 'endDate') {
            setCriteria({
                ...criteria,
                [name]: value,
                customType: ''
            })
        } else if (name === 'customType' || name === 'sort') {
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
            <BreadCrumb parent="Home" subparent="Audience" title="Target Audience" />
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
                                text='เรียงตามวันที่สร้าง'
                                isActive={criteria.sort === 'created'}
                                onChange={() => onChangeCriteria('sort', 'created')}
                            />

                            <BoxFilter 
                                text='เรียงตามตัวอักษร'
                                isActive={criteria.sort === 'title'}
                                onChange={() => onChangeCriteria('sort', 'title')}
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
            </Container>
        </Fragment>
    );
};

export default AudienceList;


const columns = [
    {
        name: "No.",
        selector: (row) => row["no"],
        sortable: true,
        center: true,
        minWidth: "100px",
    },
    {
        name: "ชื่อ Target Audience",
        selector: (row) => row["name"],
        sortable: true,
        center: false,
        minWidth: "500px",
    },
    {
        name: "สร้างเมื่อ",
        selector: (row) => row["createDate"],
        sortable: true,
        center: true,
        minWidth: "150px",
    },
    {
        name: "จำนวน influ",
        selector: (row) => row["influCount"],
        sortable: true,
        center: true,
        minWidth: "150px",
    },
    {
        name: "",
        selector: (row) => row["action"],
        sortable: true,
        center: true,
        minWidth: "150px",
    },
]