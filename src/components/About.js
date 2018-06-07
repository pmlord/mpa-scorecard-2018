import React from 'react'
import { aboutSections, faqs } from '../data/'
import Linkify from 'react-linkify'


// const homepageRegExp = /https?:\/\/(\w+\.)?mpascorecard\.(org|com)/
//
// function handleClick(e) {
//   const href = e.target.href
//   if (href.match(homepageRegExp)) {
//     const path = href.replace(homepageRegExp, '')
//     window.history.pushState({}, null, path)
//     e.preventDefault()
//     return false
//   }
// }

const linkProps = { target: '_blank' }

function splitParagraphs(content='') {
  return content.split("\n\n").map(function(paragraph, i) {
    return <p key={i}><Linkify properties={linkProps}>{paragraph}</Linkify></p>
  })
}

export default function About() {
  const renderedAboutSections = aboutSections.map(function(section, i) {
    const { heading, paragraph } = section

    return (
      <section className="about" key={i}>
        <h1>{heading}</h1>
        {splitParagraphs(paragraph)}
      </section>
    )
  })

  const renderedFaqs = faqs.map(function(faq, i) {
    return (
      <div key={i}>
        <h3>{faq.Question}</h3>
        <Linkify properties={linkProps}>{splitParagraphs(faq.Answer)}</Linkify>
      </div>
    )
  })

  return (
    <div className="about-page container">
      {renderedAboutSections}
      <section className="faq">
        <h1>FAQs</h1>
        {renderedFaqs}
      </section>
    </div>
  )
}
