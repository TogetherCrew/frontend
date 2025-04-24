export type JwtIdentityType = {
  _id: string;
  provider: string;
  id: string;
}

export type JwtPayloadType = {
  sub: {
    communities: string[];
    createdAt: string;
    updatedAt: string;
    tcaAt: string;
    identities: JwtIdentityType[];
    id: string;
  },
  iat: number;
  exp: number;
  type: string;
}