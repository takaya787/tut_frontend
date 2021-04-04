import Link from 'next/link'
//Bootstrap
import Nav from 'react-bootstrap/Nav'
//components

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <small>
        The <a href="https://railstutorial.jp/">Ruby on Rails Tutorial</a>
        by <a href="https://www.michaelhartl.com/">Michael Hartl</a>
      </small>
      <Nav>
        <ul>
          <li><Link href="#">About</Link></li>
          <li><Link href="#">Contact</Link></li>
          <li><a href="https://news.railstutorial.org/">News</a></li>
        </ul>
      </Nav>
    </footer>
  )
}
