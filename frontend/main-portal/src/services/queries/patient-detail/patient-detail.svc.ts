import { GraphqlCaller } from "@services/graph-caller";
import { PATIENT_DETAIL_QUERY } from "./patient-detail.query";
import { IPatientDetailInput, IPatientDetailResponse } from "./patient-detail.type";
import { ApolloClient } from "@apollo/client";

export class PatientDetailApi extends GraphqlCaller<
  IPatientDetailResponse['getPatientDetails'],
  IPatientDetailInput,
  IPatientDetailResponse
> {
  constructor(client: ApolloClient) {
    super(
      client,
      PATIENT_DETAIL_QUERY,
      (raw) => raw.getPatientDetails,
    );
  }
}
