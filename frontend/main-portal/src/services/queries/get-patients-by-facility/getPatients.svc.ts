import { ApolloClient } from "@apollo/client";
import { GraphqlCaller } from "@services/graph-caller";
import { GET_PATIENTS_QUERY } from "./getPatients.query";
import { IGetPatientsResponse, IParseDataGetPatients, IGetPatientsInput } from "./getPatients.type";


export class GetPatientsByFacilityApi extends GraphqlCaller<
  IParseDataGetPatients,
  IGetPatientsInput,
  IGetPatientsResponse
> {
  constructor(client: ApolloClient) {
    super(
      client,
      GET_PATIENTS_QUERY,
      (raw) => raw.getListPatients,
      "query"
    );
  }
}
