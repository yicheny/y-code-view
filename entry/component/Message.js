import React from 'react';
import ReactDOM from 'react-dom';
import Icon from './Icon';

function Notice(props) {
    const {info,icon} = props;

    return <div className='notice'>
        {icon && <Icon name={icon} />}
        {info}
    </div>
}
Notice.defaultProps={
    info:'',
    icon:''
};

class Message{
    constructor(){
        this.box = null;
        // this.timeId = null;
        this.destoryTime = 3200;
        this.infos = [];
        this.divQueue = [];
        // this.infoMaxLen = 10;
    }

    autoDestory = ()=>{
        this.timeId = setTimeout(()=>{
            this.destory()
        },this.destoryTime);
    };

    destory = ()=>{
        const div = this.divQueue.shift();
        this.infos.shift();
        div.parentNode.removeChild(div);
    };

    addBox = ()=>{
        if(!this.box){
            this.box = document.createElement('div');
            this.box.className = 'y-message-box';
            document.body.appendChild(this.box);
        }
    };

    addDivQueue = (div)=>{
        this.divQueue.push(div);
    };

    addDiv = (info)=>{
        this.addBox();
        const div = document.createElement('div');
        div.className = 'y-message';
        this.box.appendChild(div);
        this.addDivQueue(div);
        ReactDOM.render(Notice(info),div);
    };

    addInfo = (info)=>{
        this.infos.push(info)
    };

    show = (info,destoryTime)=>{
        if(destoryTime) this.destoryTime=destoryTime;
        this.addInfo(info);
        this.addDiv(info);
        this.autoDestory();
    };
}

const message = new Message();
export default message;
