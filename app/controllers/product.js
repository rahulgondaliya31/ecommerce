  const products = require('../models/product.js');
const Addcart = require('../models/addcart.js');
const Wishlist = require("../models/wishlist.js");
const WishlistTable = require("../models/wishlist_table.js");
const Orders = require("../models/oders.js")
const empty = require("is-empty");
const moment = require('moment');




exports.getproductlisting = async(req, res,next) => {
  const { user_id,filter_type,status,category_id,search_text,page} = req.body;

  var uid=0

  if(user_id !=undefined && user_id !="")
  {
    uid = user_id;
  }
  
  var catid = '';
  if(category_id  !=undefined && category_id !='')
  {
    catid = category_id;
  }

  var searchText = '';
  if(search_text !=undefined && search_text !='')
  {
    searchText = search_text;
  }
  var pages = page;

  var limit = '10';

  if(pages == '')
  {
     pages = 1;
     sp = 0;
  }
  else
  {
     pages = pages;
     sp = (pages-1)*limit;
  }


  var id = uid;
  var selected_category = "";
  products.get_detail(id, (err, data) => {
  // console.log(data); return false;
     if(data)
     {
          selected_category = data.selected_category;
     }
      
     products.getproductCount(uid,filter_type,selected_category,status,catid,searchText, (err, data) => {
      // console.log(data);
        if(data.length > 0)
        {
            var getcount  = data.length;
            var totalpage = Math.ceil(getcount/limit);

            products.getproductList(uid,filter_type,selected_category,status,catid,searchText,sp,limit, (err, product) => {
                if(product.length > 0)
                {
                  
                  var newCats = [];
                  proData = product;
                  proData.forEach(function(pro){
                    var obj ={};
                    obj['id'] = pro.id; 
                    obj['product_url'] = pro.product_url; 
                    obj['name'] = pro.name; 
                    obj['description'] = pro.description; 
                    obj['avg_rating'] = pro.avg_rating; 
                    obj['total_review'] = pro.total_review; 
                    obj['price'] = pro.price; 
                    obj['image'] = pro.image; 
                    obj['created_at'] = pro.created_at; 
                    obj['expected_delivery_time'] = pro.expected_delivery_time; 
                    obj['rating'] = pro.rating; 
                    obj['is_favourite'] = pro.is_favourite; 
                    obj['name'] = pro.name; 
                    obj['category_id'] = pro.category_id; 
                    obj['is_featured'] = pro.is_featured; 
                    obj['quantity'] = pro.quantity; 
                    obj['selling_price'] = pro.selling_price;
                    
                    var newrew = [];
                    products.getproductReview(pro.id, (err, productReview) => {
		                  productReview = productReview;
		                  productReview.forEach(function(rew){
		                    var objR ={};
		                    objR['id'] = rew.id; 
		                    objR['user_id'] = rew.user_id;
		                    objR['review'] = rew.review;
		                    newrew.push(objR);
		                  }); 

		                 
		           		obj['Review'] = [];
                	});
                   
                    newCats.push(obj);
                  });

                  return res.send({
                       status:true,
                       message: "",
                       data: newCats,
                       total_page: totalpage,
                       page: pages
                  });
                }
                else
                {
                    return res.send({
                         status:false,
                         message: "",
                         data: []
                    });

                }
            })
        } 
        else
        {
          return res.send({
               status:false,
               message: "",
               data: []
          });
        }
     })

  });
  
}

exports.cartlisting = (req, res) => {
  const { user_id} = req.body;

  let errors = '';
  if(!user_id)
  {
    errors = 'User id is required.';
  }
  if (errors.length > 0) {

    return res.send({
         success:"no",
         message: errors,
         data: []
    });
  }

  Addcart.cart_listing(user_id, (err, cart) => {
    //  console.log(cart); return false;
    if(empty(cart.product))
    {
        return res.send({
             success:"no",
             message: '',
             data: req.body
        });
    }
    else
    {
      return res.send({
           success:"yes",
           message: '',
           data: cart
      });
    }
  })

};

exports.add_or_remove_to_wishlist = (req, res) => {

  const { user_id,product_id} = req.body;
  
    let errors = '';
     
    if (!user_id) {
      errors = 'User id is required.';
    }
    else if (!product_id) {
      errors = 'Product id is required.';
    }
  
    if (errors.length > 0) {
  
      return res.send({
           success:"no",
           message: errors,
           data: []
      });
    }
  
    Wishlist.isFavoriteExist(user_id,product_id, (err, data) => {
        if(data)
        {
                Wishlist.remove(data.id, (err, data1) => {
                var returnArray = {};
                returnArray['is_favourite'] = 0; 
                return res.send({
                       success:"yes",
                       message: 'Product remove from wishlist successfully.',
                       data:  returnArray, 
                })
              });
        }
        else
        {
            const WishData = new WishlistTable({
              user_id:user_id,
              product_id:product_id
            });
  
            WishlistTable.wishlistAdd(WishData, (err, data) => {
              var returnArray = {};
              returnArray['is_favourite'] = 1; 
  
              return res.send({
                       success:"yes",
                       message: 'Product added to wishlist successfully.',
                       data:  returnArray, 
              })
            });
        }
    })
  
  };

  exports.get_product_detail = (req, res) => {
    const { user_id,product_id} = req.body;
  
    let errors = '';
     
    if (!product_id) {
      errors = 'Product id is required.';
    }
  
    if (errors.length > 0) {
  
      return res.send({
           success:"no",
           message: errors,
           data: []
      });
    }
  
    var uid=0
  
    if(user_id !=undefined && user_id !="")
    {
      uid = user_id;
    }
  
    products.get_product_detail(uid,product_id, (err, data) => {
  
      if(data)
      {
          var returnArray = {};
          returnArray['id']                  = data.id; 
          returnArray['product_url']         = data.product_key;
          returnArray['name']                = data.name;
          returnArray['price']               = data.price;
          returnArray['description']         = data.description;
          returnArray['avg_rating']          = data.avg_rating; 
          returnArray['category_id']         = data.category_id;
          returnArray['category_name']       = data.category_name;
          returnArray['total_review']        = data.total_review;
          returnArray['is_rating']           = data.is_rating;
          returnArray['is_favourite']        = data.is_favourite;
          returnArray['is_added_cart']       = data.is_added_cart;
          returnArray['is_featured']         = data.is_featured;
          returnArray['selling_price']       = data.selling_price;

          products.product_review(data.id, (err, review) => {
              if (review.length) 
              {
                  returnArray['review'] = review;     
              }
              else
              {
                  returnArray['review'] = []; 
              }
  
              products.product_image(data.id, (err, image) => {
                  if (image.length) 
                  {
                      returnArray['image'] = image;     
                  }
                  else
                  {
                      returnArray['image'] = []; 
                  }
  
                   return res.send({
                       success:"yes",
                       message: '',
                       data: returnArray
                  });
              })
  
          })
  
         
      }
      else
      {
          return res.send({
               success:"no",
               message: '',
               data: []
          });
      }
     
    })
  
  };

  exports.addcart =(req,res,next) =>{
        const {user_id,product_id,price,quantity} = req.body
 
        let errors = '';
       if(!user_id)
       {
         errors = 'User id is required.';
       }
       else if(!product_id)
       {
         errors = 'Product id is required.';
       }
       else if(!price)
       {
         errors = 'Price is required.';
       }
       else if(!quantity)
       {
         errors = 'Quantity is required.';
       }
 
       if (errors.length > 0) {
 
         return res.send({
              success:"no",
              message: errors,
              data: []
         });
       }
    products.get_product_detail(user_id,product_id,(err,products)=>{
      // console.log(products); return false;
     Addcart.exist_in_cart(user_id,product_id,(err,cart)=>{
      // console.log(cart); return false;
         if(cart){
            var cart_quantity = Number(cart.quantity) + Number(quantity);
            if(products.selling_price > 0){
              var total_price = Number(products.selling_price) * cart_quantity;
            }
            else
                   {
                     var total_price = Number(products.price) * cart_quantity;
                   }
 
 
                   Addcart.updateCart(cart_quantity,total_price,products.selling_price,products.price,user_id,product_id,(err, updata) => {
                     // console.log(updata); return false;
                     return res.send({
                          success:"yes",
                          message: 'Product updated to cart successfully.',
                          data: updata
                     });
                 });
            
         }
         else{
           if(products.selling_price>0){
             var total_price = Number(products.selling_price) * Number(quantity);
           }
           else{
             var total_price = products.price * Number(quantity);
           }
 
           const cartData = new Addcart({
             user_id:user_id,
             product_id:product_id,  
             total_price:total_price,
             price:products.price,
             selling_price:products.selling_price,
             quantity:quantity
           });
           //  console.log(cartData); return false;
            Addcart.cartAdd(cartData, (err, data) => {
             return res.send({
                  success:"yes",
                  message: 'Product added to cart successfully.',
                  data: data
             });
         })
           
         }
       })
     })

 }

 exports.getwishlistproducts = (req, res) => {
  const { user_id,page} = req.body;

  let errors = '';
   
  if (!user_id) {
    errors = 'User id is required.';
  }
  else if (!page) {
    errors = 'Page id is required.';
  }

  if (errors.length > 0) {

    return res.send({
         success:"no",
         message: errors,
         data: []
    });
  }

  var pages = page;

  var limit = '10';

  if(pages == '')
  {
     pages = 1;
     sp = 0;
  }
  else
  {
     pages = pages;
     sp = (pages-1)*limit;
  }

  Wishlist.getWishlistProductCount(user_id, (err, data) => {
       if(data.length > 0)
        {
            var getcount  = data.length;
            var totalpage = Math.ceil(getcount/limit);

            Wishlist.getWishlistProduct(user_id,sp,limit, (err, product) => {
                 if(product.length > 0)
                {
                  
                  var newCats = [];
                  proData = product;
                  proData.forEach(function(pro){
                    var obj ={};
                    obj['id'] = pro.id; 
                    obj['name'] = pro.name; 
                    obj['description'] = pro.description; 
                    obj['avg_rating'] = pro.avg_rating; 
                    obj['total_review'] = pro.total_review; 
                    obj['price'] = pro.price; 
                    obj['image'] = pro.image; 
                    obj['created_at'] = pro.created_at; 
                    obj['expected_delivery_time'] = pro.expected_delivery_time; 
                    obj['is_rating'] = pro.is_rating; 
                    obj['is_favourite'] = pro.is_favourite; 
                    obj['is_featured'] = pro.is_featured; 
                    obj['selling_price'] = pro.selling_price; 
                    newCats.push(obj);      
                  });

                  return res.send({
                       success:"yes",
                       message: "",
                       data: newCats,
                       total_page: totalpage,
                       page: pages
                  });
                }
                else
                {
                    return res.send({
                         success:"no",
                         message: "",
                         data: []
                    });

                }
            })

        }
        else
        {
            return res.send({
                 success:"no",
                 message: "",
                 data: []
            });
        }
  })

};


exports.post_review_rating = (req, res) => {
  const { user_id,product_id,rating,review} = req.body;

  let errors = '';
   
  if (!user_id) {
    errors = 'User id is required.';
  }
  else if (!product_id) {
    errors = 'Product id is required.';
  }
  else if (!rating) {
    errors = 'Rating is required.';
  }
  else if (!review) {
    errors = 'Review is required.';
  }

  if (errors.length > 0) {

    return res.send({
         success:"no",
         message: errors,
         data: []
    });
  }

   Wishlist.isUserExist(user_id, (err, data) => {
      if(data)
      {
            Wishlist.productratingExist(user_id,product_id, (err, pRating) => {
                if(pRating)
                {

                    Wishlist.updateRating(user_id,product_id,rating,review,(err, updata) => {
                        Wishlist.getproductReviewRating(product_id, (err, review) => {
                            if(review)
                            {
                                var total_rating = review.total_rating;
                                var total = review.total;
                            }
                            else
                            {
                               var total_rating = 0;
                               var total = 0;
                            }

                            var average_rating = total_rating/total;
                            //console.log(average_rating);return false;
                            Wishlist.updateProductsRating(product_id,average_rating,total,(err, updata) => {
                                var rating_id =  pRating.id;
                                Wishlist.get_product(product_id, (err, product) => {

                                    Wishlist.get_seller_review_count(product_id, (err, reviewCount) => {

                                      if(reviewCount)
                                      {
                                          var total_rating_seller = reviewCount.total_rating;
                                          var total_seller = reviewCount.total;
                                      }
                                      else
                                      {
                                          var total_rating_seller = 0;
                                          var total_seller = 0;
                                      }

                                      var avg_seller_rating = total_rating_seller/total_seller;
                                     
                                      products.updateSellerRating(product_id,average_rating,total,(err, updata) => {

                                      });


                                      var obj = {};
                                      obj['rating_id'] = rating_id;
                                      obj['avg_rating'] = product.avg_rating;
                                      obj['total_review'] = product.total_review;

                                      return res.send({
                                           success:"yes",
                                           message: 'Rating added successfully.',
                                           data: obj
                                      });

                                    })

                                    

                                })
                            })

                        })

                    })
                }
                else
                {

                     const reviewData = new Wishlist({
                        user_id:user_id,
                        product_id:product_id,
                        rating:rating,
                        review:review
                     });

                      Wishlist.reviewAdd(reviewData, (err, reviewData) => {
                            Wishlist.getproductReviewRating(product_id, (err, review) => {
                                if(review)
                                {
                                    var total_rating = review.total_rating;
                                    var total = review.total;
                                }
                                else
                                {
                                   var total_rating = 0;
                                   var total = 0;
                                }

                                var average_rating = total_rating/total;
                                //console.log(average_rating);return false;
                                Wishlist.updateProductsRating(product_id,average_rating,total,(err, updata) => {
                                    var rating_id =  reviewData.id;
                                    Wishlist.get_product(product_id, (err, product) => {

                                      Wishlist.get_seller_review_count(seller_id, (err, reviewCount) => {

                                      if(reviewCount)
                                      {
                                          var total_rating_seller = reviewCount.total_rating;
                                          var total_seller = reviewCount.total;
                                      }
                                      else
                                      {
                                          var total_rating_seller = 0;
                                          var total_seller = 0;
                                      }

                                      var avg_seller_rating = total_rating_seller/total_seller;
                                     
                                      Sellers.updateSellerRating(seller_id,average_rating,total,(err, updataRating) => {
                                        
                                      });

                                        var obj = {};
                                        obj['rating_id'] = rating_id;
                                        obj['avg_rating'] = product.avg_rating;
                                        obj['total_review'] = product.total_review;

                                        return res.send({
                                             success:"yes",
                                             message: 'Rating added successfully.',
                                             data: obj
                                        });

                                      })

                                    })
                                })

                            })
                      });
                }
            })
      }
      else
      {
           return res.send({
               success:"no",
               message: 'Invalid user id.',
               data: []
          });
      }
  });

};

exports.review_listing = (req, res) => {
  const { product_id} = req.body;
  let errors = '';
  if(!product_id)
  {
    errors = 'Product id is required.';
  }
  
    if (errors.length > 0) {

      return res.send({
           success:"no",
           message: errors,
           data: []
      });
    }

  Wishlist.review_listing(product_id, (err, review) => {
    // console.log(review); return false;
      if(review)
      {

        var newAdd = [];
        reviewData = review;
        reviewData.forEach(function(rev){
          var obj ={};
          obj['id'] = rev.id; 
          obj['user_id'] = rev.user_id; 
          obj['review'] = rev.review; 
          obj['rating'] = rev.rating; 
          let now = moment(rev.posted_at);
          var posted_at = now.format("YYYY-MM-DD h:mm:ss");
          obj['posted_at'] = posted_at;  
          obj['first_name'] = rev.first_name; 
          newAdd.push(obj);      
        });

        return res.send({
             success:"yes",
             message: "",
             data: newAdd
        });
      }
      else
      {
          return res.send({
               success:"no",
               message: "",
               data: []
          });

      }
  })

};

exports.remove_product_from_cart = (req, res) => {
  const { user_id,product_id} = req.body;

  let errors = '';
  if(!user_id)
  {
    errors = 'User id is required.';
  }
  else if(!product_id)
  {
    errors = 'Product id is required.';
  }
  if (errors.length > 0) {

    return res.send({
         success:"no",
         message: errors,
         data: []
    });
  }

  Addcart.exist_in_cart(user_id,product_id, (err, cart) => {
      if(cart)
      {
          Addcart.remove(cart.id, (err, data1) => {
              return res.send({
                   success:"yes",
                   message: 'Product remove from cart successfully.',
                   data: ''
              });
          });
      }
      else
      {
            return res.send({
                   success:"no",
                   message: '',
                   data: []
            });
      }
  });
};

exports.change_product_quantity = (req, res) => {
  const { user_id,product_id,price,quantity} = req.body;

  let errors = '';
  if(!user_id)
  {
    errors = 'User id is required.';
  }
  else if(!product_id)
  {
    errors = 'Product id is required.';
  }
  else if(!price)
  {
    errors = 'Price is required.';
  }
  else if(!quantity)
  {
    errors = 'Quantity is required.';
  }

  if (errors.length > 0) {

    return res.send({
         success:"no",
         message: errors,
         data: []
    });
  }


  Wishlist.get_product(product_id, (err, product) => {
      Addcart.exist_in_cart(user_id,product_id, (err, cart) => {
          if(cart)
          {
              var cart_quantity = quantity;

              if(product.selling_price >0)
              {
                  var total_price = Number(product.selling_price) * cart_quantity;
              }
              else
              {
                var total_price = Number(product.price) * cart_quantity;
              }

              Addcart.updateCart(cart_quantity,total_price,product.selling_price,product.price,user_id,product_id,(err, updata) => {
                  return res.send({
                       success:"yes",
                       message: 'Quantity updated successfully.',
                       data: []
                  });
              });
          }
          else
          {
              return res.send({
                   success:"no",
                   message: 'Product not exist in cart.',
                   data: []
              });
          }
      })

      
  });

};

exports.add_order = (req, res) => {
  const { user_id,address_id,product_data} = req.body;

  let errors = '';
  if(!user_id)
  {
    errors = 'User id is required.';
  }
  else if(empty(product_data)) {
    errors = 'product data is required.';
  }


  if (errors.length > 0) {

    return res.send({
         success:"no",
         message: errors,
         data: []
    });
  }

  Orders.get_address_by_id(address_id, (err, address) => {
     if(address)
     {
          var pincode = address.pincode;
          var city = address.city_name;
          var state = address.state_name;
          var country = address.country_name;
          var address_one = address.address_one;
          var latitude = address.latitude;
          var longitude = address.longitude;
     }
     else
     {
          var pincode = '';
          var city = '';
          var state = '';
          var country = '';
          var address_one = '';
          var latitude = '';
          var longitude = '';
     }

      var i=1;
      var data1 = [];
      var data2 = [];
      var data3 = [];

      var rand = '';
      for($i = 0; $i < 3; $i++) {
          rand += Math.floor(Math.random() * (1 - 10) + 10);
      }
      var moment = require('moment')
      var timestamp = moment().format(  );

      var orderid = "OD"+timestamp+''+rand;

      var total_price = 0;

      var Apincode = "";
      var Acity = "";
      var Astate = "";
      var Acountry = "";

      if(pincode != "")
      {
        Apincode = ", "+pincode;
      }
      if(city != "")
      {
        Acity = ", "+city;
      }
      if(state != "")
      {
        Astate = ", "+state;
      }
      if(country != "")
      {
        Acountry = ", "+country;
      }
      
      const orderData = new Orders({
        unique_order_id:orderid,
        user_id:user_id,
        address_id:address_id,
        full_address:address_one+Apincode+Acity+Astate+Acountry,
        latitude:latitude,
        longitude:longitude,
        total_shipping:0,
        total_price:0,
        order_total:0,
        status:0
      });

      Orders.OrderAdd(orderData, (err, order) => {
            var orderid = order;
            var newAdd = [];
            proData = product_data;
            var totalItem = proData.length;
            proData.forEach(function(pro){
                Orders.get_product(pro.product_id, (err, product) => {
                    if(product.selling_price > 0)
                    {
                      var price = product.selling_price;
                    }
                    else
                    {
                      var price = product.price;
                    }

                    const order_details_data = new Order_details({
                      order_id:order,
                      product_id:pro.product_id,
                      price: price,
                      category_id: product.category_id,
                      selling_price: product.selling_price,
                      quantity:pro.quantity,
                      total_price: price*pro.quantity,
                    });
                    total_price += price*pro.quantity;
                    Order_details.OrderDetailAdd(order_details_data, (err, detailData) => {
                      Order_details.remove(user_id,pro.product_id, (err, data1) => {
                        if(i==totalItem)
                        {
                          Order_details.getShipping((err, deliverRow) => {
                            var total_shipping = 0;
                            var order_total = 0;
                            if(total_price>0)
                            {
                              /*if(total_price < deliverRow.free_homedelivery_on_amount)
                               {
                                 total_shipping = deliverRow.shipping_charge;
                                 order_total = (total_price + deliverRow.shipping_charge);
                               }
                               else
                               {*/
                                 total_shipping = 0;
                                 order_total = total_price;
                               //}
                             }

                             Orders.updateOrder(total_shipping,order_total,total_price,orderid,(err, updata) => {
                                 return res.send({
                                     success:"yes",
                                     message: 'Order added success.',
                                     data: []
                                });
                             });
                          });
                        }
                        i++;
                      });

                    });
                });

             
            })
      })    
  })
};

exports.order_detail = (req, res) => {
  const { user_id,order_id} = req.body;

  let errors = '';
  if(!user_id)
  {
    errors = 'User id is required.';
  }
  else if(!order_id) {
    errors = 'Order id is required.';
  }


  if (errors.length > 0) {

    return res.send({
         success:"no",
         message: errors,
         data: []
    });
  }

  Orders.order_detail_listing(user_id,order_id, (err, orderDetail) => {
      if(orderDetail)
      {
          return res.send({
               success:"yes",
               message: '',
               data: orderDetail
          });
      }
      else
      {
           return res.send({
               success:"no",
               message: '',
               data: []
          });
      }
  })

}

exports.orderlisting = (req, res) => {
  const { user_id,page} = req.body;

  let errors = '';
  if(!user_id)
  {
    errors = 'User id is required.';
  }
  else if(!page) {
    errors = 'page is required.';
  }


  if (errors.length > 0) {

    return res.send({
         success:"no",
         message: errors,
         data: []
    });
  }
  
  var pages = page;

  var limit = '10';

  if(pages == '')
  {
     pages = 1;
     sp = 0;
  }
  else
  {
     pages = pages;
     sp = (pages-1)*limit;
  }

  Orders.get_orders_list_count(user_id, (err, data) => {
      if(data.length > 0)
      {
          var getcount  = data.length;
          var totalpage = Math.ceil(getcount/limit);  

          Orders.get_orders_list(user_id,sp,limit, (err, orders) => {
            // console.log(user_id); return false;
              if(orders.length > 0)
              {
                    var newCats = [];
                    proData = orders;
                    proData.forEach(function(pro){
                      var obj ={};
                      
                      obj['order_id'] = pro.order_id; 
                      obj['unique_order_id'] = pro.unique_order_id; 
                      obj['total_shipping'] = pro.total_shipping; 
                      obj['total_price'] = pro.total_price; 
                      obj['order_total'] = pro.order_total; 
                      obj['created_at'] = pro.created_at; 
                      obj['user_fullname'] = pro.user_fullname; 
                      obj['user_email'] = pro.user_email; 
                      obj['user_phone_number'] = pro.user_phone_number; 
                      obj['full_address'] = pro.full_address; 
                      obj['status'] = pro.status; 
                      obj['delivered_date'] = pro.delivered_date; 
                      obj['product_name'] = pro.product_name; 
                      obj['product_image'] = pro.product_image; 
                      obj['total_product'] = pro.total_product; 
                      if(pro.total_product > 1)
                      {
                        obj['is_more_product'] = 1; 
                      }
                      else
                      {
                        obj['is_more_product'] = 0; 
                      }
                      newCats.push(obj);      
                    });

                    return res.send({
                       success:"yes",
                       message: "",
                       data: newCats,
                       total_page: totalpage,
                       page: pages
                  });
              }
              else
              {
                  return res.send({
                         success:"no",
                         message: "",
                         data: []
                    });
              }
          })

      }
      else
      {
        return res.send({
             success:"no",
             message: "",
             data: []
        });
      }
  })
};

  