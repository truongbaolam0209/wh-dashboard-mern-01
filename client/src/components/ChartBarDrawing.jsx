import { Badge } from 'antd';
import React, { useState } from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, Tooltip, XAxis, YAxis } from 'recharts';
import styled from 'styled-components';
import { inputStackData, pieChartColors2 } from '../assets/constant';
import { getAllDrawingSameValueInOneColumn, mergeUndefined, sortStatusOrder } from '../utils/function';



const getSubDrawingByStatus = (drawingList, columnsIndexArray) => {
    let drawingCountSubStatus = [];
    let drawingListSubStatus = {};
    let inputStack = [];

    for (const key in drawingList) {

        const result = getAllDrawingSameValueInOneColumn({
            allDrawingsLatestRevision: drawingList[key],
            columnsIndexArray: columnsIndexArray
        }, 'Status');

        const arr = result.drawingCount;
        
        for (const key in arr) {
            if (key !== 'undefined') inputStack.push(key);
        };

        arr['name'] = key;
        drawingCountSubStatus.push(arr);
        drawingListSubStatus[key] = result.drawingList;
    };

    return {
        drawingCountSubStatus,
        drawingListSubStatus,
        inputStack: [...new Set(inputStack)]
    };
};


const ChartBarDrawing = ({ data, openDrawingTable, projectName }) => {

    const { columnsIndexArray } = data;
    const { drawingList } = mergeUndefined(getAllDrawingSameValueInOneColumn(data, 'Rev'), '0');


    // const dataChart = _.map(drawingCount, (value, name) => ({ name, value }))
    //     .sort((a, b) => (a.name > b.name) ? 1 : -1);


    const { drawingCountSubStatus, drawingListSubStatus, inputStack } = getSubDrawingByStatus(drawingList, columnsIndexArray);


    const onClick = (e, item) => {
        openDrawingTable(
            projectName,
            { type: 'Drawings by revision', category: `Revision: ${e.name} - Status: ${item}` },
            drawingListSubStatus[e.name][item],
            columnsIndexArray
        );
    };


    const LabelCustomStacked = (props) => {
        const { x, y, value, height } = props;
        return (
            <>
                <div className='line'></div>
                <text
                    style={{ fontSize: 13 }}
                    x={x + 20}
                    y={y + height / 2}
                    fill='#2c3e50'
                    dominantBaseline='central'
                >
                    {value === 0 ? null : value}
                </text>
            </>
        );
    };
    const LabelCustomStackedTotal = (props) => {
        const { x, y, value, topBar } = props;
        return (
            <>
                <text
                    style={{ fontSize: 17, fontWeight: 'bold' }}
                    x={x}
                    y={y - 10}
                    fill='black'
                    dominantBaseline='central'

                >
                    {topBar ? value : null}
                </text>
            </>
        );
    };
    const [tooltip, setTooltip] = useState(false);
    const TooltipCustom = (props) => {
        const { active, payload } = props;

        if (!active || !tooltip) return null;
        for (const bar of payload)
            if (bar.dataKey === tooltip) {
                return (
                    <div style={{
                        background: 'white',
                        border: '1px solid grey',
                        padding: '10px',
                        maxWidth: '180px'
                    }}>
                        {bar.name}<br />({bar.value})
                    </div>
                );
            };
        return null;
    };


    return (
        <div style={{ margin: '0 auto', display: 'table' }}>
            <BarChart
                width={320}
                height={350}
                data={drawingCountSubStatus}
                margin={{ top: 35, right: 15, left: 0, bottom: 20 }}
                padding={{ top: 5 }}
                barSize={20}
            >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis tickSize={3} dataKey='name' textAnchor='middle' interval={0} scale='point' padding={{ left: 35, right: 35 }} />
                <YAxis />
                <Tooltip content={<TooltipCustom />} />
                {sortStatusOrder(inputStack).map((item, i) => (
                    <Bar
                        key={item}
                        dataKey={item}
                        stackId='a'
                        fill={pieChartColors2[item]}
                        isAnimationActive={false}
                        onClick={(e) => onClick(e, item)}
                        onMouseOver={() => setTooltip(item)}
                        label={<LabelCustomStackedTotal topBar={i === inputStack.length - 1} />}
                    >
                        <LabelList dataKey={item} position='left' content={<LabelCustomStacked item={item} />} />
                    </Bar>
                ))}

            </BarChart>

            <div style={{ paddingLeft: 50, height: 180 }}>
                {sortStatusOrder(inputStack).reverse().map((key, i) => (
                    <div key={key} style={{ display: 'flex' }}>
                        <div style={{ paddingRight: 5 }}>{'(' + (inputStackData.indexOf(key) + 1) + ')'}</div>
                        <StyledBadge
                            size='small'
                            color={pieChartColors2[key]}
                            text={key}
                        />
                    </div>
                ))}
            </div>
        </div>

    );
};

export default ChartBarDrawing;

const StyledBadge = styled(Badge)`
    .ant-badge-status-dot {
        width: 15px;
        height: 15px;
        border-radius: 0;
    }
`;
