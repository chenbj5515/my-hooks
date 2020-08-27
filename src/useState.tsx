import React, { useState } from "react";

export default function Counter() {
    let count = 0;
    return (
        <>
            <div onClick={() => count++}></div>
            <div>{count}</div>
        </>
    )
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
