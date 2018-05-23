import React from 'react'

function Options({options, placeholder}) {
  const renderedOptions = []

  if (placeholder != null) {
    renderedOptions.push(
      <option key="placeholder" disabled value="">{placeholder}</option>
    )
  }

  options.forEach(function(option) {
    let label, value;

    if (typeof(option) === 'object') {
      label = option.label
      value = option.value
    }
    else {
      label = value = option
    }

    renderedOptions.push(
      <option
        key={value}
        value={value}
      >
        {label}
      </option>
    )
  })

  return renderedOptions
}

function Select(props) {
  const {
    options,
    value,
    onChange,
    placeholder,
    selectProps,
  } = props

  return (
    <select
      value={value}
      onChange={onChange}
      {...selectProps}
    >
      <Options options={options} placeholder={placeholder} />
    </select>
  )
}

export default Select
