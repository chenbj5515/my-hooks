import React, { useState } from "react";

export default function Counter() {
    const [count, setCount] = useState(0);
    return (
        <>
            <div>{count}</div>
            <div onClick={() => setCount(count + 1)}>click to add count</div>
            <div onClick={() => setTimeout(() => setCount(count => count + 1), 3000)}>click to show count 3s later</div>
        </>
    )
}

