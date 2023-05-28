interface RDKit {
  // 在这里添加你需要使用的 RDKit 相关方法和属性的类型声明
  get_mol(s: string): any;
  get_qmol(s: string): any;
  // 其他方法和属性...
}

declare global {
  interface Window {
    RDKit: RDKit;
  }
}
