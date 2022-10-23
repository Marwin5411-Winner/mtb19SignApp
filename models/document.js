const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const docsSchema =  new Schema({
    id: {
        type: Number,
        unique: true,
    },
    name: String,
    description: {
        type: String,
        default: 'No description'
    },
    filename: String,
    file: {
        type: String,
        unique: true
    },
    authorName: String,
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
    reviewer: {   
        type: Map,
        of: Boolean,
        default: {
            'reviewer1': false,
            'reviewer2': false,
            'reviewer3': false,
            'reviewer4': false,
            'bigboss': false
        }
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
