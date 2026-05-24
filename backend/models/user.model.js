import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name required']
    },
    email: {
        type: String,
        required: [true, 'email required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'password required'],
        minLength: [6, 'password at least 6 chars']
    },
    cartItems: [
        {
            quantity: {
                type: Number,
                default: 1
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            }
        }
    ],
    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
    }
}, {
    timestamps: true
})

// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) return next()
//     try {
//         const salt = await bcrypt.genSalt(10)
//         this.password = await bcrypt.hash(this.password, salt)
//     } catch (error) {
//         next(error)
//     }
// })
// userSchema.pre('save', function (next) {
//     if (!this.isModified('password')) return next();

//     bcrypt.genSalt(10, (err, salt) => {
//         if (err) return next(err);

//         bcrypt.hash(this.password, salt, (err, hash) => {
//             if (err) return next(err);

//             this.password = hash;
//             next();
//         });
//     });
// });

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password)
}
const User = mongoose.model('User', userSchema)
export default User