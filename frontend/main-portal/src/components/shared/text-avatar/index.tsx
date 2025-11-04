import { UserOutlined } from '@ant-design/icons';
import { IBaseProps } from '@interfaces/index';
import { Avatar } from 'antd';
import classNames from 'classnames';

const AVATAR_BACKGROUND_COLORS = [
  '#F5A36C',
  '#6ACCA3',
  '#F5D57F',
  '#F57F83',
  '#7FB1F5',
  '#A393F5',
  '#52CCC2',
];

interface CustomTextAvatarProps extends IBaseProps {
  // firstName: string;
  // lastName: string;
  name: string;
  size?: 'small' | 'default' | 'large';
}
const CustomTextAvatar = (props: CustomTextAvatarProps) => {
  // const { firstName, lastName, size = 'small' } = props;
  const { name, size = 'small' } = props;
  // const firstCharacterOfFirstName = firstName?.charAt(0);
  // const firstCharacterOfLastName = lastName?.charAt(0);
  // const charactersInHex = firstName?.charCodeAt(0) + firstName?.charCodeAt(0);
  // split name into first name and last name

  const charactersInHex = name?.charCodeAt(0);
  const backgroundColor =
    AVATAR_BACKGROUND_COLORS[charactersInHex % AVATAR_BACKGROUND_COLORS.length];
  return (
    <Avatar
      className={classNames(props.className)}
      size={size}
      style={{ backgroundColor }}
      icon={<UserOutlined />}
    >
      {/* {firstCharacterOfFirstName + firstCharacterOfLastName} */}
    </Avatar>
  );
};

export default CustomTextAvatar;
