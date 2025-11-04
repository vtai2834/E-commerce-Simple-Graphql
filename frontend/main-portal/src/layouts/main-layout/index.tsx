import { IBaseProps } from '@interfaces/index';

import classnames from 'classnames';
import './style.scss';
import MainHeader from '@components/main-header';

interface IProps extends IBaseProps {
  children: React.ReactNode | string | number;
}

const MainLayout = (props: IProps) => {
  return (
    <div className={classnames('main-layout', props.className)}>
      <MainHeader />
      {props.children}
    </div>
  );
};

export default MainLayout;
