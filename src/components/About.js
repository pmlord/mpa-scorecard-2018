import React from 'react'
import { aboutSections, faqs } from '../data/'
import Linkify from 'react-linkify'

function splitParagraphs(content='') {
  return content.split("\n\n").map(function(paragraph, i) {
    return <p key={i}><Linkify>{paragraph}</Linkify></p>
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
        <Linkify>{splitParagraphs(faq.Answer)}</Linkify>
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
