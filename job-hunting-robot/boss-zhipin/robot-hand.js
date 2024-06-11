/**
 * https://www.selenium.dev/zh-cn/documentation/webdriver/
 */
import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

import fs from "fs";
import { cookieFilePath } from "./robot-mind.js";

// 全局 hand
let hand;

export const getHand = () => hand;

export const querySelector = async (selector) => {
  return await hand.findElement(By.css(selector));
};

// 触发单击元素的行为，获得一个对应的行为函数
export const triggerClickElementAction = async (selector) => {
  return async () => {
    const clickElement = await querySelector(selector);
    await clickElement.click();
  };
};

// 执行元素单击的行为
export const executeClickElement = async (selector) => {
  if (await isElementVisible(selector)) {
    const clickAction = await triggerClickElementAction(selector);
    await clickAction();
  }
};

// 等待元素显示
export const waitElementVisible = async (selector, timeout = 2000) => {
  return hand.wait(until.elementLocated(By.css(selector)), timeout);
};

// 元素是否显示了
export const isElementVisible = async (selector, timeout = 2000) => {
  try {
    await waitElementVisible(selector, timeout);
    return true;
  } catch (error) {
    return false;
  }
};

// 根据索引点击Job卡片
export const selectJobByIndex = async (index) => {
  try {
    const jobSelector = `#wrap > div:nth-child(2) > div:nth-child(2) > div > div > div:first-child > ul > li:nth-child(${index})`;
    const jobElement = await querySelector(jobSelector);
    // 点击招聘信息列表中的项
    await jobElement.click();
  } catch (error) {
    console.log(`在索引 ${index} 处找不到工作。`);
    return null;
  }
};

// 获取职位描述
export const getJobDescription = async () => {
  const descriptionSelector =
    "#wrap > div:nth-of-type(2) > div:nth-of-type(2) > div > div > div:nth-of-type(2) > div > div:nth-of-type(2) > p";
  if (await isElementVisible(descriptionSelector)) {
    const jobDescriptionElement = await querySelector(descriptionSelector);
    return jobDescriptionElement.getText();
  }

  throw new Error("获取职位描述失败！！！");
};

/**
 * 使用指定的选项打开浏览器
 */
export const openBrowser = async (url, browser) => {
  const options = new chrome.Options();
  options.addArguments("--detach");

  if (browser === "chrome") {
    hand = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();

    await hand.manage().window().maximize();
  } else {
    throw new Error("不支持的浏览器类型");
  }

  await hand.get(url);

  // 等待直到页面包含登录按钮dom
  const loginButtonSelector = By.css(
    "#header > div:nth-of-type(1) > div:nth-of-type(3) > div > a"
  );
  await hand.wait(until.elementLocated(loginButtonSelector), 10000);
};

// 检查是否已经登录过
export const checkLogged = async () => {
  const existsCookie = true;
  let cookieStr = "";

  try {
    cookieStr = fs.readFileSync(cookieFilePath, "utf-8");
  } catch (e) {
    existsCookie = false;
  }

  if (!existsCookie) {
    return false;
  }

  if (existsCookie) {
    const cookies = JSON.parse(cookieStr) || [];
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      await hand.manage().addCookie(cookie);
    }
    await hand.navigate().refresh();
  }

  if (
    await isElementVisible(
      "#header > div:nth-of-type(1) > div:nth-of-type(3) > div > a"
    )
  ) {
    return false;
  }

  return true;
};

// 登录
const __login = async () => {
  const loginButton = await hand.findElement(
    By.css("#header > div:nth-of-type(1) > div:nth-of-type(3) > div > a")
  );

  await loginButton.click();

  const wechatLoginSelector =
    "#wrap > div > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(4) > a";
  await hand.wait(until.elementLocated(By.css(wechatLoginSelector)), 10000);

  const wechatButton = await hand.findElement(By.css(wechatLoginSelector));
  await wechatButton.click();

  const wechatLogoSelector =
    "#wrap > div > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > img";
  await hand.wait(until.elementLocated(By.css(wechatLogoSelector)), 10000);
};

// 带检查的登录
export const login = async () => {
  if (!(await checkLogged())) {
    await __login();
    await hand
      .manage()
      .getCookies()
      .then(function (cookies) {
        fs.writeFileSync(
          cookieFilePath,
          JSON.stringify(cookies, null, 4),
          "utf-8"
        );
      });
  }

  const loginSuccessSelector =
    "#header > div:nth-of-type(1) > div:nth-of-type(3) > ul > li:nth-of-type(2) > a";
  await hand.wait(until.elementLocated(By.css(loginSuccessSelector)), 60000);
};
