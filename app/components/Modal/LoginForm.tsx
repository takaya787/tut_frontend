import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
//types
import { LoginValueType, UserLoginType } from '../../types/UserType'

import styles from './Form.module.scss';

const endpoint = process.env.NEXT_PUBLIC_BASE_URL + 'login'

type LoginFormProps = {
  Closemodal: VoidFunction
}

export const LoginForm: React.FC<LoginFormProps> = ({ Closemodal }) => {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm();
  // appからcontextsを受け取る

  const onSubmit = (value: LoginValueType) => {
    fetch(endpoint, {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: value.email,
        password: value.password,
      }),
    })
      .then(response => response.json())
      .then((data): UserLoginType => {
        console.log('response data')
        console.log(data);
        if (data.error) {
          // console.log(data.error);
          alert(data.error);
          Closemodal()
          return
        }
        // console.log(data.token);
        console.log('Logined successfully');
        //Login関連の処理 context使用
        // Auth.login(data.token);
        // const user_data = data.user
        // setUser({ id: user_data.id, email: user_data.email, name: user_data.name });
        Closemodal()
        //Login関連の処理 終了
        // router.push('/reviews/new');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  return (<>
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <label className={styles.label} htmlFor="email">Eメール</label>
      <input
        id="email"
        className={styles.form_input}
        name="email"
        type="email"
        aria-invalid={errors.email ? "true" : "false"}
        {...register('email', { required: true })}
      />
      {errors.email && (
        <span role="alert" className={styles.alert}>
          This field is required
        </span>
      )}
      <label className={styles.label} htmlFor="password">パスワード</label>
      <input
        id="password"
        className={styles.form_input}
        type="password"
        name="password"
        aria-invalid={errors.password ? "true" : "false"}
        {...register('password', { required: true })}
      />
      {errors.password && (
        <span role="alert" className={styles.alert}>
          This field is required
        </span>
      )}
      <button type="submit" className={styles.form_submit}>ログイン</button>
    </form>
  </>)
}
