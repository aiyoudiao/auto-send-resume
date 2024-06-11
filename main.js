import jobStarters from "./job-hunting-robot/index.js";

const main = async () => {
  await jobStarters.bossZhipin();
};

(async () => {
  await main();
})();
