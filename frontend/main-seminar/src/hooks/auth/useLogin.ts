import { useMutation, gql } from "@apollo/client";

const LOGIN_PATIENT = gql`
  mutation LoginPatient($input: LoginInput!) {
    loginPatient(input: $input) {
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

const LOGIN_PHYSICIAN = gql`
  mutation LoginPhysician($input: LoginInput!) {
    loginPhysician(input: $input) {
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
  // Pattern chuẩn Apollo Client: trả về [mutationFunction, result]
  const [loginPatient, patientResult] = useMutation(LOGIN_PATIENT);
  const [loginPhysician, physicianResult] = useMutation(LOGIN_PHYSICIAN);

  // Wrapper function để handle cả 2 loại login
  const executeLogin = async (email: string, password: string, role: "PATIENT" | "PHYSICIAN" = "PATIENT") => {
    const input = { email, password, role };
    
    if (role === "PATIENT") {
      return await loginPatient({ variables: { input } });
    } else {
      return await loginPhysician({ variables: { input } });
    }
  };

  return [
    executeLogin,
    {
      data: patientResult.data || physicianResult.data,
      loading: patientResult.loading || physicianResult.loading,
      error: patientResult.error || physicianResult.error
    }
  ] as const;
}
