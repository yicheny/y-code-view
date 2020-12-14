import React, { useState } from 'react'
import {render} from 'react-dom'
import {Card,Button,Modal} from 'y-ui0';
import toDate from './utils/toDate';
import 'y-ui0/lib/style.css';
import '../entry/index.scss';
import './index.scss';
import {CodeViewV2,CodeView,ConsoleView} from "../entry";

const App = ()=>{
    return <CardBox current='CodeViewV2测试-支持模块导入导出'>
        <Card title='ConsoleView测试-二期'>
            <ConsoleView source={require('./doc/ConsoleView测试-二期.md')} dependencies={{toDate}}/>
        </Card>
        <Card title='ConsoleView测试-across（默认）'>
            <ConsoleView source={require('./doc/ConsoleView测试.md')} dependencies={{toDate}}/>
        </Card>
        <Card title='ConsoleView测试-vertical'>
            <ConsoleView direction='vertical' source={require('./doc/ConsoleView测试.md')}/>
        </Card>
        <Card title='原生代码演示'>
            <CodeView theme='neo' showCode={false} dependencies={{useState}}>{require('./doc/原生演示文档.md')}</CodeView>
        </Card>
        <Card title='Modal-弹出框'>
            <CodeView showCode source={require('./doc/y-ui0演示文档.md').default} dependencies={{Button,Modal,useState}}/>
        </Card>
        <Card title='错误捕捉踩坑记录-弹出框'>
            <CodeView source={require('../doc/错误捕捉踩坑记录.md')}/>
        </Card>
        <Card title='CodeViewV2测试-运行多份代码'>
            <CodeViewV2>{require('./doc/CodeViewV2测试-运行多份代码.md')}</CodeViewV2>
        </Card>
        <Card title='CodeViewV2测试-支持模块导入导出'>
            <CodeViewV2>{require('./doc/CodeViewV2测试-支持模块导入导出.md')}</CodeViewV2>
        </Card>
    </CardBox>
};

render(<App/>, document.querySelector('#app'));

function CardBox({children,current}){
    const content = [];
    React.Children.forEach(children,x=>{
        if(x.props.title === current) content.push(x);
    })
    return <div>
        {content}
    </div>
}
