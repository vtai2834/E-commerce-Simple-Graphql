import { useMutation, gql } from "@apollo/client";

const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
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

interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
  status?: "AVAILABLE" | "OUT_OF_STOCK" | "DISCONTINUED";
}

export function useCreateProduct() {
  // Pattern chuẩn Apollo Client
  const [createProductMutation, result] = useMutation(CREATE_PRODUCT);

  const executeCreateProduct = async (input: CreateProductInput) => {
    return await createProductMutation({ variables: { input } });
  };

  return [
    executeCreateProduct,
    {
      data: result.data,
      loading: result.loading,
      error: result.error,
      isSuccess: result.data?.createProduct?.isSuccess,
      message: result.data?.createProduct?.message,
      product: result.data?.createProduct?.data
    }
  ] as const;
}
