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
  smartAccountAddress: string;
  signature: string;
  nonce: number;
};

export type AuthSignResponse = {
  token: string;
  isNewUser: boolean;
};

/**
 * @dev get authentication session nonce, to init auth process
 * @returns {Promise<AuthNonceResponse>} the nonce response from server
 */
export const getAuthNonce = async (): Promise<AuthNonceResponse> =>
  ky
    .get(`${process.env.EXPO_PUBLIC_BASE_API}/auth/nonce`)
    .json<AuthNonceResponse>();

export const signIn = async (body: AuthSignInBody): Promise<AuthSignResponse> =>
  ky
    .post(`${process.env.EXPO_PUBLIC_BASE_API}/auth/sign-in`, { json: body })
    .json<AuthSignResponse>();

/**
 * PAYMENT API
 */

export type CreatePaymentBody = {
  payerId: number;
  payeeId: number;
  amount: number;
  chainId: number;
  description: string;
  txHash: `0x${string}`;
};

export type PaymentByIdParams = {
  id: number;
};

export type PaymentByIdResponse = {
  id: number;
  payerId: number;
  payeeId: number;
  chainId: number;
  amount: number;
  description: string;
  createdAt: string;
};

export type PaymentsQueryResponse = {
  id: number;
  payerId: number;
  payeeId: number;
  chainId: number;
  amount: number;
  description: string;
  createdAt: string;
};

export type PaymentsQuery = {
  withUserId?: number;
  fromDate?: string;
  toDate?: string;
  direction?: string;
  chainId?: number;
  limit?: number;
};

export const createPayment = async (
  token: string,
  body: CreatePaymentBody
): Promise<PaymentByIdResponse> =>
  ky
    .post(`${process.env.EXPO_PUBLIC_BASE_API}/payments`, {
      json: body,
      headers: { Authorization: `Bearer ${token}` },
    })
    .json<PaymentByIdResponse>();

export const getPaymentById = async (
  token: string,
  params: PaymentByIdParams
): Promise<PaymentByIdResponse> =>
  ky
    .get(`${process.env.EXPO_PUBLIC_BASE_API}/payments/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .json<PaymentByIdResponse>();

export const getPayments = async (
  token: string,
  query: PaymentsQuery
): Promise<PaymentsQueryResponse[]> =>
  ky
    .get(`${process.env.EXPO_PUBLIC_BASE_API}/payments`, {
      searchParams: query,
      headers: { Authorization: `Bearer ${token}` },
    })
    .json();

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
  smartAccountAddress?: string;
};

export type UpdateMeBody = {
  username?: string;
  displayName?: string;
  avatarUrl?: string;
  isDiscoverable?: boolean;
  farcasterUsername?: string;
};

export type UsersByIdUsernameOrAddressParams = {
  idOrUsernameOrAddress: string;
};

export type GetUsersQuery = {
  query?: string;
  limit?: number;
  page?: number;
};

export const getMe = async (token: string): Promise<UsersMeResponse> =>
  ky
    .get(`${process.env.EXPO_PUBLIC_BASE_API}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .json<UsersMeResponse>();

export const updateMe = async (
  token: string,
  body: UpdateMeBody
): Promise<UsersMeResponse> =>
  ky
    .put(`${process.env.EXPO_PUBLIC_BASE_API}/users/me`, {
      json: body,
      headers: { Authorization: `Bearer ${token}` },
    })
    .json<UsersMeResponse>();

export const getUserByIdUsernameOrAddress = async (
  token: string,
  params: UsersByIdUsernameOrAddressParams
): Promise<UsersByIdUsernameOrAddressResponse> =>
  ky
    .get(
      `${process.env.EXPO_PUBLIC_BASE_API}/users/${params.idOrUsernameOrAddress}?withPaymentInfo=true`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .json<UsersByIdUsernameOrAddressResponse>();

export const getUsers = async (
  token: string,
  query: GetUsersQuery
): Promise<UsersByIdUsernameOrAddressResponse[]> =>
  ky
    .get(`${process.env.EXPO_PUBLIC_BASE_API}/users`, {
      searchParams: query,
      headers: { Authorization: `Bearer ${token}` },
    })
    .json();

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
  id: number;
  expenseId: number;
};

export type UpdateExpenseByIdParams = {
  id: number;
  expenseId: number;
};

export type DeleteExpenseByIdParams = {
  id: number;
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
  splitAmongIds: number[];
};

export type UpdateGroupExpenseBody = {
  amount: number;
  description: string;
  category: string;
  date: string;
  splitAmongIds: number[];
};

export const getGroupById = async (
  token: string,
  params: GetGroupByIdParams
): Promise<GetGroupByIdResponse> =>
  ky
    .get(`${process.env.EXPO_PUBLIC_BASE_API}/groups/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .json();

export const getGroups = async (
  token: string
): Promise<GetGroupsQueryResponse[]> =>
  ky
    .get(`${process.env.EXPO_PUBLIC_BASE_API}/groups`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .json();

export const createGroup = async (
  token: string,
  body: CreateGroupBody
): Promise<GetGroupByIdResponse> =>
  ky
    .post(`${process.env.EXPO_PUBLIC_BASE_API}/groups`, {
      json: body,
      headers: { Authorization: `Bearer ${token}` },
    })
    .json();

export const addUsersToGroup = async (
  token: string,
  params: UpdateGroupParams,
  body: AddUsersToGroupBody
): Promise<{ message: string }> =>
  ky
    .post(`${process.env.EXPO_PUBLIC_BASE_API}/groups/${params.id}/users`, {
      json: body,
      headers: { Authorization: `Bearer ${token}` },
    })
    .json();

export const removeUsersFromGroup = async (
  token: string,
  params: UpdateGroupParams,
  body: AddUsersToGroupBody
): Promise<{ message: string }> =>
  ky
    .delete(`${process.env.EXPO_PUBLIC_BASE_API}/groups/${params.id}/users`, {
      json: body,
      headers: { Authorization: `Bearer ${token}` },
    })
    .json();

export const updateGroup = async (
  token: string,
  params: UpdateGroupParams,
  body: UpdateGroupBody
): Promise<GetGroupByIdResponse> =>
  ky
    .post(`${process.env.EXPO_PUBLIC_BASE_API}/groups/${params.id}`, {
      json: body,
      headers: { Authorization: `Bearer ${token}` },
    })
    .json();

export const deleteGroup = async (
  token: string,
  params: GetGroupByIdParams
): Promise<GetGroupByIdResponse> =>
  ky
    .delete(`${process.env.EXPO_PUBLIC_BASE_API}/groups/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .json();

export const deleteGroupExpense = async (
  token: string,
  params: DeleteExpenseByIdParams
): Promise<any> =>
  ky
    .delete(
      `${process.env.EXPO_PUBLIC_BASE_API}/groups/${params.id}/expenses/${params.expenseId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .json();

export const getGroupExpenses = async (
  token: string,
  params: GetGroupExpensesByIdParams
): Promise<any> =>
  ky
    .get(`${process.env.EXPO_PUBLIC_BASE_API}/groups/${params.id}/expenses`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .json();

export const getGroupExpenseById = async (
  token: string,
  params: GetExpenseByIdParams
): Promise<any> =>
  ky
    .get(
      `${process.env.EXPO_PUBLIC_BASE_API}/groups/${params.id}/expenses/${params.expenseId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .json();

export const getGroupBalances = async (
  token: string,
  params: GetUserExpensesInGroupParams
): Promise<any> =>
  ky
    .get(`${process.env.EXPO_PUBLIC_BASE_API}/groups/${params.id}/balances`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .json();

export const createGroupExpense = async (
  token: string,
  params: GetGroupByIdParams,
  body: CreateGroupExpenseBody
): Promise<any> =>
  ky
    .post(`${process.env.EXPO_PUBLIC_BASE_API}/groups/${params.id}/expenses`, {
      json: body,
      headers: { Authorization: `Bearer ${token}` },
      throwHttpErrors: false,
    })
    .json();

export const updateGroupExpense = async (
  token: string,
  params: UpdateExpenseByIdParams,
  body: UpdateGroupExpenseBody
): Promise<any> =>
  ky
    .put(
      `${process.env.EXPO_PUBLIC_BASE_API}/groups/${params.id}/expenses/${params.expenseId}`,
      { json: body, headers: { Authorization: `Bearer ${token}` } }
    )
    .json();

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

export const getNotifications = async (
  query: GetNotificationsQuery
): Promise<any> =>
  ky
    .get(`${process.env.EXPO_PUBLIC_BASE_API}/notifications`, {
      searchParams: query,
    })
    .json();

export const updateNotification = async (
  id: number,
  body: UpdateNotificationBody
): Promise<any> =>
  ky
    .put(`${process.env.EXPO_PUBLIC_BASE_API}/notifications/${id}`, {
      json: body,
    })
    .json();
