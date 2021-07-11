import { useState, Dispatch, SetStateAction } from 'react'
import { useForm } from 'react-hook-form';
import { mutate } from 'swr'
//hooks
import { useFormErrors } from '../../hooks/useFormErrors'
import { AutoFeedUrl } from '../../hooks/useFeedSWR'
import { useFlashReducer } from '../../hooks/useFlashReducer';
//Module
import { Auth } from '../../modules/Auth'
//types
import { UserEditType } from '../../types/UserType'
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

  //useFlashReducerを読み込み
  const { FlashReducer } = useFlashReducer()

  const onSubmit = (value: UserEditType): void => {
    fetch(endpoint, {
      method: 'PUT', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Auth.getToken()}`
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
      .then(response => {
        if (!response.ok) {
          response.json()
            .then((res): any => {
              if (res.hasOwnProperty('message')) {
                //authentication関連のエラー処理
                FlashReducer({ type: "DANGER", message: res.message })
              } else if (res.hasOwnProperty('errors')) {
                //form関連のerror処理
                FlashReducer({ type: "DANGER", message: "Your form is invalid!" })
                handleError(res.errors);
              }
            })
        } else {
          return response.json()
        }
      })
      .then((data): any => {
        //statusがokayでなければ、dataがundefinedになる
        if (data == undefined) {
          return
        }
        console.log({ data });
        //User情報更新
        resetError()
        mutate(AutoFeedUrl)
        setIsEdit(false)
        FlashReducer({ type: "SUCCESS", message: "Profile updated" })
      })
      .catch((error) => {
        console.error(error)
        FlashReducer({ type: "DANGER", message: "Error" })
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
              // name="name"
              {...register('name', { required: true })}
              defaultValue={name}
            />
            <label className={styles.label} htmlFor="email">Email</label>
            <input
              id="email"
              className={styles.form_input}
              // name="email"
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
                  // name="password"
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
                  // name="password_confirmation"
                  {...register('password_confirmation')}
                />
                {errors.password_confirmation !== '' && (
                  <p className={styles.form_error}>Password_confirmation {errors.password_confirmation}</p>
                )}
              </>
            )}
            {/* passwordを表示するボタン*/}
            {!isPassword && (
              <div className="mt-3" >
                <Button variant="outline-info" size='sm' onClick={() => setIsPassword(!isPassword)} >Click here to change Password</Button>
              </div>)
            }
            <Button variant="primary" type="submit" className="mt-3">Save Changes</Button>
          </form>
        </div>
        <div className="col-md-6 col-md-offset-3">
          <div className="gravatar_edit">
            <p>User Icon</p>
            <img src={gravator_url} width={100} height={100} className="mb-3" />
            <br />
            <a href="https://gravatar.com/emails" target="_blank">change</a>
          </div>
        </div>
      </div>
    </div >
  )
}
