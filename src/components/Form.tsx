import React from 'react';
// import { useState } from 'react';

interface Props {
  label: string;
  type: string;
  id: string;
  value: string;
  buttonText: string;
  placeholder: string;
  onSubmit: (e: any) => void;
  onChange: (e: any) => void;
}

const Form = ({label, type, id, value, buttonText, placeholder, onSubmit, onChange} : Props) => {
  // console.log(onSubmit);
  return (
    <form className="row g-3" onSubmit={onSubmit}>
      <div className="col-auto">
        <h1>{label}</h1>
        {/* <label className="visually-hidden">{label}</label> */}
        <input type={type} className="form-control-plaintext" id={id} value={value} placeholder={placeholder} onChange={onChange}/>
      </div>
      <div className="col-auto">
        <button type="submit" className="btn btn-primary mb-3">{buttonText}</button>
      </div>
    </form>
  )
}
// const Form = ({label, type, id, buttonText, placeholder, onSubmit} : Props) => {
//   const [address, setAddress] = useState('0x...');
//   return (
//     <>
//     <input
//         value={address}
//         onChange={e => setAddress(e.target.value)}
//       />
//       <button onClick={() => setAddress(e.target.value)}>
//         Search
//       </button>
//     </>
//   )
// }

export default Form