import { useContext } from 'react'
import { useForm } from 'react-hook-form'
//Bootstrap
import Button from 'react-bootstrap/Button'
//othres
import { FlashMessageContext } from '../../pages/_app'
import styles from './Form.module.scss';

type EmailForm = {
  email: string
}

type PasswordResetProps = {
  Closemodal: VoidFunction,
}

export const PasswordResetForm: React.FC<PasswordResetProps> = ({ Closemodal }) => {
  const PasswordResetUrl = process.env.NEXT_PUBLIC_BASE_URL + 'password_resets'
  //Flash Message
  const { FlashDispatch } = useContext(FlashMessageContext)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = (value: EmailForm): void => {
    fetch(PasswordResetUrl, {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password_reset: {
          email: value.email,
        }
      }),
    })
      .then(response => {
        if (!response.ok) {
          response.json()
            .then((res): any => {
              if (res.hasOwnProperty('message')) {
                //error関係のメッセージ
                Closemodal()
                FlashDispatch({ type: "DANGER", message: res.message })
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
        Closemodal()
        FlashDispatch({ type: "SUCCESS", message: data.message })
      })
      .catch((error) => {
        console.error(error)
        FlashDispatch({ type: "DANGER", message: "Error" })
      });
  }
  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      {/* <label className={styles.label} htmlFor="email">Email</label> */}
      <input
        id="email"
        className={styles.form_input}
        // name="email"
        type="email"
        placeholder="enter your email"
        aria-invalid={errors.email ? "true" : "false"}
        {...register('email', { required: true })}
      />
      <button type="submit" className={styles.form_submit}>Password Reset</button>
    </form>
  )
}
