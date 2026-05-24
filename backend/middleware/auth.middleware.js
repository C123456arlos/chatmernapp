import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
export const protectRoute = async (req, res, next) => {
    console.log("cookies:", req.cookies);
    try {
        const accessToken = req.cookies.accessToken
        if (!accessToken) {
            return res.status(401).json({ message: 'unauthorized- no token' })
        }
        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
            const user = await User.findById(decoded.userId).select('-password')
            if (!user) {
                return res.status(401).json({ messge: 'unauth not found' })
            }
            req.user = user
            next()
        } catch (error) {
            if (error.name === 'token expired error') {
                return res.status(401).json({ message: 'unauth token' })
            }
            throw error
        }
    } catch (error) {
        console.log('error in protect route', error.message)
        return res.status(401).json({ message: 'unauth invalid token' })
    }
}
export const adminRoute = (req, res, next) => {
    console.log("cookies:", req.cookies);
    if (req.user && req.user.role === 'admin') {
        next()
    } else {
        return res.status(401).json({ message: "unauth admin only" })
    }
}



