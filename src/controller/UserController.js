const { db } = require("../config/config");

const moment = require("moment");


class UserController {

  static registerCar(req, res) {
    const { plate, name, seats } = req.body;
    const { tin } = req.query;

    const time = new Date();
    const date = time.toLocaleDateString();

    const newTime = moment(date).format("DD/MM/YYYY");

    db.getConnection((err, connection) => {
      if (err) console.log("ConnectionError", err);
      else {

        connection.query("SELECT * FROM cars WHERE plate =?", [plate], (err, results) => {
          if (err) console.log("Error", err);
          else if (results.length > 0) {
            res.send({ status: 204, message: "Car already registered" });
          }
          else {
            connection.query("INSERT INTO cars SET ?", {
              plate,
              name,
              seats,
              tin,
              time: newTime
            }, (err, result) => {
              if (err) console.log("Error", err);
              else {
                res.send({ status: 200, message: "Car inserted " });
              }
              connection.release();
            });
          }
        });
      }
    });
  }
  static registerDriver(req, res) {
    const { idno, name, phonenumber, license } = req.body;
    const { tin } = req.query;

    db.getConnection((err, connection) => {
      if (err) console.log("ConnectionError", err);
      else {
        connection.query("SELECT * FROM drivers WHERE idno=?", [idno], (err, result) => {
          if (err) console.log("Error", err);
          else if (result.length > 0) {
            res.send({ status: 205, message: "Driver already registered" });
          }
          else {
            connection.query("INSERT INTO drivers SET ?", {
              idno,
              name,
              phonenumber,
              license,
              tin
            }, (err, results) => {
              if (err) console.log("Error", err);
              else {
                res.send({ status: 200, message: "Driver inserted Ok" });
              }
              connection.release();
            });
          }
        });
      }
    });
  }

  static recordInformation(req, res) {

    const { plate, outcome, driver, price, cause } = req.body;
    const { tin } = req.query;

    const time = new Date();
    const date = time.toLocaleDateString();

    const newTime = moment(date).format("DD/MM/YYYY");

    db.getConnection((err, connection) => {
      if (err) console.log("ConnectionError", err);
      else {
        connection.query("SELECT * FROM users WHERE tin", [tin], (err, result) => {
          if (err) console.log("Error", err);
          else {
            const { username } = result[0];

            if (outcome === "Expenses") {
              connection.query("INSERT INTO expenses SET?", {
                plate,
                outcome,
                driver,
                price,
                cause,
                tin,
                username,
                date: newTime
              }, (err, results) => {
                if (err) console.log("Error", err);
                else {
                  res.send({ status: 200, message: " expenses OKKKK" });
                }

              });
            }
            else {
              connection.query("INSERT INTO income SET?", {
                plate,
                outcome,
                driver,
                price,
                cause,
                tin,
                username,
                date: newTime
              }, (err, results) => {
                if (err) console.log("Error", err);
                else {
                  res.send({ status: 200, message: " income OKKKKK" });
                }

              });
            }

            connection.release();
          }
        });
      }
    });

  }

  static Viewcars(req, res) {

    const { tin } = req.query;
    db.getConnection((err, connection) => {
      if (err) console.log("ConnectionError", err);
      else {
        connection.query("SELECT * FROM cars WHERE tin=? ORDER BY id DESC ", [tin], (err, result) => {
          if (err) console.log("Error", err);
          else {
            res.send({
              status: 200,
              data: { cars: result }
            });
          }
          connection.release();
        });
      }
    });
  }

  static Viewdrivers(req, res) {
    const { tin } = req.query;
    db.getConnection((err, connection) => {
      if (err) console.log("ConnectionError", err);
      else {
        connection.query("SELECT * FROM drivers  WHERE tin =? ORDER BY id DESC ", [tin], (err, result) => {
          if (err) console.log("Error", err);
          else {
            res.send({
              status: 200,
              data: { drivers: result }
            });
          }
          connection.release();
        });
      }
    });
  }

  static allIncome(req, res) {

    const { tin } = req.query;
    db.getConnection((err, connection) => {
      if (err) console.log("ConnectionError", err);
      else {
        connection.query("SELECT * FROM income WHERE tin=? ORDER BY id DESC  ", [tin], (err, result) => {
          if (err) console.log("Error", err);
          else {
            res.send({
              status: 200,
              data: { income: result }
            });
          }
          connection.release();
        });
      }
    });
  }

  static allExpenses(req, res) {
    const { tin } = req.query;
    db.getConnection((err, connection) => {
      if (err) console.log("ConnectionError", err);
      else {
        connection.query("SELECT * FROM expenses WHERE tin=? ORDER BY id DESC  ", [tin], (err, result) => {
          if (err) console.log("Error", err);
          else {
            res.send({
              status: 200,
              data: { expense: result }
            });
          }
          connection.release();
        });
      }
    });
  }

  static searchDate(req, res) {
    const { tin } = req.query;
    const { startDate, endDate, outcome } = req.body;

    const newStartDate = moment(startDate).format("DD/MM/YYYY");
    const newEndDate = moment(endDate).format("DD/MM/YYYY");

    db.getConnection((err, connection) => {
      if (err) console.log("ConnectionError", err);
      else {
        if (outcome === "Expense") {
          connection.query("SELECT SUM(price) AS totalExpense FROM expenses WHERE tin=?  AND (date BETWEEN ? AND ?)"
            , [tin, newStartDate, newEndDate], (err, result) => {
              console.log("exp", result);
              if (err) console.log("ConnectionError", err);

              else if (result.length === 0) {
                res.send({
                  status: 203,
                  message: "No result found"
                });
              }
              else {
                res.send({
                  status: 200,
                  data: { dailyExpenses: result }
                });
              }
            });
        }
        else {
          connection.query("SELECT SUM(price) AS totalIncome FROM income WHERE tin=? AND (date BETWEEN ? AND ?)"
            , [tin, newStartDate, newEndDate], (err, results) => {
              console.log("inc", results);
              if (err) console.log("ConnectionError", err);
              else if (results.length === 0) {
                res.send({
                  status: 203,
                  message: "No result found"
                });
              }
              else {
                res.send({
                  status: 300,
                  data: { dailyIncome: results }
                });
              }
              connection.release();
            });
        }
      }
    });
  }
}

module.exports = UserController;