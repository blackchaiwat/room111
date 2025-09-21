import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts'

export default function BoxChartPie({ title = '', id = '', height = 270, data = [], labels = [] }){
    const [series, setSeries] = useState([]);

    useEffect(() => {
        const list = [];
        labels.forEach((f) => {
            const find = data.find((m) => (m?.title || '').toLowerCase() === f.toLowerCase());
            list.push(find?.value || 0);
        })
        setSeries(list);
    }, [labels, data])

    const opt = {
        chart: {
            type: 'donut',
            height: height
        },
        colors:['#9f0ff1', '#419FF9', '#FB2D63', '#51BB25', '#AA1A1A', '#4378FF', '#019E3E', '#FF02CC', '#ECC52E', '#451BFF'],
        labels: labels,
        plotOptions: {
            pie: {
                donut: {
                    size: '40%'
                }
            }
        },
        tooltip: {
            style: {
                fontFamily: 'Prompt, sans-serif  !important',
            },
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 300
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        ]
    }

    return (<div>
       <h5 style={{ fontWeight: 600 }}>{title}</h5>
        <div id={id}>
            {opt && series && (
                <Chart 
                    options={opt}
                    series={series}
                    type="donut"
                    height={height}
                />
            )}
        </div>
    </div>)
}
