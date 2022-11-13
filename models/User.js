const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const bcrypt = require('bcrypt');

const userSchema =  new Schema({
    id: {
        type: Number,
        unique: true,
    },
    name: String,
    username: {
        type: String,
        unique: true
    },
    password: String,
    department: {
        type: String,
        enum: ['กองกิจการพลเรือน', 'กองข่าว', 'กองยุทธการ', 'กองส่งกำลังบำรุง', 'กองกำลังพล', 'ฝ่ายปลัดบัญชี', 'อื่นๆ', 'ผู้ดูแลระบบ', 'ผู้ตรวจทาน'],
    },
    permission: {
        type: Map,
        of: Boolean,
        default: {
            'view': false,
            'upload': false,
            'approve': false,
            'review': false,
            'admin': false,
       }
    },
    prefix: {
        type: String
    },
    reviewer: {
        type: Number,
        enum: [0,1,2,3,4,5]
    },
});

const UserModel = mongoose.model('User', userSchema, 'users');

// var user = new UserModel({id: 0001, name: 'admin1', username: 'admin1' , password: '12345678'});

// user.save().then((() => {
//     console.log('User saved successfully');
// })).catch((err) => {
//     console.error(err);
// });

module.exports = UserModel;
