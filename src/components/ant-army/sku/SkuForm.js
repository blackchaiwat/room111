import { Fragment, useEffect, useState } from 'react';
import { Row, Col, Button, Form } from 'reactstrap'
import { useForm } from 'react-hook-form';
import { getSkuAdd } from '../../../util/sku';
import { BoxError, BoxLoading, BoxSuccess } from '../criteria/BoxAlert';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { getMasterCategory, getMasterModel, getMasterProductType, getMasterSaleType, getMasterSellingUnit } from '../../../util/masterdata';

function randomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let result = '';

    for (let i = 0; i < 5; i++) {
        result += chars.charAt(
            Math.floor(Math.random() * chars.length)
        );
    }

    return result;
}

const SkuForm = () => {
    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm();
    const attributeType = watch('attributeType');
    const isSpecial = attributeType === 'special';
    const producttypecode = watch('producttypecode');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [success, setSuccess] = useState(false);
    const [actionType, setActionType] = useState(null);

    const [randomAttribute, setAttribute] = useState('');

    const [masterProductType, setMasterProductType] = useState([]);
    const [masterModel, setMasterModel] = useState([]);
    const [masterCategory, setMasterCategory] = useState([]);
    const [masterSellingUnit, setMasterSellingUnit] = useState([]);
    const [masterSaleType, setMasterSaleType] = useState([]);
    

    const getMaster = async () => {
        const _productType = await getMasterProductType();
        setMasterProductType(_productType?.list || []);

        const _model = await getMasterModel();
        setMasterModel(_model?.list || []);

        const _category = await getMasterCategory();
        setMasterCategory(_category?.list || []);

        const _sellingUnit = await getMasterSellingUnit();
        setMasterSellingUnit(_sellingUnit?.list || []);

        const _saleType = await getMasterSaleType();
        setMasterSaleType(_saleType?.list || []);
    }

    const fetch = () => {
        reset();
        setValue('producttypecode', 'H');
        setValue('attributeType', 'special');
        setAttribute(randomCode());
        window.scrollTo({ top: 100, behavior: "smooth" });
    }

    useEffect(() => {
        getMaster();
        fetch();
    }, [])

    const onSubmit = async (data) => {
        if (actionType === 'generate') {
            await handleGenerateSKU(data);
        } else if (actionType === 'export') {
            handleExportExcel(data);
        }
    };

    const handleGenerateSKU  = async (data) => {
        const formValue = {
            ...data,
            specificattributes: data.specificattributes || randomAttribute,
        }
        setLoading(true);
        const res = await getSkuAdd({ ...formValue });
        setLoading(false);
        if (res?.result === 'error') {
            setError(true);
            const sku = `${data.producttypecode}${data.categorycode}${data.modelcode}${data.specificattributes || randomAttribute}${data.sellingunitcode}${data.salestypecode}`;
            setErrorText(res?.resultdetail === 'sku_existing' ? `SKU: ${sku} นี้มีอยู่แล้วในระบบ` : 'เกิดข้อผิดพลาด ไม่สามารถบันทึกข้อมูลได้');
        } else {
            setSuccess(true);
        }
    }

    const onSubmitSuccess = () => {
        setSuccess(false);
        fetch();
    }

    const handleExportExcel = (data) => {
      
        const headers = ['Product Name', 'SKU', 'Category'];

        const sku = `${data.producttypecode}${data.categorycode}${data.modelcode}${data.specificattributes}${data.sellingunitcode}${data.salestypecode}`;
        const body = [[data.productname, sku, masterCategory.find((m) => m.categorycode)?.categoryname || '']];

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
    }

    return (
        <Fragment>
            <BoxLoading open={loading} setOpen={setLoading} />
            <BoxError open={error} setOpen={setError} text={errorText} />
            <BoxSuccess open={success} setOpen={onSubmitSuccess} />

            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '20px', paddingBottom: '40px' }}>
                <div style={{ maxWidth: '700px' }}>
                    <Form className="needs-validation" noValidate="" onSubmit={handleSubmit(onSubmit)}>
                        <Row className='mb-4 g-4'>
                            <Col md='12'>
                                <h6 className='mb-3'>Products Type*</h6>
                                <div style={{ display: 'flex', gap: 5, marginBottom: '-14px' }}>
                                    {masterProductType.map((m, i) => (
                                        <div className="form-check form-check-inline" key={m.producttypecode}>
                                            <input 
                                                className="form-check-input"
                                                style={{ width: '16px', height: '16px', marginRight: '14px', border: '1px solid #635B5B' }}
                                                type="radio"
                                                {...register('producttypecode', { 
                                                    required: true, 
                                                    onChange: () => {
                                                        setValue('categorycode', '');
                                                        setValue('modelcode', '');
                                                    }
                                                })}
                                                id={m.producttypecode}
                                                value={m.producttypecode}
                                            />
                                            <label for={m.producttypecode}><h6 className="form-check-label" style={{ paddingTop: '3px' }}>{m.producttype}</h6></label>
                                        </div>
                                    ))}
                                </div>
                            </Col>

                            <Col md='6'>
                                <h6 className='mb-2'>Category*</h6>
                                <select 
                                    className={`form-select ${errors.categorycode && 'is-invalid'} mb-1`}
                                    id="categorycode"
                                    style={{ border: errors.categorycode ? '1px solid red' : '1px solid #D1D1D1', padding: '14px' }}
                                    {...register('categorycode', { required: true })} 
                                >
                                    <option value="" hidden>- - Select category - -</option>
                                    {masterCategory.filter((m) => producttypecode === m.producttypecode).map((m) => (
                                        <option key={m.categorycode} value={m.categorycode}>{m.categoryname}</option>
                                    ))}
                                </select>
                                <span className="text-danger">{errors.categorycode && "กรุณาเลือก Category"}</span>
                            </Col>

                            <Col md='6'>
                                <h6 className='mb-2'>Model*</h6>
                                <select 
                                    className={`form-select ${errors.modelcode && 'is-invalid'} mb-1`}
                                    id="modelcode"
                                    style={{ border: errors.modelcode ? '1px solid red' : '1px solid #D1D1D1', padding: '14px' }}
                                    {...register('modelcode', { required: true })} 
                                >
                                    <option value="" hidden>- -Select model - -</option>
                                    {masterModel.filter((m) => producttypecode === m.producttypecode).map((m) => (
                                        <option key={m.modelcode} value={m.modelcode}>{m.modelname}</option>
                                    ))}
                                </select>
                                <span className="text-danger">{errors.modelcode && "กรุณาเลือก Model"}</span>
                            </Col>

                            <Col md='12' lg='12'>
                                <h6 className='mb-2'>Specific Attributes*</h6>
                                <div style={{ display: 'flex', gap: 5 }}>
                                    <input
                                        className="form-check-input"
                                        style={{ width: '16px', height: '16px', marginTop: '20px', marginRight: '10px', border: '1px solid #635B5B' }}
                                        type="radio"
                                        {...register('attributeType', { required: true })}
                                        id="special"
                                        value="special"
                                        onChange={(e) => {
                                            setValue('attributeType', 'special');
                                            setValue('specificattributes', '');
                                        }}
                                    />
                                    <div style={{ width: '100%' }}>
                                        <input 
                                            className={`form-control ${errors.specificattributes && 'is-invalid'} mb-1`}
                                            id="specificattributes"
                                            type="text"
                                            placeholder='POSE6'
                                            style={{ width: '100%', border: errors.specificattributes ? '1px solid red' : '1px solid #D1D1D1', padding: '14px' }}
                                            maxLength={5}
                                            {...register('specificattributes', {
                                                required: isSpecial || false,
                                                pattern: {
                                                value: /^[A-Za-z0-9]{5}$/,
                                                message: 'กรุณากรอกตัวอักษรภาษาอังกฤษหรือตัวเลข 5 ตัว',
                                                },
                                                onChange: (e) => {
                                                    e.target.value = e.target.value.toUpperCase();
                                                },
                                            })}
                                            disabled={!isSpecial}
                                        />
                                        <span className="text-danger">{errors.specificattributes && (errors.specificattributes.message || 'กรุณากรอกข้อมูล')}</span>
                                        <p style={{ color: '#003176', padding: '0px', margin: '0px' }}>ใส่ 5 ตัวอักษรหรือตัวเลข ระบุลักษณะสินค้า เป็นผง เป็นขวด และขนาดบรรจุ</p>
                                    </div>               
                                </div>
                            </Col>

                            <Col md='6'>
                                <h6 className='mb-4'>หรือ เลือกให้ระบบ Random ให้ </h6>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        style={{ width: '16px', height: '16px', marginRight: '14px', border: '1px solid #635B5B' }}
                                        type="radio"
                                        {...register('attributeType', { required: true })}
                                        id="random"
                                        value="random"
                                    />
                                    <label for="random"><h6 className="form-check-label" style={{ paddingTop: '3px' }}>Random</h6></label>
                                </div>
                            </Col>

                            <Col md='6'></Col>

                            <Col md='6'>
                                <h6 className='mb-2'>Selling Unit*</h6>
                                <select 
                                    className={`form-select ${errors.sellingunitcode && 'is-invalid'} mb-1`}
                                    id="sellingunitcode"
                                    style={{ border: errors.sellingunitcode ? '1px solid red' : '1px solid #D1D1D1', padding: '14px' }}
                                    {...register('sellingunitcode', { required: true })} 
                                >
                                    <option value="" hidden>- - Select sales type - -</option>
                                    {masterSellingUnit.map((m) => (
                                        <option key={m.sellingunitcode} value={m.sellingunitcode}>{m.sellingunitname || m.sellingunitcode}</option>
                                    ))}
                                </select>
                                <span className="text-danger">{errors.sellingunitcode && "กรุณาเลือก Selling Unit"}</span>
                            </Col>

                            <Col md='6'>
                                <h6 className='mb-2'>Sales Type*</h6>
                                <select 
                                    className={`form-select ${errors.salestypecode && 'is-invalid'} mb-1`}
                                    id="salestypecode"
                                    style={{ border: errors.salestypecode ? '1px solid red' : '1px solid #D1D1D1', padding: '14px' }}
                                    {...register('salestypecode', { required: true })} 
                                >
                                    <option value="" hidden>- - Select sales type - -</option>
                                    {masterSaleType.map((m) => (
                                        <option key={m.saletypecode} value={m.saletypecode}>{m.saletypename}</option>
                                    ))}
                                </select>
                                <span className="text-danger">{errors.salestypecode && "กรุณาเลือก Sales type"}</span>
                            </Col>

                            <Col md='12'>
                                <h6 className='mb-2'>Product Name*</h6>
                                <input 
                                    className={`form-control ${errors.productname && 'is-invalid'} mb-1`}
                                    id="productname"
                                    type="text"
                                    placeholder='Product Name'
                                    style={{ border: errors.productname ? '1px solid red' : '1px solid #D1D1D1', padding: '14px' }}
                                    {...register('productname', { required: true })} 
                                />
                                <span className="text-danger">{errors.productname && "กรุณากรอก Product Name"}</span>
                            </Col>

                            <Col md='12'>
                                <h6 className='mb-2'>Remark</h6>
                                <input 
                                    className={`form-control ${errors.remark && 'is-invalid'} mb-1`}
                                    id="remark"
                                    type="text"
                                    placeholder='Remark'
                                    style={{ border: errors.remark ? '1px solid red' : '1px solid #D1D1D1', padding: '14px' }}
                                    {...register('remark', { required: false })} 
                                />
                            </Col>
                        </Row>

                        <Row className='mt-4 mb-4'>
                            <Col lg='12' className='text-center'>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                                    <Button color="default" style={{ padding: '10px 30px', border: '1px solid black', width: 120 }} onClick={() => fetch()}>Clear</Button>
                                    <Button color="primary" style={{ padding: '10px 30px' }} type="submit" onClick={() => setActionType('generate')}>Generate SKU</Button>
                                    {/* <Button color="primary" style={{ padding: '10px 30px' }} type="submit" onClick={() => setActionType('export')}>Export CSV, Excel</Button> */}
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        </Fragment>
    );
};

export default SkuForm;
