import React from 'react'


export default function BillList(props) {
  const { bills } = props

  const renderedBills = bills.map(function(bill) {
    return <Bill key={bill.id} bill={bill} />;
  })

  return (
    <div className="card list">
      {renderedBills}
    </div>
  )
}


function Bill(props) {
  const {
    shorthand_title,
    short_description,
    mpa_stance,
  } = props.bill

  const billId = props.bill.id.replace(/\s/g, '\u00A0')

  return (
    <div className="list-item">
      <div className="row">
        <div className="col-xs"><div className="box title-description">
          <div className="title">
            {shorthand_title} &nbsp;
            <span className="bill-id">{billId}</span>
          </div>
          <div className="description">{short_description}</div>
        </div></div>
        { mpa_stance &&
          <div className="col-xs-3 col-sm-2">
            <div className="box">
              <div className="title">MPA Stance</div>
              <div className={`stance ${mpa_stance}`}>{mpa_stance}</div>
            </div>
          </div>
        }
        <div className="col-xs-12 col-sm-2"><div className="box">
          <button className="full-width">Details</button>
        </div></div>
      </div>
    </div>
  )
}
