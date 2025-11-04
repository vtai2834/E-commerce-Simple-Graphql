import { useQuery, gql } from "@apollo/client";

const GET_ORDERS = gql`
  query GetOrders($userId: String!, $limit: Int) {
    getOrders(userId: $userId, limit: $limit) {
      code
      isSuccess
      message
      data {
        id
        userId
        items {
          productId
          quantity
          price
        }
        totalAmount
        status
        shippingAddress {
          street
          city
          state
          country
          zipCode
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export function useGetOrders(userId: string, limit = 10) {
  const { data, loading, error, refetch } = useQuery(GET_ORDERS, {
    variables: { userId, limit },
    skip: !userId,
  });

  return {
    orders: data?.getOrders?.data || [],
    loading,
    error,
    refetch,
    isSuccess: data?.getOrders?.isSuccess,
    message: data?.getOrders?.message
  };
}
