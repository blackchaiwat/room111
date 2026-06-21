import { Fragment, useEffect, useState } from 'react';
import { Row, Col, Button, Form } from 'reactstrap'
import { useForm } from 'react-hook-form';
import { BoxError, BoxLoading, BoxSuccess } from '../criteria/BoxAlert';
import { getCategoryAdd, getCategoryEdit } from '../../../util/category';


const CategoryForm = ({ dataEdit, setDataEdit }) => {
    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [success, setSuccess] = useState(false);

    const fetch = (_dataEdit) => {
        reset();
        setValue('producttypecode', 'H');

        if (_dataEdit) {
            setValue('producttypecode', _dataEdit.producttypecode || 'P');
            setValue('categorycode', _dataEdit.categorycode);
            setValue('categoryname', _dataEdit.categoryname);
            setValue('description', _dataEdit.description);
            setValue('typicalproducts', _dataEdit.typicalproducts);
        }
    }

    useEffect(() => {
        fetch(dataEdit);
    }, [dataEdit])

    const onSubmit = async (data) => {
        const res = dataEdit ? await getCategoryEdit({ ...dataEdit, ...data }) : await getCategoryAdd({ ...data });
        setLoading(false);
        if (res?.result === 'error') {
            setError(true);
            setErrorText(res?.resultdetail === 'duplicate_code' ? `Category นี้มีอยู่แล้วในระบบ` : 'เกิดข้อผิดพลาด ไม่สามารถบันทึกข้อมูลได้');
        } else {
            setSuccess(true);
            setDataEdit(null);
        }
    };

    const onSubmitSuccess = () => {
        setSuccess(false);
        fetch();
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
                            <Col md='12' style={{ marginBottom: '10px' }}>
                                <h6 className='mb-3'>Products Type*</h6>
                                <div style={{ display: 'flex', gap: 5, marginBottom: '-14px' }}>
                                    <div className="form-check form-check-inline">
                                        <input 
                                            className="form-check-input"
                                            style={{ width: '16px', height: '16px', marginRight: '14px', border: '1px solid #635B5B' }}
                                            type="radio"
                                            {...register('producttypecode', { required: true })}
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
                                            {...register('producttypecode', { required: true })}
                                            id="pets"
                                            value="P"
                                        />
                                        <label for="pets"><h6 className="form-check-label" style={{ paddingTop: '3px' }}>Pets</h6></label>
                                    </div>
                                </div>
                            </Col>

                            <Col md='6'>
                                <h6 className='mb-2'>Category Name (EN)*</h6>
                                <input 
                                    className={`form-control ${errors.categoryname && 'is-invalid'} mb-1`}
                                    id="categoryname"
                                    type="text"
                                    placeholder='Personal Care'
                                    style={{ border: errors.categoryname ? '1px solid red' : '1px solid #D1D1D1', padding: '14px' }}
                                    {...register('categoryname', {
                                        required: true,
                                    })}
                                />
                                <span className="text-danger">{errors.categoryname && (errors.categoryname.message || 'กรุณากรอก Category Name (EN)')}</span>
                            </Col>

                            <Col md='6'>
                                <h6 className='mb-2'>Category Code (2 ตัวอักษร)*</h6>
                                <input 
                                    className={`form-control ${errors.categorycode && 'is-invalid'} mb-1`}
                                    id="categorycode"
                                    type="text"
                                    placeholder=''
                                    style={{ border: errors.categorycode ? '1px solid red' : '1px solid #D1D1D1', padding: '14px' }}
                                    maxLength={2}
                                    {...register('categorycode', {
                                        required: true,
                                        pattern: {
                                        value: /^[A-Za-z]{2}$/,
                                        message: 'กรุณากรอกตัวอักษรภาษาอังกฤษ 2 ตัว',
                                        },
                                        onChange: (e) => {
                                            e.target.value = e.target.value.toUpperCase();
                                        },
                                    })}
                                />
                                <span className="text-danger">{errors.categorycode && (errors.categorycode.message || 'กรุณากรอก Category Code')}</span>
                            </Col>

                            <Col md='12'>
                                <h6 className='mb-2'>Thai Description*</h6>
                                <textarea 
                                    className={`form-control ${errors.description && 'is-invalid'} mb-1`}
                                    id="description"
                                    type="text"
                                    placeholder='เช่น ผลิตภัณฑ์ดูแลร่างกาย'
                                    style={{ border: errors.description ? '1px solid red' : '1px solid #D1D1D1', padding: '14px' }}
                                    {...register('description', { required: true })} 
                                />
                                <span className="text-danger">{errors.description && "กรุณากรอก Thai Description"}</span>
                            </Col>

                            <Col md='12'>
                                <h6 className='mb-2'>Typical Products*</h6>
                                <textarea 
                                    className={`form-control ${errors.typicalproducts && 'is-invalid'} mb-1`}
                                    id="typicalproducts"
                                    type="text"
                                    placeholder='เช่น แชมพู, ครีมอาบน้ำ, โลชั่น, สบู่, เบบี้ออยล์'
                                    style={{ border: errors.typicalproducts ? '1px solid red' : '1px solid #D1D1D1', padding: '14px' }}
                                    {...register('typicalproducts', { required: true })} 
                                />
                                <span className="text-danger">{errors.typicalproducts && "กรุณากรอก Typical Products"}</span>
                            </Col>
                        </Row>

                        <Row className='mt-4 mb-4'>
                            <Col lg='12' className='text-center'>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                                    <Button color="default" style={{ padding: '10px 30px', border: '1px solid black', width: 120 }} onClick={() => fetch()}>Clear</Button>
                                    <Button color="primary" style={{ padding: '10px 30px' }} type="submit">Save</Button>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        </Fragment>
    );
};

export default CategoryForm;
