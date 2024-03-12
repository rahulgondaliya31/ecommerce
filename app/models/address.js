const sql = require("./db.js");
// var number_format = require("number_format-php");
// constructor
const Address = function(address) {
  this.user_id = address.user_id;
  this.address_one = address.address_one;
  this.address_two = address.address_two;
  this.address_two = address.address_two;
  this.city = address.city;
  this.pincode = address.pincode;
  this.state = address.state;
  this.country = address.country;
  this.latitude = address.latitude;
  this.longitude = address.longitude;
  this.cancel_status = address.cancel_status;
};

Address.updateAddress = (user_id,address_one,address_two,pincode,city_id,state_id,country_id,latitude,longitude,address_id,cancel_status, result) => {
  sql.query(
    "UPDATE addresses SET user_id = ?, address_one = ?, address_two = ?, pincode = ?, city = ?, state = ?, country = ?, latitude = ?, longitude = ?,cancel_status =? WHERE id = ?",
    [user_id, address_one, address_two, pincode ,city_id ,state_id ,country_id ,latitude , longitude ,cancel_status, address_id],
    (err, res) => {
      
      result(null, address_id);
      return;  
    }
  );
};

Address.addressExist = (user_id,latitude,longitude, result) => {

    /*var lat = number_format(latitude, 4);
    var lon = number_format(latitude, 4);*/

    sql.query(`SELECT * FROM addresses WHERE user_id = ${user_id} AND latitude = ? AND longitude = ?`, 
    [latitude, longitude],
    (err, res) => {
    result(null, res[0]);
    return;  
    });
}

Address.addressAdd = (newaddress, result) => {
  sql.query("INSERT INTO addresses SET ?", newaddress, (err, res) => {
    result(null, res.insertId);
    return; 
  });
};

Address.get_address = (user_id, result) => {
    sql.query(`SELECT a.id,a.user_id, a.address_one, a.address_two, a.city,a.state,a.country, a.latitude, a.longitude, a.created_at,a.cancel_status,
    if((SELECT id FROM users WHERE address_id=a.id AND user_id= ${user_id})>0,1,0) as is_default_address,a.pincode
    FROM addresses as a 
    LEFT JOIN users AS u ON u.id = a.user_id
    WHERE a.user_id = ${user_id} ORDER BY a.id DESC`, 
    (err, res) => {
    result(null, res); 
    return;  
    });
}

Address.userUpdateAddress = (user_id,address_id, result) => {
  sql.query(
    "UPDATE users SET address_id = ? WHERE id = ?",
    [address_id, user_id],
    (err, res) => {
      result(null, user_id);
      return;  
    }
  );
};

Address.remove = (address_id, result) => {
  sql.query("DELETE FROM addresses WHERE id = ?", address_id, (err, res) => {
    result(null, res);
  });
};

Address.get_default_address = (user_id, result) => {
    sql.query(`SELECT * FROM addresses WHERE user_id = ${user_id} ORDER BY id DESC limit 1`, (err, res) => {
    result(null, res[0]);
    return;  
    });
}
module.exports = Address;
