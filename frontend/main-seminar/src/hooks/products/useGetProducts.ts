import { useQuery, gql } from "@apollo/client";

const GET_PRODUCTS = gql`
  query GetProducts($filter: ProductFilterInput, $limit: Int) {
    getProducts(filter: $filter, limit: $limit) {
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

interface ProductFilter {
  name?: string;
  category?: string;
  status?: "AVAILABLE" | "OUT_OF_STOCK" | "DISCONTINUED";
}

export function useGetProducts(filter?: ProductFilter, limit = 100) {
  const { data, loading, error, refetch } = useQuery(GET_PRODUCTS, {
    variables: { filter, limit },
  });

  return {
    products: data?.getProducts?.data || [],
    loading,
    error,
    refetch,
    isSuccess: data?.getProducts?.isSuccess,
    message: data?.getProducts?.message
  };
}
