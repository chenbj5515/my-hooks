import React, {useState} from 'react';

export default function App() {
    const [count, setCount] = useState(0);
    return (
        <>
            <div>{count}</div>
            <div onClick={() => setCount(count + 1)}>click to add count</div>
            <div onClick={() => setTimeout(() => console.log(count), 3000)}>click to log count 3s later</div>
        </>
    )
}