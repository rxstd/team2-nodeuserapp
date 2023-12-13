var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");

// Router 커스터마이징 시작
var memberAPIRouter = require('./routes/memberAPI');
// Router 커스터마이징 끝

const session = require("express-session");

var app = express();

app.use(
  session({
    secret: "ormcamp",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Note: In production, set this to true and use HTTPS
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Router Use 적용 시작

app.use("/", indexRouter);
app.use('/api/member', memberAPIRouter);

// Router Use 적용 끝

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
