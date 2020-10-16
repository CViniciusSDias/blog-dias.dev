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
      <nav className="menu">
        <Link to="/">Home</Link>
        <Link to="/sobre-mim">
          Sobre Mim
        </Link>
        <Link to="https://youtube.com/DiasDeDev?sub_confirmation=1" target="_blank">
          YouTube&nbsp;<img src="/img/external-link-symbol.svg" alt="Símbolo de link externo" aria-hidden="true" width="12" />
        </Link>
        <Link href="https://github.com/PHPRio/CFP/issues?q=label%3APalestras+author%3Acviniciussdias" target="_blank">
          Palestras&nbsp;<img src="/img/external-link-symbol.svg" alt="Símbolo de link externo" aria-hidden="true" width="12" />
        </Link>
      </nav>
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()}, Dias de Dev
      </footer>
    </div>
  )
}

export default Layout
