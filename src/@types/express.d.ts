declare namespace Express {
  export interface Request {
    // Ele não sobrescreve o método, somente anexa
    user: {
      id: string;
    };
  }
}
