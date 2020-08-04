import React,{PureComponent} from 'react';

function WithErrorBoundary(WrapComponent){
    return class ErrorBoundary extends PureComponent{
        constructor(props) {
            super(props);
            this.state = {
                // errorInfo: null,
                // error:null
            };
        }

        static getDerivedStateFromError(error) {
            alert('报错信息：'.concat(error))
        }

        // componentDidCatch(error, errorInfo) {
        //     this.setState({error, errorInfo});
        // }

        render(){
            return <WrapComponent {...this.props}/>;
        }
    }
}
export default WithErrorBoundary;

// function Preview(props) {
//     const {children,error} = props;
//
//     if (error) return <pre className="code-view-error">{error}</pre>;
//     return <div className="code-view">{children}</div>;
// }
