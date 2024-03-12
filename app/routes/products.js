module.exports = app =>{
    var router = require("express").Router();
    const products = require("../controllers/product.js");
    const fileUpload = require('express-fileupload');
    app.use(fileUpload());

    
    app.post('/addcart',products.addcart);
    app.post('/getproductlisting',products.getproductlisting);
    app.post('/cartlisting',products.cartlisting);
    app.post("/add_or_remove_to_wishlist", products.add_or_remove_to_wishlist);
    app.post("/get_product_detail", products.get_product_detail);
    app.post("/getwishlistproducts", products.getwishlistproducts);
    app.post("/post_review_rating", products.post_review_rating);
    app.post("/review_listing", products.review_listing);
    app.post("/remove_product_from_cart", products.remove_product_from_cart);
    app.post("/change_product_quantity", products.change_product_quantity);
    app.post("/add_order", products.add_order);
    app.post("/order_detail", products.order_detail);
    app.post("/orderlisting",products.orderlisting);
    // app.post("/cart_listing", products.cart_listing);
}