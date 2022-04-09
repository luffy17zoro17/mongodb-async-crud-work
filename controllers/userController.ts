


import User from '../model/User.js';





const getAllUsers = async (req, res) => {


    const user = await User.find();
    if(!user) return res.status(204).json({"message": "No users found"});
    res.json(user);

}


const deleteUser = async (req, res) => {

    if(!req?.body?.id)  res.status(400).json({"message": "Employee ID required."});

    const user = await User.findOne({_id: req.body.id}).exec();

    if(!user) return res.status(204).json({"message": `No user match ID ${req.body.id}.`});


    const result = await user.deleteOne({_id: req.body.id});

    res.json(result);

    
}






export default {
    getAllUsers,
    deleteUser

}