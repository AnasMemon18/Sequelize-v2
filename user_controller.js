const path = require("path");
const User = require('../models/product');

var date = new Date().toISOString().split("T")[0];


const insertUser = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });
        if (user) {
            console.log(user)
            res.render("index", {emailMessage: "Email already registered, Please try logging in."});
            // res.redirect('/');
        } else {
            User.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.confirmPassword,
                phoneNumber: req.body.phoneNumber,
                dob: req.body.dateOfBirth,
                country: req.body.country,
                role: req.body.role,
                address: req.body.address
            })
                .then((user) => {
                    res.redirect('/user/showUsers');
                   
                })
                .catch(err => {
                    console.log("Insertion Error!");
                    throw err;
                })
        }
    }
    catch (err) {
        throw err;
    }
};

const getUsers = (req, res, next) => {
    try {
        User.findAll()
            .then(result => {
                res.render('showUsers', { users: result })
            })
            .catch(err => {
                throw err;
            })
    } catch (err) {
        throw err;
    }

};

const deleteUser = (req, res, next) => {
    try {
        const id = parseInt(req.params.id)
        User.destroy({ where: { id: id } }).then(user => {
            res.redirect('/user/showUsers')
        }).catch(err => {
            throw err;
        })
    } catch (err) {
        throw err;
    }
};


const getUserById = (req, res, next) => {
    const id = req.params.id;
    try {
        User.findByPk(id)
            .then(data => {
                res.render("updateUser", { date: date, data: data });
            })
            .catch(err => {
                throw err;
            })
    } catch (err) {
        throw err;
    }


};


const updateUser = (req, res, next) => {
    try {
        User.update({
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address
        }, {
            where: { id: req.body.id }
        }).then(user => {
            res.redirect('/user/showUsers');
        }).catch(err => {
            throw err;
        })
    } catch (err) {
        throw err;
    }
};


const isLoggedIn = async (req, res, next)=>{
    const user = await User.findOne({ where: { email: req.body.loginEmail } });
    try{
        if (user) {
            if(user.password === req.body.loginPassword){
            res.redirect('/user/successLogin');
            }
            else{
                res.render("index", {emailMessage: "Password incorrect. Please enter correct password."});
            }
        }
        else{
            res.render("index", {emailMessage: "You are not a registered user, Please sign up."});
        }
    }catch(err){
        throw err;
    }   
}


const successLoginpage = (req, res, next) =>{
    res.render("successLogin");
};

// const checkEmail = (req, res, next)=>{
//    console.log("This is check email")
// };

module.exports = {
    insertUser,
    updateUser,
    getUserById,
    getUsers,
    deleteUser,
    isLoggedIn,
    successLoginpage
    // checkEmail
}
