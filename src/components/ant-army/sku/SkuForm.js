import { Fragment, useEffect, useState } from 'react';
import { Row, Col, Button, Form } from 'reactstrap'
import { useForm } from 'react-hook-form';
import { getSkuAdd } from '../../../util/sku';
import { BoxError, BoxLoading, BoxSuccess } from '../criteria/BoxAlert';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const masterCategory = [
    { value: 'HW', label: 'Health & Wellness' },
    { value: 'CL', label: 'Cleaning' },
    { value: 'VT', label: 'Vitamin' },
    { value: 'HR', label: 'Herb' },
    { value: 'CT', label: 'Catnip' },
]

const masterModel = [
    { value: 'LMB', label: 'Lamoonbaby' },
    { value: 'VTC', label: 'VitaminC' },
]

const masterSalesType = [
    { value: 'M', label: 'Manufactured' },
    { value: 'C', label: 'Consignment' },
    { value: 'D', label: 'Distributor' },
    { value: 'R', label: 'Retail' },
]

const categoryList = {
    'VT': 'Vitamin',
    'HR': 'Herb',
    'CT': 'Catnip',
}

function randomLetters(){
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 3; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return result;
};

function randomNumbers(){
  let result = '';
  for (let i = 0; i < 3; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
};

const SkuForm = () => {
    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm();
    const attributeType = watch('attributeType');
    const isSpecial = attributeType === 'special';

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [success, setSuccess] = useState(false);
    const [actionType, setActionType] = useState(null);

    const [randomAttribute1, setAttribute1] = useState('');
    const [randomAttribute2, setAttribute2] = useState('');

    const fetch = () => {
        reset();
        setValue('producttype', 'H');
        setValue('attributeType', 'special');
        setAttribute1(randomLetters());
        setAttribute2(randomNumbers());
        window.scrollTo({ top: 100, behavior: "smooth" });
    }

    useEffect(() => {
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
            attribute1: data.attribute1 || randomAttribute1,
            attribute2: data.attribute2 || randomAttribute2,
        }
        setLoading(true);
        const res = await getSkuAdd({ ...formValue });
        setLoading(false);
        if (res?.result === 'error') {
            setError(true);
            const sku = `${data.producttype}${data.category}${data.model}${data.attribute1 || randomAttribute1}${data.attribute2 || randomAttribute2}${data.salestype}`;
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

        const sku = `${data.producttype}${data.category}${data.model}${data.attribute1 || randomAttribute1}${data.attribute2 || randomAttribute2}${data.salestype}`;
        const body = [[data.productname, sku, categoryList[data.category || '']]];

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
                                    <div className="form-check form-check-inline">
                                        <input 
                                            className="form-check-input"
                                            style={{ width: '16px', height: '16px', marginRight: '14px', border: '1px solid #635B5B' }}
                                            type="radio"
                                            {...register('producttype', { required: true })}
                                            id="human"
                                            value="H"
                                        />
                                        <label for="human"><h6 className="form-check-label" style={{ paddingTop: '3px' }}>Human</h6></label>
                                    </div>

                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            style={{ width: '16px', height: '16px', marginRight: '14px', border: '1px solid #635B5B' }}
                                            type="radio"
                                            {...register('producttype', { required: true })}
                                            id="pets"
                                            value="P"
                                        />
                                        <label for="pets"><h6 className="form-check-label" style={{ paddingTop: '3px' }}>Pets</h6></label>
                                    </div>
                                </div>
                            </Col>

                            <Col md='6'>
                                <h6 className='mb-2'>Category*</h6>
                                <select 
                                    className={`form-select ${errors.category && 'is-invalid'} mb-1`}
                                    id="category"
                                    style={{ border: errors.category ? '1px solid red' : '1px solid #D1D1D1', padding: '14px' }}
                                    {...register('category', { required: true })} 
                                >
                                    <option value="" hidden>- - Select category - -</option>
                                    {masterCategory.map((m) => (
                                        <option key={m.value} value={m.value}>{m.label}</option>
                                    ))}
                                </select>
                                <span className="text-danger">{errors.category && "กรุณาเลือก Category"}</span>
                            </Col>

                            <Col md='6'>
                                <h6 className='mb-2'>Model*</h6>
                                <select 
                                    className={`form-select ${errors.model && 'is-invalid'} mb-1`}
                                    id="model"
                                    style={{ border: errors.model ? '1px solid red' : '1px solid #D1D1D1', padding: '14px' }}
                                    {...register('model', { required: true })} 
                                >
                                    <option value="" hidden>- -Select model - -</option>
                                    {masterModel.map((m) => (
                                        <option key={m.value} value={m.value}>{m.label}</option>
                                    ))}
                                </select>
                                <span className="text-danger">{errors.model && "กรุณาเลือก Model"}</span>
                            </Col>

                            <Col md='6'>
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
                                            setValue('attribute1', '');
                                            setValue('attribute2', '');
                                        }}
                                    />
                                    <div>
                                        <input 
                                            className={`form-control ${errors.attribute1 && 'is-invalid'} mb-1`}
                                            id="attribute1"
                                            type="text"
                                            placeholder='POW'
                                            style={{ border: errors.attribute1 ? '1px solid red' : '1px solid #D1D1D1', padding: '14px' }}
                                            maxLength={3}
                                            {...register('attribute1', {
                                                required: isSpecial || false,
                                                pattern: {
                                                value: /^[A-Za-z]{3}$/,
                                                message: 'กรุณากรอกตัวอักษรภาษาอังกฤษ 3 ตัว',
                                                },
                                                onChange: (e) => {
                                                    e.target.value = e.target.value.toUpperCase();
                                                },
                                            })}
                                            disabled={!isSpecial}
                                        />
                                        <span className="text-danger">{errors.attribute1 && (errors.attribute1.message || 'กรุณากรอกข้อมูล')}</span>
                                        <p style={{ color: '#003176', padding: '0px', margin: '0px' }}>ใส่ 3 ตัวอักษร ระบุลักษณะสินค้า เป็นผง เป็นขวด</p>
                                    </div>               
                                </div>
                            </Col>

                            <Col md='6'>
                                <h6 className='mb-2'>&nbsp;</h6>
                                <input 
                                    className={`form-control ${errors.attribute2 && 'is-invalid'} mb-1`}
                                    id="attribute2"
                                    type="text"
                                    placeholder='e.g  060'
                                    style={{ border: errors.attribute2 ? '1px solid red' : '1px solid #D1D1D1', padding: '14px' }}
                                    maxLength={3}
                                    {...register('attribute2', {
                                        required: isSpecial || false,
                                        pattern: {
                                        value: /^[0-9]{3}$/,
                                        message: 'กรุณากรอกตัวเลข 3 หลักเท่านั้น',
                                        },
                                        onChange: (e) => {
                                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                        },
                                    })}
                                    disabled={!isSpecial}
                                />
                                <span className="text-danger">{errors.attribute2 && (errors.attribute2.message || 'กรุณากรอกข้อมูล')}</span>
                                <p style={{ color: '#003176', padding: '0px', margin: '0px' }}>ใส่ 3 ตัวเลข เพื่อระบุขนาด เช่น 060 60 กรัม</p>
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
                                <h6 className='mb-2'>Sales Type*</h6>
                                <select 
                                    className={`form-select ${errors.salestype && 'is-invalid'} mb-1`}
                                    id="salestype"
                                    style={{ border: errors.salestype ? '1px solid red' : '1px solid #D1D1D1', padding: '14px' }}
                                    {...register('salestype', { required: true })} 
                                >
                                    <option value="" hidden>- - Select sales type - -</option>
                                    {masterSalesType.map((m) => (
                                        <option key={m.value} value={m.value}>{m.label}</option>
                                    ))}
                                </select>
                                <span className="text-danger">{errors.salestype && "กรุณาเลือก Sales type"}</span>
                            </Col>

                            <Col md='6'></Col>

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
