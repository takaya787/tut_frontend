import { SetStateAction, useContext, Dispatch } from "react";
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { mutate } from 'swr'
//module
import { Auth } from '../../modules/Auth'
//hooks
import { AutoLoginUrl } from '../../hooks/useUserSWR'
//types
import { LoginValueType, UserLoginType } from '../../types/UserType'
//othres
import { FlashMessageContext } from '../../pages/_app'
import Button from 'react-bootstrap/Button'
import styles from './Form.module.scss';

const endpoint = process.env.NEXT_PUBLIC_BASE_URL + 'login'

type LoginFormProps = {
  Closemodal: VoidFunction,
  PasswordResetControll: VoidFunction
}

export const LoginForm: React.FC<LoginFormProps> = ({ Closemodal, PasswordResetControll }) => {
  //Flash Message
  const { FlashDispatch } = useContext(FlashMessageContext)

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
      .then((data): UserLoginType | undefined => {
        // console.log('response data')
        // console.log(data);
        if (data.error) {
          console.log(data.error);
          FlashDispatch({ type: "DANGER", message: data.error })
          Closemodal()
          return
        }
        //Login関連の処理 context使用
        Auth.login(data.token);
        //user data更新
        mutate(AutoLoginUrl)
        //Login関連の処理 終了
        const user_data = data.user
        // router.push(`/users/${user_data.id}`);
        FlashDispatch({ type: "SUCCESS", message: `Welcome back ${user_data.name}` })
        Closemodal()
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  return (<>
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <label className={styles.label} htmlFor="email">Email</label>
      <input
        id="email"
        className={styles.form_input}
        // name="email"
        type="email"
        aria-invalid={errors.email ? "true" : "false"}
        {...register('email', { required: true })}
      />
      {errors.email && (
        <span role="alert" className={styles.alert}>
          This field is required
        </span>
      )}
      <label className={styles.label} htmlFor="password">Password</label>
      <input
        id="password"
        className={styles.form_input}
        type="password"
        // name="password"
        aria-invalid={errors.password ? "true" : "false"}
        {...register('password', { required: true })}
      />

      {errors.password && (
        <span role="alert" className={styles.alert}>
          This field is required
        </span>
      )}
      <Button variant="outline-warning" size='sm' onClick={() => PasswordResetControll()}>Forget the Password?</Button>
      <button type="submit" className={styles.form_submit}>Log in</button>
    </form>
  </>)
}
