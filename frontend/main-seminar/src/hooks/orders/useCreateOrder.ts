import { useMutation, gql } from "@apollo/client";

const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
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

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}

interface CreateOrderInput {
  userId: string;
  items: OrderItem[];
  shippingAddress?: ShippingAddress;
}

export function useCreateOrder() {
  // Pattern chuẩn Apollo Client: trả về [mutationFunction, result]
  const [createOrderMutation, result] = useMutation(CREATE_ORDER);

  const executeCreateOrder = async (input: CreateOrderInput) => {
    return await createOrderMutation({ variables: { input } });
  };

  return [
    executeCreateOrder,
    {
      data: result.data,
      loading: result.loading,
      error: result.error,
      isSuccess: result.data?.createOrder?.isSuccess,
      message: result.data?.createOrder?.message,
      order: result.data?.createOrder?.data
    }
  ] as const;
}
