import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts'
import { Button } from 'reactstrap';
import { Upload } from 'react-feather';
import { toFixed } from '../../../util/helpper';

export default function BoxCustomer({ data, height }){
    const [labels, setLabels] = useState([]);
    const [series, setSeries] = useState([]);

    
    useEffect(() => {
        const list = (data?.dashboard_register?.stat || []);
        
        const _labels = list.map((m) => m.date);
        setLabels(_labels);

        let _names = (list?.[0]?.totalcustomer || []).map((m, i) => ({ 
            value: m.branch, 
            data: [],
            type: 'line',
            order: i + 1,
            name: m.branch
        }));

        _names = _names.sort((a, b) => a.order - b.order);

        const result = _names.map((m) => ({
            ...m,
            data: list.map((l) => {
              const found = (l?.totalcustomer || []).find((f) => f.branch === m.value);
              return found ? found.value : 0;
            })
        }));

        setSeries(result);
    }, [data])

    const opt = {
        chart: {
          toolbar: {
            show: true
          }
        },
        stroke: {
          width: [3, 3, 3],
        //   curve: 'smooth'
        },
        plotOptions: {
          bar: {
            columnWidth: '30%'
          }
        },
        // legend: {
        //     tooltipHoverFormatter: function(val, opts) {
        //     return val + ' - <strong>' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + '</strong>'
        //     }
        // },
        fill: {
          opacity: [1, 1, 1],
          gradient: {
            inverseColors: false,
            shade: 'light',
            type: "vertical",
            opacityFrom: 0.85,
            opacityTo: 0.55,
            stops: [0, 100, 100, 100]
          }
        },
        labels: labels,
        markers: {
            size: 0,
            hover: {
                sizeOffset: 6
            }
        },
        xaxis: {
          type: 'datetime'
        },
        colors: ['#9f0ff1', '#419FF9', '#FB2D63'],
        yaxis: {
          title: {
            text: 'จำนวน',
          },
          min: 0
        },
        grid: {
          borderColor: '#f1f1f1',
        },
        tooltip: {
          style: {
            fontFamily: 'Prompt, sans-serif  !important',
          },
          shared: true,
          intersect: false,
          y: {
            formatter: function (y) {
              if (typeof y !== "undefined") {
                return toFixed(y);
              }
              return y;
            }
          }
        }
      }

    return (<div>
        <div style={{ display: 'flex', marginBottom: '14px', justifyContent: 'space-between', alignItems: 'center' }}>
            <h5 style={{ fontWeight: 600 }}>จำนวนคำสั่งซื้อ</h5>
            {/* <Button color="primary" outline className='btn-js1 text-center' style={{ maxWidth: 300, display: 'flex', alignItems: 'center' }}><Upload size={18} style={{ marginRight: '5px' }} /> Generate Report</Button> */}
        </div>
        <div id="customer-chart">
            {opt && series && (
                <Chart 
                    options={opt}
                    series={series}
                    type="line"
                    height={height}
                />
            )}
        </div>
    </div>)
}