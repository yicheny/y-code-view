import React, {Fragment, useRef, useState, useEffect} from 'react';
import clsx from "clsx";
import {usePopper} from 'react-popper';

function getPopperOption(placement) {
    return {
        strategy: "fixed",
        placement,
        modifiers: [
            {
                name: "offset",
                options: {
                    offset: [0, 5]
                }
            }
        ]
    };
}

function Tooltip(props) {
    const {children, title, arrow,placement,onClick,targetClassName} = props;
    const [popper, setPopper] = useState(null);
    const wrapperRef = useRef(null);
    const {styles, attributes} = usePopper(wrapperRef.current, popper, getPopperOption(placement));
    const [show, setShow] = useState(false);

    useEffect(() => {
        const wrapper = wrapperRef.current;
        const hide = () => setShow(false);
        const show = () => setShow(true);

        wrapper.addEventListener("mouseenter", show);
        wrapper.addEventListener("mouseover", show);
        wrapper.addEventListener("mouseleave", hide);

        return () => {
            wrapper.removeEventListener("mouseenter", show);
            wrapper.removeEventListener("mouseover", show);
            wrapper.removeEventListener("mouseleave", hide);
        }
    }, [])

    return (<Fragment>
        <span className={clsx("cv-tooltip-wrapper",targetClassName)} ref={wrapperRef} onClick={onClick}>
            {children}
        </span>
        {show && <div className={clsx("y-tooltip", props.className)} style={{...props.style, ...styles.popper}}
                      ref={setPopper} {...attributes.popper}>
            {title}
            {arrow && <div className="y-tooltip-arrow" style={styles.arrow} data-popper-arrow/>}
        </div>}
    </Fragment>);
}

Tooltip.defaultProps = {
    title:null,
    arrow: true,
    placement:"top"
}

export default Tooltip;
