const Mattermost = require("node-mattermost");
const Schedule = require("node-schedule");

const hookurl = process.env.HOOK_URL;
const mattermost = new Mattermost(hookurl);

const rule = new Schedule.RecurrenceRule();
rule.tz = 'Asia/Seoul';
rule.dayOfWeek = [1, 2, 3, 4, 5];
rule.hour = 8;
rule.minute = 50;

const job = Schedule.scheduleJob(rule, function () {
  mattermost.send({
    text: "입실체크 하세요",
    channel: "off-topic",
    username: "입실체크 봇",
  });
});

