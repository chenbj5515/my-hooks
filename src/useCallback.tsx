import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

interface States {
  // useState, useReducer, useRef等会用到的当前值
  _value: any;
  // 回调
  _callback: Function;
  _deps: Array<any> | undefined;
}

interface CurrentComponent{
  _hooks: Array<States>;
}

const isType = (type: string) => (target: any) => `[object ${type}]` === Object.prototype.toString.call(target);

// 每次渲染都被重置为0，然后按照hook定义的顺序来递增，这样每个hook就能对应到自己的状态了。
// 这也就是必须保证hook的执行顺序必须每次渲染都保证一致的原因
let hookIdx = 0;
let currentComponent: CurrentComponent = {
  // 储存所有hook的状态，key是某个Hook的ID，value是某个hook的当前状态
  _hooks: []
}

function getHooksState(index: number) {
  const hooks = currentComponent._hooks;
  // 首次的时候，每个Hook都没有状态，所以往自己的位置放一个空的状态
  if (index >= hooks.length) {
    hooks.push({} as States);
  }
  // 后面的渲染中就有状态了，通过index来获取自己的状态
  // React Hooks在设计的时候采用了自增的index来作为标识而没有采用id的形式
  // 这是应该是出于id的命名冲突问题，以及写起来并不优雅的考虑
  return hooks[index];
}

function render() {
  hookIdx = 0;
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  )
}

function isFunction<T>(target: any) : target is ((arg0: any) => T) {
  return isType('Function')(target)
}

function depsChanged(oldDeps?: Array<any>, newDeps?: Array<any>) {
    return !oldDeps || !newDeps || newDeps.some((dep, index) => dep !== oldDeps[index]);
}

function useState<T>(initialState: ((arg0: any) => T) | T) {
  const hooksState = getHooksState(hookIdx++);
  return hooksState._value = [
    hooksState._value ? hooksState._value[0] : initialState,
    function setState(newState: T) {
      if (isFunction<T>(newState)) {
        hooksState._value[0] = newState(hooksState._value[0]);
      }
      else {
        hooksState._value[0] = newState;
      }
      render();
    }
  ]
}

function useMemo(fn: Function, deps?: Array<any>) {
  const hooksState = getHooksState(hookIdx++);
  if (depsChanged(hooksState._deps, deps)) {
    hooksState._deps = deps;
    return hooksState._value = fn();
  }
  return hooksState._value;
}

function useCallback(fn: Function, deps?: Array<any>) {
    return useMemo(() => fn, deps);
}

// function Child(props: any) {
//     const {calc} = props;
//     calc();
//     return (
//         <>
//             <div>复杂计算的结果: {calc()}</div>
//         </>
//     )
// }

const Child = React.memo((props: any) => {
    console.log('Child rerender')
    const {calc} = props;
    return (
        <>
            <div>复杂计算的结果: {calc()}</div>
        </>
    )
})

function App() {
    console.log('root rerender')
    const [count, setCount] = useState(1000);
    const [other, setOther] = useState(0);
    const calc = useCallback((count: number) => {
        console.log('触发了复杂计算');
        let result = 0;
        for (let i = 0; i < count; i++) {
            result += i;
        }
        return result;
    }, [count]);
    return (
        <>
            <Child calc={calc} count={count}/>
            <div>复杂计算的依赖: {count}</div>
            <div>无关变量: {other}</div>
            <div onClick={() => setCount(count + 1)}>改变复杂计算的依赖，触发重新计算</div>
            <div onClick={() => setOther(other + 1)}>改变无关变量，不触发重新计算</div>
        </>
    );
}

export default App;
