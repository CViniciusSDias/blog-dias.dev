/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            twitter
          }
        }
      }
    }
  `)

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const author = data.site.siteMetadata?.author
  const social = data.site.siteMetadata?.social

  return (
    <div className="bio">

      <div style={{ marginRight: 'var(--spacing-4)' }}>
        <img src="https://gravatar.com/avatar/63579c5a873f3ab6abff10803e9a252f.jpg?s=50"
             alt="Foto de Vinicius Dias segurando um microfone durante uma palestra"
             style={{
               borderRadius: '50%',
               width: 50.01,
               height: 50.01,
             }} />
      </div>
      {author?.name && (
        <p>
          Escrito por <strong>{author.name}</strong> {author?.summary || null}
          {` `}
          <a href={`https://twitter.com/${social?.twitter || ``}`}>
            Que tal seguir ele no Twitter?
          </a>
        </p>
      )}
    </div>
  )
}

export default Bio
