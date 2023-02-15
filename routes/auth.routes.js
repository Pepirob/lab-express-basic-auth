const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const User = require("../models/User.model")

// GET "/auth/signup" => renderizar formulario registro
router.get("/signup", (req, res, next) =>{
    res.render("auth/signup-form.hbs")
})


// POST "/auth/signup" => recivir data de usuario y crear en la DB
router.post("/signup", async (req, res, next) => {
    const { username, password } = req.body
    try {
        const salt = await bcrypt.genSalt(12)
        const hashPassword = await bcrypt.hash(password, salt)

        await User.create({
            username,
            password: hashPassword
        })
        console.log(password)
        res.redirect("/auth/login")
    } catch (err) {
        next(err)
    }
})


module.exports = router