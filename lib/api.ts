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

/**
 * GROUP API
 */
export type CreateGroupBody = {
  name: string;
  memberIds: number[];
};

export type UpdateGroupParams = {
  id: number;
};

export type AddUsersToGroupBody = {
  memberIds?: number[];
};

export type UpdateGroupBody = {
  name?: string;
  memberIds?: number[];
};

export type GetGroupByIdParams = {
  id: number;
};

export type GetUserExpensesInGroupParams = {
  id: number;
};

export type GetGroupExpensesByIdParams = {
  id: number;
};

export type GetExpenseByIdParams = {
  expenseId: number;
};

export type GetGroupByIdResponse = {
  id: number;
  name: string;
  creatorId: number;
  members: {
    id: number;
    displayName: string;
    avatarUrl: string;
  }[];
};

export type GetGroupsQueryResponse = {
  id: number;
  name: string;
  members: {
    id: number;
    displayName: string;
    avatarUrl: string;
  }[];
};

export type CreateGroupExpenseBody = {
  paidById: number;
  amount: number;
  description: string;
  category: string;
  date: string;
  splitAmong: {
    userId: number;
    amount: number;
    type: 'PERCENTAGE' | 'AMOUNT';
  }[];
};

export type UpdateGroupExpenseBody = {
  paidById: number;
  amount: number;
  description: string;
  splitAmong: {
    userId: number;
    amount: number;
    type: 'PERCENTAGE' | 'AMOUNT';
  }[];
};

export const getGroupById = async (params: GetGroupByIdParams): Promise<GetGroupByIdResponse> =>
  ky.get(`http://localhost:3000/groups/${params.id}`).json();

export const getGroups = async (): Promise<GetGroupsQueryResponse[]> =>
  ky.get("http://localhost:3000/groups").json();

export const createGroup = async (body: CreateGroupBody): Promise<GetGroupByIdResponse> =>
  ky.post("http://localhost:3000/groups", { json: body }).json();

export const addUsersToGroup = async (params: UpdateGroupParams, body: AddUsersToGroupBody): Promise<{ message: string }> =>
  ky.post(`http://localhost:3000/groups/${params.id}/users`, { json: body }).json();

export const removeUsersFromGroup = async (params: UpdateGroupParams, body: AddUsersToGroupBody): Promise<{ message: string }> =>
  ky.delete(`http://localhost:3000/groups/${params.id}/users`, { json: body }).json();

export const updateGroup = async (params: UpdateGroupParams, body: UpdateGroupBody): Promise<GetGroupByIdResponse> =>
  ky.post(`http://localhost:3000/groups/${params.id}`, { json: body }).json();

export const deleteGroup = async (params: GetGroupByIdParams): Promise<GetGroupByIdResponse> =>
  ky.delete(`http://localhost:3000/groups/${params.id}`).json();

export const deleteGroupExpense = async (params: GetExpenseByIdParams): Promise<any> =>
  ky.delete(`http://localhost:3000/groups/${params.expenseId}/expenses/${params.expenseId}`).json();

export const getGroupExpenses = async (params: GetGroupExpensesByIdParams): Promise<any> =>
  ky.get(`http://localhost:3000/groups/${params.id}/expenses`).json();

export const getGroupExpenseById = async (params: GetExpenseByIdParams): Promise<any> =>
  ky.get(`http://localhost:3000/groups/${params.expenseId}/expenses/${params.expenseId}`).json();

export const getGroupBalances = async (params: GetUserExpensesInGroupParams): Promise<any> =>
  ky.get(`http://localhost:3000/groups/${params.id}/balances`).json();

export const createGroupExpense = async (params: GetGroupByIdParams, body: CreateGroupExpenseBody): Promise<any> =>
  ky.post(`http://localhost:3000/groups/${params.id}/expenses`, { json: body }).json();

export const updateGroupExpense = async (params: GetExpenseByIdParams, body: UpdateGroupExpenseBody): Promise<any> =>
  ky.put(`http://localhost:3000/groups/${params.expenseId}/expenses/${params.expenseId}`, { json: body }).json();

/**
 * NOTIFICATIONS API
 */

export type UpdateNotificationBody = {
  read: boolean;
};

export type GetNotificationsQuery = {
  limit: number;
  page: number;
};

export const getNotifications = async (query: GetNotificationsQuery): Promise<any> =>
  ky.get("http://localhost:3000/notifications", { searchParams: query }).json();

export const updateNotification = async (id: number, body: UpdateNotificationBody): Promise<any> =>
  ky.put(`http://localhost:3000/notifications/${id}`, { json: body }).json();