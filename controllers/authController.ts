


import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);





import { createRequire } from 'module';
const require = createRequire(import.meta.url);


import bcrypt from "bcrypt";


import jwt from "jsonwebtoken";

import User from '../model/User.js';





const handleLogin = async (req, res) => {

    const { user, pwd} = req.body;

    if(!user || !pwd) return res.status(400).json({ "message": "Username and password are required."});


    const foundUser = await User.findOne({username: user}).exec();
    if(!foundUser) return res.sendStatus(401);    // Unauthorized  

    // Evaluate password

    const match = await bcrypt.compare(pwd, foundUser.password);

    if(match){

        const roles = Object.values(foundUser.roles);
        // create JWT


        const accessToken = jwt.sign(
            {
              "UserInfo": {
                "username": foundUser.username,
                "roles": roles,
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '60s'}
            
        );


        const refreshToken = jwt.sign(
            {"username": foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '1d'}
            
        );

        
       // Saving refreshToken with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();

        console.log(result);
                                                                //secure: true. should be turned off only with thunder client
                                                                //it dosent add user roles.
        res.cookie('jwt', refreshToken, {httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000});

        res.json({accessToken});
    } else {
        res.sendStatus(401);
    }


}


export default { handleLogin };