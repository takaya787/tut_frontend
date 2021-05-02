import { useContext } from 'react'
import { useForm } from 'react-hook-form'
//Bootstrap
import Button from 'react-bootstrap/Button'
//othres
import { FlashMessageContext } from '../../pages/_app'
import styles from './Form.module.scss';

export const PasswordResetForm: React.FC = () => {
  //Flash Message
  const { FlashDispatch } = useContext(FlashMessageContext)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = (value) => {
    console.log({ value })
  }
  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      {/* <label className={styles.label} htmlFor="email">Email</label> */}
      <input
        id="email"
        className={styles.form_input}
        name="email"
        type="email"
        placeholder="enter your email"
        aria-invalid={errors.email ? "true" : "false"}
        {...register('email', { required: true })}
      />
      <button type="submit" className={styles.form_submit}>Password Reset</button>
    </form>
  )
}
