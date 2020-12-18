import React, { useState } from 'react'
import {render} from 'react-dom'
import {Card,Button,Modal} from 'y-ui0';
import toDate from './utils/toDate';
import 'y-ui0/lib/style.css';
import '../entry/index.scss';
import './index.scss';
import {CodeViewV2,CodeView,ConsoleView} from "../entry";

const App = ()=>{
    return <CardBox current='CodeView测试-Modal弹出框'>
        <Card title='ConsoleView测试-二期'>
            <ConsoleView source={require('./doc/ConsoleView测试-二期.md')} dependencies={{toDate}}/>
        </Card>
        <Card title='ConsoleView测试-across（默认）'>
            <ConsoleView source={require('./doc/ConsoleView测试.md')} dependencies={{toDate}}/>
        </Card>
        <Card title='ConsoleView测试-vertical'>
            <ConsoleView direction='vertical' source={require('./doc/ConsoleView测试.md')}/>
        </Card>
        <Card title='ConsoleView-引入外部依赖'>
            <ConsoleView dependencies={{'rootnet-core/dateFormat':{toDate}}} source={require('./doc/ConsoleView-引入外部依赖.md')}/>
        </Card>

        <Card title='CodeView测试-原生代码演示'>
            <CodeView theme='neo' showCode={false} dependencies={{useState}}>{require('./doc/CodeView-原生测试.md')}</CodeView>
        </Card>
        <Card title='CodeView测试-Modal弹出框'>
            <CodeView showCode source={require('./doc/CodeView-引入依赖.md').default} dependencies={{Button,Modal,useState}}/>
        </Card>
        <Card title='错误捕捉踩坑记录-弹出框'>
            <CodeView source={require('../doc/错误捕捉踩坑记录.md')}/>
        </Card>

        <Card title='CodeViewV2测试-运行多份代码'>
            <CodeViewV2>{require('./doc/CodeViewV2-运行多份代码.md')}</CodeViewV2>
        </Card>
        <Card title='CodeViewV2测试-支持模块导入导出'>
            <CodeViewV2>{require('./doc/CodeViewV2-支持模块导入导出.md')}</CodeViewV2>
        </Card>
        <Card title='CodeViewV2测试-引入外部依赖'>
            <CodeViewV2 dependencies={{ 'y-ui0':{Card,Button,Modal}}}
                        expanded={true}
                        delay={600}>{require('./doc/CodeViewV2-引入外部依赖.md')}</CodeViewV2>
        </Card>
    </CardBox>
};

render(<App/>, document.querySelector('#app'));

function CardBox({children,current}){
    const content = [];
    React.Children.forEach(children,x=>{
        if(current==='all') return content.push(x);
        if(x.props.title.includes(current)) return content.push(x);
    })
    return <div>
        {content}
    </div>
}
