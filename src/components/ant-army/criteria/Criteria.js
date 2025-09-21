import { Calendar, Search } from "react-feather"
import { Button, ButtonGroup, Col, Input, Popover, PopoverBody, } from "reactstrap"
import DatePicker from "react-datepicker";
import { useState } from "react";
import moment from "moment";
import { toFixed } from "../../../util/helpper";

export const BoxFilter = ({ text = '', isActive = false, onChange, isView = false }) => {
    if (isView) {
        return (
            <div className={`filter-select active`}>
                <p>{text}</p>
            </div>
        ) 
    }
    return (
        <div className={`filter-select ${isActive ? 'active' : ''}`} onClick={() => onChange()}>
            <p>{text}</p>
        </div>
    )
}

export const BoxSearch = ({ value, onChange }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', padding: '20px 20px' }}>
            <div className="faq-form">
                <Input 
                    className="form-control"
                    type="text"
                    placeholder="ค้นหา.."
                    style={{ width: 300 }}
                    value={value}
                    onChange={(e) => onChange('keyword', e.target.value)} 
                />
                <Search className="search-icon" />
            </div>
        </div>
    )
}

export const BoxCustomType = ({ value, onChange }) => {
    return (
        <ButtonGroup key={value}>
            <Button color="primary" outline className={`btn-js1 ${value === 'today' ? 'active' : ''}`} onClick={() => onChange('customType', 'today')}>วันนี้</Button>
            <Button color="primary" outline className={`btn-js1 ${value === 'week' ? 'active' : ''}`} onClick={() => onChange('customType', 'week')}>สัปดาห์นี้</Button>
            <Button color="primary" outline className={`btn-js1 ${value === 'month' ? 'active' : ''}`} onClick={() => onChange('customType', 'month')}>เดือนนี้</Button>
        </ButtonGroup> 
    )
}

export const BoxCustomDate = ({ startDate, endDate, onChange, onClear }) => {
    const [popover, setPopover] = useState(false);
    const OffsetToggle = () => { setPopover(!popover); };

    const [popover2, setPopover2] = useState(false);
    const OffsetToggle2 = () => { setPopover2(!popover2); };

    return (
         <ButtonGroup className="pull-right">
            <Button color="primary" outline className="btn-js1" id="Popover-StartDate">{startDate ? moment(startDate).format('DD/MM/yyyy') : 'วันที่เริ่มต้น'}</Button>
            <Popover placement="bottom" isOpen={popover} target="Popover-StartDate" toggle={OffsetToggle} trigger="hover">
                <PopoverBody>
                    <DatePicker className="form-control digits"
                        selected={startDate}
                        onChange={(date) => onChange('startDate', date)}
                        inline
                    />
                </PopoverBody>
            </Popover>
            <Button color="primary" outline className="btn-js1" id="Popover-EndDate">{endDate ? moment(endDate).format('DD/MM/yyyy') : 'วันที่สิ้นสุด'}</Button>
            <Popover placement="bottom" isOpen={popover2} target="Popover-EndDate" toggle={OffsetToggle2} trigger="hover">
                <PopoverBody>
                    <DatePicker className="form-control digits"
                        selected={endDate}
                        onChange={(date) => onChange('endDate', date)}
                        inline
                    />
                </PopoverBody>
            </Popover>
            <Button color="primary" outline className="btn-js1 active" onClick={() => onClear()}><Calendar size={18} /></Button>
        </ButtonGroup>
    )
}


export const BoxCount = ({ text = '', value = '' }) => {
    let count = '';

    if (value < 1000) {
        count = toFixed(value);
    } else if (value < 1000000) {
        count = `${toFixed(value/1000, 1)} K`;
    } else  {
        count = `${toFixed(value/1000000, 1)} M`;
    }     

    return (
        <div className='text-center'>
            <h5 style={{ margin: 0 }}><strong>{count}</strong></h5>
            <p>{text}</p>
        </div>
    )
}


export const BoxInfo = ({ text = '', value = '' }) => {
    return (
        <Col xs='12'>
            <div style={{ borderBottom: '1px solid #E3E3E3', padding: '20px 0px 0px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <p style={{ fontSize: 14, margin: 0 }}>{text}</p>
                <p style={{ fontSize: 14, margin: 0 }}>{value}</p>
            </div>
        </Col>
       
    )
}

export const BoxCriteriaDate = ({ type, startDate, endDate, onChange, onClear }) => {
    return (
        <div style={{ 
            display: 'flex',
            padding: '20px 20px',
            background: '#F1F1F1',
            alignItems: 'center'
        }}>
            <span style={{ marginRight: '14px' }}>แสดงวันที่</span>
            <div style={{ width: '200px' }}>
                <select 
                    className={`form-select`}
                    style={{ background: '#FFFFFF' }}
                    value={type}
                    onChange={(e) => onChange('customType', e.target.value)} 
                >
                    <option value="">ทั้งหมด</option>
                    <option value="today">วันนี้</option>
                    <option value="week">สัปดาห์นี้</option>
                    <option value="month">เดือนนี้</option>
                    <option value="1month">ย้อนหลัง 1 เดือน</option>
                    <option value="3month">ย้อนหลัง 3 เดือน</option>
                    <option value="custom">กำหนดเอง</option>
                </select>
            </div>
            {type === 'custom' && (
                <div style={{ marginLeft: '20px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span>เริ่มต้น</span>
                    <div>
                        <input 
                            className={`form-control`}
                            value={startDate}
                            type="date"
                            onChange={(e) => onChange('startDate', e.target.value)} 
                        />
                    </div>
                    <span>ถึง</span>
                    <div>
                        <input 
                            className={`form-control`}
                            value={endDate}
                            type="date"
                            onChange={(e) => onChange('endDate', e.target.value)} 
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export const BoxHeader = ({ menu = '', isHealth = true, setIsHealth }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h4 style={{ margin: 0, fontWeight: 600 }}>{menu}</h4>
        
            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{
                    background: !isHealth ? 'black' : '#D9D9D9',
                    color: !isHealth ? 'white' : 'black',
                    padding: '4px 14px',
                    width: '120px',
                    textAlign: 'center',
                    cursor: 'pointer',
                }} onClick={() => setIsHealth(false)}>
                    <span style={{ fontSize: '18px', fontWeight: 600 }}>PETS</span>
                </div>
                <div style={{
                    background: isHealth ? 'black' : '#D9D9D9',
                    color: isHealth ? 'white' : 'black',
                    padding: '4px 14px',
                    width: '120px',
                    textAlign: 'center',
                    cursor: 'pointer',
                }} onClick={() => setIsHealth(true)}>
                    <span style={{ fontSize: '18px', fontWeight: 600 }}>HEALTH</span>
                </div>
            </div>
        </div>
    )
}

export const BoxHeader2 = ({ isHealth = true, setIsHealth }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{
                    background: !isHealth ? 'black' : '#D9D9D9',
                    color: !isHealth ? 'white' : 'black',
                    padding: '4px 14px',
                    width: '120px',
                    textAlign: 'center',
                    cursor: 'pointer',
                }} onClick={() => setIsHealth(false)}>
                    <span style={{ fontSize: '18px', fontWeight: 600 }}>PETS</span>
                </div>
                <div style={{
                    background: isHealth ? 'black' : '#D9D9D9',
                    color: isHealth ? 'white' : 'black',
                    padding: '4px 14px',
                    width: '120px',
                    textAlign: 'center',
                    cursor: 'pointer',
                }} onClick={() => setIsHealth(true)}>
                    <span style={{ fontSize: '18px', fontWeight: 600 }}>HEALTH</span>
                </div>
            </div>
        </div>
    )
}