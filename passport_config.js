const LocalStrategy = require("passport-local").Strategy;
const { pool } = require("./db_config");
const bcrypt = require("bcrypt");

function initialize(passport) {
  console.log("Initialized");

  const authenticateUser = (name, password, done) => {
    console.log(name, password);
    pool.query(
      `SELECT * FROM users WHERE name = $1`,
      [name],
      (err, results) => {
        if (err) {
          throw err;
        }
        console.log(results.rows);

        if (results.rows.length > 0) {
          const user = results.rows[0];

          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              console.log(err);
            }
            if (isMatch) {
              return done(null, user);
            } else {
              //password is incorrect
              return done(null, false, { message: "You have entered an invalid username or password" });
            }
          });
        } else {
          // No user
          return done(null, false, {
            message: "User not registered!"
          });
        }
      }
    );
  };

  passport.use(
    new LocalStrategy(
      { usernameField: "name", passwordField: "password" },
      authenticateUser
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) => {
    pool.query(`SELECT * FROM users WHERE id = $1`,
     [id], (err, results) => {
      if (err) {
        return done(err);
      }
      console.log(`ID is ${results.rows[0].id}`);
      return done(null, results.rows[0]);
    });
  });
}

module.exports = initialize;