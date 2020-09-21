import React, {useState, useRef, useEffect} from 'react';
import ReactDOM from 'react-dom';
import './App.css';

function request(url: any) {
    console.log(url);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < .5) {
                resolve('sucess')
            }
            else {
                reject('fail')
            }
        }, 1000);
    })
}

function useRequest(url: any) {
    const [state, setState] = useState({
        loading: false,
        error: null,
        data: null
    });
    useEffect(() => {
        setState({
            loading: true,
            error: null,
            data: null
        });
        request(url).then((res: any) => {
            setState({
                loading: false,
                error: null,
                data: res
            });
        }).catch(err => {
            setState({
                loading: false,
                error: err,
                data: null
            });
        })
    }, []);
    return state;
}

function App() {
    const {loading, error, data} = useRequest('/user/login');
    if (loading) {
        return <div>loading...</div>
    }
    if (error) {
        return <div>{error}</div>
    }
    if (data) {
        return <div>{data}</div>
    }
    return (
        <>
        </>
    );
}

export default App;
