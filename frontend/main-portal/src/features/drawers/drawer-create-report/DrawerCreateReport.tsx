import FormCreateReport from '@/features/form/form-create-report';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Drawer } from 'antd';
import React from 'react';

interface IDrawerCreateReportProps {
  carePlanId?: string;
  onCallBack?: () => void;
}

const DrawerCreateReport = ({
  carePlanId,
  onCallBack,
}: IDrawerCreateReportProps) => {
  const [open, setOpen] = React.useState<boolean>(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        onClick={showDrawer}
        type='default'
        icon={<PlusOutlined />}
        style={{
          borderColor: '#3164AF',
          color: '#3164AF',
        }}
      >
        Create report
      </Button>

      <Drawer
        loading={false}
        title='Create a new report'
        closable={{ 'aria-label': 'Close Button' }}
        onClose={onClose}
        open={open}
      >
        <FormCreateReport
          friendlyId={carePlanId ?? ''}
          onCallBack={onCallBack}
        />
      </Drawer>
    </>
  );
};

export default DrawerCreateReport;
