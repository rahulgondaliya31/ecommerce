const sql = require('./db.js');

const Products = function(product){
  this.id = product.id;  
  this.product_url = product.product_key;  
  this.category_id = product.category_id;   
  this.category_name = product.category_name;  
  this.name = product.name;   
  this.image = product.image;   
  this.price = product.price;  
  this.selling_price = product.selling_price;  
  this.description = product.description;  
  this.avg_rating = product.avg_rating;   
  this.total_review = product.total_review;  
  this.expected_delivery_time = product.expected_delivery_time;   
  this.cancel_status = product.cancel_status;
  this.is_featured = product.is_featured;  
  this.featured_date = product.featured_date;
  this.created_at = product.created_at;  
  this.isfavourite = product.isfavourite;  
  this.avg_rating = product.avg_rating;  
  this.selling_products = product.selling_products;  
  this.rating = product.rating;
    
}

Products.get_detail = (id, result) => {
  sql.query(`SELECT * FROM users WHERE id = ${id}`, (err, res) => {
    // console.log(res); return false;
  result(null, res[0]);
  return;  
  });
};

Products.getproductCount = (uid,filter_type,selected_category,status,category_id,search_text, result) => {

  var strlimit="";
  var strCon="";
  var order_by = "p.id DESC";
  if(filter_type =='1')
  {
     order_by ="p.avg_rating DESC";
  }
  else if(filter_type =='2')
  {
    order_by ="p.price DESC";
  }
  else if( filter_type =='3')
  {
    order_by ="p.price ASC";
  }

  if(status=='1')
  {
    if(selected_category !='')
    {
      strCon=" AND p.category_id IN ("+selected_category+")";
    }
  }
  else if(status =='0')
  {
    if(selected_category !='')
    {
      strCon +=" AND p.category_id NOT IN ("+selected_category+")";
    }
  }

  if(filter_type =='4')
  {
    strCon +=" AND p.is_featured=1";
  }

  if(category_id !='')
  {
     strCon +=" AND p.category_id IN ("+category_id+")";
  }

  if(search_text !='')
  {
    strCon +=" AND p.name LIKE '%"+search_text+"%'";
  }

  sql.query(`SELECT p.id,p.product_key as product_url,p.name,p.description, p.avg_rating,p.total_review,p.price,(SELECT if(image !='',CONCAT('`+nodeSiteUrl+`','/file/product/',image),'')  FROM product_images WHERE product_id = p.id ORDER BY id ASC LIMIT 1) as image,
    p.created_at,p.expected_delivery_time,
    if((SELECT COUNT(id) FROM product_review WHERE product_id = p.id AND user_id= ${uid})>0,1,0) as rating,
    if((SELECT COUNT(id) FROM wishlist WHERE product_id = p.id AND user_id = ${uid})>0,1,0) as is_favourite,
    c.name as name,p.category_id,p.is_featured,
    (SELECT COUNT(o.product_id) FROM order_details as o where p.id=o.product_id) as quantity,
    p.selling_price,p.is_featured
    FROM products as p LEFT JOIN category as c ON c.id=p.category_id 
    WHERE 1=1 `+strCon+` AND p.cancel_status=0 ORDER BY `+order_by+``+strlimit,
   
  (err, res) => {
//  console.log(res); return false;

  result(null, res);
  return;  
  });
};

Products.getproductList = (uid,filter_type,selected_category,status,category_id,search_text,sp,limit, result) => {
  var strCon="";
  var order_by = "p.id DESC";

  var strlimit = " LIMIT "+sp+","+limit+"";
  
  if(filter_type =='1')
  {
     order_by ="p.avg_rating DESC";
  }
  else if(filter_type =='2')
  {
    order_by ="p.price DESC";
  }
  else if( filter_type =='3')
  {
    order_by ="p.price ASC";
  }

  if(status=='1')
  {
    if(selected_category !='')
    {
      strCon=" AND p.category_id IN ("+selected_category+")";
    }
  }
  else if(status =='0')
  {
    if(selected_category !='')
    {
      strCon +=" AND p.category_id NOT IN ("+selected_category+")";
    }
  }

  if(filter_type =='4')
  {
    strCon +=" AND p.is_featured=1";
  }

  if(category_id !='')
  {
     strCon +=" AND p.category_id IN ("+category_id+")";
  }

  if(search_text !='')
  {
    strCon +=" AND p.name LIKE '%"+search_text+"%'";
  }

  sql.query(`SELECT p.id,p.product_key as product_url,p.name,p.description, p.avg_rating,p.total_review,p.price,(SELECT if(image !='',CONCAT('`+nodeSiteUrl+`','/file/product/',image),'')  FROM product_images WHERE product_id = p.id ORDER BY id ASC LIMIT 1) as image,
    p.created_at,p.expected_delivery_time,
    if((SELECT COUNT(id) FROM product_review WHERE product_id = p.id AND user_id= ${uid})>0,1,0) as rating,
    if((SELECT COUNT(id) FROM wishlist WHERE product_id = p.id AND user_id = ${uid})>0,1,0) as is_favourite,
    c.name as name,p.category_id,p.is_featured,
    (SELECT COUNT(o.product_id) FROM order_details as o where p.id=o.product_id) as quantity,
    p.selling_price,p.is_featured
    FROM products as p LEFT JOIN category as c ON c.id=p.category_id 
    WHERE 1=1 `+strCon+` AND p.cancel_status=0 ORDER BY `+order_by+``+strlimit,
   
  (err, res) => {
// console.log(res); return false
  if(res == undefined)
  {
     result(null, []);
    return;  
  }
  else
  {
     result(null, res);
    return;  
  }
  });
};


Products.getproductReview = (pid, result) => {
  sql.query(`SELECT *
    FROM product_review 
    WHERE product_id = ${pid}`,
   
    (err, res) => {
        if(res == undefined)
        {
           result(null, []);
          return;  
        }
        else
        {
           result(null, res);
          return;  
        }
    });
};

Products.get_product_detail = (uid,product_id, result) => {

  sql.query(`SELECT p.id,p.product_key,p.name,p.price,p.description,p.category_id,p.avg_rating,
   if((SELECT COUNT(id) FROM product_review WHERE product_id = p.id AND user_id= ${uid})>0,1,0) as is_rating,
   if((SELECT COUNT(id) FROM wishlist WHERE product_id = p.id AND user_id= ${uid})>0,1,0) as is_favourite,
   (SELECT name FROM category WHERE id = p.category_id ) as category_name,p.total_review,
   if((SELECT COUNT(id) FROM cart WHERE product_id = p.id AND user_id= ${uid})>0,1,0) as is_added_cart,
   p.is_featured,p.selling_price 
   FROM products as p
   WHERE 1=1 AND (CAST(p.id AS CHAR) = ? OR p.product_key= ?)`,
   [product_id,product_id],
   (err, res) => {
    // console.log(res); return false
     result(null, res[0]);
     return; 
   });
}

Products.product_review = (product_id, result) => {
  sql.query(`SELECT r.id,r.user_id,r.review,r.rating,r.created_at as posted_at,u.first_name
 FROM product_review as r, users as u
 WHERE product_id = ${product_id} AND u.id = r.user_id order by r.id DESC`,
 (err, review) => {
   if (review.length) 
   {
         var newRew = [];
         rewData = review;
         rewData.forEach(function(pro){
           var obj ={};
           obj['id'] = pro.id; 
           obj['user_id'] = pro.user_id; 
           obj['review'] = pro.review; 
           obj['rating'] = pro.rating; 
           obj['posted_at'] = pro.posted_at; 
           obj['first_name'] = pro.first_name; 
           newRew.push(obj);      
         });

         result(null, newRew);
         return;
   }
   else
   {
     result(null, []);
     return;
   }
 });
}

Products.product_image = (product_id, result) => {
  sql.query(`SELECT id,
  if(image !='',CONCAT('`+nodeSiteUrl+`','/file/product/',image),'') AS image
  FROM product_images
  WHERE product_id = ${product_id}`,
 (err, image) => {
   if (image.length) 
   {
         var newImg = [];
         imgData = image;
         imgData.forEach(function(pro){
           var obj ={};
           obj['id'] = pro.id; 
           obj['image'] = pro.image; 
           newImg.push(obj);      
         });

         result(null, newImg);
         return;
   }
   else
   {
     result(null, []);
     return;
   }
 });
}

Products.updateSellerRating = (product_id,avg_rating,total_review, result) => {
  sql.query(
    "UPDATE sellers SET avg_rating = ?, total_review = ?  WHERE id = ?",
    [avg_rating, total_review, product_id],
    (err, res) => {

      //console.log(res);return false;
      result(null, product_id);
      return;  
    }
  );
};

// Products.getProducts = (result) =>{
//   sql.query(`SELECT products.*,CONCAT('`+nodeSiteUrl+`','/file/product/',images) as images,prices.price FROM products INNER JOIN prices ON products.id = prices.price_id GROUP BY id`,(err,res)=>{
//     // console.log(res); return false;
//     result(null,res)
//   })
// }

// Products.productfilter = (Category,result) =>{
//   sql.query(`SELECT products.*, prices.price FROM products INNER JOIN prices ON products.id = prices.price_id WHERE Category = ?`,[Category],(err,res)=>{
//     // console.log(err); return false;
//      result(null,res)
//   })
// }

// Products.priceFilter = (low,high,result) =>{
//   sql.query(`SELECT products.*, prices.price FROM products INNER JOIN prices ON products.id = Prices.price_id WHERE prices.price < ? AND prices.price > ?`,[low,high],(err,res)=>{
//     // console.log(err); return false;
//     result(null,res)
//   })
// }

// Products.productDetail = (id, result) => {
//   sql.query(`SELECT *,CONCAT('`+nodeSiteUrl+`','/file/product/',images) as images,prices.price FROM products INNER JOIN prices ON products.id = prices.price_id WHERE id = ?`, [id], (err, res) => {
//     //  console.log(err); return false;
//     result(null, res[0])
//     return;
//   })
// }




module.exports = Products;