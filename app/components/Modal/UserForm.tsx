import { useForm } from 'react-hook-form';
//types
import { UserValueType, UserSignupType } from '../../types/UserType'
//hooks
import { useFormErrors } from '../../hooks/useFormErrors'
import styles from './Form.module.scss';

const endpoint = process.env.NEXT_PUBLIC_BASE_URL + 'users'

type UserFormProps = {
  Closemodal: VoidFunction
}

export const UserForm: React.FC<UserFormProps> = ({ Closemodal }) => {
  const { register, handleSubmit } = useForm();

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
      .then((data): UserSignupType => {
        console.log('response data')
        console.log(data);
        if (data.errors) {
          console.log(data.errors);
          handleError(data.errors);
          return
        }
        // console.log(data.token);
        console.log('User is created successfully');
        //Login関連の処理 context使用
        // Auth.login(data.token);
        const user_data = data.user
        // setUser({ id: user_data.id, email: user_data.email, name: user_data.name });
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
        <label className={styles.label} htmlFor="name">お名前</label>
        <input
          className={styles.form_input}
          id="name"
          name="name"
          {...register('name', { required: true })}
        />
        <label className={styles.label} htmlFor="email">Eメール</label>
        <input
          id="email"
          className={styles.form_input}
          name="email"
          type="email"
          {...register('email', { required: true })}
        />
        {errors.email !== '' && (
          <p className={styles.form_error}>Email {errors.email}</p>
        )}
        <label className={styles.label} htmlFor="password">パスワード</label>
        <input
          id="password"
          className={styles.form_input}
          type="password"
          name="password"
          {...register('password', { required: true })}
        />
        {errors.password !== '' && (
          <p className={styles.form_error}>Password {errors.password}</p>
        )}
        <label
          className={styles.label}
          htmlFor="password_confirmation">
          パスワード確認用
      </label>
        <input
          id="password_confirmation"
          className={styles.form_input}
          type="password"
          name="password_confirmation"
          {...register('password_confirmation', { required: true })}
        />
        {errors.password_confirmation !== "" && (
          <p className={styles.form_error}>Password_confirmation {errors.password_confirmation}</p>
        )}
        <button type="submit" className={styles.form_submit}>登録する</button>
      </form>
    </>
  )
}
