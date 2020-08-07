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
            alert('报错信息：'.concat(error));
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
