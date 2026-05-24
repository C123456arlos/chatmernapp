// import Coupon from '../models/coupon.model.js'
// export const getCoupon = async (req, res) => {
//     try {
//         const coupon = await Coupon.findOne({ userId: req.user._userId, isActive: true })
//         res.json(coupon || null)
//     } catch (error) {
//         console.log('error get coupon function', error.message)
//         res.status(500).json({ mesage: 'server error', error: error.message })
//     }
// }
// export const validateCoupon = async (req, res) => {
//     try {
//         const { code } = req.body
//         const coupon = await Coupon.findOne({ code: code, userId: req.user._id, isActive: true })
//         if (!coupon) {
//             return res.status(404).json({ message: 'coupon not found' })
//         }
//         if (coupon.expirationDate < new Date()) {
//             coupon.isActive = false
//             await coupon.save()
//             return res.status(401).json({ message: 'coupon expired' })
//         }
//         res.json({
//             message: 'coupon is valid',
//             code: coupon.code,
//             discountPercentage: coupon.discountPercentage
//         })
//     } catch (error) {
//         console.log('error in validatecoupon controller', error.message)
//         res.status(500).json({ message: 'server error', error: error.message })
//     }
// }





import Coupon from "../models/coupon.model.js";

export const getCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findOne({ userId: req.user._id, isActive: true });
        res.json(coupon || null);
    } catch (error) {
        console.log("Error in getCoupon controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const validateCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = await Coupon.findOne({ code: code, userId: req.user._id, isActive: true });

        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }

        if (coupon.expirationDate < new Date()) {
            coupon.isActive = false;
            await coupon.save();
            return res.status(404).json({ message: "Coupon expired" });
        }

        res.json({
            message: "Coupon is valid",
            code: coupon.code,
            discountPercentage: coupon.discountPercentage,
        });
    } catch (error) {
        console.log("Error in validateCoupon controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};