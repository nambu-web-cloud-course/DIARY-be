const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const isAuth = async (req, res, next)=>{
    const auth = req.get('Authorization');
    console.log(auth);
    // console.log(req);
    if(!(auth && auth.startsWith('Bearer'))){
        return res.send({ message: 'Auth error'});
    };

    const token = auth.split(' ')[1];
    console.log(secret);
    jwt.verify(token, secret, (error, decoded)=>{
        //member_id가 입력한 비밀번호와 db에 저장된 token 확인하여 인증
        if(error){
            return res.send({ message: 'Auth error2'});
        } else {
            const id = decoded.mid;
            // const role = decoded.rol;
            req.id = id;
            // req.role = role;
            next();
        };
    });

};

module.exports = isAuth;