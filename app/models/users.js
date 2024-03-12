const sql = require('./db.js');

const Users = function(users){
    this.id = users.id
    this.first_name = users.first_name
    this.last_name = users.last_name
    this.email = users.email
    this.password  = users.password
    this.phone_number = users.phone_number
    this.address_id = users.address_id
    this.selected_category = users.selected_category
    this.device_type = users.device_type
    this.device_token = users.device_token
    this.delete_status  = users.delete_status
    // this.created_at =- users.created_at
}

Users.findEmailuses = (email, result) => {
  // console.log(email); return false;
    sql.query(`SELECT * FROM users WHERE email = ?`, [email], (err, res) => {
      // console.log(res);return false
      result(null, res[0])
      return;
    });
  };

  Users.findCustomerInfo = (id, result) => {
    sql.query(`SELECT * FROM users WHERE id = ?`, [id], (err, res) => {
      result(null, res[0])
      return;
    })
  }

  Users.loginUser = (email, password, result) => {
    // console.log(email,password); return false;
    sql.query(`SELECT id,email,first_name,last_name,phone_number,address_id,selected_category,device_type,device_token,delete_status FROM users WHERE email = ? AND password =?`, [email, password], (err, res) => {
      // console.log(res); return false;
      result(null, res[0])
      // console.log(res[0]); return false;
      return
    })
  }

  Users.registerUser = (Data,result) =>{
      sql.query("INSERT INTO users SET ?", [Data], (err, res) => {
        // console.log(err); return false;
        result(null, res?.insertId);
        return;
      });
    };
  

  Users.findUserInfo = (id, result) => {
    sql.query(`SELECT * FROM users WHERE id = ?`, [id], (err, res) => {
      result(null, res[0])
      return;
    })
  }

  Users.Get_user_detail = (id,result) =>{
    sql.query(`SELECT id,first_name,last_name,email,phone_number,selected_category,created_at FROM users WHERE id = ?`, [id], (err, res) => {
      result(null, res[0])
      return;
    })
  }

  Users.UserLogout = (id, result) => {
    sql.query(
      "UPDATE users SET device_type = ?, device_token = ?  WHERE id = ?",
      ['0', '', id],
      (err, res) => {
        result(null, id);
        return;  
      }
    );
  };

  Users.addressDefaultSet = (user_id, result) => {
    sql.query(`SELECT * FROM users WHERE id = ${user_id}`, (err, res) => {
    result(null, res[0]);
    return;  
    });
  };
  
  Users.setDefaultAddress = (user_id,address_id, result) => {
    sql.query(
      "UPDATE users SET address_id=?  WHERE id = ?",
      [address_id, user_id],
      (err, res) => {
        result(null, user_id);
        return;  
      }
    );
  };

  Users.editUser = (id, first_name,last_name, email, result) => {
    // let employee_id = id
    sql.query(`UPDATE users SET first_name=?,last_name=?,email=? WHERE id = ?`, [first_name,last_name, email,id], (err, res) => {
      result(null, res[0])
  
    })
  }

  Users.findPassworduses = (password, result) => {
    sql.query(`SELECT * FROM users WHERE password = ?`, [password], (err, res) => {
      // console.log(err);return false
      result(null, res[0])
      return;
    });
  };

  Users.updatePassword = (password, id, result) => { 
    sql.query(`UPDATE users SET password = ? WHERE id= ?`, [password, id], (err, res) => {
      // console.log(err); return false;
      result(null, res[0])
    })
  }
  

  module.exports = Users
  