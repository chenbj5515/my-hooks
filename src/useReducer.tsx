import React, { useReducer, useEffect } from "react";

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { count, step } = state;

  useEffect(() => {
    const id = setInterval(() => {
      return dispatch({ type: 'add' });
    }, 1000);
    return () => clearInterval(id);
  }, [dispatch]);

  return (
    <>
      <h1>{count}</h1>
      <input value={step} onChange={e => {
        dispatch({
          type: 'setStep',
          step: Number(e.target.value)
        });
      }} />
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
