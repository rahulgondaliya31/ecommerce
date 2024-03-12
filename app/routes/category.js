module.exports = app =>{
    var router = require("express").Router();
    const Category = require("../controllers/category.js");
    const fileUpload = require('express-fileupload');
    app.use(fileUpload());

    app.get('/allcategory',Category.allcategory);
    app.post('/addprefernce',Category.addprefernce);

}