const jwt = require("jsonwebtoken");

module.exports = function getData (req) {
    let getToken = req.cookies['jwt'];
    let { data } = jwt.verify(getToken, 'mtb19signDev');
    return data;
}