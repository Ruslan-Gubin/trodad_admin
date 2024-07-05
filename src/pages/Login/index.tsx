import {useContext} from 'react';
import {Button, Form, FormProps, Input, notification} from "antd";
import {api} from "../../utils/api";
import {Navigate, useNavigate} from "react-router";
import Auth from "../../contexts/Auth";
import './style.css';
import { useAppDispatch } from '../../slices/model';
import { authAction } from '../../slices/auth-slice';

type FieldType = {
  username: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();
  const authContext = useContext(Auth);
  const [notApi, contextHolder] = notification.useNotification();
  const dispatch = useAppDispatch();

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    const payload = {
      username: 'admin',
      password: '8R22y87R',
    }
    try {
      const res = await api.post<{isLogin: boolean}>('/users/login/admin', payload);
      if (res.data.isLogin) {
        dispatch(authAction.loginAuth({ username: values.username }));
        navigate('/');
      }
    } catch (e: any) {
      notApi.error({
        message: e.message
      })
    }
  };

  if (authContext.isLogin) return <Navigate to="/" />;

  return (
    <div className="login-wrapper">
      {contextHolder}
      <Form
        onFinish={onFinish}
        className="login-form"
        autoComplete="off"
      >
        <h1 className="login-title">Логин</h1>
        <Form.Item<FieldType>
          label="Логин"
          name="username"
          rules={[{ required: true, message: 'Введите логин' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Пароль"
          name="password"
          rules={[{ required: true, message: 'Введите пароль' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 3 }}>
          <Button type="primary" htmlType="submit">
            Войти
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;