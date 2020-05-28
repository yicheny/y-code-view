import React from 'react'
import {render} from 'react-dom'
import CodeView from "../entry/component/CodeView";
import {DatePicker,Card} from 'y-ui0';

import 'y-ui0/lib/style.css';
import '../entry/index.scss';
import './index.scss';

const App = ()=>{
    return <div>
        <Card title='原生代码演示'>
            <CodeView theme='dark' showCode source={require('./原生演示文档.md').default}/>
        </Card>
        <Card title='日期选择器-DatePicker' contentStyle={{display:'flex',minHeight:428}}>
            <CodeView source={require('./y-ui0演示文档.md').default} dependencies={{DatePicker}}/>
        </Card>
    </div>
};

render(<App/>, document.querySelector('#app'));
