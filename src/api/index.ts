import axios from "axios";
import * as CONF from "@/openai-conf";
import { ChatRecommendationM, MoleculeM, SendMessageM } from "@/models";

export async function reqSendMessage(
  message: string,
  chatId: number,
  context = []
): Promise<SendMessageM> {
  const url = "https://api.openai.com/v1/chat/completions";
  const data = {
    prompt: message,
    max_tokens: CONF.MAX_TOKENS, // 设置生成的回复长度
    temperature: CONF.TEMPERATURE, // 设置回复的创造性程度，值越大越创造性，但也会更加不确定
    context: context,
    chatId: chatId,
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${CONF.YOUR_API_KEY}`, // 将YOUR_API_KEY替换为您的OpenAI API密钥
  };

  try {
    const response = await axios.post(url, data, { headers });
    const reply = response.data.choices[0].text.trim();
    const newContext = response.data.choices[0].message.context;
    console.log("ChatGPT reply:", reply);

    // 返回新的上下文以便在下一轮对话中使用
    return {
      isOk: true,
      newContext,
      reply,
      chatId,
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      isOk: false,
      chatId,
      newContext: context,
      reply: "",
    };
  }
}

export async function reqMolecularRecommend(
  likedMolecularIds: number[] = [],
  dislikedMolecularIds: number[] = [],
  messageId: number | null = null
): Promise<ChatRecommendationM> {
  // TODO: 请在此处实现分子推荐的请求
  // const url = "example.com";
  // const data = {
  //   liked: likedMolecularIds,
  //   messageId: messageId,
  // };
  // const headers = {
  //   "Content-Type": "application/json",
  // };

  // try {
  //   const response: ChatRecommendationM = await axios.post(url, data, {
  //     headers,
  //   });
  //   return response;
  // } catch (error) {
  //   console.error("Error:", error);
  //   return {
  //     error: error,
  //   };
  // }
  // TODO: 请在此处实现分子推荐的请求 ( MOCK )
  const molecules = [
    {
      name: "add_0",
      before: "before_add_0.sdf",
      after: "after_add_0.sdf",
      id: 1,
      statistics_before: {
        num_atoms: 28,
        num_bonds: 28,
        num_rings: 1,
        num_H_donors: 4,
        num_H_acceptors: 5,
        num_rotatable_bonds: 7,
        QED: 0.39576499672758714,
        SA: 0.76,
        LogP: 0.5856999999999999,
      },
      statistics_after: {
        num_atoms: 36,
        num_bonds: 37,
        num_rings: 2,
        num_H_donors: 4,
        num_H_acceptors: 6,
        num_rotatable_bonds: 10,
        QED: 0.3667695443608393,
        SA: 0.77,
        LogP: 2.0349,
      },
    },
    {
      name: "add_1",
      before: "before_add_1.sdf",
      after: "after_add_1.sdf",
      id: 2,
      statistics_before: {
        num_atoms: 18,
        num_bonds: 18,
        num_rings: 1,
        num_H_donors: 2,
        num_H_acceptors: 3,
        num_rotatable_bonds: 4,
        QED: 0.6177558493971933,
        SA: 0.87,
        LogP: 1.0635999999999992,
      },
      statistics_after: {
        num_atoms: 19,
        num_bonds: 19,
        num_rings: 1,
        num_H_donors: 2,
        num_H_acceptors: 3,
        num_rotatable_bonds: 4,
        QED: 0.6520638160749629,
        SA: 0.86,
        LogP: 1.7169999999999996,
      },
    },
    {
      name: "del_0",
      before: "before_del_0.sdf",
      after: "after_del_0.sdf",
      id: 3,
      statistics_before: {
        num_atoms: 40,
        num_bonds: 41,
        num_rings: 2,
        num_H_donors: 4,
        num_H_acceptors: 6,
        num_rotatable_bonds: 10,
        QED: 0.19513088951938565,
        SA: 0.72,
        LogP: 2.5912999999999995,
      },
      statistics_after: {
        num_atoms: 36,
        num_bonds: 37,
        num_rings: 2,
        num_H_donors: 4,
        num_H_acceptors: 6,
        num_rotatable_bonds: 10,
        QED: 0.3667695443608393,
        SA: 0.77,
        LogP: 2.0349,
      },
    },
    {
      name: "del_1",
      before: "before_del_1.sdf",
      after: "after_del_1.sdf",
      id: 4,
      statistics_before: {
        num_atoms: 37,
        num_bonds: 39,
        num_rings: 3,
        num_H_donors: 3,
        num_H_acceptors: 6,
        num_rotatable_bonds: 11,
        QED: 0.35889924030885445,
        SA: 0.75,
        LogP: 2.875,
      },
      statistics_after: {
        num_atoms: 34,
        num_bonds: 36,
        num_rings: 3,
        num_H_donors: 3,
        num_H_acceptors: 6,
        num_rotatable_bonds: 10,
        QED: 0.4107814551480482,
        SA: 0.79,
        LogP: 1.8503999999999996,
      },
    },
    {
      name: "del_2",
      before: "before_del_2.sdf",
      after: "after_del_2.sdf",
      id: 5,
      statistics_before: {
        num_atoms: 25,
        num_bonds: 26,
        num_rings: 2,
        num_H_donors: 3,
        num_H_acceptors: 5,
        num_rotatable_bonds: 7,
        QED: 0.6440268538776837,
        SA: 0.81,
        LogP: 1.218799999999999,
      },
      statistics_after: {
        num_atoms: 22,
        num_bonds: 23,
        num_rings: 2,
        num_H_donors: 2,
        num_H_acceptors: 4,
        num_rotatable_bonds: 6,
        QED: 0.7881564244389874,
        SA: 0.82,
        LogP: 1.5205999999999995,
      },
    },
    {
      name: "rep_0",
      before: "before_rep_0.sdf",
      after: "after_rep_0.sdf",
      id: 6,
      statistics_before: {
        num_atoms: 36,
        num_bonds: 37,
        num_rings: 2,
        num_H_donors: 4,
        num_H_acceptors: 6,
        num_rotatable_bonds: 10,
        QED: 0.3667695443608393,
        SA: 0.77,
        LogP: 2.0349,
      },
      statistics_after: {
        num_atoms: 34,
        num_bonds: 35,
        num_rings: 2,
        num_H_donors: 4,
        num_H_acceptors: 6,
        num_rotatable_bonds: 9,
        QED: 0.4119489508108998,
        SA: 0.77,
        LogP: 1.5525000000000002,
      },
    },
    {
      name: "rep_1",
      before: "before_rep_1.sdf",
      after: "after_rep_1.sdf",
      id: 7,
      statistics_before: {
        num_atoms: 36,
        num_bonds: 37,
        num_rings: 2,
        num_H_donors: 4,
        num_H_acceptors: 6,
        num_rotatable_bonds: 10,
        QED: 0.3667695443608393,
        SA: 0.77,
        LogP: 2.0349,
      },
      statistics_after: {
        num_atoms: 36,
        num_bonds: 37,
        num_rings: 2,
        num_H_donors: 4,
        num_H_acceptors: 6,
        num_rotatable_bonds: 10,
        QED: 0.3564530636525713,
        SA: 0.77,
        LogP: 1.7561999999999989,
      },
    },
    {
      name: "rep_2",
      before: "before_rep_2.sdf",
      after: "after_rep_2.sdf",
      id: 8,
      statistics_before: {
        num_atoms: 21,
        num_bonds: 21,
        num_rings: 1,
        num_H_donors: 3,
        num_H_acceptors: 4,
        num_rotatable_bonds: 7,
        QED: 0.3938922242578155,
        SA: 0.75,
        LogP: 0.8220999999999992,
      },
      statistics_after: {
        num_atoms: 21,
        num_bonds: 21,
        num_rings: 1,
        num_H_donors: 3,
        num_H_acceptors: 4,
        num_rotatable_bonds: 8,
        QED: 0.3736372424424016,
        SA: 0.81,
        LogP: 0.698499999999999,
      },
    },
  ];
  const randomFourDifferentMolecules = async (): Promise<MoleculeM[]> => {
    const shuffled = [...molecules].sort(() => 0.5 - Math.random());
    console.log("shuffled", shuffled);
    const preMolecules = shuffled.slice(0, 4);
    const res: MoleculeM[] = [];

    await Promise.all(
      preMolecules.map(async (molecule) => {
        const url = "./examples/" + molecule.name + "/" + molecule.before;
        const response = await fetch(url);
        const sdfText = await response.text();
        const resMolecule: MoleculeM = {
          id: molecule.id,
          smiles: sdfText,
          name: molecule.name,
          statisticsIndexs: molecule.statistics_before,
          isLiked: false,
          isDisliked: false,
          isSubmited: false,
        };
        console.log("resMolecule", resMolecule);
        res.push(resMolecule);
      })
    );

    console.log("res", res);
    return res;
  };

  const moleculesResponse = await randomFourDifferentMolecules();
  console.log("moleculesResponse", moleculesResponse);
  const response: ChatRecommendationM = {
    id: 1,
    replyId: messageId,
    isUser: false,
    context: [],
    molecules: moleculesResponse,
  };
  return response;
}
