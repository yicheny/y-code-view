import React,{useState} from 'react'
import {render} from 'react-dom'
import CodeView from "../entry/component/CodeView";
import {Card,Button,Modal} from 'y-ui0';

import 'y-ui0/lib/style.css';
import '../entry/index.scss';
import './index.scss';

const App = ()=>{
    return <div>
        <Card title='原生代码演示'>
            <CodeView theme='dark' showCode source={require('./原生演示文档.md').default}/>
        </Card>
        <Card title='Modal-弹出框'>
            <CodeView source={require('./y-ui0演示文档.md').default} dependencies={{Button,Modal,React,useState}}/>
        </Card>
    </div>
};

render(<App/>, document.querySelector('#app'));
