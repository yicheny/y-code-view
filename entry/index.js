import React from 'react'
import {render} from 'react-dom'
import './index.scss';
import CodeView from "./component/CodeView";

const App = ()=>{
    return <div>
        <CodeView theme='dark' showCode
                  source={require('./doc/测试文档.md').default}/>
    </div>
};

render(<App/>, document.querySelector('#app'));