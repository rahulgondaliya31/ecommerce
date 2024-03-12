const Category = require('../models/category.js');

exports.allcategory = (req, res) => {
    Category.allCategory((err, data) => {
  
      var newCats = [];
      catData = data;
      catData.forEach(function(data){
        var obj ={};
        obj['id'] = data.id; 
        obj['name'] = data.name; 
        obj['image'] = nodeSiteUrl+'/file/category/'+data.image; 
        newCats.push(obj);      
      });
  
      return res.send({
           success:"yes",
           message: "",
           data: newCats  
      });
    });
  };

  exports.addprefernce = (req, res) => {
    const { user_id, category_id} = req.body;
    // console.log(req.body); return false;
    let errors = '';
    if (!user_id) {
      errors = 'User id is required.';
    }

    if (errors.length > 0) {

      return res.send({
           success:"no",
           message: errors,
           data: []
      });
    }

    const data = user_id;
    Category.SelectCategory(category_id,data,(err, update) => {
      // console.log(update); return false;
        return res.send({
           success:"yes",
           message: 'Preference added successfully.',
           data:  req.body
        })
    })

};