import React from 'react'
import {render} from 'react-dom'
import {Markdown} from "y-markdown";
import './index.scss';
import 'y-markdown/lib/index.css';

const App = ()=>{
    return <Markdown>
    {require('./doc/测试文档.md').default}
</Markdown>;
};

render(<App/>, document.querySelector('#app'));