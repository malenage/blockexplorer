import React from 'react'

interface Props {
    label: string;
    type: string;
    placeholder: string;
}

const Input = ({label, type, placeholder} : Props) => {
  return (
    <div className="mb-3">
        <label className="form-label">{label}</label>
        <input type={type} className="form-control" id="exampleFormControlInput1" placeholder={placeholder} />
    </div>
  )
}

export default Input