
import { Badge } from 'antd';
import React from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';
import styled from 'styled-components';
import { chartWidth, colorType, pieChartColors2 } from '../assets/constant';
import { convertDataToStackedChart } from '../utils/function';
import CardPanel from './ui/CardPanel';




// const LabelCustomStacked = (props) => {
//     console.log(props);
//     const {x, y, value} = props;
    // const { cx, cy, midAngle, innerRadius, outerRadius, value } = props;
    // const RADIAN = Math.PI / 180;
    // const radius = 28 + innerRadius + (outerRadius - innerRadius);
    // const x = cx + radius * Math.cos(-midAngle * RADIAN);
    // const y = cy + radius * Math.sin(-midAngle * RADIAN);
    // return (
    //     <text
    //         x={x}
    //         y={y}
    //         fill='black'
            // textAnchor={x > cx ? 'start' : 'end'}
//             dominantBaseline='central'
//         >
//             {value}
//         </text>
//     );
// };



const ChartBarStack = ({ data, title }) => {


    const inputData = title === 'Drawing Status' ? convertDataToStackedChart(data).dataChart
        : title === 'Productivity - (days per drawing)' ? data.inputData : null;

    const inputStack = title === 'Drawing Status' ? convertDataToStackedChart(data).itemArr
        : title === 'Productivity - (days per drawing)' ? data.inputStack : null;


    console.log(inputData, inputStack);


    // const xxx = (e) => {
    //     console.log(e);
    // };


    return (

        <CardPanel
            title={title}
            headColor={colorType.orange}
        >
            {data && (
                <>
                    <BarChart
                        data={inputData}
                        width={chartWidth}
                        height={320}
                        margin={{ top: 35, right: 20, left: 15, bottom: 30 }}
                        padding={{ top: 10 }}
                        barSize={30}
                    >
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis tickSize={3} dataKey='name' textAnchor='end' angle={-20} interval={0} scale='point' padding={{ left: 50, right: 50 }} />
                        <YAxis />
                        {/* <Tooltip /> */}
                        {inputStack.map((item, i) => {
                            // console.log(item, inputStack);
                            return (
                                <Bar
                                    key={item}
                                    dataKey={item}
                                    stackId='a'
                                    fill={pieChartColors2[item]}
                                    isAnimationActive={false}
                                    // label={<LabelCustomStacked />}
                                >
                                    <LabelList dataKey={item} position='left' />
                                </Bar>
                            )
                        })}
                    </BarChart>

                    <div style={{ paddingLeft: 50, height: 180 }}>
                        {inputStack.map((key, i) => (
                            <div key={key} style={{ display: 'flex' }}>
                                <StyledBadge
                                    size='small'
                                    color={pieChartColors2[key]}
                                    text={key}
                                />
                            </div>
                        ))}
                    </div>
                </>
            )}

        </CardPanel>
    );
};

export default ChartBarStack;


const StyledBadge = styled(Badge)`
    .ant-badge-status-dot {
        width: 15px;
        height: 15px;
        border-radius: 0;
    }
`;









