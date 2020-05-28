import React from 'react'
import {render} from 'react-dom'
import '../entry/index.scss';
import './index.scss';
import CodeView from "../entry/component/CodeView";

const App = ()=>{
    return <div>
        <CodeView theme='dark' showCode
                  source={require('./测试文档.md').default}/>
    </div>
};

render(<App/>, document.querySelector('#app'));
