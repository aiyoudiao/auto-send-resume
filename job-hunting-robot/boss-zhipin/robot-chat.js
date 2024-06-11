import { OpenAI } from "openai";
import { Key } from "selenium-webdriver";
import {
  openAIBaseURL,
  openAIAccessKay,
  getQuestion,
  openAIRole,
  openAIModel,
  sleepDuration,
} from "./robot-mind.js";
import { querySelector } from "./robot-hand.js";

const openAI = new OpenAI({
  baseURL: openAIBaseURL,
  apiKey: openAIAccessKay,
});

// 与GPT进行聊天的函数
export const getGPTChatMessage = async (jobDescription) => {
  const question = getQuestion();
  try {
    const completion = await openAI.chat.completions.create({
      messages: [
        {
          role: openAIRole,
          content: question,
        },
      ],
      model: openAIModel,
    });

    // 获取gpt返回的信息
    const formattedMessage = completion.choices[0].message.content.replace(
      /\n/g,
      " "
    );
    return formattedMessage;
  } catch (error) {
    console.error(`${openAIRole} ${openAIModel} 返回时发生错误: ${error}`);
    const errorResponse = JSON.stringify({ error: String(error) });
    return errorResponse;
  }
};

// 发送响应到聊天框
export const sendMessageToChatBox = async (message) => {
  try {
    const chatBox = await querySelector("#chat-input");

    await chatBox.clear();

    await chatBox.sendKeys(message);
    await sleepDuration(1000);

    await chatBox.sendKeys(Key.RETURN);
    await sleepDuration(2000);
  } catch (error) {
    console.error(`发送消息至聊天框时错误: ${error}`);
  }
};
