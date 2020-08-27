import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

interface States {
  // useState, useReducer, useRef等会用到的当前值
  _value: any;
  // 回调
  _callback: Function;
  _deps: Array<any> | undefined;
  _cleanup: Function | void;
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

function useEffect(effect: () => Function | void, deps?: any[] | undefined) {
    const hooksState = getHooksState(hookIdx++);
    if (depsChanged(hooksState._deps, deps)) {
        if (hooksState._cleanup) {
            hooksState._cleanup();
        }
        hooksState._deps = deps;
        hooksState._cleanup = effect();
    }
    
}

function App() {
    const [count, setCount] = useState(0);
    useEffect(() => {
        console.log('effect')
        return () => {
            console.log('clean up effect')
        }
    })
    return (
        <>
            <div onClick={() => setCount(count + 1)}>add count</div>
        </>
    );
}

export default App;
