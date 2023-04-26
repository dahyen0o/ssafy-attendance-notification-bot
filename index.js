const Mattermost = require("node-mattermost");
const Schedule = require("node-schedule");

const hookurl = process.env.HOOK_URL;
const mattermost = new Mattermost(hookurl);

/**
 * 입퇴실
 */
const presentRule = new Schedule.RecurrenceRule();
presentRule.tz = "Asia/Seoul";
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

let leaveRule = new Schedule.RecurrenceRule();
leaveRule.tz = "Asia/Seoul";
leaveRule.dayOfWeek = [1, 2, 3, 4, 5];
leaveRule.hour = 18;
leaveRule.minute = 0;
leaveRule.second = 0;

const leaveJob = Schedule.scheduleJob(leaveRule, function () {
  mattermost.send({
    text: "@here 퇴실하세요🚀",
    channel: "off-topic",
    username: "퇴실체크 봇",
  });
});

/**
 * 생일
 */
const xlsxFile = require("read-excel-file/node");

let birthdayJobs = [];
const jujups = [
  `삐빅! 기사님 두 명이요. 제 마음속엔 언제나 jujup(이)가 존재하거든요`,
  `참나.. 사람들이 예쁘다 예쁘다 하니까 세상이 다 너꺼 같지?\n딱 기다려 우주도 곧 너꺼가 될거니까. jujup아 사랑해`,
  `여기서 jujup(이) 싫어하는 사람 있나?\n탕...!\n혹시 있나?`,
  `jujup(이)는 왜 매일 똑같은 티만 입어?\n프리티, 큐티`,
];

xlsxFile("./ssafy_09_09_birthday_list.xlsx").then((members) => {
  for (let idx = 0; idx < members.length; idx++) {
    const name = members[idx][0];
    let date = members[idx][1];
    date = date.split(" ");

    const birthdayRule = new Schedule.RecurrenceRule();
    birthdayRule.tz = "Asia/Seoul";
    birthdayRule.month = Number(date[0]) - 1;
    birthdayRule.date = Number(date[1]);
    birthdayRule.hour = 8;
    birthdayRule.minute = 30;
    birthdayRule.second = 0;

    const jujupIdx = Math.floor(Math.random() * jujups.length);
    const jujup = jujups[jujupIdx].replace('jujup', name.substr(1));

    birthdayJobs.push(
      Schedule.scheduleJob(birthdayRule, function () {
        mattermost.send({
          text:
            `@here \n` +
            `#### ✨오늘은 ${name}의 생일입니다✨\n` +
            `${jujup}\n\n` +
            `생일 축하해^^ 🎉🥰`,
          channel: "off-topic",
          username: "생일축하 봇",
        });
      })
    );
  }
});
