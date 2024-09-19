import jwt from 'jsonwebtoken'

export const isAuthenticated = (req, res, next) => {

    const token = req.cookies.jwt

    if (!token) {
        return res.redirect('/login');
    }
    
    jwt.verify(token, 'secretocoder', (error, decoded) => {

        if (error) {

            return res.redirect('/login');
        }
        req.user = decoded;
        next();
    });
};


export const isNotAuthenticated = (req, res, next) => {

    const token = req.cookies.jwt

    if (token) {
        return res.redirect('/profile')
    } 

    next()
};

export const authorization = (role) => {

    return async (req, res, next) => {

        if (!req.user)
            return res.status(401).send({ error: 'Unauthorized' });

        if (req.user.role !== role)
            return res.status(403).send({ error: 'No permissions' });
        
        next();
    }
}