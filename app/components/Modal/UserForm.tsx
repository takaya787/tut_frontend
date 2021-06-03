import { useContext } from 'react'
import { useForm } from 'react-hook-form';
import { mutate } from 'swr'
//types
import { UserValueType, UserSignupType } from '../../types/UserType'
//hooks
import { useFormErrors } from '../../hooks/useFormErrors'
import { AutoLoginUrl } from '../../hooks/useUserSWR'
//module
import { Auth } from '../../modules/Auth'
//othres
import styles from './Form.module.scss';
import { FlashMessageContext } from '../../pages/_app'

const endpoint = process.env.NEXT_PUBLIC_BASE_URL + 'users'

type UserFormProps = {
  Closemodal: VoidFunction
}

export const UserForm: React.FC<UserFormProps> = ({ Closemodal }) => {
  const { register, handleSubmit } = useForm();
  //Flash Message
  const { FlashDispatch } = useContext(FlashMessageContext)

  const initialerrors = { name: '', email: '', password: '', password_confirmation: '' };
  const { errors, handleError, resetError } = useFormErrors(initialerrors)

  const onSubmit = (value: UserValueType): void => {
    fetch(endpoint, {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: {
          name: value.name,
          email: value.email,
          password: value.password,
          password_confirmation: value.password_confirmation
        }
      }),
    })
      .then(response => response.json())
      .then((data): UserSignupType | undefined => {
        // console.log('response data')
        // console.log({ data });
        if (data.errors) {
          FlashDispatch({ type: "DANGER", message: "Your form is invalid!" })
          handleError(data.errors);
          return
        }
        // console.log(data.token);
        //Login関連の処理 context使用
        Auth.login(data.token);
        //SWRのユーザーデータを更新しておく
        mutate(AutoLoginUrl)
        const user_data = data.user
        FlashDispatch({ type: "PRIMARY", message: `Welcome to Sample App, ${user_data.name}` })
        // router.push('/reviews/new')
        Closemodal()
        //Login関連の処理 終了
        resetError();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <label className={styles.label} htmlFor="name">Your name</label>
        <input
          className={styles.form_input}
          id="name"
          // name="name"
          {...register('name', { required: true })}
        />
        <label className={styles.label} htmlFor="email">Email</label>
        <input
          id="email"
          className={styles.form_input}
          // name="email"
          type="email"
          {...register('email', { required: true })}
        />
        {errors.email !== '' && (
          <p className={styles.form_error}>Email {errors.email}</p>
        )}
        <label className={styles.label} htmlFor="password">Password</label>
        <input
          id="password"
          className={styles.form_input}
          type="password"
          // name="password"
          {...register('password', { required: true })}
        />
        {errors.password !== '' && (
          <p className={styles.form_error}>Password {errors.password}</p>
        )}
        <label
          className={styles.label}
          htmlFor="password_confirmation">
          Password_confirmation
      </label>
        <input
          id="password_confirmation"
          className={styles.form_input}
          type="password"
          // name="password_confirmation"
          {...register('password_confirmation', { required: true })}
        />
        {errors.password_confirmation !== "" && (
          <p className={styles.form_error}>Password_confirmation {errors.password_confirmation}</p>
        )}
        <button type="submit" className={styles.form_submit}>Sign up</button>
      </form>
    </>
  )
}
