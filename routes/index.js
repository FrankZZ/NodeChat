/*
 * GET home page.
 */

exports.index = function (req, res) {
	res.render('index', { title: 'Frank Wammes & Jim Franke IPC Week 2' });
};