import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts'
import { Button } from 'reactstrap';
import { Upload } from 'react-feather';
import { toFixed } from '../../../util/helpper';

export default function BoxRepeat({ data, height }){
    const labels = ['1st', '2nd', '3rd', '4th', '5th', '6th+'];
    const [result, setResult] = useState([]);
    const [series, setSeries] = useState([]);

    useEffect(() => {
        const list = (data?.dashboard_repeatpurchase?.stat || []);
        const result = [];
        labels.forEach((f) => {
            const find = list.find((m) => (m?.title || '').toLowerCase() === f.toLowerCase());
            result.push(find?.value || 0);
        })

        const _series = [
            {
                name: 'People',
                data: result
            },
        ]

        setResult(result);
        setSeries(_series);
    }, [data])
    
    const total = result.reduce((a, b) => a + b, 0);

    const opt = {
        chart: {
            type: 'bar',
            height: height
        },
        plotOptions: {
            bar: {
              horizontal: false,
              endingShape: 'rounded',
              dataLabels: {
                position: 'top',
              }
            }
        },
        dataLabels: {
            enabled: true,
            offsetY: -20,
            formatter: function (val) {
              const percent = toFixed((val / total) * 100);
              return `${percent}%`;
            },
            style: {
              colors: ['#333']
            }
        },
        colors:['#419FF9'],
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: labels,
        },
        yaxis: {
            title: {
                text: 'จำนวน(คน)'
            },
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            style: {
                fontFamily: 'Prompt, sans-serif  !important',
            },
            y: {
                formatter: function (val) {
                    return "" + toFixed(val) + ""
                }
            }
        }
    }

    return (<div>
        <div style={{ display: 'flex', marginBottom: '14px', justifyContent: 'space-between', alignItems: 'center' }}>
            <h5 style={{ fontWeight: 600 }}>Repeat purchase</h5>
            <Button color="primary" outline className='btn-js1 text-center' style={{ maxWidth: 300, display: 'flex', alignItems: 'center' }}><Upload size={18} style={{ marginRight: '5px' }} /> Generate Report</Button>
        </div>
        <div id="repeat-chart">
            {opt && series && (
                <Chart 
                    options={opt}
                    series={series}
                    type="bar"
                    height={height}
                />
            )}
        </div>
    </div>)
}