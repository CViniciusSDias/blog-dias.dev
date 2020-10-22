import React from "react"
import { Link } from "gatsby"
import { Helmet } from "react-helmet"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath

  const HTag = isRootPath ? 'h1' : 'h3';
  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <Helmet>
        <link rel="stylesheet" href="/css/fonts.css" />
      </Helmet>
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
        <a href="https://youtube.com/DiasDeDev?sub_confirmation=1" target="_blank">
          YouTube&nbsp;<img src="/img/external-link-symbol.svg" alt="Símbolo de link externo" aria-hidden="true" width="12" />
        </a>
        <a href="https://github.com/PHPRio/CFP/issues?q=label%3APalestras+author%3Acviniciussdias" target="_blank">
          Palestras&nbsp;<img src="/img/external-link-symbol.svg" alt="Símbolo de link externo" aria-hidden="true" width="12" />
        </a>
      </nav>
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()}, Dias de Dev
      </footer>
    </div>
  )
}

export default Layout
