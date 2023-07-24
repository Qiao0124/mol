export interface statisticsIndexsM {
  num_atoms: number;
  num_bonds: number;
  num_rings: number;
  num_H_donors: number;
  num_H_acceptors: number;
  num_rotatable_bonds: number;
  QED: number;
  SA: number;
  LogP: number;
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
  type: string;
  pdbId?: number; // 对应咬合的蛋白质的Id
  name: string;
  isLiked: boolean;
  isDisliked: boolean;
  isSubmited: boolean; // 在分子推送中，用户是否已经提交了偏好反馈
  statisticsIndexs: statisticsIndexsM;
}

export interface ChatRecommendationM {
  id: number;
  molecules: MoleculeM[];
  likedMolecules: MoleculeM[]; // 用于 isUser == true
  dislikedMolecules: MoleculeM[]; // 用于 isUser == true
  canSubmit: boolean;
  replyId?: number | null;
  isUser: boolean;
  context?: string[] | null;
}

// 发送对话后的响应模型
export interface SendMessageM {
  isOk: boolean;
  newContext: any[]; // context 类型未定
  reply: string;
  chatId: number;
}
