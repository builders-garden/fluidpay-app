export interface SimpleUser {
  id: number;
  address: string;
  username: string;
}

export interface DBUser {
  address: string;
  avatarUrl: string | null;
  createdAt: string;
  displayName: string;
  id: number;
  isDiscoverable: boolean;
  subscription: string | null;
  updatedAt: string;
  username: string;
  token: string;
}

export interface DBTransaction {
  amount: number;
  createdAt: string;
  description: string;
  id: number;
  payeeId: number;
  payerId: number;
  payer: DBUser;
  payee: DBUser;
}
