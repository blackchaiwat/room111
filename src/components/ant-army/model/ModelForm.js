import { Fragment, useEffect, useState } from 'react';
import { Row, Col, Button, Form } from 'reactstrap'
import { useForm } from 'react-hook-form';
import { BoxError, BoxLoading, BoxSuccess } from '../criteria/BoxAlert';
import { getCategoryAdd, getCategoryEdit } from '../../../util/category';
import { getModelAdd, getModelEdit } from '../../../util/model';


const ModelForm = ({ dataEdit, setDataEdit }) => {
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
            setValue('modelcode', _dataEdit.modelcode);
            setValue('modelname', _dataEdit.modelname);
        }
    }

    useEffect(() => {
        fetch(dataEdit);
    }, [dataEdit])

    const onSubmit = async (data) => {
        const res = dataEdit ? await getModelEdit({ ...dataEdit, ...data }) : await getModelAdd({ ...data });
        setLoading(false);
        if (res?.result === 'error') {
            setError(true);
            setErrorText(res?.resultdetail === 'duplicate_code' ? `Model นี้มีอยู่แล้วในระบบ` : 'เกิดข้อผิดพลาด ไม่สามารถบันทึกข้อมูลได้');
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
                                <h6 className='mb-2'>Model Name*</h6>
                                <input 
                                    className={`form-control ${errors.modelname && 'is-invalid'} mb-1`}
                                    id="modelname"
                                    type="text"
                                    placeholder='Personal Care'
                                    style={{ border: errors.modelname ? '1px solid red' : '1px solid #D1D1D1', padding: '14px' }}
                                    {...register('modelname', {
                                        required: true,
                                    })}
                                />
                                <span className="text-danger">{errors.modelname && (errors.modelname.message || 'กรุณากรอก Category Name (EN)')}</span>
                            </Col>

                            <Col md='6'>
                                <h6 className='mb-2'>Model Code (3 ตัวอักษร ใส่ตัวเลขได้)*</h6>
                                <input 
                                    className={`form-control ${errors.modelcode && 'is-invalid'} mb-1`}
                                    id="modelcode"
                                    type="text"
                                    placeholder=''
                                    style={{ border: errors.modelcode ? '1px solid red' : '1px solid #D1D1D1', padding: '14px' }}
                                    maxLength={3}
                                    {...register('modelcode', {
                                        required: true,
                                        pattern: {
                                            value: /^[A-Za-z0-9]{3}$/,
                                            message: 'กรุณากรอกตัวอักษรภาษาอังกฤษหรือตัวเลขจำนวน 3 ตัว',
                                        },
                                        onChange: (e) => {
                                            e.target.value = e.target.value.toUpperCase();
                                        },
                                    })}
                                />
                                <span className="text-danger">{errors.modelcode && (errors.modelcode.message || 'กรุณากรอก Category Code')}</span>
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

export default ModelForm;
