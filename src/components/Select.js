import React from 'react'

function Options({options}) {
  return options.map(function(option) {
    let label, value;

    if (typeof(option) === 'object') {
      label = option.label
      value = option.value
    }
    else {
      label = value = option
    }

    return (
      <option
        key={value}
        value={value}
      >
        {label}
      </option>
    )
  })
}

function Select(props) {
  const {
    selectProps,
    options,
    value,
    onChange,
  } = props

  return (
    <select
      value={value}
      onChange={onChange}
      {...selectProps}
    >
      <Options options={options} />
    </select>
  )
}

export default Select
