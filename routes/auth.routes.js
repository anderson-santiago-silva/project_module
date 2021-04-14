const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/User');

const router = express();

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', async (req, res) => {
    console.log(req.body);

    const { userName, userEmail, userPassword, userBirthDate } = req.body

    const validationErrors = {};

    if (userName.trim().length === 0) {
        validationErrors.userNameError = 'Campo obrigatório!'
    }
    if (userEmail.trim().length === 0) {
        validationErrors.userEmailError = 'Campo obrigatório!'
    }
    if (userPassword.trim().length === 0) {
        validationErrors.userPasswordError = 'Campo obrigatório!'
    }
    if (userBirthDate.trim().length === 0) {
        validationErrors.userBirthDateError = 'Campo obrigatório!'
    }

    if (Object.keys(validationErrors).length > 0) {
        return res.render('signup', validationErrors );
    }

    try {

        const userFromDb = await User.findOne({ email: userEmail });

        if (userFromDb) {
            return res.render('signup', { userEmailError: 'Email já cadastrado.' })
        }

        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const encryptedPassword = bcrypt.hashSync(userPassword, salt);

        await User.create({ 
            name: userName,
            email: userEmail,
            password: encryptedPassword,
            birthDate: new Date(userBirthDate),
        });

        res.redirect('/login');

    } catch(error) {
        console.log('Error na rota /signup', error);
    }
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {

    try {
        const { userEmail, userPassword } = req.body;

        const userFromDb = await User.findOne({email: userEmail });

        if (!userFromDb) {
            return res.render('login', { userEmailError: 'Usuário ou senha incorretos' })
        }

        const passwordValid = bcrypt.compareSync( userPassword, userFromDb.password);
        if (!passwordValid) {
            return res.render('login', { userEmailError: 'Usuário ou senha incorretos' })
        }

        req.session.currentUser = userFromDb;

        res.redirect('/pets');

    } catch(error) {
        console.log(error);
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy();

    res.redirect('/login');
})

module.exports = router;