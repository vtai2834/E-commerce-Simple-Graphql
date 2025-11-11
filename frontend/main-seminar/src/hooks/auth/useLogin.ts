import { useMutation, gql } from "@apollo/client";

const LOGIN_ADMIN = gql`
  mutation LoginAdmin($input: LoginInput!) {
    loginAdmin(input: $input) {
      code
      isSuccess
      message
      accessToken
      refreshToken
      user {
        id
        email
        firstName
        lastName
        role
      }
    }
  }
`;

const LOGIN_CUSTOMER = gql`
  mutation LoginCustomer($input: LoginInput!) {
    loginCustomer(input: $input) {
      code
      isSuccess
      message
      accessToken
      refreshToken
      user {
        id
        email
        firstName
        lastName
        role
      }
    }
  }
`;

export function useLogin() {
  const [loginAdmin, adminResult] = useMutation(LOGIN_ADMIN);
  const [loginCustomer, customerResult] = useMutation(LOGIN_CUSTOMER);

  const executeLogin = async (
    email: string,
    password: string,
    role: "ADMIN" | "CUSTOMER" = "CUSTOMER"
  ) => {
    const input = { email, password, role };
    if (role === "ADMIN") {
      return await loginAdmin({ variables: { input } });
    } else {
      return await loginCustomer({ variables: { input } });
    }
  };

  return [
    executeLogin,
    {
      data: adminResult.data || customerResult.data,
      loading: adminResult.loading || customerResult.loading,
      error: adminResult.error || customerResult.error
    }
  ] as const;
}
