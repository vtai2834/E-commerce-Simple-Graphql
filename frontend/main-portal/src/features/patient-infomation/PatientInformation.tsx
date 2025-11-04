import { Grid } from "antd";
import "./style.scss";
import { usePatientDetail } from "@hooks/patient/usePatientDetail";
import LoadingPage from "@components/loading-page";
import { useEffect } from "react";
import { useAppSelector } from "@store/index";

const PatientInformation = () => {
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;

  const userId = useAppSelector((state) => state.authenticator.user?.id);

  const { data ,loading, onFetchPatientDetail} = usePatientDetail()

  useEffect(() => {
    onFetchPatientDetail({ getPatientDetailsId: userId ?? '' });
  }, [onFetchPatientDetail]);

  return (
    <LoadingPage loading={loading}>
      <section className={`patient-info ${isMobile ? "patient-info--mobile" : ""}`}>
        
      <section className="patient-info__card">
        <img 
          src="https://ca.slack-edge.com/T09ERD5AQAC-U09DW6TRPL3-a6ca13c11847-72" 
          alt="Patient Avatar" 
          className="patient-info__avatar"
        />
        <h2 className="patient-info__name">
          {data ? `${data.patient?.firstName} ${data.patient?.lastName}` : ''}
        </h2>
        <p>Phone: {data ? data.patient?.contactInfo?.phone : ''}</p>
        <p>Email: {data ? data.patient?.email : ''}</p>
      </section>

      <section className="patient-info__card">
        <h2 className="patient-info__title">General Information</h2>
        <p>Date of birth: {data ? data.patient?.dob : ''}</p>
        <p>Address: {data ? data.patient?.contactInfo?.address : ''}</p>
        <p>Country: {data ? data.patient?.contactInfo?.country : ''}</p>
        <p>State: {data ? data.patient?.contactInfo?.state : ''}</p>
      </section>
    </section>
  </LoadingPage>
  );
};

export default PatientInformation;
