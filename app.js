var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const db = require("./models");

// contact.csv파일을 읽기 위한 준비.
const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const csv = fs.readFileSync("csv/contact.csv");
const records = parse(csv.toString("utf-8"));

// 데이터베이스 싱크하기.
db.sequelize.sync();

// contact.csv파일 읽기
records.forEach(async r => {
  await db.User.create({
    name: r[0],
    number: r[1]
  });
});

// 데이터베이스 기능 사용.
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

app.listen(3000, function() {
  console.log("Start!! express server on port 3000");
});

// 접속시 html 파일 제공을 위해서.
app.use(express.static("public"));

// 데이터를 쉽게 주고받기 위한 기본 세팅.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 처음에 접속시 보여주는 html 파일.
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/form.html");
});

// insert 작업시 라우팅.
app.post("/insert", async (req, res) => {
  try {
    // 공백 처리
    if (req.body.name !== "" && req.body.number !== "") {
      await db.User.create({
        name: req.body.name,
        number: req.body.number
      });
    }

    // check validation.
    var responseData = { result: "ok", data: req.body };
    res.json(responseData);
  } catch (e) {
    console.log(e);
  }
});

// search 작업시 라우팅
app.post("/search", async (req, res) => {
  try {
    // 공백 처리
    if (req.body.name !== "") {
      // 같은 이름을 가진 이름 리스트 찾기 => 반환값 : 배열
      const sameList = await db.User.findAll({
        where: {
          name: req.body.name
        }
      });

      // 이름에서 성 따오기
      var lastName = req.body.name.substring(0, 1);

      // 같은 성을 가진 이름 리스트 찾기 => 반환값 : 배열
      const lastNameSameList = await db.User.findAll({
        where: { name: { [Op.like]: lastName + "%" } }
      });

      // 응답 데이터 만들기
      var responseData = {
        result: "ok",
        sameList: sameList,
        lastNameSameList: lastNameSameList
      };

      // res에 실어서 전송.
      res.json(responseData);
    }
  } catch (e) {
    console.log(e);
  }
  // check validation.
});

// 삭제 작업 라우팅
app.post("/delete", async (req, res) => {
  try {
    // 공백 처리
    if (req.body.name !== "") {
      // 같은 이름을 가진 녀석 찾기
      const find = await db.User.findOne({
        where: {
          name: req.body.name
        }
      });
      console.log(find);

      // 삭제
      await db.User.destroy({
        where: {
          id: find.dataValues.id
        }
      });

      // 응답 데이터 만들기
      var responseData = { result: "ok", data: req.body.name };
      // 데이터 전송
      res.json(responseData);
    }
  } catch (e) {
    console.log(e);
  }
});

// 수정 작업 라우팅
app.post("/update", async (req, res) => {
  try {
    // 수정 작업 (id가 일치하는 녀석을 전달받은 값으로 바꿈)
    await db.User.update(
      { name: req.body.inputname, number: req.body.inputnumber },
      {
        where: {
          id: req.body.id
        }
      }
    );

    // 응답 데이터 만들기
    var responseData = { result: "ok", data: req.body };
    // 데이터 전송
    res.json(responseData);
  } catch (e) {
    console.log(e);
  }
});