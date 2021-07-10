const { db } = require("../config/config");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

class AuthController {
	static register(req, res) {
		const { username, password, confirmPassword, companyName, address, phone, tin } = req.body;
		if (password !== confirmPassword) {
			res.send({ status: 203, message: "Passwords do not Match Check again" });
		}
		else {
			db.getConnection((err, connection) => {
				if (err) console.log("ConnectionError", err);
				else {
					connection.query("SELECT * FROM users WHERE tin =?", [tin], async (err, result) => {
						if (err) console.log("errr", err);
						else if (result.length > 0) {
							res.send({ status: 204, message: "Company already registered" });
						}
						else {
							const hashedPassword = await bcrypt.hash(password, 10);
							connection.query("INSERT INTO users SET?", {
								username,
								companyName,
								address,
								phone,
								tin,
								password: hashedPassword
							}, (err, results) => {
								if (err) console.log("errr", err);
								else {
									res.send({ status: 200, message: "created Success" });
								}
								connection.release();
							});
						}
					});
				}
			});
		}
	}

	static login(req, res) {

		const { tin, password } = req.body;

		db.getConnection((err, connection) => {
			if (err) console.log("ConnectionError", err);
			else {
				if (tin === "admin") {
					connection.query("SELECT * FROM users WHERE tin =?", [tin], async (err, results) => {
						if (err) console.log("Error", err);

						else {
							if (!(await (bcrypt.compare(password, results[0].password)))) {
								res.send({ status: 204, message: "WRONG PASSWORD" });
							}
							else {
								const token = jwt.sign({ tin }, `${process.env.JWT_SECRET}`, { expiresIn: "2h" });
								res.send({ status: 201, token, tin });
							}
						}
					});
				}
				else {
					connection.query("SELECT * FROM users WHERE tin =? ", [tin], async (err, result) => {
						if (err) console.log("Error", err);
						else if (result.length < 1) {
							res.send({ status: 205, message: "TIN doesn't exist" });
						}
						else {
							if (!(await (bcrypt.compare(password, result[0].password)))) {
								res.send({ status: 204, message: "WRONG PASSWORD" });
							}
							else {
								const token = jwt.sign({ tin }, `${process.env.JWT_SECRET}`, { expiresIn: "2h" });
								res.send({ status: 200, token, tin });
							}
						}
					});
				}
			}
			connection.release();
		});



	}


	static createAdmin(req, res) {
		const { name, password } = req.body;
		db.getConnection(async (err, connection) => {
			if (err) console.log("ConnectionError", err);
			else {
				let hashedPassword = await bcrypt.hash(password, 10);
				connection.query("INSERT INTO users SET ?", {
					tin: name,
					password: hashedPassword
				}, (err, result) => {
					if (err) console.log("Error", err);
					else {
						res.send({ status: 200 });
					}
					connection.release();
				});
			}
		});
	}




}

module.exports = AuthController;