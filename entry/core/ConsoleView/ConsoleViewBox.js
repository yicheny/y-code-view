import React from 'react';
import clsx from "clsx";
import Icon from "../../component/Icon";
import _ from "lodash";
import ViewColValue from "./ViewColValue";

export default function ConsoleViewBox({ data }) {
    return <div className="cv-console-view-box">
        {
            _.map(data,(x,i)=><ViewCol key={i} data={x}/>)
        }
    </div>
}

function ViewCol(props){
    const {data} = props;
    return <div className={clsx('v-col')}>
        <Icon name='arrowDown' size={12}/>
        <div className="content">
            {
                _.map(data,(x,i)=><ViewColValue key={i} data={x}/>)
            }
        </div>
    </div>
}
