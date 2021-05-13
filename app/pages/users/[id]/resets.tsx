import { useState, useContext } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
//components
import { Layout } from '../../../components/Layout'
//hooks
import { useFormErrors } from '../../../hooks/useFormErrors'
//Bootstrap
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
//othres
import { FlashMessageContext } from '../../../pages/_app'

type ValueType = {
  password: string,
  password_confirmation: string
}

const Resets: React.FC = () => {
  const [passwordState, setPassWordState] = useState(false)
  const [confirmationState, setConfirmationState] = useState(false)

  const initialFormState = { password: '', password_confirmation: '' }
  const [inputValue, setInputValue] = useState<ValueType>(initialFormState)

  //FormErrorのhook関連
  const initialerrors = { password: '', password_confirmation: '' };
  const { errors, handleError, resetError } = useFormErrors(initialerrors)

  //Flash Message
  const { FlashDispatch } = useContext(FlashMessageContext)

  //Passwordの状態を動作しやすくする
  const OutputType = (bool: boolean): "text" | "password" => {
    if (bool) {
      return "text"
    } else {
      return "password"
    }
  }

  //router機能を設定
  const router = useRouter()
  const { id, email } = router.query

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setInputValue({ ...inputValue, [name]: value })
  }

  const handleSubmit = () => {
    const endpoint = process.env.NEXT_PUBLIC_BASE_URL + 'password_resets/' + id + '?email=' + email
    fetch(endpoint, {
      method: 'PUT', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: {
          password: inputValue.password,
          password_confirmation: inputValue.password_confirmation
        }
      }),
    })
      .then(response => {
        if (!response.ok) {
          response.json()
            .then((res): any => {
              console.log({ res })
              if (res.hasOwnProperty('message')) {
                //authentication関連のエラー処理
                FlashDispatch({ type: "DANGER", message: res.message })
              } else if (res.hasOwnProperty('errors')) {
                //form関連のerror処理
                FlashDispatch({ type: "DANGER", message: "Your form is invalid!" })
                handleError(res.errors)
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
        resetError();
        router.push('/')
        FlashDispatch({ type: "SUCCESS", message: "Password is updated Successfully" })
      })
      .catch((error) => {
        console.error(error)
        FlashDispatch({ type: "DANGER", message: "Error" })
      });
  }

  return (
    <Layout>
      <Head>
        <title>Password Resets | Sample App</title>
      </Head>
      <h1>Password Resets</h1>
      <div>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control name="password" type={OutputType(passwordState)} placeholder="Enter New Password" value={inputValue.password} onChange={handleInputChange} />
          {passwordState ? (<Button className='mt-1' size="sm" variant="secondary" onClick={() => setPassWordState(!passwordState)}>Hide</Button>) : (<Button className='mt-1' size="sm" variant="secondary" onClick={() => setPassWordState(!passwordState)}>Show</Button>)}
          {errors.password !== '' && (
            <p className='text-danger'>Password {errors.password}</p>
          )}
        </Form.Group>

        <Form.Group controlId="formBasicPassword_Conformed">
          <Form.Label>Password_confirmation</Form.Label>
          <Form.Control name="password_confirmation" type={OutputType(confirmationState)} placeholder="Password Confirmation" value={inputValue.password_confirmation} onChange={handleInputChange} />
          {confirmationState ? (<Button className='mt-1' size="sm" variant="secondary" onClick={() => setConfirmationState(!confirmationState)}>Hide</Button>) : (
            <Button className='mt-1' size="sm" variant="secondary" onClick={() => setConfirmationState(!confirmationState)}>Show</Button>
          )}
          {errors.password_confirmation !== "" && (
            <p className='text-danger'>Password_confirmation {errors.password_confirmation}</p>
          )}
        </Form.Group>

        <Button variant="primary" onClick={() => handleSubmit()}>
          Submit
      　</Button>
      </div>
    </Layout>
  )
}

export default Resets
