import React from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Tooltip, XAxis, YAxis } from 'recharts';
import { colorType } from '../assets/constant';



const ChartBarRecord = ({ data }) => {
    console.log(data);
    const dataChart = [];


    return (
        <div style={{ margin: '0 auto', display: 'table' }}>
            <BarChart
                width={320}
                height={350}
                data={dataChart}
                margin={{ top: 35, right: 30, left: 0, bottom: 20 }}
                padding={{ top: 10 }}
                barSize={20}
            >
                <XAxis dataKey='name' textAnchor='end' angle={-45} interval={0} scale='point' padding={{ left: 30, right: 30 }} />
                <YAxis />
                <Tooltip />
                <CartesianGrid strokeDasharray='3 3' />
                <Bar
                    dataKey='value'
                    background={{ fill: colorType.grey0 }}
                    barSize={25}
                >
                    {dataChart.map((entry, index) => (
                        <Cell
                            cursor='pointer'
                            fill={colorType.grey1}
                            key={`cell-${index}`}
                        />
                    ))}
                </Bar>

            </BarChart>
        </div>

    );
};

export default ChartBarRecord;


