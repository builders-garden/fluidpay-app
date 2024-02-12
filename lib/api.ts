import ky from "ky";

/**
 * AUTHENTICATION API
 */

export type AuthNonceResponse = {
  message: string;
  nonce: number;
};

export type AuthSignInBody = {
  address: string;
  signature: string;
  nonce: number;
};

export type AuthSignResponse = {
  message: string;
  nonce: number;
};

/**
 * @dev get authentication session nonce, to init auth process
 * @returns {Promise<AuthNonceResponse>} the nonce response from server
 */
export const getAuthNonce = async (): Promise<AuthNonceResponse> =>
  ky.get("http://localhost:3000/auth/nonce").json<AuthNonceResponse>();

export const signIn = async (body: AuthSignInBody): Promise<AuthSignResponse> =>
  ky
    .post("http://localhost:3000/auth/sign", { json: body })
    .json<AuthSignResponse>();

/**
 * PAYMENT API
 */

export type CreatePaymentBody = {
  payerId: number;
  payeeId: number;
  amount: number;
  description: string;
  createdAt: string;
};

export type PaymentByIdParams = {
  id: number;
};

export type PaymentByIdResponse = {
  id: number;
  payerId: number;
  payeeId: number;
  amount: number;
  description: string;
  createdAt: string;
};

export type PaymentsQueryResponse = {
  id: number;
  payerId: number;
  payeeId: number;
  amount: number;
  description: string;
  createdAt: string;
};

export type PaymentsQuery = {
  withProfileId?: number;
  fromDate?: string;
  toDate?: string;
  direction?: string;
};

export const createPayment = async (
  body: CreatePaymentBody
): Promise<PaymentByIdResponse> =>
  ky
    .post("http://localhost:3000/payments", { json: body })
    .json<PaymentByIdResponse>();

export const getPaymentById = async (
  params: PaymentByIdParams
): Promise<PaymentByIdResponse> =>
  ky
    .get(`http://localhost:3000/payments/${params.id}`)
    .json<PaymentByIdResponse>();

export const getPayments = async (
  query: PaymentsQuery
): Promise<PaymentsQueryResponse[]> =>
  ky.get("http://localhost:3000/payments", { searchParams: query }).json();

/**
 * USERS API
 */
export type UsersMeResponse = {
  id: number;
  address: string;
  username: string;
  displayName: string;
  avatarUrl: string;
};

export type UsersByIdUsernameOrAddressResponse = {
  id: number;
  address: string;
  username: string;
  displayName: string;
  avatarUrl: string;
};

export type UpdateMeBody = {
  username?: string;
  displayName?: string;
  avatarUrl?: string;
  isDiscoverable?: boolean;
};

export type UsersByIdUsernameOrAddressParams = {
  idOrUsernameOrAddress: string;
};

export type GetUsersQuery = {
  query?: string;
  limit?: number;
  page?: number;
};

export const getMe = async (): Promise<UsersMeResponse> =>
  ky.get("http://localhost:3000/users/me").json<UsersMeResponse>();

export const updateMe = async (body: UpdateMeBody): Promise<UsersMeResponse> =>
  ky
    .put("http://localhost:3000/users/me", { json: body })
    .json<UsersMeResponse>();

export const getUserByIdUsernameOrAddress = async (
  params: UsersByIdUsernameOrAddressParams
): Promise<UsersByIdUsernameOrAddressResponse> =>
  ky
    .get(`http://localhost:3000/users/${params.idOrUsernameOrAddress}`)
    .json<UsersByIdUsernameOrAddressResponse>();

export const getUsers = async (
  query: GetUsersQuery
): Promise<UsersByIdUsernameOrAddressResponse[]> =>
  ky.get("http://localhost:3000/users", { searchParams: query }).json();
