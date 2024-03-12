const { login } = require('../controllers/users.js');
const sql = require('./db.js');

const Message = function(mess) {
    this.sender_id = mess.sender_id;
    this.receiver_id = mess.receiver_id;
    this.message = mess.message;
    this.message_type = mess.message_type;
    this.read_status = mess.read_status;
    this.delete_id = mess.delete_id;
    this.created_date = mess.created_date
    this.first_name = mess.first_name
    this.user_id = mess.user_id;
}

Message.SelectReciver = (receiver_id,result) =>{
  sql.query('SELECT message FROM messages WHERE receiver_id = ?',[receiver_id],(err,res)=>{
    // console.log(res); return false
    result(null,res[0])
  })
}

Message.GetUsers = (result) =>{
    sql.query('SELECT id,first_name FROM users ORDER BY id ASC',(err,res)=>{
        result(null,res)
    })
}

Message.SendMessage = (sender_id,receiver_id,message,result) =>{
    sql.query('INSERT INTO messages SET sender_id = ?,receiver_id = ?,message=?',[sender_id,receiver_id,message],(err,res)=>{
        // console.log(res); return false
      result(null,res.insertId)
    })
}

Message.GetPostMessage = (sender_id,user_id,result) =>{
  // var strlimit = " LIMIT "+sp+","+limit+"";
  sql.query(`SELECT messages.id,messages.sender_id,(SELECT users.first_name  WHERE users.id = messages.sender_id) as sender_name,(SELECT users.first_name FROM users WHERE users.id = messages.receiver_id) as receiver_name, users.email as sender_email,messages.receiver_id,messages.message,messages.read_status,messages.message_type,messages.created_date,messages.delete_id FROM messages LEFT JOIN users ON messages.sender_id = users.id WHERE (messages.sender_id =${sender_id} AND messages.receiver_id=${user_id}  
    ) OR ( messages.sender_id=${user_id} AND  messages.receiver_id=${sender_id} ) ORDER BY  messages.id DESC`,
     [sender_id,user_id],(err,res)=>{
      // console.log(res); return false
    result(null,res)
    // console.log(use\_id); return false
  })
}

// Message.GetChatList = (user_id,result) =>{
//   // sql.query(`SELECT uc.id, uc.sender_id, uc.receiver_id, uc.message,uc.message_type,uc.read_status as is_read FROM messages AS uc LEFT JOIN messages AS m  ON ((uc.sender_id = m.sender_id AND uc.receiver_id = m.receiver_id) OR (uc.sender_id = m.receiver_id AND uc.receiver_id = m.sender_id)) AND uc.id < m.id WHERE (uc.sender_id = ${user_id} OR uc.receiver_id = ${user_id}) AND m.id IS NULL AND uc.delete_id != ${user_id} ORDER BY uc.id ASC`,(err,res)=>{
//   //    console.log(res);return false
//   // })



// }


Message.GetChatList = (user_id, result) => {
  sql.query(`SELECT uc.id, uc.sender_id, uc.receiver_id, uc.message,uc.message_type,uc.read_status as is_read,DATE_FORMAT(uc.created_date,'%Y-%m-%d %H:%i:%s') as created_date,uc.created_date as date_time,
  (SELECT CONCAT_WS(" ", first_name, last_name) AS full_name FROM users WHERE id=uc.receiver_id) as receiver_name,
  (SELECT CONCAT_WS(" ", first_name, last_name) AS full_name FROM users WHERE id=uc.sender_id) as sender_name,
  (SELECT COUNT(id)  FROM messages  WHERE sender_id= ${user_id} AND read_status=0) as sender_unread_message,
  (SELECT COUNT(id)  FROM messages  WHERE receiver_id= ${user_id} AND read_status=0) as receiver_unread_message
  FROM messages AS uc LEFT JOIN messages AS m ON ((uc.sender_id = m.sender_id AND uc.receiver_id = m.receiver_id AND m.delete_id !=${user_id}) 
 OR (uc.sender_id = m.receiver_id AND uc.receiver_id = m.sender_id AND m.delete_id !=${user_id})) AND uc.id < m.id WHERE (uc.sender_id = ${user_id} OR uc.receiver_id = ${user_id}) AND m.id IS NULL AND uc.delete_id !=${user_id} Order by uc.id DESC`,
 (err, message) => {
  // console.log(message); return false
     if (message) 
   {
         var newRew = [];
         message.forEach(function(pro){
           var obj ={};
           obj['id'] = pro.id; 
           obj['sender_id'] = pro.sender_id; 
           obj['receiver_id'] = pro.receiver_id; 
           obj['message'] = pro.message; 
           obj['created_date'] = pro.created_date; 
           obj['read_message'] = pro.read_message

          if(pro.sender_id == user_id)
          {
           obj['full_name'] = pro.receiver_name
           obj['sender_unread_message'] = pro.sender_unread_message
          }
          else if(pro.receiver_id == user_id)
          {
            obj['full_name'] = pro.sender_name
            obj['receiver_unread_message'] = pro.receiver_unread_message
          }
          newRew.push(obj)
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

Message.UpadateMsg = (sender_id,user_id,read_status,result) =>{
 sql.query(`UPDATE messages SET read_status=? WHERE sender_id=? AND receiver_id=?`,[read_status,sender_id,user_id],(err,res)=>{
  result(null,res)
  return
 })
}


module.exports = Message