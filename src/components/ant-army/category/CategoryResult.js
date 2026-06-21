import { Fragment, useEffect, useState } from 'react';
import { Row, Col, Card, CardBody, Input, Label, Badge } from 'reactstrap'
import DataTable from 'react-data-table-component'
import { BoxFilter, BoxSearch } from '../criteria/Criteria';
import { BoxLoading } from '../criteria/BoxAlert';
import { getCategoryList, getCategoryStatus } from '../../../util/category';

const customStyles = {
    headCells: {
        style: {
          justifyContent: "center",
          textAlign: "center",
        },
    },
};

const CategoryResult = ({ setDataEdit }) => {
    const [dataList, setDataList] = useState([]);
    const [datas, setDatas] = useState([]);
    const [resetPagination, setResetPagination] = useState(false);

    const [loading, setLoading] = useState(false);

    const [criteria, setCriteria] = useState({
        producttype: 'all',
        keyword: '',
    })

    useEffect(() => {
        setDataList(mappingData([...datas]));
    }, [])
        
    function mappingData(data){
        const list = [];
    
        data.forEach((m, i) => {
            list.push({
                ...m,
                no: i + 1,
            });
        })
        
        return list;
    }

    const fetch = async (_criteria) => { 
        const formValue = {
            page: 1,
            itemperpage: 10000,
            producttypecode: _criteria?.producttype === 'all' ? "" : _criteria?.producttype || '',
            searchtext: _criteria?.keyword || '',
        }

        const res = await getCategoryList({ ...formValue });

        setDataList(mappingData(res?.list || []));
        setDatas(res?.list || []);

        setResetPagination(prev => !prev);
    }

    useEffect(() => {
        fetch(criteria);
    }, [criteria])

    const onChangeCriteria = (name, value) => {
        setCriteria({
            ...criteria,
            [name]: value
        })
    }
    
    const onChangeStatus = async (row) => {
        await getCategoryStatus({ id: row.id, status: row.status === 'Active' ? 'Inactive' : 'Active' });

        fetch(criteria);
    }

    const handleEdit = (row) => {
        setDataEdit({ ...row });
    }

    return (
        <Fragment>
            <BoxLoading open={loading} setOpen={setLoading} />

            <Row>
                <h6 className='mb-4'>Category Data</h6>
                <Col md="12" lg="6" >
                    <h6 className='mb-2'>Filter</h6>
                    <div className='box-filter gap-3'>
                        <BoxFilter
                            text='All'
                            isActive={criteria.producttype === 'all'}
                            onChange={() => onChangeCriteria('producttype', 'all')}
                        />

                        <BoxFilter
                            text='Human'
                            isActive={criteria.producttype === 'H'}
                            onChange={() => onChangeCriteria('producttype', 'H')}
                        />

                        <BoxFilter 
                            text='Pets'
                            isActive={criteria.producttype === 'P'}
                            onChange={() => onChangeCriteria('producttype', 'P')}
                        />
                    </div>
                </Col>
                <Col md="12" lg="6" >
                    <div className="pull-right">
                        <BoxSearch 
                            value={criteria.keyword}
                            onChange={onChangeCriteria}
                            placeholder='ใส่ code'
                            isNew
                        />
                    </div>
                </Col>
            </Row>

            <Row>
                <Col sm="12">
                    <Card style={{ boxShadow: 'none' }}>
                        <CardBody>
                            <div className="table-responsive support-table">
                                <DataTable
                                    columns={
                                        columns(
                                            onChangeStatus,
                                            handleEdit
                                        )
                                    }
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
                                    paginationResetDefaultPage={resetPagination}
                                />
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    );
};

export default CategoryResult;

const columns = (
    onChangeStatus,
    handleEdit
) => [
    // {
    //     name: "",
    //     selector: (row) => row["selected"],
    //     sortable: true,
    //     center: true,
    //     minWidth: "80px",
    // },
    {
        name: "No.",
        selector: (row) => row["no"],
        sortable: true,
        center: true,
        minWidth: "100px",
    },
    {
        name: "Code",
        selector: (row) => row["categorycode"],
        sortable: true,
        center: true,
        wrap: true,
        minWidth: "150px",
    },
    {
        name: "Category Name (EN)",
        selector: (row) => row["categoryname"],
        sortable: true,
        center: false,
        wrap: true,
        minWidth: "300px",
    },
    {
        name: "Thai Description",
        selector: (row) => row["description"],
        sortable: true,
        center: false,
        wrap: true,
        minWidth: "300px",
    },
    {
        name: "Typical Products",
        selector: (row) => row["typicalproducts"],
        sortable: true,
        center: false,
        wrap: true,
        minWidth: "300px",
    },
    {
        name: "Status",
        selector: (row) => row["status"],
        sortable: true,
        center: true,
        minWidth: "120px",
        cell: (row) => (
            <Badge color={row.status === 'Inactive' ? 'danger' : 'success'}>
                {row.status}
            </Badge>
        ) 
    },
    {
        name: "",
        center: true,
        minWidth: "120px",
        cell: (row) => (
             <div className="switch-sm">
            <Label className="switch">
                <Input
                    type="checkbox"
                    checked={row.status === 'Active'}
                    onClick={() => {
                        onChangeStatus(row);
                    }}
                />
                <span className="switch-state"></span>
            </Label>
            </div>
        )
    },
    {
        name: "Action",
        center: true,
        minWidth: "120px",
        cell: (row) => (
            <div>
                <span onClick={() => handleEdit(row)}>
                <i
                    className="fa fa-pencil"
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
        )
    },
]