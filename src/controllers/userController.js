const UserModel = require('../models/userSchema')

const createUser = async function (req, res){

    let user = await UserModel.create(req.body)
    res.send({user : user})

}



module.exports.createUser = createUser