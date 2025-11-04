import { useMutation, gql } from "@apollo/client";

const REMOVE_PRODUCT = gql`
  mutation RemoveProduct($id: ID!) {
    removeProduct(id: $id) {
      code
      isSuccess
      message
      data {
        id
        name
        description
        price
        stock
        category
        image
        status
        createdAt
        updatedAt
      }
    }
  }
`;

export function useRemoveProduct() {
  // Pattern chuẩn Apollo Client
  const [removeProductMutation, result] = useMutation(REMOVE_PRODUCT);

  const executeRemoveProduct = async (id: string) => {
    return await removeProductMutation({ variables: { id } });
  };

  return [
    executeRemoveProduct,
    {
      data: result.data,
      loading: result.loading,
      error: result.error,
      isSuccess: result.data?.removeProduct?.isSuccess,
      message: result.data?.removeProduct?.message,
      product: result.data?.removeProduct?.data
    }
  ] as const;
}
