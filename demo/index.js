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
            <CodeView theme='neo' showCode dependencies={{useState}}>{require('./原生演示文档.md')}</CodeView>
        </Card>
        <Card title='Modal-弹出框'>
            <CodeView showCode source={require('./y-ui0演示文档.md').default} dependencies={{Button,Modal,useState}}/>
        </Card>
        <Card title='错误捕捉踩坑记录-弹出框'>
            <CodeView source={require('../doc/错误捕捉踩坑记录.md')}/>
        </Card>
    </div>
};

render(<App/>, document.querySelector('#app'));
