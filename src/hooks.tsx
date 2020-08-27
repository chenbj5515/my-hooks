import React, {useState, useRef} from 'react';
import './App.css';

const Child = React.memo((props: any) => {
    console.log('Child rerender')
    // const {countRef} = props;
    return (
        <div>
            Child
        </div>
    )
});
function App() {
    const [count, setCount] = useState(0);
    const countRef = useRef({
        name: 'chenbj'
    });
    return (
        <>
            <div>{count}</div>
            <div onClick={() => setCount(count + 1)}>emit rerender</div>
            <Child countRef={countRef}/>
        </>
    );
}

export default App;
