import React, { useEffect, useState } from 'react';
import { Button } from 'reactstrap'
import DataTable from 'react-data-table-component'
import { toFixed } from '../../../util/helpper';
import { Upload } from 'react-feather';
import { useNavigate } from 'react-router';

const customStyles = {
    headCells: {
        style: {
          justifyContent: "center",
          textAlign: "center",
        },
    },
};

export default function BoxTopSpender({ data }){
    const navigate = useNavigate();
    const [result, setResult] = useState([]);

    useEffect(() => {
        const list = (data?.dashboard_topspender || []).filter((f, i) => i < 10);
        setResult(mappingData(list));
    }, [data])

    const onClickDetail = (id) => {
        // navigate(`${process.env.PUBLIC_URL}/customer/detail/${id}`);
    }

    function mappingData(data){
        const list = [];
    
        data.forEach((m, i) => {
            list.push({
                action: (
                    <div style={{ display: 'flex', gap: 2 }}>
                      <span onClick={() => onClickDetail(m.profileid)}>
                        <i
                          className="fa fa-eye"
                          style={{
                            width: 35,
                            fontSize: 16,
                            padding: 11,
                            color: "#000000",
                            cursor: 'pointer',
                          }}
                        ></i>
                      </span>
                    </div>
                ),
                no: i + 1,
                firstname: m?.firstname || '',
                lastname: m?.lastname || '',
                purchase: toFixed(m?.repeatpurchase || 0),
                spending: toFixed(m?.totalspending || 0)
            });
        })
        
        return list;
    }

    return (<div>
        <div style={{ display: 'flex', marginBottom: '14px', justifyContent: 'space-between', alignItems: 'center' }}>
            <h5 style={{ fontWeight: 600 }}>Top 10 Spender</h5>
            <Button color="primary" outline className='btn-js1 text-center' style={{ maxWidth: 300, display: 'flex', alignItems: 'center' }}><Upload size={18} style={{ marginRight: '5px' }} /> Generate Report</Button>
        </div>

        <div className="table-responsive support-table" style={{ maxHeight: '250px' }}>
            <DataTable
                columns={columns}
                data={result}
                striped={true}
                center={true}
                pagination={false}
                customStyles={customStyles} 
                noDataComponent={
                    <div style={{ padding: '10px', fontSize: '16px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        ไม่มีข้อมูลแสดงในขณะนี้
                    </div>
                }
                persistTableHead
            />
        </div>
    </div>)
}

const columns = [
    {
        name: "No.",
        selector: (row) => row["no"],
        sortable: false,
        center: true,
        minWidth: "50px",
    },
    {
        name: "Name",
        selector: (row) => row["firstname"],
        sortable: false,
        center: false,
        minWidth: "120px",
    },
    {
        name: "Surname",
        selector: (row) => row["lastname"],
        sortable: false,
        center: false,
        minWidth: "120px",
    },
    {
        name: "Repeat purchase",
        selector: (row) => row["purchase"],
        sortable: false,
        center: true,
        minWidth: "160px",
    },
    {
        name: "Spending",
        selector: (row) => row["spending"],
        sortable: false,
        center: true,
        minWidth: "120px",
    },
     {
        name: "Phone",
        selector: (row) => row["phone"],
        sortable: false,
        center: true,
        minWidth: "120px",
    },
     {
        name: "Address City",
        selector: (row) => row["address"],
        sortable: false,
        center: true,
        minWidth: "150px",
    },
     {
        name: "Product",
        selector: (row) => row["product"],
        sortable: false,
        center: true,
        minWidth: "120px",
    },
    {
        name: "",
        selector: (row) => row["action"],
        sortable: false,
        center: true,
        minWidth: "50px",
    },
]