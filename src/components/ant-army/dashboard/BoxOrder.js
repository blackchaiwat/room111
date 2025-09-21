import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts'
import { toFixed } from '../../../util/helpper';

export default function BoxOrder({ data, height }){
    const labels = ['<10,000', '10,001-50,000', '50,001-100,000', '100,001-200,000', '200,001-300,000', '300,001+'];
    const [result, setResult] = useState([]);
    const [series, setSeries] = useState([]);

    useEffect(() => {
        const list = (data?.dashboard_ordervalue?.stat || []);
        const result = [];
        labels.forEach((f) => {
            const find = list.find((m) => (m?.title || '').toLowerCase() === f.toLowerCase());
            result.push(find?.value || 0);
        })

        const _series = [
            {
                name: 'Order',
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
                return `${percent}% (${toFixed(val)})`;
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
                text: 'จำนวน(Order)'
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
        <div style={{ display: 'flex', marginBottom: '14px', alignItems: 'center' }}>
            <h5 style={{ fontWeight: 600 }}>Average Order Value {toFixed((data?.dashboard_avgorder?.stat || [])?.[0]?.value || 0)} THB</h5>
            <h6 style={{ marginLeft: '10px', fontWeight: 600, color: '#1B85FF' }}>Average / order</h6>
        </div>
        <div id="order-chart">
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
