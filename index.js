const Mattermost = require("node-mattermost");
const Schedule = require("node-schedule");

const hookurl = process.env.HOOK_URL;
const mattermost = new Mattermost(hookurl);

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

