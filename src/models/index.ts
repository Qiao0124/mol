export interface statisticsIndexsM {
  num_atoms: number;
  num_bonds: number;
  num_rings: number;
  num_benzene_rings: number;
  Vina: number;
  Lipinski: number;
  QED: number;
  SA: number;
}

export interface ChatMessageM {
  id: number;
  message: string;
  replyId: number | null;
  chatId: number;
  originalMoleculeSmiles: string;
  lastMoleculeSmiles: string | null;
  replyMoleculeSmiles: string | null;
  isUser: boolean;
  isFinished: boolean;
  context: string[];
}

export interface MoleculeM {
  id: number;
  smiles: string;
  url: string;
  pngUrl?: string;
  statisticsUrl?: string;
  type: string;
  pdbId?: number; // 对应咬合的蛋白质的Id
  name: string;
  isLiked: boolean;
  isDisliked: boolean;
  isSubmited: boolean; // 在分子推送中，用户是否已经提交了偏好反馈
  statisticsIndexs?: Metrics;
}

export interface ChatRecommendationM {
  id: number;
  molecules: MoleculeM[];
  likedMolecules: MoleculeM[]; // 用于 isUser == true
  dislikedMolecules: MoleculeM[]; // 用于 isUser == true
  canSubmit: boolean;
  replyId?: number | null;
  isUser: boolean;
  isAiGenerating?: boolean;
  isAiGenerated?: boolean;
  canScoreAiEffect?: boolean;
  score?: number;
  context?: string[] | null;
  readyToCheck?: boolean;
}

// 发送对话后的响应模型
export interface SendMessageM {
  isOk: boolean;
  newContext: any[]; // context 类型未定
  reply: string;
  chatId: number;
}

/////// api module //////
export interface GetPdbsResM {
  pdb_list: PdbList[];
  token: string;
}

export interface PdbList {
  id: number;
  name: string;
  url: string;
}

export interface ConfirmPdbReqM {
  timestamp: string;
  pdb_id: string;
  id: string;
}

export interface ConfirmPdbResM {
  msg: string;
}

export interface SubmitMolPreferenceReqM {
  timestamp: string;
  pdb_id: string;
  liked_ids: number[];
  disliked_ids: number[];
}

export interface SubmitMolPreferenceResM {
  check_prompt: boolean;
  next_molecules: NextMolecule[];
}

export interface GetSdfsAiGeneratedResM {
  next_molecules: NextMolecule[];
}

export interface NextMolecule {
  id: number;
  metrics: Metrics;
  png_url: string;
  smiles: string;
  url: string;
}

export interface Metrics {
  Lipinski: number;
  NumAtoms: number;
  NumBenzeneRings: number;
  NumBonds: number;
  NumRings: number;
  QED: number;
  SA: number;
  Vina: number;
}
