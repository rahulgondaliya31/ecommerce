const Contact = require('../models/contact.js');

exports.contact = async (req, res, next) => {
    try {
        await Contact.getContact((err, data) => {
            // console.log(data);return false;
            if (data) {
                return res.send({
                    status: true,
                    data: data
                })
            }
            else {
                return res.send({
                    status: false,
                    message: "contacts not found",
                    data: []
                })
            }
        })
    }
    catch (ex) {
        next(ex)
    }
}

exports.newcontact = async (req, res, next) => {
    try {
        const { contact_id, firstname, lastname, email, username, message } = req.body
        let errors = ''

        //   if(!contact_id){
        //     errors = 'contact_id is required'
        //   }
        if (!firstname) {
            errors = "firstname is required"
        }
        else if (!lastname) {
            errors = "lastname is required"
        }
        else if (!email) {
            errors = "email is required"
        }
        else if (!username) {
            errors = "username is required"
        }
        else if (!message) {
            errors = "message is required"
        }
        if (errors.length > 0) {
            return res.send({
                status: false,
                message: errors,
                data: []
            });
        }

        const contactData = new Contact({
            firstname: firstname,
            lastname: lastname,
            email: email,
            username: username,
            message: message
        })

        Contact.newContact(contactData, (err, data) => {
            // console.log(data); return false;s
            if (data) {
                return res.send({
                    status: true,
                    data: data
                })
            }
        })


    }
    catch (ex) {
        next(ex)
    }
}

exports.deletecontact = (req, res) => {
    const { contact_id } = req.body
    let errors = ''

    if (errors.length > 0) {
        return res.send({
            status: false,
            message: errors,
            data: []
        });
    }

    Contact.deleteContact(contact_id, (err, data) => {
        return res.send({
            status: true,
            message: "contact delete succesfully",
            data: ''
        })
    })
}

exports.updatecontact = (req, res) => {
    const { contact_id, firstname, lastname, email, username, message } = req.body
    let errors = ''
    if (!contact_id) {
        errors = 'contact_id is required'
    }
    else if (!firstname) {
        errors = "firstname is required"
    }
    else if (!lastname) {
        errors = "lastname is required"
    }
    else if (!email) {
        errors = "email is required"
    }
    else if (!username) {
        errors = "username is required"
    }
    else if (!message) {
        errors = "message is required"
    }
    if (errors.length > 0) {
        return res.send({
            status: false,
            message: errors,
            data: []
        });
    }

    Contact.updateContact(contact_id,firstname,lastname,email, username,message, (err, update) => {
        return res.send({
          status: true,
          message: 'contact update successfully',
          data: req.body
        })
      })

}