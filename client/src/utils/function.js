import Axios from 'axios';
import _ from 'lodash';
import moment from 'moment';




export const api = Axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});


// convert data from DB of all projects
export const getDataConverted = (projectArray) => {

    let dataOutput = {};
    for (let i = 0; i < projectArray.length; i++) {

        // get the column header
        const project = projectArray[i];
        const categoryArray = _.map(project.columns, 'title');
        let columnsIndexArray = {};
        categoryArray.forEach(cate => {
            project.columns.forEach(cl => {
                if (cl.title === cate) columnsIndexArray[cate] = cl.index;
            });
        });

        const indexDrawingName = columnsIndexArray['Drawing Name'];
        const indexRev = columnsIndexArray['Rev'];

        let allDrawings = [];
        let allDrawingsLatestRevision = [];

        for (let i = 0; i < project.rows.length; i++) {
            const dwg = project.rows[i];
            if (dwg.cells[indexDrawingName].value === undefined) continue; // make sure all drawing name is keyed in
            allDrawings.push([...dwg.cells]);

            if (dwg.cells[indexRev].value === undefined) {
                allDrawingsLatestRevision.push([...dwg.cells]);
                continue;
            };

            let found = false;
            for (let j = 0; j < allDrawingsLatestRevision.length; j++) {
                if (allDrawingsLatestRevision[j][indexDrawingName].value === dwg.cells[indexDrawingName].value) {
                    found = true;
                    if (String(allDrawingsLatestRevision[j][indexRev].value) < String(dwg.cells[indexRev].value)) {
                        allDrawingsLatestRevision.splice(j, 1);
                        allDrawingsLatestRevision.push([...dwg.cells]);
                    };
                    break;
                };
            };
            if (!found) allDrawingsLatestRevision.push([...dwg.cells]);
        };
        dataOutput[project.name.slice(0, project.name.length - 17)] = {
            columnsIndexArray,
            allDrawings,
            allDrawingsLatestRevision
        };
    };
    return dataOutput;
};



export const getAllDrawingSameValueInOneColumn = ({
    columnsIndexArray,
    allDrawings,
    allDrawingsLatestRevision
}, column, dataType) => {

    const drawings = dataType === 'all' ? allDrawings : allDrawingsLatestRevision;
    const indexCategory = columnsIndexArray[column];

    let drawingCount = {};
    let drawingList = {};

    drawings.forEach(dwg => {
        const { value } = dwg[indexCategory];

        drawingCount[value] = (drawingCount[value] || 0) + 1;
        drawingList[value] = [...drawingList[value] || [], dwg];
    });

    return {
        drawingCount,
        drawingList
    };
};



export const getDrawingLateNow = (data, type) => {

    const { allDrawingsLatestRevision, columnsIndexArray } = data;

    const dwgsLateNow = [];
    const columnHeader = type === 'getApproval' ? 'get Approval'
        : type === 'drgToConsultant' ? 'Drg to Consultant' : null;

    allDrawingsLatestRevision.forEach(dwg => {
        const status = dwg[columnsIndexArray['Status']].value;
        // make sure drawing is not approved or consultant reviewing
        if (status && (status.includes('Approved') || status === 'Consultant reviewing')) return;

        const dateT = dwg[columnsIndexArray[`${columnHeader} (T)`]].value;
        const dateA = dwg[columnsIndexArray[`${columnHeader} (A)`]].value;
        if (dateT === undefined || dateA !== undefined) return;

        const diff = moment(dateT).diff(moment(), 'days');
        if (diff < 0) dwgsLateNow.push([...dwg]);
    });
    return dwgsLateNow;
};



export const mergeUndefined = ({ drawingCount, drawingList }, mergeWith) => {
    if (drawingCount['undefined'] === undefined) return;

    drawingCount[mergeWith] = (drawingCount[mergeWith] || 0) + drawingCount['undefined'];
    delete drawingCount['undefined'];

    drawingList[mergeWith] = [...drawingList[mergeWith] || [], ...drawingList['undefined']];
    delete drawingList['undefined'];

    return {
        drawingCount,
        drawingList
    };
};

export const formatString = (str) => {
    let mystring = str.replace(/ /g, '').replace(/\(|\)/g, '');
    return mystring.charAt(0).toLowerCase() + mystring.slice(1);
};


export const pickDataToTable = (drawings, columnsIndexArray) => {

    const headerArr = [
        'Drawing Number', 'Drawing Name', 'RFA Ref', 'Drg Type', 'Use For', 'Coordinator In Charge',
        'Modeller', 'Model Finish (T)', 'Model Finish (A)', 'Model Progress', 'Drawing Start (T)', 'Drawing Start (A)',
        'Drawing Finish (T)', 'Drawing Finish (A)', 'Drawing Progress',
        'Drg to Consultant (T)', 'Drg to Consultant (A)', 'Consultant Reply (T)', 'Consultant Reply (A)',
        'get Approval (T)', 'get Approval (A)', 'Construction issuance date', 'Construction Start', 'Rev', 'Status', 'Remark'
    ];

    let arr = [];
    drawings.forEach(dwg => {
        let obj = {};
        Object.keys(columnsIndexArray).forEach(header => {
            obj[formatString(header)] = dwg[columnsIndexArray[header]].value || 'N/A';
        });
        arr.push(obj);
    });
    console.log(arr);
    return arr;
};



export const convertDataToStackedChart = (data) => {
    let dataChart = [];
    let allKeys = [];
    data && Object.keys(data).forEach(project => {
        const { drawingCount } = mergeUndefined(getAllDrawingSameValueInOneColumn(data[project], 'Status'), 'Not Started');
        dataChart.push({ ...drawingCount, name: project });
        allKeys = [...allKeys, ...Object.keys(drawingCount)];
    });
    const itemArr = [...new Set(allKeys)];

    itemArr.forEach(key => {
        dataChart.forEach(projectData => {
            if (key in projectData) return;
            projectData[key] = 0;
        });
    });

    return {
        dataChart,
        itemArr
    };
};





