const Mattermost = require("node-mattermost");
const Schedule = require("node-schedule");

const hookurl = process.env.HOOK_URL;
const mattermost = new Mattermost(hookurl);

/**
 * 입퇴실
 */
const presentRule = new Schedule.RecurrenceRule();
presentRule.tz = 'Asia/Seoul';
presentRule.dayOfWeek = [1, 2, 3, 4, 5];
presentRule.hour = 8;
presentRule.minute = 50;

const presentJob = Schedule.scheduleJob(presentRule, function () {
  mattermost.send({
    text: "@here 입실체크 하세요",
    channel: "off-topic",
    username: "입실체크 봇",
  });
});

const leaveRule = new Schedule.RecurrenceRule();
leaveRule.tz = 'Asia/Seoul';
leaveRule.dayOfWeek = [1, 2, 3, 4, 5];
leaveRule.hour = 17;
leaveRule.minute = 59;
leaveRule.second = 50;

const leaveJob = Schedule.scheduleJob(leaveRule, function () {
  mattermost.send({
    text: "@here 10초 뒤 퇴실체크 하세요",
    channel: "off-topic",
    username: "퇴실체크 봇",
  });
});

/**
 * 생일
 */
const xlsxFile = require('read-excel-file/node');
let birthdayJobs = [];

xlsxFile("./ssafy_09_09_birthday_list.xlsx").then((members) => {
  for (let idx = 0; idx < members.length; idx++) {
    const name = members[idx][0];
    let date = members[idx][1];
    date = date.split(' ');

    birthdayJobs.push(Schedule.scheduleJob(`0 0 0 ${date[1]} ${date[0]} *`, function () {
      mattermost.send({
        text: `#### ✨오늘은 ${name}의 생일입니다✨\n다들 축하해주세요^^`,
        channel: "off-topic",
        username: "생일축하 봇",
      })
    }));
  }

  // test
  birthdayJobs.push(Schedule.scheduleJob(`0 0 13 20 4 *`, function () {
    mattermost.send({
      text: `#### ✨오늘은 테스트의 생일입니다✨\n다들 축하해주세요^^`,
      channel: "off-topic",
      username: "생일축하 봇",
    })
  }));
});


