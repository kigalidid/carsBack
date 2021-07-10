const { db } = require("../config/config");



class AdminController {
  static getAllUsers(req, res) {
    db.getConnection((err, connection) => {
      if (err) console.log("ConnectionError", err);
      else {
        connection.query("SELECT * FROM users ORDER BY id DESC ", (err, result) => {
          if (err) console.log("Error", err);
          else {
            res.send({
              status: 200,
              data: { Users: result }
            });
          }
          connection.release();
        });
      }
    });
  }
}

module.exports = AdminController;