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
      <div className="nav">
        <ul >
          <li><Link href="/About">About</Link></li>
          <li><Link href="/Contact">Contact</Link></li>
          <li><a href="https://news.railstutorial.org/">News</a></li>
        </ul>
      </div>
    </footer>
  )
}
