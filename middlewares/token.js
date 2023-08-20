import jwt from 'jsonwebtoken';

const setToken = (res, user) => {
    const payload = {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    res.cookie('token', token, {
        httpOnly: true
    });
};

export default setToken;