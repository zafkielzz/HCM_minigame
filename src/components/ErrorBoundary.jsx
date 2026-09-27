import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-2xl font-bold">
              ⚠️
            </div>
            <h3 className="title-1st text-lg text-slate-900">Đã xảy ra sự cố hiển thị</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hệ thống đã tự động bảo vệ giao diện. Vui lòng thử tải lại hoặc quay về giao diện chính.
            </p>
            {this.state.error?.message && (
              <div className="p-2.5 rounded-xl bg-slate-100 text-[11px] font-mono text-slate-700 text-left overflow-x-auto max-h-24">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
            >
              Tiếp tục / Đóng
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
