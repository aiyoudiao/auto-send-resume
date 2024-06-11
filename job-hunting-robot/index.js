import * as bossZhipin from "./boss-zhipin/index.js";

const jobStarters = {
  // bossZhipin的启动器
  bossZhipin: async () => {
    const { robotStart, url, browserType } = bossZhipin;
    await robotStart(url, browserType);
  },
};

export default jobStarters;
