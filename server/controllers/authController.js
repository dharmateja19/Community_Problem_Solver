// import {jwt} from 'jsonwebtoken'

export const register = (req, res) => {
    
}

export const login = (req, res) => {
    const {email, password} = req.body;
    try {
        if(!email || !password) {
            return res.status(400).json({message : "Both Email and password are required"});
        }
    } catch (error) {
        
    }
}
