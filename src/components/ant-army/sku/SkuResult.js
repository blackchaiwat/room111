import { Fragment, useEffect, useState } from 'react';
import { Row, Col, Card, CardBody, CardHeader, Button } from 'reactstrap'
import DataTable from 'react-data-table-component'
import { BoxFilter, BoxSearch } from '../criteria/Criteria';
import { Upload } from 'react-feather';
import { getSkuExport, getSkuList } from '../../../util/sku';
import { BoxError, BoxLoading } from '../criteria/BoxAlert';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const customStyles = {
    headCells: {
        style: {
          justifyContent: "center",
          textAlign: "center",
        },
    },
};

const categoryList = {
    'VT': 'Vitamin',
    'HR': 'Herb',
    'CT': 'Catnip',
}

const SkuResult = () => {
    const [dataList, setDataList] = useState([]);
    const [datas, setDatas] = useState([]);

    const [idSelect, setIdSelect] = useState([]);
    const [isAll, setIsAll] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const [criteria, setCriteria] = useState({
        producttype: 'all',
        keyword: '',
    })

    const onSelectId = (id) => {
        if (idSelect.indexOf(id) > -1) {
            setIdSelect([...idSelect.filter((f) => f !== id)]);
        } else {
            setIdSelect([ ...idSelect, id ]);
        }
    }

    const onSelectAll = () => {
        const newAll = !isAll;
        setIsAll(newAll);
        if (newAll) {
            setIdSelect([...datas.map((m) => m.id)]);
        } else {
            setIdSelect([]);
        }
    }

    useEffect(() => {
        setDataList(mappingData([...datas]));
    }, [idSelect])
        
    function mappingData(data){
        const list = [];
    
        data.forEach((m, i) => {
            list.push({
                selected: (
                    <div style={{ paddingTop: '7px' }}>
                        <label className='checkbox-container'>
                            <input 
                                type='checkbox'
                                className='custom-checkbox'
                                checked={idSelect.indexOf(m.id || '') > -1}
                                onClick={() => onSelectId(m.id)}
                            />
                            <span className='checkmark'></span>
                        </label>
                    </div>
                ),
                no: i + 1,
                productname: m?.productname || '',
                sku: m?.sku || '',
                category: categoryList[m?.category || ''] || m?.category,
            });
        })
        
        return list;
    }

    const fetch = async (_criteria) => { 
        const formValue = {
            page: 1,
            itemperpage: 10000,
            searchproducttype: _criteria?.producttype === 'all' ? "" : _criteria?.producttype || '',
            searchtext: _criteria?.keyword || '',
        }

        const res = await getSkuList({ ...formValue });
        setIdSelect([]);
        setIsAll(false);

        setDataList(mappingData(res?.list || []));
        setDatas(res?.list || []);
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

    const onClickExport = async () => {
        const formValue = {
            searchproducttype: criteria?.producttype === 'all' ? "" : criteria?.producttype || '',
            searchtext: criteria?.keyword || '',
            productid: idSelect
        }

        setIdSelect([]);
        setIsAll(false);
        setLoading(true);
        const res = await getSkuExport({ ...formValue });
        setLoading(false);
        if (res?.result === 'error') {
            setError(true);
        } else {
            try {
                const filename = res.csvurl.split('/').pop() || 'ProductSKU.csv';

                const link = document.createElement('a');
                link.href = res.csvurl;
                link.setAttribute('download', filename);
                link.setAttribute('target', '_blank');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (err) {
                console.error('Export failed:', err);
                setError(true);
            }
        }
    }

    const onClickExport2 = () => {
        if (!idSelect.length) {
            return;
        }

        const headers = ['Product Name', 'SKU', 'Category'];
        const body = [];

        const list = datas.filter((f) => idSelect.indexOf(f.id) > -1);
        list.forEach((f) => {
            body.push([f.productname, f.sku, categoryList[f?.category || '']])
        })


        const worksheetData = [headers, ...body];

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

        const date = new Date();
        const formatDate = date.toISOString().slice(0, 10).replace(/-/g, '');
        const fileName = `ProductSKU_${formatDate}.xlsx`;
        saveAs(blob, fileName);

        setIdSelect([]);
        setIsAll(false);
    }

    return (
        <Fragment>
            <BoxLoading open={loading} setOpen={setLoading} />
            <BoxError open={error} setOpen={setError} text='ไม่สามารถดาวน์โหลดไฟล์ได้' />

            <Row>
                <h6 className='mb-4'>SKU Data</h6>
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
                            isActive={criteria.producttype === 'human'}
                            onChange={() => onChangeCriteria('producttype', 'human')}
                        />

                        <BoxFilter 
                            text='Pets'
                            isActive={criteria.producttype === 'pets'}
                            onChange={() => onChangeCriteria('producttype', 'pets')}
                        />
                    </div>
                </Col>
                <Col md="12" lg="6" >
                    <div className="pull-right">
                        <BoxSearch 
                            value={criteria.keyword}
                            onChange={onChangeCriteria}
                            placeholder='ใส่ชื่อสินค้า / SKU'
                            isNew
                        />
                    </div>
                </Col>
            </Row>

            <Row>
                <Col sm="12">
                    <Card style={{ boxShadow: 'none' }}>
                        <CardHeader>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div className='mb-2' style={{ }}>
                                    <label className='checkbox-container'>
                                        <input 
                                            type='checkbox'
                                            className='custom-checkbox'
                                            checked={isAll}
                                            onClick={() => onSelectAll()}
                                        />
                                        <span className='checkmark check-lg'></span>
                                        <span style={{ marginLeft: '10px', fontSize: '18px', fontWeight: 600 }}>Select All</span>
                                    </label>
                                </div>
                                <Button color="primary" outline className='btn-js1 text-center' style={{ display: 'flex', alignItems: 'center' }}
                                    onClick={() => onClickExport2()}
                                    disabled={!idSelect.length}
                                ><Upload size={18} style={{ marginRight: '5px' }} /> Export Excel</Button>
                            </div>
                        </CardHeader>
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
        </Fragment>
    );
};

export default SkuResult;

const columns = [
    {
        name: "",
        selector: (row) => row["selected"],
        sortable: true,
        center: true,
        minWidth: "80px",
    },
    {
        name: "No.",
        selector: (row) => row["no"],
        sortable: true,
        center: true,
        minWidth: "200px",
    },
    {
        name: "Product Name",
        selector: (row) => row["productname"],
        sortable: true,
        center: false,
        minWidth: "300px",
    },
    {
        name: "SKU",
        selector: (row) => row["sku"],
        sortable: true,
        center: false,
        minWidth: "300px",
    },
    {
        name: "Category",
        selector: (row) => row["category"],
        sortable: true,
        center: true,
        minWidth: "200px",
    },
]