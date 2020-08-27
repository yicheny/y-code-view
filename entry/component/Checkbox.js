import React,{useState} from "react";
import clsx from "clsx";

export default function Checkbox(props) {
    let {style,className,onChange,defaultChecked} = props;
    const [checked,setChecked] = useState(defaultChecked);

    return <span className={clsx("cv-checkbox",className)} style={style} onClick={handleClick}>
        <span className={clsx('cv-checkbox-box',{checked})}/>
    </span>

    function handleClick(){
        const nextChecked = !checked;
        setChecked(nextChecked);
        if(onChange) onChange(nextChecked);
    }
}
