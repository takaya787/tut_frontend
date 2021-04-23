import { useContext } from 'react'
import { useForm } from 'react-hook-form';
//types
import { UserValueType, UserSignupType } from '../../types/UserType'
//contexts
import { FlashMessageContext } from '../../pages/_app'
//others
import styles from '../Modal/Form.module.scss';
import Button from 'react-bootstrap/Button'

type EditProps = {
  id: number,
  gravator_url: string
}

export const UserEditForm: React.FC<EditProps> = ({ id, gravator_url }) => {
  const { register, handleSubmit } = useForm();
  //Flash Message
  const { FlashDispatch } = useContext(FlashMessageContext)

  const onSubmit = (value: UserValueType): void => {
    console.log({ value })
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
            />
            <label className={styles.label} htmlFor="email">Email</label>
            <input
              id="email"
              className={styles.form_input}
              name="email"
              type="email"
              {...register('email', { required: true })}
            />
            {/* {errors.email !== '' && (
            <p className={styles.form_error}>Email {errors.email}</p>
          )} */}
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
