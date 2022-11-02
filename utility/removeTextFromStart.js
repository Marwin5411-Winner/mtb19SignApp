module.exports = (num, req) => {
    num = num || 0;
    const file = req.file.path;
    const path = file.substring(num);
    console.log(path);
    return path;
};