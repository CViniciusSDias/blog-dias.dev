import React from "react"
import { Link } from "gatsby"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath

  const HTag = isRootPath ? 'h1' : 'h3';
  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">
        <HTag className="main-heading">
          <Link to="/">{title}</Link>
        </HTag>
      </header>
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()}, <a href="https://youtube.com/DiasDeDev">Dias de Dev</a>
      </footer>
    </div>
  )
}

export default Layout
