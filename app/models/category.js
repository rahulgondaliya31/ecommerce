const sql = require('./db.js');

const Category = function(category) {
    this.category_id = category.category_id;
    this.id = category.id
    this.name = category.name;
    this.image = category.image;
  };

  Category.allCategory = result => {
    sql.query(`SELECT id,name,image FROM category ORDER BY name ASC`, (err, res) => {
    result(null, res);
    return;  
    });
  };


Category.SelectCategory = (category_id,id,result) => {
  sql.query(
    "UPDATE users SET selected_category = ?  WHERE id = ?",
    [category_id, id],
    (err, res) => {
      // console.log(res); return false;
      result(null,category_id,id);
      return;  
    }
  );
};

  module.exports = Category