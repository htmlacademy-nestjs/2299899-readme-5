export interface RefreshToken {
  id?: string;
  tokenId: string;
  userId: string;
  createdAt: Date;
  expiresIn: Date;
}
