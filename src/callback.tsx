import React, { useReducer, useState, useEffect } from "react";

const Child = React.memo((props: { setCount: any; }) => {
    console.log('Child rerender');
    const {setCount} = props;
    return (
        <>
            <div onClick={() => setCount((count: number) => count + 1)}>setCount</div>
        </>
    )
})

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
//   const { count, step } = state;
  const [count, setCount] = useState(0);
  const [other, setOther] = useState(0);

//   useEffect(() => {
//     const id = setInterval(() => {
//       return dispatch({ type: 'add' });
//     }, 1000);
//     return () => clearInterval(id);
//   }, [dispatch]);

  return (
    <>
        <div>count: {count}</div>
        <div>other: {other}</div>
        <div onClick={() => setOther(other + 1)}>change other</div>
        <Child setCount={setCount}/>
    </>
  );
}

const initialState = {
  count: 0,
  step: 1,
};

function reducer(state: { count: any; step: any; }, action: { type: string; step?: any; }) {
  const { count, step } = state;
  switch (action.type) {
    case 'add': 
      return { count: count + step, step }
    case 'setStep':
      return { count, step: action.step}
    default:
      return { count, step }
  }
}
