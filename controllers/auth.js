import User from '../models/user.js';
import hashPassword from '../middlewares/hashpassword.js';
import setToken from '../middlewares/token.js'


export const login = (req, res) => {
    try {
        setToken(res, req.user);
    } catch (err) {
        res.status(500).send('로그인에 실패했습니다.');
    }
    res.redirect('/');
};

export const join = async (req, res) => {
    try{
        const { email, name, password } = req.body;
        const existingUser = await User.findOne({ email }); 
        const hashedPassword = await hashPassword(password);

        if (!existingUser) {
            const user = await User.create({
                email,
                name,
                password: hashedPassword,
            });
            return res.json({ message: '회원가입이 성공적으로 완료되었습니다.'});
        } else {
            return res.status(400).json('이미 존재하는 email 입니다.');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('회원가입 중 오류가 발생했습니다.')
    }
}