import React from 'react';
import cls from 'clsx';

function Icon(props) {
    let {name,size,style,className,color,...rest} = props;

    return <i className={cls('iconfont',`icon-${name}`,className)}
               style={{...style,fontSize:size,color}}
               {...rest}>
    </i>;
}
Icon.defaultProps={
    name:'',
    size:20,
    style:{},
    className:'',
};

export default Icon;