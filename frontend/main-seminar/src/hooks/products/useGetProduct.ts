import { useQuery, gql } from "@apollo/client";

const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    getProduct(id: $id) {
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

export function useGetProduct(id: string) {
  const { data, loading, error, refetch } = useQuery(GET_PRODUCT, {
    variables: { id },
    skip: !id,
  });

  return {
    product: data?.getProduct?.data,
    loading,
    error,
    refetch,
    isSuccess: data?.getProduct?.isSuccess,
    message: data?.getProduct?.message
  };
}
