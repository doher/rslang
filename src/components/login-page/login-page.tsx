import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { Button } from 'antd';
import 'antd/dist/antd.css';
import loginUser from '../../services/login-user';
import Context from '../../context/context';
import styles from './login-page.module.css';

interface LoginUser {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { register, errors, handleSubmit } = useForm<LoginUser>();
  const history = useHistory();
  const { authorize } = useContext(Context);
  const [errorMessage, setErrorMessage] = useState<React.ReactNode>(null);
  const onSubmit = async (data: LoginUser): Promise<void> => {
    loginUser(data)
      .then(() => {
        history.push('/');
        authorize();
      }).catch((err) => {
        setErrorMessage(<p className={styles.errorMsg}>{err.message}</p>);
      });
  };

  return (
    <div className={styles.container}>
      <form onSubmit={(e) => e.preventDefault()}>
        <span className={styles.label}>Email address</span>
        <input
          className={styles.inputForm}
          name="email"
          placeholder="Email address"
          ref={register({
            required: 'Email is required',
          })}
        />
        {errorMessage
          || (errors.email && <p className={styles.errorMsg}>{errors.email.message}</p>)}

        <span className={styles.label}>Password</span>
        <input
          className={styles.inputForm}
          name="password"
          type="password"
          placeholder="Password"
          ref={register({
            required: 'You must specify a password',
          })}
        />
        {errors.password && <p className={styles.errorMsg}>{errors.password.message}</p>}

        <Button
          className={`${styles.btn} ${styles.btnFilled}`}
          shape="round"
          onClick={handleSubmit(onSubmit)}
          value="large"
        >
          Login
        </Button>
      </form>
      <span className={styles.bgTitle}>
        <span>Welcome</span>
        <span>Back</span>
      </span>
    </div>
  );
};

export default LoginPage;
