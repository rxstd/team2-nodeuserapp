var express = require("express");
var router = express.Router();
var dotenv = require("dotenv");

var memberStore = require("../store/member.store");

dotenv.config();

const webTitle = process.env.PROJECT_TITLE;

router.get("/", function (req, res, next) {
  if (req.session.member_id) {
    res.redirect("/chat/");
  } else {
    res.redirect("/login");
  }
});

router.get("/login", function (req, res, next) {
  res.render("auth/sign-in", { title: webTitle });
});

router.post("/login", function (req, res, next) {
  const username = req.body.username;

  if (username === undefined || username === "") {
    res.send(
      `<script>alert("이메일이 공란이어서는 안됩니다.");history.back();</script>`
    );
    return;
  }

  const password = req.body.password;

  if (password === undefined || password === "") {
    res.send(
      `<script>alert("비밀번호가 공란이어서는 안됩니다.");history.back();</script>`
    );
    return;
  }

  const user = memberStore.authUser(username, password);

  if (user) {
    req.session.member_id = user.member_id;
    res.redirect("/");
  } else {
    res.send(
      `<script>alert("일치하는 인증 정보가 없습니다.\\n이메일 혹은 비밀번호를 확인하십시오.");history.back();</script>`
    );
  }
});

router.get("/entry", function (req, res, next) {
  res.render("auth/sign-up", { title: webTitle });
});

router.post("/entry", function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password1;
  const passwordConfirm = req.body.password2;
  const name = req.body.name;
  const telephone = req.body.telephone;
  const birthDate = req.body.birth;

  if (username === undefined || username === "") {
    res.send(
      `<script>alert("이메일이 공란이어서는 안됩니다.");history.back();</script>`
    );
    return;
  }

  if (password === undefined || password === "") {
    res.send(
      `<script>alert("비밀번호가 공란이어서는 안됩니다.");history.back();</script>`
    );
    return;
  }

  if (passwordConfirm === undefined || passwordConfirm === "") {
    res.send(
      `<script>alert("비밀번호 확인이 공란이어서는 안됩니다.");history.back();</script>`
    );
    return;
  }

  if (password !== passwordConfirm) {
    res.send(
      `<script>alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");history.back();</script>`
    );
    return;
  }

  const user = memberStore.checkUserAlreadyExists(username);

  const birth = birthDate.split("-").join("").substring(2);

  const nowTime = new Date();
  const year = nowTime.getFullYear();
  const month = nowTime.getMonth() + 1;
  const date = nowTime.getDate();
  const hour = nowTime.getHours();
  const minute = nowTime.getMinutes();
  const second = nowTime.getSeconds();
  const nowTimeStr = `${year}-${month}-${date} ${hour}:${minute}:${second}`;

  if (user) {
    res.send(
      `<script>alert("이미 가입된 이메일입니다.");history.back();</script>`
    );
  } else {
    const newUser = {
      member_id: memberStore.getUsers().length + 1,
      email: username,
      member_password: password,
      member_name: name,
      telephone: telephone,
      entry_type_code: "1",
      user_state_code: "1",
      birth_date: birth,
      reg_date: nowTimeStr,
      reg_member_id: "1",
      edit_date: nowTimeStr,
      edit_member_id: "1",
    };

    memberStore.addUser(newUser);

    res.send(
      `<script>alert("회원가입이 완료되었습니다.");location.href="/login";</script>`
    );
  }
});

router.get("/logout", function (req, res, next) {
  req.session.destroy();
  res.redirect("/login");
});

router.get("/find", function (req, res, next) {
  res.render("auth/forgot-pw", { title: webTitle });
});

router.post("/find", function (req, res, next) {
  const username = req.body.username;

  if (username === undefined || username === "") {
    res.send(
      `<script>alert("이메일이 공란이어서는 안됩니다.");history.back();</script>`
    );
    return;
  }

  const user = memberStore.getUserByUsername(username);

  if (user) {
    res.send(
      `<script>alert("초기화된 비밀번호가 귀하의 이메일로 발송되었습니다.\n이는 구현되지 않은 기능입니다.");history.back();</script>`
    );
  } else {
    res.send(
      `<script>alert("일치하는 인증 정보가 없습니다.\\n가입된 이메일이 맞는지 확인하십시오.");history.back();</script>`
    );
  }
});

module.exports = router;
