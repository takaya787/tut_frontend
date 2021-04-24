import { useState, useContext, Dispatch, SetStateAction } from 'react'
import { useForm } from 'react-hook-form';
//hooks
import { useFormErrors } from '../../hooks/useFormErrors'
//types
import { UserEditType } from '../../types/UserType'
//contexts
import { UserContext, FlashMessageContext } from '../../pages/_app'
//others
import Button from 'react-bootstrap/Button'
//styleはmodal内のform.moduleを使用
import styles from '../Modal/Form.module.scss';

type EditProps = {
  id: number,
  name: string,
  email: string,
  gravator_url: string,
  setIsEdit: Dispatch<SetStateAction<boolean>>,
}


export const UserEditForm: React.FC<EditProps> = ({ id, name, email, gravator_url, setIsEdit }) => {
  //Password表示用のstate
  const [isPassword, setIsPassword] = useState(false);

  //useFormからメソッドをimport
  const { register, handleSubmit } = useForm();

  //Update先用のUrl
  const endpoint = process.env.NEXT_PUBLIC_BASE_URL + 'users/' + id

  //error用のcustom hook
  const initialerrors = { email: '', name: '', password: '', password_confirmation: '' };
  const { errors, handleError, resetError } = useFormErrors(initialerrors)

  //Context呼び出し
  const { FlashDispatch } = useContext(FlashMessageContext)
  const { setUser } = useContext(UserContext)

  // const onSubmit = (value: UserEditType): void => {
  //   console.log({ value })
  //   FlashDispatch({ type: "SUCCESS", message: "Profile updated" })
  // }
  const onSubmit = (value: UserEditType): void => {
    fetch(endpoint, {
      method: 'PUT', // or 'PUT'
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
      .then((data): any => {
        console.log({ data });
        if (data.errors) {
          FlashDispatch({ type: "DANGER", message: "Your form is invalid!" })
          handleError(data.errors);
          return
        }
        // console.log(data.token);
        resetError();
        setIsEdit(false)
        FlashDispatch({ type: "SUCCESS", message: "Profile updated" })
        setUser({ id: data.id, email: data.email, name: data.name, gravator_url: data.gravator_url });
        resetError();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }


  return (
    <div className="center jumbotron mt-3 py-3">
      <h3>Update your profile</h3>
      <div className="row">
        <div className="col-md-6 col-md-offset-3">
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <label className={styles.label} htmlFor="name">Your name</label>
            <input
              className={styles.form_input}
              id="name"
              name="name"
              {...register('name', { required: true })}
              defaultValue={name}
            />
            <label className={styles.label} htmlFor="email">Email</label>
            <input
              id="email"
              className={styles.form_input}
              name="email"
              type="email"
              {...register('email', { required: true })}
              defaultValue={email}
            />
            {errors.email !== '' && (
              <p className={styles.form_error}>Email {errors.email}</p>
            )}
            {isPassword && (
              <>
                {/* password表示ボタン 開始*/}
                <Button className="my-2" variant="outline-info" size='sm' onClick={() => setIsPassword(!isPassword)} >Hide Password</Button>
                {/* password表示ボタン 終了 */}
                <label className={styles.label} htmlFor="password">Password</label>
                <input
                  id="password"
                  className={styles.form_input}
                  type="password"
                  name="password"
                  {...register('password')}
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
                  name="password_confirmation"
                  {...register('password_confirmation')}
                />
                {errors.password_confirmation !== '' && (
                  <p className={styles.form_error}>Password_confirmation {errors.password_confirmation}</p>
                )}
              </>
            )}
            {/* passwordを表示するボタン*/}
            {!isPassword && (
              <p className="my-0 text-info" >
                <Button variant="outline-info" size='sm' onClick={() => setIsPassword(!isPassword)} /> Click here to change Password
              </p>)
            }
            <Button variant="primary" type="submit" className="mt-3">Save Changes</Button>
          </form>
        </div>
        <div className="col-md-6 col-md-offset-3">
          <div className="gravatar_edit">
            <p>ユーザーicon</p>
            <img src={gravator_url} width={100} height={100} className="mb-3" />
            <br />
            <a href="https://gravatar.com/emails" target="_blank">change</a>
          </div>
        </div>
      </div>
    </div >
  )
}
