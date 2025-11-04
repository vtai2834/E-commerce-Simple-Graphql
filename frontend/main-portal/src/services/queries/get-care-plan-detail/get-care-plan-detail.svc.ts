import { ApolloClient } from "@apollo/client";
import { GraphqlCaller } from "@services/graph-caller";
import { CARE_PLANS_DETAIL_QUERY } from "./get-care-plan-detail.query";
import { IGetCarePlanDetailInput, IGetCarePlanDetailResponse } from "./get-care-plan-detail.type";


export class CarePlansDetailApi extends GraphqlCaller<
  IGetCarePlanDetailResponse['getDetailCarePlanById'], 
  IGetCarePlanDetailInput, 
  IGetCarePlanDetailResponse
> {
  constructor(client: ApolloClient) {
    super(
      client,
      CARE_PLANS_DETAIL_QUERY,
      (raw) => raw.getDetailCarePlanById
    );
  }
}
