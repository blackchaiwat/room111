import React, { Fragment, useEffect, useState } from 'react';
import BreadCrumb from '../../../layout/Breadcrumb'
import { Container, Row, Col, Card, CardBody, Button, Form } from 'reactstrap'
import { useForm } from 'react-hook-form';
import { BoxError, BoxLoading, BoxSuccess } from '../criteria/BoxAlert';
import { useNavigate, useParams } from 'react-router';
import { getJobList, getCreateJob, getEditJob } from '../../../util/job';
import { getTargetList } from '../../../util/audience';
import useProductType from '../../../util/useProductType';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { setDate } from '../../../util/helpper';

const init = {
    
}

const CampaignForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isEdit, setIsEdit] = useState(false);
    const [targetList, setTargetList] = useState([]);
    const productTypes = useProductType();

    const [steps, setSteps] = useState(1);
    const [formdata, setFormdata] = useState({})

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const getTarget = async () => {
        const res = await getTargetList({ page: 1, itemperpage: 10000 });
        setTargetList(res?.list || []);
    }

    const fetch = async () => {
        setIsEdit(true);
        const res = await getJobList({ page: 1, itemperpage: 10000, JobID: id });
        const find = (res?.list || []).find((f) => f.jobid === id);
        console.log("get campaign form", find);
        if (find) {
            const boardcast = (find?.broadcastaudience || [])?.[0];

            const targetDate = (boardcast?.broadcastdate || '').split(' ');
            setFormdata({ 
                ...find,
                validbegin: setDate(find?.validbegin || ''),
                validend: setDate(find?.validend || ''),
                submitbegin: setDate(find?.submitbegin || ''),
                submmitend: setDate(find?.submmitend || ''),
                approvebegin: setDate(find?.approvebegin || ''),
                approveend: setDate(find?.approveend || ''),
                tiktoktabtype: find?.utm === 'Tab' ? 'Tab' : 'Utm',

                broadcastaudienceid: boardcast?.audienceid || '',
                broadcastdate: targetDate?.[0] || '',
                broadcasttime: targetDate?.[1] || '',
                broadcastdescription: boardcast?.broadcastdescription || ''
            });
        }
    }

    useEffect(() => {
        if (id && id !== 'create') {
            fetch();
        }
        getTarget();
    }, [id])

    const onSubmit = async (data) => {
        setLoading(true);

        const formValue = {
            title: data?.title || '',
            imgbase64: data?.imgbase64,
            validbegin: `${data?.validbegin || ''} 00:00:00`,
            validend: `${data?.validend || ''} 23:59:59`,
            submitbegin: `${data?.validbegin || ''} 00:00:00`,
            submmitend: `${data?.submmitend || ''} 23:59:59`,
            approvebegin: `${data?.validbegin || ''} 00:00:00`,
            approveend: `${data?.approveend || ''} 23:59:59`,
            kollimit: parseFloat(data?.kollimit || ''),
            earning: parseFloat(data?.earning || ''),
            commission: parseFloat(data?.commission || ''),
            producttype: data?.producttype || '',
            description:  data?.description || '',
            brief:  data?.brief || '',
            tiktoktabtype:  data?.tiktoktabtype || '',
            tiktoktaburl:  data?.tiktoktaburl || '',
            condition:  data?.condition || '',
            broadcastaudienceid:  data?.broadcastaudienceid || '',
            broadcastdate:  `${data?.broadcastdate || ''} ${data?.broadcasttime}:00`,
            broadcasttime:  data?.broadcasttime || '',
            broadcastdescription:  data?.broadcastdescription || '',

            tiktoktabtype:  data?.tiktoktabtype || '',
            // utm: "utm_source=xxx&utm_campaign=xxx&utm_medium=xxxx",
            utm: data?.tiktoktabtype || '',
            intviteonly: false
        }
        console.log(formValue);

        if (isEdit) {
            const res = await getEditJob({ jobid: id, ...formValue });
            setLoading(false);
            if (res?.result === 'error') {
                setError(true);
            } else {
                setSuccess(true);
            }
        } else {
            const res = await getCreateJob({ ...formValue });
            setLoading(false);
            if (res?.result === 'error') {
                setError(true);
            } else {
                setSuccess(true);
            }
        }
    };

    const onSubmitSuccess = () => {
        setSuccess(false);
        navigate(`${process.env.PUBLIC_URL}/campaign/overview`);
    }

    return (
        <Fragment>
            <BoxLoading open={loading} setOpen={setLoading} />
            <BoxError open={error} setOpen={setError} />
            <BoxSuccess open={success} setOpen={onSubmitSuccess} />

            <BreadCrumb key={isEdit} parent="Home" subparent="Campaign" title={isEdit ? "Edit Campaign" : "Create Campaign"} />
            
            <Container fluid={true}>
                <Card>
                    <CardBody>
                        <div className="stepwizard">
                            <div className="stepwizard-row setup-panel">
                                <div className="stepwizard-step">
                                    <Button color={`${steps === 1 ? 'primary' : 'light'}`} onClick={() => { setSteps(1) }}>1</Button>
                                    <p>{'ข้อมูลแคมเปญ'}</p>
                                </div>
                                <div className="stepwizard-step">
                                    <Button color={`${steps === 2 ? 'primary' : 'light'}`}>2</Button>
                                    <p>{'Broadcashting'}</p>
                                </div>
                            </div>
                        </div>
                        {steps === 1 && <FormStep1 productTypes={productTypes} steps={steps} setSteps={setSteps} setFormdata={setFormdata} formdata={formdata} />}
                        {steps === 2 && <FormStep2 targetList={targetList} steps={steps} setSteps={setSteps} setFormdata={setFormdata} formdata={formdata} onSubmitForm={onSubmit} />}
                    </CardBody>
                </Card>
            </Container>
        </Fragment>
    );
};

export default CampaignForm;

const FormStep1 = ({ productTypes, steps, setSteps, setFormdata, formdata }) => {
    const { register, handleSubmit, formState: { errors }, clearErrors, setValue, setError } = useForm();
    const [editor, setEditor] = useState('');

    const [imgUrl, setImgUrl] = useState('');
    const [imageBase64, setImageBase64] = useState('');

    useEffect(() => {
        if (steps === 1) {
            setValue('title', formdata?.title || '');
            setValue('validbegin', formdata?.validbegin || '');
            setValue('validend', formdata?.validend || '');
            setValue('submitbegin', formdata?.submitbegin || '');
            setValue('submmitend', formdata?.submmitend || '');
            setValue('approvebegin', formdata?.approvebegin || '');
            setValue('approveend', formdata?.approveend || '');
            setValue('kollimit', formdata?.kollimit || '');
            setValue('earning', formdata?.earning || '');
            setValue('commission', formdata?.commission || '');
            setValue('producttype', formdata?.producttype || '');
            setValue('description', formdata?.description || '');
            setValue('brief', formdata?.brief || '');
            setValue('tiktoktabtype', formdata?.tiktoktabtype || '');
            setValue('tiktoktaburl', formdata?.tiktoktaburl || '');

            setImageBase64(formdata?.imgbase64 || '');
            setImgUrl(formdata?.imgurl || '');
            setEditor(formdata?.condition || '');
        }
    }, [steps, formdata, productTypes])

    const onSubmit = (data) => {
        if (!editor || editor === '<p><br></p>') {
            setError('condition', true);
            return
        }
        if (!imgUrl && !imageBase64) {
            setError('imgbase64', true);
            window.scrollTo({ top: 240, behavior: "smooth" });
            return
        }
        setFormdata(prev => ({ 
            ...prev, 
            ...data,
            imgbase64: imageBase64 || '',
            imgurl: imgUrl || '',
            condition: editor
        }))
        setSteps(prev => prev + 1)
        window.scrollTo({ top: 50, behavior: "smooth" });
    }

    const onSelectFile = (e) => {
        console.log("select");
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            clearErrors('imgbase64');

            const reader = new FileReader();
    
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = reader.result.split(",")[1];
                setImageBase64(`${base64String}`);
                setImgUrl('');
            };
    
            reader.onerror = (error) => {
                console.error("Error converting file:", error);
            };
        }
    };

    // กำหนด Toolbar ให้รองรับรูปภาพและวิดีโอ
    const modules = {
        toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image", "video"], // เปิดใช้งานรูปภาพและวิดีโอ
        ["clean"],
        ],
    };

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "list",
        "bullet",
        "link",
        "image",
        "video",
    ];

    return (
        <Fragment>
            <Form className="needs-validation" noValidate="" onSubmit={handleSubmit(onSubmit)}>
                <Row className='mb-4'>
                    <Col lg='12'>
                        <h6 for="name">ชื่อ Campaign</h6>
                        <input 
                            className={`form-control ${errors.title && 'is-invalid'} mb-1`}
                            id="title"
                            style={{ background: '#F3F3F3' }}
                            type="text"
                            {...register('title', { required: true })} 
                        />
                        <span className="text-danger">{errors.title && "กรุณากรอกชื่อ Campaign"}</span>
                    </Col>
                </Row>

                <Row className='mb-4'>
                    <Col lg='12'>
                        <h6 for="name">ภาพแคมเปญ (1:1  1024x1024 px)</h6>
                        <input 
                            className={`form-control ${errors.imgbase64 && 'is-invalid'} mb-1`}
                            style={{ background: '#F3F3F3' }}
                            type="file"
                            accept="image/*"
                            onChange={onSelectFile}
                        />
                        <span className="text-danger">{errors.imgbase64 && "กรุณาอัปโหลดภาพแคมเปญ"}</span>
                    </Col>
                    {imageBase64 && (
                        <Col lg='12' className='mt-2'>
                            <img alt="Campaign" src={`data:image/png;base64,${imageBase64}`} style={{ maxWidth: '100%', height: 'auto', width: 'auto' }} />
                        </Col>
                    )}
                    {imgUrl && (
                        <Col lg='12' className='mt-2'>
                            <img alt="Campaign" src={`${imgUrl}`} style={{ maxWidth: '100%', height: 'auto', width: 'auto' }} />
                        </Col>
                    )}
                </Row>

                <Row className='mb-1'>
                    <Col sm='6' md='4'>
                        <Card style={{ background: '#F0F0F0' }}>
                            <CardBody style={{ padding: '24px' }}>
                                <h6 className='mb-1'>วันเริ่มต้นแคมเปญ</h6>
                                <input 
                                    className={`form-control ${errors.validbegin && 'is-invalid'} mb-1`}
                                    id="validbegin"
                                    type="date"
                                    {...register('validbegin', { required: true })} 
                                />
                                <span className="text-danger">{errors.validbegin && "กรุณาเลือกวันเริ่มต้นแคมเปญ"}</span>

                                <h6 className='mb-1 mt-3'>วันจบแคมเปญ</h6>
                                <input 
                                    className={`form-control ${errors.validend && 'is-invalid'} mb-1`}
                                    id="validend"
                                    type="date"
                                    {...register('validend', { required: true })} 
                                />
                                <span className="text-danger">{errors.validend && "กรุณาเลือกวันจบแคมเปญ"}</span>
                            </CardBody>
                        </Card>
                    </Col>
                    
                    <Col sm='6' md='4'>
                        <Card style={{ background: '#F0F0F0' }}>
                            <CardBody style={{ padding: '24px' }}>
                                <h6 className='mb-1'>วันเริ่มส่งการบ้าน</h6>
                                <input 
                                    className={`form-control ${errors.submitbegin && 'is-invalid'} mb-1`}
                                    id="submitbegin"
                                    type="date"
                                    {...register('submitbegin', { required: true })} 
                                />
                                <span className="text-danger">{errors.submitbegin && "กรุณาเลือกวันเริ่มส่งการบ้าน"}</span>

                                <h6 className='mb-1 mt-3'>วันหมดเขตส่งการบ้าน</h6>
                                <input 
                                    className={`form-control ${errors.submmitend && 'is-invalid'} mb-1`}
                                    id="submmitend"
                                    type="date"
                                    {...register('submmitend', { required: true })} 
                                />
                                <span className="text-danger">{errors.submmitend && "กรุณาเลือกวันหมดเขตส่งการบ้าน"}</span>
                            </CardBody>
                        </Card>
                    </Col>

                    <Col sm='6' md='4'>
                        <Card style={{ background: '#F0F0F0' }}>
                            <CardBody style={{ padding: '24px' }}>
                                <h6 className='mb-1'>วันเริ่มตรวจการบ้าน</h6>
                                <input 
                                    className={`form-control ${errors.approvebegin && 'is-invalid'} mb-1`}
                                    id="approvebegin"
                                    type="date"
                                    {...register('approvebegin', { required: true })} 
                                />
                                <span className="text-danger">{errors.approvebegin && "กรุณาเลือกวันเริ่มตรวจการบ้าน"}</span>

                                <h6 className='mb-1 mt-3'>วันสิ้นสุดการตรวจการบ้าน</h6>
                                <input 
                                    className={`form-control ${errors.approveend && 'is-invalid'} mb-1`}
                                    id="approveend"
                                    type="date"
                                    {...register('approveend', { required: true })} 
                                />
                                <span className="text-danger">{errors.approveend && "กรุณาเลือกวันสิ้นสุดการตรวจการบ้าน"}</span>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                <Row className='mb-4'>
                    <Col lg='7'>
                        <h6 for="name">จำนวนที่รับสมัคร</h6>
                        <input 
                            className={`form-control ${errors.kollimit && 'is-invalid'} mb-1`}
                            id="kollimit"
                            style={{ background: '#F3F3F3' }}
                            type="number"
                            {...register('kollimit', { required: true })} 
                            placeholder='ระบุตัวเลข'
                        />
                        <span className="text-danger">{errors.kollimit && "กรุณากรอกจำนวนที่รับสมัคร"}</span>
                    </Col>
                </Row>

                <Row className='mb-4'>
                    <Col lg='7'>
                        <h6 for="name">ระบุค่าจ้างของพร้อมขาย</h6>
                        <input 
                            className={`form-control ${errors.earning && 'is-invalid'} mb-1`}
                            id="earning"
                            style={{ background: '#F3F3F3' }}
                            type="number"
                            placeholder='ระบุตัวเลขค่าจ้าง'
                            {...register('earning', { required: true })} 
                        />
                        <span className="text-danger">{errors.earning && "กรุณากรอกค่าจ้างของพร้อมขาย"}</span>
                    </Col>
                </Row>

                <Row className='mb-4'>
                    <Col lg='7'>
                        <h6 for="name">ระบุค่าคอมที่จะได้รับจาก Tiktok เป็น %</h6>
                        <select 
                            className={`form-select ${errors.commission && 'is-invalid'} mb-1`}
                            id="commission"
                            style={{ background: '#F3F3F3' }}
                            {...register('commission', { required: true })} 
                        >
                            <option value="">กรุณาเลือกค่าคอม</option>
                            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'].map((m, i) => (
                                <option key={i} value={m}>{m} %</option>
                            ))}
                        </select>
                        <span className="text-danger">{errors.commission && "กรุณาเลือกค่าคอมที่จะได้รับจาก Tiktok"}</span>
                    </Col>
                </Row>

                <Row className='mb-4'>
                    <Col lg='7'>
                        <h6 for="name">ประเภทสินค้า</h6>
                        <select 
                            className={`form-select ${errors.producttype && 'is-invalid'} mb-1`}
                            id="producttype"
                            style={{ background: '#F3F3F3' }}
                            {...register('producttype', { required: true })} 
                        >
                            <option value="">กรุณาเลือกประเภทสินค้า</option>
                            {productTypes.map((m, i) => (
                                <option key={i} value={m.id}>{m.name}</option>
                            ))}
                        </select>
                        <span className="text-danger">{errors.producttype && "กรุณาเลือกประเภทสินค้า"}</span>
                    </Col>
                </Row>

                <Row className='mb-4'>
                    <Col lg='12'>
                        <h6 for="name">คำอธิบายแบบสั้น</h6>
                        <textarea 
                            className={`form-control ${errors.description && 'is-invalid'} mb-1`}
                            id="description"
                            style={{ background: '#F3F3F3' }}
                            type="text"
                            {...register('description', { required: true })}
                            rows={3}
                        />
                        <span className="text-danger">{errors.description && "กรุณากรอกคำอธิบายแบบสั้น"}</span>
                    </Col>
                </Row>

                <Row className='mb-4'>
                    <Col lg='12'>
                        <h6 for="name">Brief</h6>
                        <textarea 
                            className={`form-control ${errors.brief && 'is-invalid'} mb-1`}
                            id="brief"
                            style={{ background: '#F3F3F3' }}
                            type="text"
                            {...register('brief', { required: true })}
                            rows={3}
                        />
                        <span className="text-danger">{errors.brief && "กรุณากรอก Brief"}</span>
                    </Col>
                </Row>

                <Row className='mb-4'>
                    <Col lg='7'>
                        <h6 for="name">ลิงค์ติดตระกร้า</h6>
                        <div className="my-3">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" {...register('tiktoktabtype', { required: true })} id="radiotablink" value="Tab" />
                                <label for="radiotablink"><h6 className="form-check-label">Tab Link <span style={{ color: '#FB2D63' }}>(Auto Generate Unique Link)</span></h6></label>
                            </div>

                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" {...register('tiktoktabtype', { required: true })} id="radioutm" value="Utm" />
                                <label for="radioutm"><h6 className="form-check-label">UTM <span style={{ color: '#FB2D63' }}>(Auto Generate UTM Link)</span></h6></label>
                            </div>

                            <span className="text-danger">{errors.tiktoktabtype && "กรุณาเลือกประเภทลิงค์ติดตระกร้า"}</span>
                        </div>
                        <input 
                            className={`form-control ${errors.tiktoktaburl && 'is-invalid'} mb-1`}
                            id="tiktoktaburl"
                            style={{ background: '#F3F3F3' }}
                            type="text"
                            placeholder='วางลิงค์ที่นี่'
                            {...register('tiktoktaburl', { required: true })} 
                        />
                        <span className="text-danger">{errors.tiktoktaburl && "กรุณากรอกลิงค์ติดตระกร้า"}</span>
                    </Col>
                </Row>

                <Row className='mb-4'>
                    <Col lg='12'>
                        <h6 for="name">เงื่อนไข</h6>
                        <div className={`${errors.condition && 'quill-is-invalid'}`}>
                            <ReactQuill 
                                theme="snow"
                                value={editor}
                                onChange={(e) => {
                                    setEditor(e);
                                    clearErrors('condition');
                                }}
                                modules={modules}
                                formats={formats}
                                className="custom-quill"
                            />
                        </div>
                        <span className="text-danger">{errors.condition && "กรุณากรอก Brief"}</span>
                    </Col>
                </Row>

                <Row className='mt-4 mb-4'>
                    <Col lg='12' className='text-center'>
                        <Button color="primary">ถัดไป</Button>
                    </Col>
                </Row>
            </Form>
        </Fragment>
    )
}

const FormStep2 = ({ targetList, steps, setSteps, setFormdata, formdata, onSubmitForm }) => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    
    useEffect(() => {
        if (steps === 2) {
            setValue('broadcastaudienceid', formdata?.broadcastaudienceid || '');
            setValue('broadcastdate', formdata?.broadcastdate || '');
            setValue('broadcasttime', formdata?.broadcasttime || '');
            setValue('broadcastdescription', formdata?.broadcastdescription || '');
        }
    }, [steps, formdata, targetList])
    
    const onSubmit = (data) => {
        setFormdata(prev => ({ ...prev, ...data }))
        onSubmitForm({
            ...formdata,
            ...data
        })
    }

    return (
        <Fragment>
            <Form className="needs-validation" noValidate="" onSubmit={handleSubmit(onSubmit)}>
                <Row className='mb-4'>
                    <Col lg='7'>
                        <h6 for="name">Target Group</h6>
                        <select 
                            className={`form-select ${errors.broadcastaudienceid && 'is-invalid'} mb-1`}
                            id="broadcastaudienceid"
                            style={{ background: '#F3F3F3' }}
                            {...register('broadcastaudienceid', { required: true })} 
                        >
                            <option value="">เลือกกลุ่มที่สร้างไว้</option>
                            {targetList.map((m, i) => (
                                <option key={i} value={m.audienceid}>{m.title}</option>
                            ))}
                        </select>
                        <span className="text-danger">{errors.broadcastaudienceid && "กรุณาเลือก Target Group"}</span>
                    </Col>
                </Row>

                <Row className='mb-1'>
                    <Col sm='6' md='4'>
                        <Card style={{ background: '#F0F0F0' }}>
                            <CardBody style={{ padding: '24px' }}>
                                <h6 className='mb-1'>วันยิง Broadcasting msg</h6>
                                <input 
                                    className={`form-control ${errors.broadcastdate && 'is-invalid'} mb-1`}
                                    id="broadcastdate"
                                    type="date"
                                    {...register('broadcastdate', { required: true })} 
                                />
                                <span className="text-danger">{errors.broadcastdate && "กรุณาเลือกวันยิง Broadcasting msg"}</span>

                                <h6 className='mb-1 mt-3'>เวลา</h6>
                                <input 
                                    className={`form-control ${errors.broadcasttime && 'is-invalid'} mb-1`}
                                    id="broadcasttime"
                                    type="time"
                                    {...register('broadcasttime', { required: true })} 
                                />
                                <span className="text-danger">{errors.broadcasttime && "กรุณาเลือกเวลา"}</span>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                <Row className='mb-4'>
                    <Col lg='12'>
                        <h6 for="name">คำอธิบาย</h6>
                        <textarea 
                            className={`form-control ${errors.broadcastdescription && 'is-invalid'} mb-1`}
                            id="broadcastdescription"
                            style={{ background: '#F3F3F3' }}
                            type="text"
                            {...register('broadcastdescription', { required: true })}
                            rows={3}
                        />
                        <span className="text-danger">{errors.broadcastdescription && "กรุณากรอกคำอธิบาย"}</span>
                    </Col>
                </Row>

                <Row className='mt-4 mb-4'>
                    <Col lg='12' className='text-center'>
                        <Button color="primary">บันทึก</Button>
                    </Col>
                </Row>
            </Form>
        </Fragment>
    )
}