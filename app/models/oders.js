const sql = require("./db.js");

// constructor
const Orders = function(order) {
  this.unique_order_id = order.unique_order_id;
  this.user_id = order.user_id;
  this.address_id = order.address_id;
  this.total_shipping = order.total_shipping;
  this.total_price = order.total_price;
  this.order_total = order.order_total;
  this.status = order.status;
  this.full_address = order.full_address;
  this.latitude = order.latitude;
  this.longitude = order.longitude;
  /*this.accept_date = order.accept_date;
  this.shipped_date = order.shipped_date;
  this.delivered_date = order.delivered_date;*/

};

Orders.get_address_by_id = (address_id, result) => {
    sql.query(`SELECT c.country,c.state,c.city,c.address_one,c.address_two FROM addresses 
    WHERE a.id = ${address_id}`, (err, res) => {
    result(null, res[0]);
    return;  
    });
}

Orders.OrderAdd = (orderdata, result) => {
  sql.query("INSERT INTO product_order SET ?", orderdata, (err, res) => {
    //console.log(err);return;
    result(null, res.insertId);
    return; 
  });
};

Orders.order_detail_listing = (user_id,order_id, result) => {
 sql.query(`SELECT o.full_address,o.created_at,o.total_price,o.id as order_id,o.status,o.unique_order_id,o.order_total,o.total_shipping,u.first_name as full_name,u.email,u.phone_number,u.id as user_id,o.delivered_date
    FROM product_order AS o
    LEFT JOIN users u ON o.user_id = u.id
    WHERE o.id = ${order_id}`, 
    (err, res) => {
      // console.log(err); return false;
        var returnArray ={};
        if(res[0])
        {
            var row =  res[0];  
            returnArray['order_id'] = row.order_id;
            returnArray['unique_order_id'] = row.unique_order_id;
            returnArray['total_shipping'] = row.total_shipping;
            returnArray['total_price'] = row.total_price;
            returnArray['order_total'] = row.order_total;
            returnArray['created_at'] = row.created_at;
            returnArray['first_name'] = row.first_name;
            returnArray['email'] = row.email;
            returnArray['phone_number'] = row.phone_number;
            returnArray['full_address'] = row.full_address;
            returnArray['status'] = row.status;
            returnArray['delivered_date'] = row.delivered_date?row.delivered_date:"";
            returnArray['user_id'] = row.user_id;

            sql.query(`SELECT p.id as product_id,p.product_key,p.name,
            (SELECT if(image !='',CONCAT('`+nodeSiteUrl+`','/file/product/',image),'') FROM product_images WHERE product_id = p.id ORDER BY id ASC LIMIT 1) as image
            ,od.price,od.quantity,od.total_price,p.selling_price
            FROM order_details as od
            LEFT JOIN products as p ON p.id=od.product_id 
            WHERE od.order_id= ${row.order_id}`, 
            (err, products) => {
              // console.log(err); return false;
               var product_count = 0;
               if(products.length > 0)
               {
                    var newCats = [];
                    proData = products;
                   
                    proData.forEach(function(pro){
                        var obj ={};
                        obj['ProductId']       = pro.product_id;
                        obj['ProductName'] = pro.name;
                        obj['name']     = pro.name;
                        obj['Price']    = pro.price;  
                        obj['selling_price']= pro.selling_price;  
                        obj['quantity']   = pro.quantity;
                        obj['image']    =  pro.image; 
                        obj['total_Price']= pro.total_price;  
                        obj['product_url']= pro.product_key;  
                        product_count += pro.quantity;
                        newCats.push(obj); 
                    });
                    returnArray['ProductCount']  = product_count; 
                    returnArray['products'] = newCats;
               }
               else
               {
                  returnArray['products'] = [];
               }
               result(null, returnArray);
               return;
            })
        }
        else
        {
            result(null, returnArray);
            return;
        }
    });

}


Orders.get_orders_list_count = (user_id, result) => {

 /* var where = '';
  if(type == '1')
  {
    where = " AND o.status != 3";
  }
  else
  {
    where = " AND o.status = 3";
  }
*/
  sql.query(`SELECT o.id FROM product_order as o LEFT JOIN users u ON o.user_id = u.id WHERE o.user_id= ${user_id} GROUP BY o.id ORDER BY o.id DESC`,
   
  (err, res) => {
  //console.log(err);
 
  result(null, res);
  return;  
  });
};

Orders.get_orders_list = (user_id,sp,limit, result) => {

  var sp     = sp; 
  var limit  = limit;
  var where = '';

  sql.query(`SELECT o.full_address,o.order_total,o.created_at,o.total_price,
  o.id as order_id,o.status,o.unique_order_id,
  o.delivered_date,o.total_shipping,u.first_name as user_fullname,u.email as user_email,u.phone_number as user_phone_number,
  (SELECT count(id) FROM order_details WHERE order_id = o.id) as total_product,
  (SELECT p.name FROM order_details as d LEFT JOIN products as p ON p.id=d.product_id WHERE d.order_id = o.id limit 1) as product_name,
  (SELECT if(i.image !='',CONCAT('`+nodeSiteUrl+`','/file/product/',i.image),'') FROM order_details as d LEFT JOIN products as p ON p.id=d.product_id LEFT JOIN product_images as i ON i.product_id = p.id WHERE d.order_id = o.id limit 1) as product_image
  FROM product_order as o
  LEFT JOIN users u ON o.user_id = u.id 
  WHERE o.user_id= ${user_id} GROUP BY o.id ORDER BY o.created_at DESC LIMIT `+sp+`,`+limit,
   
  (err, res) => {
    // console.log(err); return false
  result(null, res);
  return;  
  });
};

Orders.get_order_status = (product_id,order_id, result) => {
    sql.query(`SELECT count(id) as total FROM order_details
    WHERE order_id = ${order_id} AND status !=3`, (err, res) => {
    result(null, res[0]);
    return;  
    });
}

Orders.updateStatus = (product_id,order_id,status,current_date, result) => {

  var field = "";
  if(status == 1)
  {
     field = ", accept_date = '"+current_date+"'";
  }
  else if(status == 2)
  {
      field = ", shipped_date = '"+current_date+"'";
  }
  else if(status == 3)
  {
    field = ", delivered_date = '"+current_date+"'";
  }
  else 
  {
    field = ", cancelled_date = '"+current_date+"'";
  }

  sql.query(
    "UPDATE product_order SET status = ? "+field+" WHERE product_id = ? AND order_id = ?",
    [status, product_id, order_id],
    (err, res) => {
      result(null, product_id);
      return;  
    }
  );
};

Orders.updateStatusOrder = (order_id,orderStatus,delivered_date, result) => {
  sql.query(
    "UPDATE product_order SET status = ?, delivered_date = ? WHERE id = ?",
    [orderStatus, delivered_date, order_id],
    (err, res) => {
      result(null, order_id);
      return;  
    }
  );
};
Orders.updateStatusOrderPar = (order_id,orderStatus, result) => {
  sql.query(
    "UPDATE product_order SET status = ? WHERE id = ?",
    [orderStatus, order_id],
    (err, res) => {
      result(null, order_id);
      return;  
    }
  );
};

Orders.get_product = (id, result) => {
    sql.query(`SELECT p.id,p.name,p.image,p.price,p.description,p.category_id,
      p.avg_rating,c.name as category_name,c.id as category_id,
      p.expected_delivery_time,p.created_at,p.is_featured,
      p.featured_date,p.selling_price  
      FROM products as p 
      LEFT JOIN category as c ON c.id=p.category_id
      WHERE p.id = ${id}`, (err, res) => {
    result(null, res[0]);
    return;  
    });
};

Orders.updateOrder = (total_shipping,order_total,total_price,orderid, result) => {

  sql.query(
    "UPDATE product_order SET total_shipping = ? , order_total = ?, total_price = ? WHERE id = ?",
    [total_shipping, order_total, total_price,orderid],
    (err, res) => {
      result(null, orderid);
      return;  
    }
  );
};



module.exports = Orders;
