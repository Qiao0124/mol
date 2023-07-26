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
  const pdb = {
    id: 1,
    type: "pdb",
    url: "/PDB_and_ligands/PDB-2v3r_and_ligands/2v3r_A_rec_1dy4_snp_lig_tt_docked_1_pocket10.pdb",
    pdbId: 1,
  };

  const molecules = [
    {
      id: 2,
      type: "sdf",
      url: "/PDB_and_ligands/PDB-2v3r_and_ligands/2023-05-28-20-52-54_ligand_8_of_pocket_4.sdf",
      name: "/PDB_and_ligands/PDB-2v3r_and_ligands/2023-05-28-20-52-54_ligand_8_of_pocket_4",
      pdbId: 1,
    },
    {
      id: 3,
      type: "sdf",
      url: "/PDB_and_ligands/PDB-2v3r_and_ligands/2023-05-28-20-52-58_ligand_9_of_pocket_4.sdf",
      name: "/PDB_and_ligands/PDB-2v3r_and_ligands/2023-05-28-20-52-58_ligand_9_of_pocket_4",
      pdbId: 1,
    },
    {
      id: 4,
      type: "sdf",
      url: "/PDB_and_ligands/PDB-2v3r_and_ligands/2023-05-28-20-54-04_ligand_23_of_pocket_4.sdf",
      name: "/PDB_and_ligands/PDB-2v3r_and_ligands/2023-05-28-20-54-04_ligand_23_of_pocket_4",
      pdbId: 1,
    },
    {
      id: 5,
      type: "sdf",
      url: "/PDB_and_ligands/PDB-2v3r_and_ligands/2023-05-28-21-03-15_ligand_64_of_pocket_4.sdf",
      name: "/PDB_and_ligands/PDB-2v3r_and_ligands/2023-05-28-21-03-15_ligand_64_of_pocket_4",
      pdbId: 1,
    },
    {
      id: 6,
      type: "sdf",
      url: "/PDB_and_ligands/PDB-2v3r_and_ligands/2023-05-28-21-04-02_ligand_76_of_pocket_4.sdf",
      name: "/PDB_and_ligands/PDB-2v3r_and_ligands/2023-05-28-21-04-02_ligand_76_of_pocket_4",
      pdbId: 1,
    },
    {
      id: 7,
      type: "sdf",
      url: "/PDB_and_ligands/PDB-2v3r_and_ligands/2023-05-28-21-04-20_ligand_81_of_pocket_4.sdf",
      name: "/PDB_and_ligands/PDB-2v3r_and_ligands/2023-05-28-21-04-20_ligand_81_of_pocket_4",
      pdbId: 1,
    },
    {
      id: 8,
      type: "sdf",
      url: "/PDB_and_ligands/PDB-2v3r_and_ligands/2023-05-28-21-05-47_ligand_98_of_pocket_4.sdf",
      name: "/PDB_and_ligands/PDB-2v3r_and_ligands/2023-05-28-21-05-47_ligand_98_of_pocket_4",
      pdbId: 1,
    },
    {
      id: 9,
      type: "sdf",
      url: "/PDB_and_ligands/PDB-2v3r_and_ligands/2023-05-28-21-05-50_ligand_99_of_pocket_4.sdf",
      name: "/PDB_and_ligands/PDB-2v3r_and_ligands/2023-05-28-21-05-50_ligand_99_of_pocket_4",
      pdbId: 1,
    },
    {
      id: 10,
      type: "sdf",
      url: "/PDB_and_ligands/PDB-2v3r_and_ligands/2023-06-26-14-24-32_ligand_21_of_pocket_4.sdf",
      name: "/PDB_and_ligands/PDB-2v3r_and_ligands/2023-06-26-14-24-32_ligand_21_of_pocket_4",
      pdbId: 1,
    },
    {
      id: 11,
      type: "sdf",
      url: "/PDB_and_ligands/PDB-2v3r_and_ligands/2023-06-26-14-26-17_ligand_28_of_pocket_4.sdf",
      name: "/PDB_and_ligands/PDB-2v3r_and_ligands/2023-06-26-14-26-17_ligand_28_of_pocket_4",
      pdbId: 1,
    },
    {
      id: 12,
      type: "sdf",
      url: "/PDB_and_ligands/PDB-2v3r_and_ligands/11.sdf",
      name: "/PDB_and_ligands/PDB-2v3r_and_ligands/11",
      pdbId: 1,
    },
    {
      id: 13,
      type: "sdf",
      url: "/PDB_and_ligands/PDB-2v3r_and_ligands/12.sdf",
      name: "/PDB_and_ligands/PDB-2v3r_and_ligands/12",
      pdbId: 1,
    },
  ];
  const randomSixDifferentMolecules = async (): Promise<MoleculeM[]> => {
    const shuffled = [...molecules].sort(() => 0.5 - Math.random());
    console.log("shuffled", shuffled);
    const preMolecules = shuffled.slice(0, 6);
    const res: MoleculeM[] = [];
    const statisticsIndexs = {
      num_atoms: 34,
      num_bonds: 36,
      num_rings: 3,
      num_benzene_rings: 2,
      Vina: -1,
      Lipinski: 2,
      QED: 0.4107814551480482,
      SA: 0.79,
    };

    await Promise.all(
      preMolecules.map(async (molecule) => {
        const response = await fetch(molecule.url);
        const sdfText = await response.text();
        const resMolecule: MoleculeM = {
          id: molecule.id,
          smiles: sdfText,
          name: molecule.name,
          url: molecule.url,
          pngUrl: molecule.name + ".png",
          statisticsUrl: molecule.name + ".json",
          type: molecule.type,
          statisticsIndexs: statisticsIndexs,
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

  const moleculesResponse = await randomSixDifferentMolecules();
  console.log("moleculesResponse", moleculesResponse);
  const response: ChatRecommendationM = {
    id: 1,
    replyId: messageId,
    isUser: false,
    canSubmit: true,
    context: [],
    molecules: moleculesResponse,
    likedMolecules: [],
    dislikedMolecules: [], 
  };
  return response;
}

export async function reqGetPdbs(): Promise<MoleculeM[]> {
  const pdbs = [
    {
      id: 1,
      type: "pdb",
      url: "/PDB_and_ligands/PDB-2v3r_and_ligands/2V3R.pdb",
      name: "/PDB_and_ligands/PDB-2v3r_and_ligands/2V3R",
      pdbId: 1,
    },
  ];

  const getPdbs = async (): Promise<MoleculeM[]> => {
    const res: MoleculeM[] = [];

    await Promise.all(
      pdbs.map(async (molecule) => {
        const statisticsIndexs = {
          num_atoms: 34,
          num_bonds: 36,
          num_rings: 3,
          num_benzene_rings: 2,
          Vina: -1,
          Lipinski: 2,
          QED: 0.4107814551480482,
          SA: 0.79,
        };
        const response = await fetch(molecule.url);
        const sdfText = await response.text();
        const resMolecule: MoleculeM = {
          id: molecule.id,
          smiles: sdfText,
          name: molecule.url,
          url: molecule.url,
          type: molecule.type,
          statisticsIndexs: statisticsIndexs,
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
  const pdbsReturn = await getPdbs();
  return pdbsReturn;
}

export async function reqGetStatistics(url: string): Promise<any> {
  const response = await fetch(url);
  const json = await response.json();
  return json;
}
