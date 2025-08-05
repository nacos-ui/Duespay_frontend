import React from "react";
import ErrorModal from "./ErrorModal";

export default class ErrorBoundaryWithModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMsg: "", errorTitle: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMsg: error.message || "An error occurred.", errorTitle: "Internal Server Error" };
  }

  componentDidCatch(error, errorInfo) {
    // You can log errorInfo to a service here if needed
  }

  handleClose = () => {
    this.setState({ hasError: false, errorMsg: "", errorTitle: "" });
    if (this.props.onClose) this.props.onClose();
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorModal
          open={true}
          onClose={this.handleClose}
          title={this.state.errorTitle}
          message={this.state.errorMsg}
        />
      );
    }
    return this.props.children;
  }
}