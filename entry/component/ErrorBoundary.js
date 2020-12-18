import React,{PureComponent,Fragment} from 'react';

class ErrorBoundary extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            // errorInfo: null,
            // error:null
        };
    }

    // static getDerivedStateFromError(error) {
    //     alert('报错信息：'.concat(error));
    // }

    componentDidCatch(error, errorInfo) {
        // this.setState({error, errorInfo});
        const {setError} = this.props;
        // console.error('DidCatch',error,errorInfo.componentStack);
        setError && setError(error.toString())
    }

    render() {
        const {error,children} = this.props;
        if(error) return <pre className="code-view-error">{ error }</pre>;
        return <Fragment>{children}</Fragment>;
    }
}
export default ErrorBoundary;
