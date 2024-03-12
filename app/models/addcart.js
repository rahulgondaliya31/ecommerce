const sql = require('./db.js');

const Addcart = function (cart){
    this.user_id = cart.user_id
    this.product_id = cart.product_id
    this.price = cart.price
    this.selling_price = cart.selling_price
    this.total_price = cart.total_price
    this.quantity = cart.quantity
}

Addcart.exist_in_cart = (user_id,product_id,result) => {
    sql.query(`SELECT id,quantity,price FROM cart WHERE product_id = ${product_id} AND user_id = ${user_id}`, (err, res) => {
      // console.log(res); return false;
    result(null, res[0]);
    return;  
    });
  };
  
  Addcart.updateCart = (cart_quantity,total_price,selling_price,price,user_id,product_id, result) => {
    sql.query(
      "UPDATE cart SET quantity = ?, total_price = ?, price = ?, selling_price = ? WHERE user_id = ? AND product_id = ?",
      [cart_quantity, total_price, price, selling_price, user_id, product_id],
      (err, res) => {
        // console.log(err); return false;
        result(null, product_id);
        return;  
      }
    );
  };
  
  Addcart.cartAdd = (Data, result) => {
    sql.query("INSERT INTO cart SET ?", [Data], (err, res) => {
      // console.log(err); return false;
      result(null, res.insertId);
      return; 
    });
  };

  Addcart.cart_listing = (user_id, result) => {
    sql.query(`SELECT a.id, a.address_one, a.address_two, a.city,a.state,a.country,a.pincode, a.latitude, a.longitude, u.first_name as full_name,u.phone_number as phone_number,u.email
    FROM addresses AS a
    LEFT JOIN users u ON u.address_id = a.id
    WHERE a.user_id = ${user_id} `, 
    (err, res) => {
      // console.log(res); return false;
        var returnArray ={};
        if(res[0])
        {
          var row =  res[0];  
          returnArray['address_id'] = row.id;
          returnArray['address_one'] = row.address_one;
          returnArray['address_two'] = row.address_two;
          returnArray['city'] = row.city;
          returnArray['state'] = row.state;
          returnArray['country'] = row.country;
          returnArray['pincode'] = row.pincode;
          returnArray['latitude'] = row.latitude;
          returnArray['longitude'] = row.longitude;
          returnArray['first_name'] = row.first_name;
          returnArray['phone_number'] = row.phone_number;
          returnArray['email'] = row.email;

        }
        else
        {
            returnArray['address_id'] = '';
            returnArray['address_one'] = '';
            returnArray['address_two'] = '';
            returnArray['city'] = '';
            returnArray['state'] = '';
            returnArray['country'] = '';
            returnArray['pincode'] = '';
            returnArray['latitude'] = '';
            returnArray['longitude'] = '';
            returnArray['first_name'] = '';
            returnArray['phone_number'] = '';
            returnArray['email'] ='';
        }

        sql.query(`SELECT free_homedelivery_on_amount,shipping_charge FROM admin LIMIT 1`, 
        (err, res) => {

            var DeliverRow = res[0];
            var grand_total = 0;

              sql.query(`SELECT c.id,c.product_id, c.user_id, c.price, c.quantity, c.total_price, p.name,
              (SELECT image FROM product_images WHERE product_id = p.id ORDER BY id ASC LIMIT 1) as image, p.expected_delivery_time,c.selling_price
              FROM cart c LEFT JOIN products p ON c.product_id = p.id
              WHERE c.user_id = ${user_id} `, 
              (err, products) => {
                // console.log(products); return false;
                  if(products.length > 0)
                  { 
                        var newCats = [];
                        proData = products;
                        var total = 0;
                        var product_count = 0;
                        proData.forEach(function(pro){
                            var obj ={};
                            obj['id']       = pro.id;
                            obj['product_id'] = pro.product_id;
                            obj['name']     = pro.name;
                            obj['price']    = pro.price;  
                            obj['selling_price']= pro.selling_price;  
                            obj['quantity']   = pro.quantity;
                            obj['image']    =  pro.image?nodeSiteUrl+'/file/product/'+pro.image:""; 
                            obj['total_price']= pro.total_price;  
                            obj['expected_delivery_time']= pro.expected_delivery_time;  
                            total += pro.total_price;  
                            product_count += pro.quantity; 
                            newCats.push(obj); 
                        });
                         
                        returnArray['product'] = newCats;
                        returnArray['free_homedelivery_on_amount'] =   DeliverRow.free_homedelivery_on_amount;     

                        if(total >= DeliverRow.free_homedelivery_on_amount)
                        {
                          returnArray['shipping_charge']             = 0;
                          returnArray['total_amount']               = total;
                        }
                        else
                        {
                          if(total > 0) 
                          {
                            returnArray['shipping_charge'] = DeliverRow.shipping_charge;
                            returnArray['total_amount']     = total + DeliverRow.shipping_charge;
                          }
                          else 
                          {
                            returnArray['shipping_charge']   = 0;
                            returnArray['total_amount']    = 0;
                          } 
                        }
                        grand_total += returnArray['total_amount'];
                        returnArray['product_count'] = product_count; 
                  }
                  else
                  {
                     returnArray['product'] = [];
                  }
                  returnArray['grand_total'] = grand_total;  

                  result(null, returnArray);
                  return;

              });

        });
    });
};

Addcart.remove = (id, result) => {
  sql.query("DELETE FROM cart WHERE id = ?", id, (err, res) => {
    result(null, res);
  });
};



  module.exports = Addcart