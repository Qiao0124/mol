import axios from "axios";
import * as CONF from "@/openai-conf";
import requests from "./request";
import { AxiosPromise } from "axios";
import * as models from "@/models";
import Qs from "qs";

export async function reqSendMessage(
  message: string,
  chatId: number,
  context = []
): Promise<models.SendMessageM> {
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

// export async function reqMolecularRecommend(
//   likedMolecularIds: number[] = [],
//   dislikedMolecularIds: number[] = [],
//   messageId: number | null = null
// ): Promise<models.ChatRecommendationM> {
//   // TODO: 请在此处实现分子推荐的请求
//   // const url = "example.com";
//   // const data = {
//   //   liked: likedMolecularIds,
//   //   messageId: messageId,
//   // };
//   // const headers = {
//   //   "Content-Type": "application/json",
//   // };

//   // try {
//   //   const response: ChatRecommendationM = await axios.post(url, data, {
//   //     headers,
//   //   });
//   //   return response;
//   // } catch (error) {
//   //   console.error("Error:", error);
//   //   return {
//   //     error: error,
//   //   };
//   // }
//   // TODO: 请在此处实现分子推荐的请求 ( MOCK )
//   const pdb = {
//     id: 1,
//     type: "pdb",
//     url: "/PDB_and_ligands/PDB-2v3r_and_ligands/2v3r_A_rec_1dy4_snp_lig_tt_docked_1_pocket10.pdb",
//     pdbId: 1,
//   };

//   const molecules = [
//     {
//       id: 2,
//       type: "sdf",
//       url: "/PDB_and_ligands/PDB-2v3r_and_ligands/2023-05-28-20-52-54_ligand_8_of_pocket_4.sdf",
//       name: "/PDB_and_ligands/PDB-2v3r_and_ligands/2023-05-28-20-52-54_ligand_8_of_pocket_4",
//       pdbId: 1,
//     },
//     {
//       id: 3,
//       type: "sdf",
//       url: "/PDB_and_ligands/PDB-2v3r_and_ligands/2023-05-28-20-52-58_ligand_9_of_pocket_4.sdf",
//       name: "/PDB_and_ligands/PDB-2v3r_and_ligands/2023-05-28-20-52-58_ligand_9_of_pocket_4",
//       pdbId: 1,
//     },
//     {
//       id: 4,
//       type: "sdf",
//       url: "/PDB_and_ligands/PDB-2v3r_and_ligands/2023-05-28-20-54-04_ligand_23_of_pocket_4.sdf",
//       name: "/PDB_and_ligands/PDB-2v3r_and_ligands/2023-05-28-20-54-04_ligand_23_of_pocket_4",
//       pdbId: 1,
//     },
//     {
//       id: 5,
//       type: "sdf",
//       url: "/PDB_and_ligands/PDB-2v3r_and_ligands/2023-05-28-21-03-15_ligand_64_of_pocket_4.sdf",
//       name: "/PDB_and_ligands/PDB-2v3r_and_ligands/2023-05-28-21-03-15_ligand_64_of_pocket_4",
//       pdbId: 1,
//     },
//     {
//       id: 6,
//       type: "sdf",
//       url: "/PDB_and_ligands/PDB-2v3r_and_ligands/2023-05-28-21-04-02_ligand_76_of_pocket_4.sdf",
//       name: "/PDB_and_ligands/PDB-2v3r_and_ligands/2023-05-28-21-04-02_ligand_76_of_pocket_4",
//       pdbId: 1,
//     },
//     {
//       id: 7,
//       type: "sdf",
//       url: "/PDB_and_ligands/PDB-2v3r_and_ligands/2023-05-28-21-04-20_ligand_81_of_pocket_4.sdf",
//       name: "/PDB_and_ligands/PDB-2v3r_and_ligands/2023-05-28-21-04-20_ligand_81_of_pocket_4",
//       pdbId: 1,
//     },
//     {
//       id: 8,
//       type: "sdf",
//       url: "/PDB_and_ligands/PDB-2v3r_and_ligands/2023-05-28-21-05-47_ligand_98_of_pocket_4.sdf",
//       name: "/PDB_and_ligands/PDB-2v3r_and_ligands/2023-05-28-21-05-47_ligand_98_of_pocket_4",
//       pdbId: 1,
//     },
//     {
//       id: 9,
//       type: "sdf",
//       url: "/PDB_and_ligands/PDB-2v3r_and_ligands/2023-05-28-21-05-50_ligand_99_of_pocket_4.sdf",
//       name: "/PDB_and_ligands/PDB-2v3r_and_ligands/2023-05-28-21-05-50_ligand_99_of_pocket_4",
//       pdbId: 1,
//     },
//     {
//       id: 10,
//       type: "sdf",
//       url: "/PDB_and_ligands/PDB-2v3r_and_ligands/2023-06-26-14-24-32_ligand_21_of_pocket_4.sdf",
//       name: "/PDB_and_ligands/PDB-2v3r_and_ligands/2023-06-26-14-24-32_ligand_21_of_pocket_4",
//       pdbId: 1,
//     },
//     {
//       id: 11,
//       type: "sdf",
//       url: "/PDB_and_ligands/PDB-2v3r_and_ligands/2023-06-26-14-26-17_ligand_28_of_pocket_4.sdf",
//       name: "/PDB_and_ligands/PDB-2v3r_and_ligands/2023-06-26-14-26-17_ligand_28_of_pocket_4",
//       pdbId: 1,
//     },
//     {
//       id: 12,
//       type: "sdf",
//       url: "/PDB_and_ligands/PDB-2v3r_and_ligands/11.sdf",
//       name: "/PDB_and_ligands/PDB-2v3r_and_ligands/11",
//       pdbId: 1,
//     },
//     {
//       id: 13,
//       type: "sdf",
//       url: "/PDB_and_ligands/PDB-2v3r_and_ligands/12.sdf",
//       name: "/PDB_and_ligands/PDB-2v3r_and_ligands/12",
//       pdbId: 1,
//     },
//   ];
//   const randomSixDifferentMolecules = async (): Promise<models.MoleculeM[]> => {
//     const shuffled = [...molecules].sort(() => 0.5 - Math.random());
//     console.log("shuffled", shuffled);
//     const preMolecules = shuffled.slice(0, 6);
//     const res: models.MoleculeM[] = [];
//     const statisticsIndexs = {
//       num_atoms: 34,
//       num_bonds: 36,
//       num_rings: 3,
//       num_benzene_rings: 2,
//       Vina: -1,
//       Lipinski: 2,
//       QED: 0.4107814551480482,
//       SA: 0.79,
//     };

//     await Promise.all(
//       preMolecules.map(async (molecule) => {
//         const response = await fetch(molecule.url);
//         const sdfText = await response.text();
//         const resMolecule: models.MoleculeM = {
//           id: molecule.id,
//           smiles: sdfText,
//           name: molecule.name,
//           url: molecule.url,
//           pngUrl: molecule.name + ".png",
//           statisticsUrl: molecule.name + ".json",
//           type: molecule.type,
//           statisticsIndexs: statisticsIndexs,
//           isLiked: false,
//           isDisliked: false,
//           isSubmited: false,
//         };
//         console.log("resMolecule", resMolecule);
//         res.push(resMolecule);
//       })
//     );

//     console.log("res", res);
//     return res;
//   };

//   const moleculesResponse = await randomSixDifferentMolecules();
//   console.log("moleculesResponse", moleculesResponse);
//   const response: models.ChatRecommendationM = {
//     id: 1,
//     replyId: messageId,
//     isUser: false,
//     canSubmit: true,
//     context: [],
//     molecules: moleculesResponse,
//     readyToCheck: false,
//     likedMolecules: [],
//     dislikedMolecules: [],
//   };
//   return response;
// }

// export async function reqGetPdbs(): Promise<models.MoleculeM[]> {
//   const pdbs = [
//     {
//       id: 1,
//       type: "pdb",
//       url: "/PDB_and_ligands/PDB-2v3r_and_ligands/2V3R.pdb",
//       name: "/PDB_and_ligands/PDB-2v3r_and_ligands/2V3R",
//       pdbId: 1,
//     },
//   ];

//   const getPdbs = async (): Promise<models.MoleculeM[]> => {
//     const res: models.MoleculeM[] = [];

//     await Promise.all(
//       pdbs.map(async (molecule) => {
//         const statisticsIndexs = {
//           num_atoms: 34,
//           num_bonds: 36,
//           num_rings: 3,
//           num_benzene_rings: 2,
//           Vina: -1,
//           Lipinski: 2,
//           QED: 0.4107814551480482,
//           SA: 0.79,
//         };
//         const response = await fetch(molecule.url);
//         const sdfText = await response.text();
//         const resMolecule: models.MoleculeM = {
//           id: molecule.id,
//           smiles: sdfText,
//           name: molecule.url,
//           url: molecule.url,
//           type: molecule.type,
//           statisticsIndexs: statisticsIndexs,
//           isLiked: false,
//           isDisliked: false,
//           isSubmited: false,
//         };
//         console.log("resMolecule", resMolecule);
//         res.push(resMolecule);
//       })
//     );

//     console.log("res", res);
//     return res;
//   };
//   const pdbsReturn = await getPdbs();
//   return pdbsReturn;
// }

export async function reqGetStatistics(url: string): Promise<any> {
  const response = await fetch(url);
  const json = await response.json();
  return json;
}

/// api ///
export async function reqGetPdbs(): Promise<models.MoleculeM[]> {
  const res = await requests({
    url: `api/pdb`,
    method: "get",
  });
  const rawPdbs: models.GetPdbsResM = res.data;
  const pdbs: models.MoleculeM[] = [];
  rawPdbs.pdb_list.forEach((pdb) => {
    const pdbMolecule: models.MoleculeM = {
      id: pdb.id,
      smiles: "",
      name: pdb.name,
      url: pdb.url,
      type: "pdb",
      isLiked: false,
      isDisliked: false,
      isSubmited: false,
    };
    pdbs.push(pdbMolecule);
  });
  return pdbs;
}

export async function reqConfirmPdb(
  pdbId: number,
  timestamp: string,
  pdb = "2V3R"
): Promise<boolean> {
  const params: models.ConfirmPdbReqM = {
    timestamp,
    id: pdbId,
    pdb,
  };
  const res = await requests({
    url: `api/confirmpdb`,
    method: "get",
    data: params,
  });
  return true;
}

export async function reqSubmitMolPreference(
  pdb_id: number,
  timestamp: string,
  likedMolecularIds: number[] = [],
  dislikedMolecularIds: number[] = [],
  messageId: number | null = null
): Promise<models.ChatRecommendationM> {
  const params: models.SubmitMolPreferenceReqM = {
    pdb_id: pdb_id,
    liked_ids: likedMolecularIds,
    disliked_ids: dislikedMolecularIds,
    timestamp: timestamp,
  };
  const res = await requests({
    url: `api/getMoleculeList`,
    method: "get",
    data: params,
  });
  const submitMolPreferenceRes: models.SubmitMolPreferenceResM = res.data;
  const molecules: models.MoleculeM[] = [];
  submitMolPreferenceRes.next_molecules.forEach((rawMolecule) => {
    const molecule: models.MoleculeM = {
      id: rawMolecule.id,
      smiles: rawMolecule.smiles,
      name: "example",
      url: rawMolecule.url,
      statisticsIndexs: rawMolecule.metrics,
      pngUrl: rawMolecule.png_url,
      type: "sdf",
      isLiked: false,
      isDisliked: false,
      isSubmited: false,
    };
    molecules.push(molecule);
  });
  const response: models.ChatRecommendationM = {
    id: 1,
    replyId: 1,
    isUser: false,
    canSubmit: true,
    context: [],
    readyToCheck: submitMolPreferenceRes.check_prompt,
    molecules: molecules,
    likedMolecules: [],
    dislikedMolecules: [],
  };
  return response;
}

export async function reqGetSdfsAiGenerated(
  timestamp: string
): Promise<models.ChatRecommendationM> {
  const params = {
    timestamp: timestamp,
  };
  const res = await requests({
    url: `api/getMoleculeList/ai`,
    method: "get",
    params: params,
  });
  const submitMolPreferenceRes: models.GetSdfsAiGeneratedResM = res.data;
  const molecules: models.MoleculeM[] = [];
  submitMolPreferenceRes.molecules.forEach((rawMolecule) => {
    const molecule: models.MoleculeM = {
      id: rawMolecule.id,
      smiles: rawMolecule.smiles,
      name: "example",
      url: rawMolecule.url,
      pngUrl: rawMolecule.png_url,
      statisticsIndexs: rawMolecule.metrics,
      type: "sdf",
      isLiked: false,
      isDisliked: false,
      isSubmited: false,
    };
    molecules.push(molecule);
  });
  return {
    id: 1,
    replyId: 1,
    isUser: false,
    isAiGenerated: true,
    canSubmit: true,
    canScoreAiEffect: true,
    score: 0,
    context: [],
    readyToCheck: false,
    molecules: molecules,
    likedMolecules: [],
    dislikedMolecules: [],
  };
}

export async function reqScoreEffect(score: number, timestamp: string) {
  const params = {
    score: score,
    timestamp: timestamp,
  };
  await requests({
    url: `api/feedback`,
    method: "get",
    params: params,
  });
  return true;
}
