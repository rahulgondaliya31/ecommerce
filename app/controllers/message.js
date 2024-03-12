const Message = require('../models/message.js');

exports.getuser = async(req, res,next) => {
    try{
   await Message.GetUsers((err, data) => {
        return res.send({
            status: true,
            message: "",
            data: data
        })
    })

}
catch(ex){
  next(ex)
}
}

exports.selectreceiver = async(req,res,next) =>{
    try{
    const {receiver_id} = req.body
    let errors = ''

    if(!receiver_id){
        errors = 'receiver id is required'
    }

    if (errors.length > 0) {

        return res.send({
             success:"no",
             message: errors,
             data: []
        });
      }

    await  Message.SelectReciver(receiver_id,(err,data)=>{
         if(data){
            return res.send({
                success : "yes",
                message : "",
                data : data
            })
         }else{
            return res.send({
                success : "no",
                message : "",
                data : []
            }) 
         }
      })
    }
    catch(ex){
      next(ex)
    }
}

exports.sendmessage = async(req,res,next) =>{
    try{
       const {sender_id,receiver_id,message} = req.body
    //    console.log(req.body); return false;
       let errors = ''

       if(!sender_id){
         errors = 'sender id is required'
       }
       else if(!receiver_id){
        errors = 'receiver id is required'
       }
       else if(!message){
        errors = 'message is required'
       }
       
       if (errors.length > 0) {
        return res.send({
            status: false,
            message: errors,
            data: []
        });
    }

    await Message.SendMessage(sender_id,receiver_id,message,(err,data)=>{
        // console.log(data); return false
        if(data){
            return res.send({
                success : "yes",
                message : "chat send",
                data : req.body
            })
        }
        else
        {
            return res.send({
                success : "no",
                message : "",
                data : []
            })
        }
    })

    }
    catch(ex)
    {
       next(ex)
    }
}

exports.get_post_message = async(req,res,next) =>{
    try{
    const {sender_id,user_id} = req.body
    let errors = ''

    if(!sender_id){
        errors = 'sender id is required'
    }
    else if(!user_id){
        errors = 'receiver id is required'
    }   

    if (errors.length > 0) {
        return res.send({
            status: false,
            message: errors,
            data: []
        });
    }

    // var pages = page;

    // var limit = '10';
  
    // if(pages == '')
    // {
    //    pages = 1;
    //    sp = 0;
    // }
    // else
    // {
    //    pages = pages;
    //    sp = (pages-1)*limit;
    // }
  
  await Message.GetPostMessage(sender_id,user_id,(err,data)=>{
      if(data){
          var newCats = [];
          let proData = data;
          proData.forEach(function(pro){
              var obj = {}
              obj['sender_id'] = pro.sender_id;
                obj['sender_name'] = pro.sender_name;
                obj['sender_email'] = pro.sender_email;
                obj['receiver_id'] = pro.receiver_id;
                obj['receiver_name'] = pro.receiver_name
                obj['message'] = pro.message;
                obj['read_status'] = pro.read_status;
                obj['message_type'] = pro.message_type;
                obj['created_date'] = pro.created_date;
                obj['delete_id'] = pro.delete_id
                // console.log(obj);return false
                newCats.push(obj)
                // console.log(newCats); return false
            })
           return res.send({
            success : "true",
            message  : "",
            data : data
           })
        }
        else
        {
            return res.send({
                success : "no",
                message : "something happend wrong",
                data : []
            })
        }
    })
}
catch(ex)
{
  next(ex)
}
}
exports.getchatlist = async(req,res,next) =>{
    try{
    const {user_id} = req.body
    let errors = ''

    if(!user_id){
        errors = 'user_id is required'
    }

    if (errors.length > 0) {
        return res.send({
            status: false,
            message: errors,
            data: []
        });
    }


   await Message.GetChatList(user_id,(err,data)=>{
    //  console.log(data); return false
        if(data){
            return res.send({
                success : "yes",
                message : "",
                data : data
            })
        }
    })
}
catch(ex)
{
  next(ex)
}
}

exports.updatemsg = async(req,res,next) =>{
    try{
    const {sender_id,user_id} = req.body
    var read_status = 1
    let errors = ''

    if(!sender_id){
        errors = 'sender_id is required'
    }
    else if(!user_id){
        errors = 'user_id is required'
    }
    if (errors.length > 0) {
        return res.send({
            status: false,
            message: errors,
            data: []
        });
    }


  await Message.UpadateMsg(sender_id,user_id,read_status,(err,data)=>{
        if(data){
            return res.send({
                success : "yes",
                message : "",
                data : data
            })
        }
    })
    }
    catch(ex)
    {
      next(ex)
    }
}

