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
  name: string;
  isLiked: boolean;
  isDisliked: boolean;
  statisticsIndexs: statisticsIndexsM;
}

export interface ChatRecommendationM {
  id: number;
  molecules: MoleculeM[];
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
};