import { ApolloClient } from "@apollo/client";
import { GraphqlCaller } from "@services/graph-caller";
import { ICarePlanDetailParaseData, IListCarePlansResponse, IListCarePlansVariables } from "./get-care-plans.type";
import { LIST_CARE_PLANS_QUERY } from "./get-care-plans.query";

export class ListCarePlansApi extends GraphqlCaller<
  ICarePlanDetailParaseData, // Parsed data type
  IListCarePlansVariables, // Input variables type
  IListCarePlansResponse // Raw response type 
> {
  constructor(client: ApolloClient) {
    super(
      client,
      LIST_CARE_PLANS_QUERY,
      (raw) => {
        return {
          pagination: raw.getListCarePlans.pagination,

          data: raw.getListCarePlans?.data?.map(item => {
            return {
                  id: item.id,
                  friendlyId: item.friendlyId,
                  note: item.note,
                  start: item.start,
                  stop: item.stop,
                  status: item.status,

                  facilityId: item.facility?.id,
                  facilityName: item.facility?.name, 

                  patientId: item.patient?.id,
                  patientEmail: item.patient?.email,
                  patientFirstName: item.patient?.firstName,
                  patientLastName: item.patient?.lastName,
                  patientDob: item.patient?.dob,
                  patientPhone: item.patient?.contactInfo?.phone,
                  patientAddress: item.patient?.contactInfo?.address,
                  patientCity: item.patient?.contactInfo?.city,
                  patientCountry: item.patient?.contactInfo?.country,

                  physicianId: item.physician?.id,
                  physicianFirstName: item.physician?.firstName,
                  physicianLastName: item.physician?.lastName,
                  physicianDob: item.physician?.dob,
                  physicianPhone: item.physician?.contactInfo?.phone,
                  physicianAddress: item.physician?.contactInfo?.address,
                  physicianCity: item.physician?.contactInfo?.city,
                  physicianCountry: item.physician?.contactInfo?.country,
            }
          }),
        }
      },
    );
  }
}
