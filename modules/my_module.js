"use strict";
let ensureAuthenticated = function (req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	else {
		res.redirect('/');
	}
};
if(typeof module !== 'undefined' && module.exports) {
	module.exports.ensureAuthenticated = ensureAuthenticated;
}

