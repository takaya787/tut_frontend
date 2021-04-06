import styles from '../styles/Home.module.scss'
import Link from 'next/link'
//Bootstrap
import Nav from 'react-bootstrap/Nav'

export const Header: React.FC = () => {
  return (
    <header className={'navbar ' + 'navbar-fixed-top ' + 'navbar-inverse ' + styles.container}>
      <div className={"container "}>
        <Link href="#"><a id="logo">Sample App</a></Link>
        <Nav>
          <ul className={'nav' + " " + 'navbar-nav' + " " + 'navbar-right'}>
            <li><Link href="/"><a>Home</a></Link></li>
            <li><Link href="/help"><a>Help</a></Link></li>
          </ul>
        </Nav>
      </div>
    </header>
  )
}
