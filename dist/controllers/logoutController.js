import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import User from '../model/User.js';
const handleLogout = async (req, res) => {
    // on client, also delete the access token
    const cookies = req.cookies;
    if (!cookies?.jwt)
        return res.sendStatus(204); // no content
    const refreshToken = cookies.jwt;
    // Is refreshToken in db?
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    } // no content
    // delete refreshToken in the db
    foundUser.refreshToken = '';
    const result = await foundUser.save();
    console.log(result);
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }); // secure: true    only serves on https
    res.sendStatus(204);
};
export default { handleLogout };
