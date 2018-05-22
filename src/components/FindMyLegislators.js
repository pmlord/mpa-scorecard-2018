import React from 'react'
import Select from './Select'
import towns from '../data/townNames.json'

function FindMyLegislators() {
  return (
    <div className="find-my-legislators">
      <Select
        selectProps={{
          placeholder: "hello world",
        }}
        options={towns}
        />
      <input />
      <button>
        Find my reps
      </button>
    </div>
  )
}

export default FindMyLegislators
