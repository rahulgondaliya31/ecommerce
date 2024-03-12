const sql = require("./db.js");

const Wishlist = function(wishlist) {
    this.user_id = wishlist.user_id;
    this.product_id = wishlist.product_id;
    this.rating = wishlist.rating;
    this.review = wishlist.review;
    
  
  };

  Wishlist.isFavoriteExist = (user_id,product_id, result) => {
    sql.query(`SELECT id FROM wishlist WHERE product_id = ${product_id} AND user_id= ${user_id}`, (err, res) => {
    //console.log(err);return false;
    result(null, res[0]);
    return;  
    });
}

Wishlist.remove = (id, result) => {
  sql.query("DELETE FROM wishlist WHERE id = ?", id, (err, res) => {
    result(null, res);
  });
};

Wishlist.getWishlistProductCount = (user_id, result) => {

  var strlimit="";
  var strCon="";
  var order_by = "p.id DESC";

  sql.query(`SELECT p.id,p.name,p.description, p.avg_rating,p.total_review,p.price,
    (SELECT if(image !='',CONCAT('`+nodeSiteUrl+`','/file/product/',image),'') FROM product_images WHERE product_id = p.id ORDER BY id ASC LIMIT 1) as image,
    p.created_at,p.expected_delivery_time,
    if((SELECT COUNT(id) FROM product_review WHERE product_id = p.id AND user_id= ${user_id})>0,1,0) as is_rating,
    if((SELECT COUNT(id) FROM wishlist WHERE product_id = p.id AND user_id= ${user_id})>0,1,0) as is_favourite,
    p.selling_price,p.is_featured
    FROM wishlist AS w
    LEFT JOIN products AS p ON p.id = w.product_id
    LEFT JOIN category AS c ON c.id = p.category_id
    WHERE w.user_id = ${user_id}
    ORDER BY `+order_by+``+strlimit,
   
  (err, res) => {
 /* console.log(res);
  return false;*/

  result(null, res);
  return;  
  });
};

Wishlist.getWishlistProduct = (user_id,sp,limit, result) => {

  var strlimit = " LIMIT "+sp+","+limit+"";
  var strCon="";
  var order_by = "p.id DESC";

  sql.query(`SELECT p.id,p.name,p.description, p.avg_rating,p.total_review,p.price,
    (SELECT if(image !='',CONCAT('`+nodeSiteUrl+`','/file/product/',image),'') FROM product_images WHERE product_id = p.id ORDER BY id ASC LIMIT 1) as image,
    p.created_at,p.expected_delivery_time,
    if((SELECT COUNT(id) FROM product_review WHERE product_id = p.id AND user_id= ${user_id})>0,1,0) as is_rating,
    if((SELECT COUNT(id) FROM wishlist WHERE product_id = p.id AND user_id= ${user_id})>0,1,0) as is_favourite,
    p.selling_price,p.is_featured
    FROM wishlist AS w
    LEFT JOIN products AS p ON p.id = w.product_id
    LEFT JOIN category AS c ON c.id = p.category_id
    WHERE w.user_id = ${user_id}
    ORDER BY `+order_by+``+strlimit,
   
  (err, res) => {
  /*console.log(res);
  return false;*/

  result(null, res);
  return;  
  });
};

Wishlist.wishlistAdd = (wishlist, result) => {
  sql.query("INSERT INTO wishlist SET ?", wishlist, (err, res) => {
    result(null, res.insertId);
    return; 
  });
};

Wishlist.isUserExist = (user_id, result) => {
  sql.query(`SELECT id FROM users WHERE id = ${user_id}`, (err, res) => {
  result(null, res[0]);
  return;  
  });
}

Wishlist.productratingExist = (user_id,product_id, result) => {
  sql.query(`SELECT id FROM product_review WHERE user_id = ${user_id} AND product_id = ${product_id}`, (err, res) => {
  result(null, res[0]);
  return;  
  });
}

Wishlist.updateRating = (user_id,product_id,rating,review, result) => {
sql.query(
  "UPDATE product_review SET user_id = ?, product_id = ?,rating = ?,review = ? WHERE product_id = ? AND user_id = ?",
  [user_id, product_id, rating, review, product_id, user_id],
  (err, res) => {
    result(null, product_id);
    return;  
  }
);
};

Wishlist.getproductReviewRating = (product_id, result) => {
  sql.query(`SELECT SUM(rating) as total_rating,count(id) as total FROM product_review WHERE product_id = ${product_id}`, (err, res) => {
  result(null, res[0]);
  return;  
  });
}

Wishlist.updateProductsRating = (product_id,average_rating,total, result) => {
sql.query(
  "UPDATE products SET avg_rating = ?, total_review = ? WHERE id = ?",
  [average_rating, total, product_id],
  (err, res) => {
    result(null, product_id);
    return;  
  }
);
};

Wishlist.get_product = (product_id, result) => {
  sql.query(`SELECT * FROM products WHERE id = ${product_id}`, (err, res) => {
  result(null, res[0]);
  return;  
  });
}

Wishlist.reviewAdd = (newreview, result) => {
sql.query("INSERT INTO product_review SET ?", newreview, (err, res) => {
  // console.log(err);return false;
  result(null, res.insertId);
  return; 
});
};

Wishlist.review_listing = (product_id, result) => {
  sql.query(`SELECT r.id,r.user_id,r.review,r.rating,r.created_at as posted_at,u.first_name as first_name
  FROM product_review as r 
  LEFT JOIN users AS u ON u.id = r.user_id
  WHERE r.product_id = ${product_id} order by r.id DESC`, 
  (err, res) => {
  // console.log(res);return false;
  result(null, res);
  return;  
  });
}
Wishlist.get_seller_review_count = (user_id, result) => {
  sql.query(`SELECT SUM(rating) as total_rating, COUNT(id) as total
  FROM product_review as r 
  WHERE r.user_id = ${user_id}`, 
  (err, res) => {
  result(null, res[0]);
  return;
  });
}

module.exports = Wishlist;