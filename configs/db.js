const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(`mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@militarycircle19th.qzfmx.mongodb.net/main-db1?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('db connection established');
}).catch(err => console.log(err));