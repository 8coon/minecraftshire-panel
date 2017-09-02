import React, {Component} from 'react';
import './layer-popup.css';


const Z_INDEX_BASE = 6000;


export default class LayerPopup extends Component {

    static components = [];
    static windows = [];

    constructor(props) {
        super(props);
        this.state = {visible: false};

        this.onBackgroundClick = this.onBackgroundClick.bind(this);
        this.onWindowClick = this.onWindowClick.bind(this);
    }

    static openWindow(window) {
        LayerPopup.windows.push(window);
        LayerPopup.toggleComponents(true);
    }

    static closeWindow(window) {
        LayerPopup.windows.splice(LayerPopup.windows.indexOf(window), 1);
        LayerPopup.toggleComponents(LayerPopup.windows.length === 0 ? false : void 0);
    }

    static closeLastWindow() {
        const lastWindow = LayerPopup.windows[LayerPopup.windows.length - 1];
        lastWindow && LayerPopup.closeWindow(lastWindow);
    }

    static toggleComponents(visible) {
        LayerPopup.components.forEach(component =>
                component.setState({visible: visible === void 0 ? component.state.visible : visible}));
    }

    componentDidMount() {
        LayerPopup.components.push(this);
    }

    componentWillUnmount() {
        LayerPopup.components.splice(LayerPopup.components.indexOf(this), 1);
    }

    onBackgroundClick() {
        const windows = LayerPopup.windows;
        LayerPopup.closeWindow(windows[windows.length - 1]);
    }

    onWindowClick(evt) {
        evt.stopPropagation();
    }

    renderWindows() {
        return LayerPopup.windows.map((window, idx) => {
            return (
                <div className="layer-popup__window"
                     key={idx}
                     style={{zIndex: Z_INDEX_BASE + idx}}
                     onClick={this.onWindowClick}>
                    <div className="layer-popup__window__title-bar" style={{display: 'none'}}>
                        <div className="layer-popup__window__close-button"
                             onClick={() => LayerPopup.closeWindow(window)}>
                            <i className="fa fa-times" aria-hidden="true"/>
                        </div>
                    </div>

                    <div className="layer-popup__window__content">
                        {window}
                    </div>
                </div>
            )
        });
    }

    render() {
        return (
            <div className={`layer-popup ${this.state.visible ? '' : 'layer-popup_hidden'}`}
                 onClick={this.onBackgroundClick}>
                <div className="layer-popup__background"/>
                {this.renderWindows()}
            </div>
        )
    }

}
