import { useCallback, useEffect, useRef } from "react";
import { useApolloClient } from "@apollo/client/react";
import { useApiResult } from "../useApiResult";
import { toast } from "react-toastify";
import { GetPhysiciansValidApi } from "@services/queries/get-physician-valid-workinghour/getListPhysicianValid.svc";
import { IGetPhysiciansValidInput, IGetPhysiciansValidResponse, IParseDataGetPhysiciansValid } from "@services/queries/get-physician-valid-workinghour/getListPhysicianValid.type";

export function useListPhysiciansValidWorkingHour(facilityId?: string, date?: string, time?: string, duration?: number) {
  const client = useApolloClient();

  const apiRef = useRef<GetPhysiciansValidApi>(null);
  if (!apiRef.current) {
    apiRef.current = new GetPhysiciansValidApi(client);
  }
  const api = apiRef.current;

  const result = useApiResult<
    IParseDataGetPhysiciansValid,
    IGetPhysiciansValidInput,
    IGetPhysiciansValidResponse
  >(api);

  const onFetchPhysiciansValid = useCallback(() => {
    const input: IGetPhysiciansValidInput = {
        input: {
            facilityId: facilityId ? facilityId : '',
            date: date ? date : '',
            time: time ? time : '',
            duration: duration ? duration : 0,
        }
    }

    api.execute(input).catch((error) => {
      console.error("Fetch physicians error:", error);
      toast.error("Failed to fetch physicians");
    });
  }, [facilityId, date, time, duration]);

  useEffect(() => {
    // Only fetch if all parameters are provided
    if (facilityId && date && time && duration) {
      onFetchPhysiciansValid()
    }
  }, [onFetchPhysiciansValid, facilityId, date, time, duration]);

  const loading = result.status !== 'success' && result.status !== 'error';
  const data = result.status === "success" ? result.data : null;
  const error = result.status === "error" ? result.message : null;

  return { data, loading, error, onFetchPhysiciansValid };
}
