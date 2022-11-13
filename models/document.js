const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const docsSchema =  new Schema({
    name: String,
    description: {
        type: String,
        default: 'No description'
    },
    file: {
        type: String,
        unique: true
    },
    author: String,
    authorId: String,
    department: {
        type: String,
        enum: ['กองกิจการพลเรือน', 'กองข่าว', 'กองยุทธการ', 'กองส่งกำลังบำรุง', 'กองกำลังพล', 'ฝ่ายปลัดบัญชี', 'อื่นๆ'],
        default: ''
    },
    date: {
        type: Date,
        default: Date.now
    },
    //Create reviewer Schema that map type of boolean
    reviewer:  {
        type: Array,
        of: Number,
        default: [0,0,0,0,0]
    },
    reviewerStatus: {
        type: Number,
        default: 1
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
    },
    notPassby: {
        type: String
    }
});

const DocsModel = mongoose.model('Document', docsSchema);

module.exports = DocsModel;
