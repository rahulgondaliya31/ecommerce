const Users = require('../models/users.js');
const Address = require('../models/address.js')

exports.login = (req, res, next) => {
    const { email, password } = req.body;
    let errors = ''

    if (!email) {
      errors = 'email is required'
    }
    else if (!password) {
      errors = 'password is required'
    }

    if (errors.length > 0) {
      return res.send({
        status: 500,
        message: errors,
        data: []
      });
    }

     Users.loginUser(email, password, (err, data) => {
     const id = data
      if (id) {
        return res.send({
          status: true,
          message: "login successfully",
          data: data
        })
      }
      else {
        return res.send({
          status: false,
          message: "email and password incorrect",
          data: []
        })
      }
    })

};

exports.register = async (req, res, next) => {
  try {
    const {first_name, last_name, email, password, phone_number, address_id, selected_category, device_type, device_token, delete_status} = req.body
    let errors = '';

    if (!first_name) {
      errors = 'first_name is required'
    }
    else if (!last_name) {
      errors = 'last_name is required'
    }
    else if (!email) {
      errors = 'email is required'
    }
    else if (!password) {
      errors = 'password is required'
    }

    if (errors.length > 0) {
      return res.send({
        status: 500,
        message: errors,
        data: []
      });
    }

    await Users.findEmailuses(email, (err, data) => {
      if (data) {
        return res.send({
          status: false,
          message: "Email already exist",
          data: req.body
        })
      }
      else {
        const userData = new Users({

          first_name: first_name,
          last_name: last_name,
          email: email,
          password: password,
          phone_number: phone_number,
          address_id: address_id,
          selected_category: selected_category,
          device_type: device_type,
          device_token: device_token,
          delete_status: delete_status,





        })
        Users.registerUser(userData, (err, usercreate) => {
          // console.log(usercreate);return false;
          const id = usercreate
          Users.findUserInfo(id, (err, data) => {
            if (data) {
              return res.send({
                status: true,
                message: "register succefully",
                data: data
              })
            }
          })
        }
        )
      }
    })
  }
  catch (ex) {
    next(ex)
  }
}

exports.get_user_detail = async (req, res, next) => {
  try {
    const { id } = req.body;
    let errors = ""

    if (!id) {
      errors = 'id is required'
    }

    if (errors.length > 0) {
      return res.send({
        status: 500,
        message: errors,
        data: []
      });
    }

    await Users.Get_user_detail(id, (err, data) => {
      return res.send({
        status: true,
        data: data
      });
    })
  }
  catch (ex) {
    next(ex)
  }
}
//  const {email,password} = req.body
//  let errors = ''

//  if(!email){
//   errors = "email is required"
//  }
//  else if(!password){
//   errors = "password is required"
//  }

//  if (errors.length > 0) {
//   return res.send({
//     status: 500,
//     message: errors,
//     data: []
//   })
// }

// users.loginUser(email,password,(err,data)=>{
//   // console.log(err); return false;
//   if(data){
//       return res.send({
//           status: 200,
//           message: 'login successfully',
//           data: data
//         });
//   }
//   else{
//       return res.send({
//           status: 500,
//           message: 'email and password incorrect',
//           data: []
//         });
//   }
// })
exports.logout = (req, res) => {
  const { user_id } = req.body;
  let errors = '';
  if (!user_id) {
    errors = 'User id is required.';
  }
 
  if (errors.length > 0) {

    return res.send({
      success: "no",
      message: errors,
      data: []
    });
  }
  const id = user_id;
  Users.UserLogout(id, (err, update) => {
    return res.send({
      success: "yes",
      message: 'User logout successfully.',
      data: []
    })
  })
};

exports.getaddresslisting = (req, res) => {
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

  Address.get_address(user_id, (err, address) => {
      if(address.length > 0)
      {

        var newAdd = [];
        addressData = address;
        addressData.forEach(function(pro){
          var obj ={};
          obj['id'] = pro.id; 
          obj['user_id'] = pro.user_id; 
          obj['address_one'] = pro.address_one; 
          obj['address_two'] = pro.address_two; 
          obj['city'] = pro.city; 
          obj['state'] = pro.state; 
          obj['country'] = pro.country; 
          obj['latitude'] = pro.latitude; 
          obj['longitude'] = pro.longitude; 
          obj['created_at'] = pro.created_at; 
          obj['is_default_address'] = pro.is_default_address; 
          obj['pincode'] = pro.pincode; 
          obj['cancel_status'] = pro.cancel_status;
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

}

exports.set_default_address = (req, res) => {
  const { user_id,address_id} = req.body;

  let errors = '';
  if(!user_id)
  {
    errors = 'User id is required.';
  }
  else if(!address_id)
  {
    errors = 'Address id is required.';
  }
  
  if (errors.length > 0) {

    return res.send({
         success:"no",
         message: errors,
         data: []
    });
  }

  Address.userUpdateAddress(user_id,address_id,(err, updata) => {
      var obj = {};
      obj['address_id'] = address_id;
      return res.send({
             success:"yes",
             message: "Address updated successfully.",
             data: obj
      });
  })
       
}


exports.add_or_edit_address = (req, res) => {
  const {user_id,address_one,address_two,pincode,city,state,country,latitude,longitude,cancel_status,address_id} = req.body;

  let errors = '';
  if(!user_id)
  {
    errors = 'User id is required.';
  }
  else if(!address_one)
  {
    errors = 'Address one is required.';
  }
  else if(!pincode)
  {
    errors = 'Pincode is required.';
  }
  else if(!city)
  {
    errors = 'City is required.';
  }
  else if(!state)
  {
    errors = 'State is required.';
  }
  else if(!country)
  {
    errors = 'Country is required.';
  }
  else if(!latitude)
  {
    errors = 'Latitude is required.';
  }
  else if(!longitude)
  {
    errors = 'Longitude is required.';
  }

  if (errors.length > 0) {

    return res.send({
         success:"no",
         message: errors,
         data: []
    });
  }
  if(address_id !=undefined && address_id !="")
  {
      Address.updateAddress(user_id,address_one,address_two,pincode,city,state,country,latitude,longitude,address_id,(err, updata) => {
          
          var obj = {};
          obj['user_id']  = user_id;
          obj['address_one']  = address_one;
          obj['address_two']  = address_two;
          obj['pincode']  = pincode;
          obj['city']  = city;
          obj['state']  = state;
          obj['country']  = country;
          obj['latitude']  = latitude;
          obj['longitude']  = longitude;
          obj['address_id']  = address_id;
          obj['cancel_status'] = cancel_status;


          return res.send({
             success:"yes",
             message: 'Address updated successfully.',
             data: obj
        });
      })
  }
  else
  {
      Address.addressExist(user_id,latitude,longitude, (err, address) => {
          if(address)
          {
              return res.send({
                   success:"no",
                   message: 'Address already exists.',
                   data: address
              });
          }
          else
          {
               const addressData = new Address({
                  user_id:user_id,
                  address_one:address_one,
                  address_two:address_two,
                  pincode:pincode,
                  city:city,
                  state:state,
                  country:country,
                  latitude:latitude,
                  longitude:longitude,
                  cancel_status : cancel_status
               });

               Address.addressAdd(addressData, (err, addAddress) => {
                    var obj = {};
                      obj['user_id']  = user_id;
                      obj['address_one']  = address_one;
                      obj['address_two']  = address_two;
                      obj['pincode']  = pincode;
                      obj['city']  = city;
                      obj['state']  = state;
                      obj['country']  = country;
                      obj['latitude']  = latitude;
                      obj['longitude']  = longitude;
                      obj['address_id']  = addAddress;
                      obj['cancel_status'] = cancel_status;

                      Users.addressDefaultSet(user_id, (err, UserDetail) => {
                          if(UserDetail.address_id == 0)
                          {
                              Users.setDefaultAddress(user_id,addAddress,(err, updata) => {

                              }) 
                          }

                          return res.send({
                             success:"yes",
                             message: 'Address add successfully.',
                             data: obj
                          });

                      });
               })
          }
      })
  }

};

exports.delete_address = (req, res) => {
  const { user_id,address_id} = req.body;

  let errors = '';
  if(!user_id)
  {
    errors = 'User id is required.';
  }
  else if(!address_id)
  {
    errors = 'Address id is required.';
  }
  
  if (errors.length > 0) {

    return res.send({
         success:"no",
         message: errors,
         data: []
    });
  }

  Address.remove(address_id, (err, data1) => {
      Address.get_default_address(user_id, (err, address) => {
          if(address)
            {

              Address.userUpdateAddress(user_id,address.id,(err, updata) => {
                var obj = {};
                obj['user_id'] = user_id;
              obj['address_id'] = address_id;
                return res.send({
                 success:"yes",
                 message: 'Address deleted successfully.',
                 data: obj
            });
              })
            }
            else
            {
              Address.userUpdateAddress(user_id,0,(err, updata) => {
                var obj = {};
                obj['user_id'] = user_id;
              obj['address_id'] = address_id;
                return res.send({
                 success:"yes",
                 message: 'Address deleted successfully.',
                 data: obj
            });
              })
            }
      })
  })

}


exports.edituser = (req, res) => {
  const {user_id, first_name,last_name, email} = req.body
  // console.log(id,username,email,number,address,pincode,img); return false;
  let errors = '';
 if (!first_name) {
    errors = 'first_name is required'
  }
  else if (!last_name) {
    errors = 'first_name is required'
  }
  else if (!email) {
    errors = 'email is required'
  }

  if (errors.length > 0) {
    return res.send({
      success: "no",
      message: errors,
      data: []
    })
  }

  Users.editUser(user_id, first_name,last_name, email,(err, update) => {
    return res.send({
      status: 200,
      message: 'customer update successfully',
      data: req.body
    })
  })

}

exports.forgetpassword = (req, res) => {
  const { password } = req.body
  // console.log(req.body); return false;
  let errors = ''
  if (!password) {
    errors = 'password is required'
  }


  if (errors.length > 0) { 
    return res.send({
      status: 500,
      message: errors,
      data: []
    })
  }


  Users.findPassworduses(password, (err, data) => {
    // console.log(data); return false;
    const user = data
    if (!user) {
      return res.send({
        status: 500,
        message: "password was incorrect",
        data: req.body
      })
    }
    else {
      let id = data.id;
      let new_password = req.body.new_password;
      Users.updatePassword(new_password, id, (err, data) => {
        // console.log(new_password);return false;

        return res.send({
          status: 200,
          message: "password update successfully",
          data: req.body
        })


      })
    }

  })
}


