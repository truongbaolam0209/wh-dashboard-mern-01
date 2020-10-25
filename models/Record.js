const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const RecordSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    projects: [
        {
            projectName: {
                type: String,
                required: true
            },
            drawingLateConstruction: {
                type: Number,
                required: true
            },
            drawingLateApproval: {
                type: Number,
                required: true
            },
            drawingLateSubmission: {
                type: Number,
                required: true
            },
            drawingStatus: [
                {
                    status: {
                        type: String,
                        required: true
                    },
                    count: {
                        type: Number,
                        required: true
                    }
                }
            ],
            drawingByRevision: [
                {
                    revision: {
                        type: String,
                        required: true
                    },
                    count: {
                        type: Number,
                        required: true
                    }
                }
            ]
        }
    ]
});

module.exports = mongoose.model('-records', RecordSchema);