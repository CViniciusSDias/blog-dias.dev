import React from "react"
import { graphql } from "gatsby"
import SEO from "../components/seo"
import Layout from "../components/layout"

export default ( { data, location }) => {
  const siteTitle = data?.site?.siteMetadata?.title

  return <Layout location={location} title={siteTitle}>
      <SEO title="Sobre Mim" />
      <h1>Sobre Mim</h1>
      <h2>Vinicius Dias</h2>

      <p>
        Estudante e amante de desenvolvimento desde os 14 anos, me especializei
        em PHP e com 19 anos tirei minha primeira certificação.
        Hoje sou <strong>Zend Certified Engineer</strong> e <strong>iMasters Certified Professional</strong>.
      </p>

      <p>
        Graduado em Tecnologia da Informação e Comunicação na FAETERJ Petrópolis,
        tive oportunidade de organizar e palestrar em diversos eventos de
        tecnologia falando principalmente sobre boas práticas de programação.
      </p>
      <p>
        Atualmente trabalho como Desenvolveldor Fullstack em uma empresa
        Canadense chamada TemboSocial e sou Instrutor na Alura, plataforma de
        cursos online.
      </p>
      <p>
        Grande entusiasta de Object Calisthenics, SOLID, Design Patterns e tudo
        que há de bom, tento sempre seguir a regra do bom escoteiro:&nbsp;
        <i>"Sempre deixe o código mais limpo do que quando você o encontrou"</i>
      </p>
    </Layout>
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
