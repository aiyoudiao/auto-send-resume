export const url =
  "https://www.zhipin.com/web/geek/job-recommend?ka=header-job-recommend";
export const browserType = "chrome";
export const cookieFilePath = "./job-hunting-robot/boss-zhipin/cookie.json";
export const openAIBaseURL = "https://api.chatanywhere.com.cn";
// https://gitcode.com/chatanywhere/gpt_api_free/overview
export const openAIAccessKay =
  "<https://gitcode.com/chatanywhere/gpt_api_free/overview> 请从链接处获取key";
export const openAIRole = "system";
export const openAIModel = "gpt-3.5-turbo";
const resumeInfo = `
<你的名字>

<你的介绍>
`;

export const getQuestion = (jobDescription) =>
  `您好，这是我简历上的信息：${resumeInfo}，这是我钟意公司的职位描述：${jobDescription}。我想写一封简洁优雅生动有趣的求职信，请帮帮我，谢谢您～`;

export const sleepDuration = (ms = 2000) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
