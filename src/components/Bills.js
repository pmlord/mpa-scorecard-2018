import React from 'react'
import BillList from './BillList'
import { bills } from '../data/'


class Bills extends React.Component {
  render() {
    return (
      <div className="bills container">
        <section>
          <div className="row">
            <div className="col-xs"><div className="box">
              <h1>Bills</h1>
            </div></div>
          <div className="col-xs-12 col-sm-4 col-md-3"><div className="box">
              <select className="full-width" />
            </div></div>
          <div className="col-xs-12 col-sm-4 col-md-3"><div className="box">
              <select className="full-width" />
            </div></div>
          </div>
        </section>
        <section>
          <BillList bills={bills} />
        </section>
      </div>
    )
  }
}

export default Bills
