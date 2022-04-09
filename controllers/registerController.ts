
import path from "path";

import { createRequire } from 'module';
const require = createRequire(import.meta.url);


import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


import User from "../model/User.js";







const fsPromises = require('fs').promises;


import bcrypt from 'bcrypt';


const handleNewUser = async (req, res) => {

     const { user, pwd} = req.body;
     if(!user || !pwd) {
     return res.status(400).json({"message": "Username and password are required."});
     }

     // check for duplicate usernames in the DB


     const duplicate =await User.findOne({ username: user}).exec();        // exec  for callback error message
     if(duplicate) {
         return res.sendStatus(409);    // Conflict (duplicate)
     }
     try{
         //encrypt the password
         const hashedPwd = await bcrypt.hash(pwd, 10);

         //store the new user
         const result = await User.create({ 
             
            'username': user,
            'password': hashedPwd 
        });

        console.log(result);
       
        res.status(201).json({"success": `New user ${user} has been created!`});

     } catch (err: any){
        res.status(500).json({'message': err.message});
     }    
     
}


export default {handleNewUser};