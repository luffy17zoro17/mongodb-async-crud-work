


import express from 'express';
import ROLES_LIST from '../../config/roles_list.js';
const router = express.Router();

import userController from "../../controllers/userController.js";

import verifyRoles from "../../middleware/verifyRoles.js";


router.route('/')
        .get(verifyRoles(ROLES_LIST.Admin), userController.getAllUsers)
        .delete(verifyRoles(ROLES_LIST.Admin), userController.deleteUser)


export default router;        