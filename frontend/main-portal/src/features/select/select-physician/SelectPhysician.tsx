import { useGetPhysicians } from "@hooks/physician/useListPhysician";
import { Select } from "antd";

interface ISelectPhySicalProps {
  value?: string;
  onChange?: (value: string) => void;
  facilityId: string;
}

const SelectPhySician = ({value, facilityId,  onChange}: ISelectPhySicalProps) => {
  const {data : listPhysicans , loading} = useGetPhysicians(facilityId);

 

  const onHandleChange = (value: string) => {
    console.log(`selected ${value}`);

    if (onChange) {
      onChange(value);
    }
  }

  const parseDataToOptions = ()=>{
    if(!Array.isArray(listPhysicans)) return []

    return listPhysicans.map((item) => ({
    value: item?.id,
    label: item?.firstName + " " +  item?.lastName,
  }));
  }
  
  console.log(parseDataToOptions());

  return (
    <Select
      value={value}
      loading={loading}
      onChange={onHandleChange}
      options={parseDataToOptions()}
      style={{fontFamily: "Quicksand, sans-serif"}}
    />
  )
}

export default SelectPhySician
