import React, {useState} from 'react';
import clsx from "clsx";

function Switch(props) {
    const {defaultChecked,onChange,checkedChildren,unCheckedChildren,className,style} = props;
    const [checked,setChecked] = useState(defaultChecked);

    return <span className={clsx("cv-switch",{checked},className)} onClick={handleClick} style={style}>
        <span className="cv-switch-dot"/>
        <span className="cv-switch-inner">{checked ? checkedChildren : unCheckedChildren}</span>
    </span>

    function handleClick(){
        const nextChecked = !checked;
        setChecked(nextChecked);
        if(onChange) onChange(nextChecked)
    }
}
Switch.defaultProps={
    defaultChecked:false,
    checkedChildren:null,
    unCheckedChildren:null
}

export default Switch;
