const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mtb19signDev', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('db connection established');
}).catch(err => console.log(err));