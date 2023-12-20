var express = require("express");
var router = express.Router();
var dotenv = require("dotenv");

var memberStore = require("../store/member.store");

var userMiddleware = require("../middleware/user.middleware");

dotenv.config();

const webTitle = process.env.PROJECT_TITLE;

router.get("/all", userMiddleware, function (req, res, next) {
  try {
    const memberList = memberStore.getUsers();
    res.json({ message: "회원 목록 조회에 성공했습니다.", data: memberList });
  } catch (error) {
    res.json({ message: "회원 목록 조회에 실패했습니다.", data: {} });
  }
});

router.post("/modify", userMiddleware, function (req, res, next) {
  const member_id = req.body.member_id;
  const password = req.body.password;
  const name = req.body.name;
  const telephone = req.body.telephone;
  const birthDate = req.body.birthDate;

  const member = memberStore.modifyMember(
    member_id,
    password,
    name,
    telephone,
    birthDate
  );

  if (member) {
    res.json({ message: "회원정보 수정에 성공했습니다.", data: member });
  } else {
    res.json({ message: "회원정보 수정에 실패했습니다.", data: {} });
  }
});

// 신규 회원정보 데이터 등록 등록 - 이미 회원가입에서 구현하여 일단 패스

router.post("/delete", userMiddleware, function (req, res, next) {
  const member_id = req.body.member_id;

  if (!memberStore.getUserById(member_id)) {
    res.json({ message: "회원정보 삭제에 실패했습니다.", data: {} });
  }

  memberStore.deleteUser(member_id);

  const member = memberStore.getUsers();

  res.json({ message: "회원정보 삭제에 성공했습니다.", data: member });
});

router.get("/:mid", userMiddleware, function (req, res, next) {
  const member_id = req.params.mid;

  const member = memberStore.getUserById(member_id);

  if (member) {
    res.json({ message: "회원 조회에 성공했습니다.", data: member });
  } else {
    res.json({
      message: "회원 조회에 실패했습니다. 올바른 회원인지 확인하십시오.",
      data: {},
    });
  }
});

module.exports = router;
