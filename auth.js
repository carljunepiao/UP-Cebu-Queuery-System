const express = require('express');
const database = require('./database');
const Admin = require('./model').Admin;

const router = new express.Router();

router.post('/signin', function(req, res) {
	const email = req.body.email;
    const password = req.body.password;
	const remember = req.body.remember;

	Admin.findOne({ where: { email: email } }).then(function(user) {
        if (user === null) {
            // req.flash('signInMessage', 'Incorrect email.');
            console.log("Incorrect email");
            return res.redirect('/');
        }

		// const match = bcrypt.compareSync(password, user.password);
		if (password !== user.password) {
			// req.flash('signInMessage', 'Incorrect password.');
            console.log("Incorrect email");
			return res.redirect('/');
		}

        // req.flash('statusMessage', 'Signed in successfully!');
        console.log("Signed in Successfully");
        req.session.currentUser = user.email;
		if (remember) {
			req.session.cookie.maxAge = 1000 * 60 * 60;
		}
		res.redirect('/admin');
    });
});

router.get('/signout', function(req, res) {
	req.session.destroy();
	res.redirect('/');
});

module.exports = router;