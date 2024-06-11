import { sleepDuration } from "./robot-mind.js";
import { getGPTChatMessage, sendMessageToChatBox } from "./robot-chat.js";
import {
  getRobotEntity,
  openBrowser,
  login,
  triggerClickElementAction,
  executeClickElement,
  selectJobByIndex,
  getJobDescription,
  isElementVisible,
  waitElementVisible,
} from "./robot-hand.js";
import {
  initBefore,
  initAfter,
  loginBefore,
  loginAfter,
  runLoopTaskBefore,
  runSingleTaskBefore,
  runSingleTaskAfter,
  runLoopTaskAfter,
  end,
} from "./robot-lifecycle.js";

const context = {
  executeClickElement,
};

export async function robotStart(url, browserType) {
  try {
    await initBefore(context);
    await openBrowser(url, browserType);
    await initAfter(context);

    await loginBefore(context);
    await login();
    await loginAfter(context);

    let index = 1;
    const hand = getRobotEntity();

    await runLoopTaskBefore(context);

    while (true) {
      await runSingleTaskBefore(context);

      await selectJobByIndex(index);
      const jobDescription = await getJobDescription();

      await sleepDuration();
      const contactButtonSelector =
        "#wrap > div.job-recommend-main > div.job-recommend-result > div > div > div.job-detail-container > div > div.job-detail-header > div.job-detail-op.clearfix > a.op-btn.op-btn-chat";
      if (await isElementVisible(contactButtonSelector)) {
        const clickContactButton = await triggerClickElementAction(
          contactButtonSelector
        );
        await clickContactButton();
        await sleepDuration();
      }

      const contactedSelector =
        "body > div.greet-boss-dialog > div.greet-boss-container > div.greet-boss-header > h3";
      if (await isElementVisible(contactedSelector, 3000)) {
        const clickContinueButton = await triggerClickElementAction(
          "body > div.greet-boss-dialog > div.greet-boss-container > div.greet-boss-footer > a.default-btn.sure-btn"
        );
        await clickContinueButton();
        await sleepDuration();
      }

      await waitElementVisible("#chat-input", 10000);
      const message = await getGPTChatMessage(jobDescription);
      await sendMessageToChatBox(message);
      await hand.navigate().back();
      await sleepDuration();
      index++;

      await runSingleTaskAfter(context);
    }
  } catch (error) {
    console.error(`发生错误，请检查: ${error}`);

    await runLoopTaskAfter(context);
  }

  await end(context);
}
