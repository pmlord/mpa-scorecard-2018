import React from 'react'
import { getBillFromParams } from '../services/bill-helpers'

export default function BillDetail({ match }) {
  const bill = getBillFromParams(match.params)

  return (
    <div className="bill-detail">
      <section>
        <h1>{bill.shorthand_title}</h1>
      </section>
      <section>
        <img className="bill-photo" src={bill.photo} alt="" />
        <div className="bill-copy">
          <p>
            {bill.quote}
            <br />
            <span className="quote-attribution">
              &ndash; {bill.quote_attribution}
            </span>
          </p>
          <h2>What is the bill</h2>
          <p>{bill.what_is_the_bill}</p>
          <h2>Why it matters</h2>
          <p>{bill.why_it_matters}</p>
          <h2>What happened</h2>
          <p>{bill.what_happened}</p>
        </div>
      </section>
    </div>
  )
}
