const sql = require('./db.js');

const Contacts = function(users){
    this.contact_id = users.contact_id
    this.firstname = users.firstname
    this.lastname = users.lastname
    this.email = users.email
    this.username = users.message
    this.message = users.message
}
Contacts.getContact = (result) =>{
    sql.query(`SELECT * FROM contacts`,(err,res)=>{
       result(null,res) 
    })
}

Contacts.newContact = (Data,result) =>{
 sql.query(`INSERT INTO contacts SET ?` , [Data],(err,res)=>{
    result(null,res[0])
 })
}

Contacts.deleteContact = (contact_id,result) =>{
    sql.query(`DELETE FROM contacts WHERE contact_id = ?`,[contact_id],(err,res)=>{
      result(null,res[0])
    })
}

Contacts.updateContact = (contact_id,firstname,lastname,email,username,message,result) =>{
    sql.query(`UPDATE contacts SET firstname=?,lastname=?,email=?,username=?,message=? WHERE contact_id = ?`,[firstname,lastname,email,username,message,contact_id],(err,res)=>{
        result(null,res[0])
    })
}

module.exports = Contacts
