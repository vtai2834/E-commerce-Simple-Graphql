import { Button, Modal } from "antd";
import { useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import "./style.scss";
import FormEditCarePlan from "@features/form/form-edit-careplan/FormEditCarePlan";
import { ICarePlanDetailParaseData } from "@services/queries/get-care-plans/get-care-plans.type";

interface IModalEditPatientProps extends React.ComponentProps<typeof Modal> {
  carePlan: TArrayElement<ICarePlanDetailParaseData['data']>;
  onCallback?: () => void;
}

const ModalEditCarePlan : React.FC<IModalEditPatientProps>= ({carePlan , onCallback, ...props }) => {
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Button onClick={showModal}>
          <EditOutlined /> 
      </Button>

      <Modal
        open={open}
        title="Edit CarePlan"
        onCancel={handleCancel}
        footer={null}
        centered
        className="custom-edit-patient-modal"
        {...props}
      >
        <FormEditCarePlan
          carePlan ={carePlan} 
          onSuccess = {
            ()=>{
              setOpen(false);
              if(onCallback) {
                onCallback();
              }
            }
        }/>
      </Modal>
    </>
  );
}

export default ModalEditCarePlan
