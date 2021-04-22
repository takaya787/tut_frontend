import { useCallback, useContext } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
//Bootstrap
import Button from 'react-bootstrap/Button'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Dropdown from 'react-bootstrap/Dropdown'
//Context
import { FlashMessageContext, UserContext } from '../pages/_app'
//Module
import { Auth } from '../modules/Auth'

export const Header: React.FC = () => {
  //router機能
  const router = useRouter()

  //contexts
  const { FlashDispatch } = useContext(FlashMessageContext)
  const { user, setUser } = useContext(UserContext)

  //Logout時の処理をCallBack化しておく
  const ClickLogout = useCallback((): void => {
    setUser({ email: '', id: 0, gravator_url: '', name: '' })
    Auth.logout()
    router.push("#")
    FlashDispatch({ type: "SUCCESS", message: "You are logged out successfully!" })
  }, [])

  return (
    <header>
      <Navbar bg='dark' variant="dark" className="my-3">
        <Navbar.Brand href="#"> Sample App</Navbar.Brand>
        <Nav className="ml-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/help">Help</Nav.Link>
          {Auth.isLoggedIn() && (
            <>
              <Dropdown>
                <Dropdown.Toggle variant="dark" id="dropdown button" size="sm">
                  Account <b className="caret"></b>
                </Dropdown.Toggle>

                <Dropdown.Menu >
                  <Dropdown.Header>User Menu</Dropdown.Header>
                  <Dropdown.Item href={`/users/${user.id}`}>Profile</Dropdown.Item>
                  <Dropdown.Item href="#">Settings</Dropdown.Item>
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
