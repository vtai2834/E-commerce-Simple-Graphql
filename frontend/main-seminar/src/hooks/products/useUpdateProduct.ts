import { useMutation, gql } from "@apollo/client";

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
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

interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;  // Backend sẽ tự động update status dựa trên stock
  category?: string;
  image?: string;
}

export function useUpdateProduct() {
  // Pattern chuẩn Apollo Client
  const [updateProductMutation, result] = useMutation(UPDATE_PRODUCT);

  const executeUpdateProduct = async (id: string, input: UpdateProductInput) => {
    return await updateProductMutation({ variables: { id, input } });
  };

  return [
    executeUpdateProduct,
    {
      data: result.data,
      loading: result.loading,
      error: result.error,
      isSuccess: result.data?.updateProduct?.isSuccess,
      message: result.data?.updateProduct?.message,
      product: result.data?.updateProduct?.data
    }
  ] as const;
}
