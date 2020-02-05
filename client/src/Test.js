import React from 'react';

//  Same as below, but as a reusable custom hook

// const useStateWithLocalStorage = localStorageKey => {
//   const [value, setValue] = React.useState(
//     localStorage.getItem(localStorageKey) || ''
//   );
//   React.useEffect(() => {
//     localStorage.setItem(localStorageKey, value);
//   }, [value]);
//   return [value, setValue];
// };
// const Test = () => {
//   const [value, setValue] = useStateWithLocalStorage(
//     'myValueInLocalStorage'
//   );

//   const onChange = event => setValue(event.target.value);
//   return (
//     <div>
//       <h1>Hello React with Local Storage!</h1>
//       <input value={value} type="text" onChange={onChange} />
//       <p>{value}</p>
//     </div>
//   );
// };

//  Saves all typed values and displays them below
//  saves and gets from local state

const Test = () => {
  const [value, setValue] = React.useState(
    localStorage.getItem('myValueInLocalStorage') || ''
  );
  React.useEffect(() => {
    localStorage.setItem('myValueInLocalStorage', value);
  }, [value]);
  const onChange = event => setValue(event.target.value);

  return (
    <div>
      <h1>Hello React with Local Storage!</h1>
      <input value={value} type="text" onChange={onChange} />
      <p>{value}</p>
    </div>
  );
};

export default Test;