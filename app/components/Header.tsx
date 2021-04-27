import { useCallback, useContext } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
//Bootstrap
import Button from 'react-bootstrap/Button'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Dropdown from 'react-bootstrap/Dropdown'
//Context
import { FlashMessageContext } from '../pages/_app'
//Module
import { Auth } from '../modules/Auth'
//hooks
import { useUserSWR } from '../hooks/useUserSWR'

export const Header: React.FC = () => {
  //router機能
  const router = useRouter()
  //
  const { user_data, user_error, has_user_key } = useUserSWR()

  //contexts
  const { FlashDispatch } = useContext(FlashMessageContext)

  //Logout時の処理をCallBack化しておく
  const ClickLogout = useCallback((): void => {
    Auth.logout()
    router.push("/")
    FlashDispatch({ type: "SUCCESS", message: "You are logged out successfully!" })
  }, [])

  return (
    <header>
      <Navbar bg='dark' variant="dark" className="my-3">
        <Navbar.Brand href="#"> Sample App</Navbar.Brand>
        <Nav className="ml-auto">
          <div className="nav-link">
            <Link href="/">Home</Link>
          </div>
          <div className="nav-link">
            <Link href="/help">Help</Link>
          </div>

          {Auth.isLoggedIn() && user_data && has_user_key() && (
            <>
              <Dropdown>
                {/* <Dropdown.Toggle variant="dark" id="dropdown button" size="sm">
                  <Button variant="outline-danger" >Account <b className="caret"></b></Button>
                </Dropdown.Toggle> */}
                <Button variant="primary" size="sm" >
                  <Dropdown.Toggle variant="primary" id="dropdown button" size="sm">Account <b className="caret"></b></Dropdown.Toggle>
                </Button>

                <Dropdown.Menu >
                  <Dropdown.Header>{user_data.user.name}</Dropdown.Header>
                  <Dropdown.Item><Link href={`/users/${user_data.user.id}`}> Profile </Link></Dropdown.Item>
                  <Dropdown.Item><Link href="#">Settings</Link></Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item ><Button variant="outline-danger" onClick={() => ClickLogout()}>Logout</Button></Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          )}
        </Nav>
      </Navbar>
    </header>
  )
}
