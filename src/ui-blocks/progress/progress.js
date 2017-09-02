import React, {Component} from 'react';
import './progress.css';


export default class Progress extends Component {

    static defaultProps = {
        active: true,
        loaded: 0,
        total: 1,
    };

    constructor(props) {
        super(props);
        this.state = {active: props.active, loaded: props.loaded, total: props.total};
    }

    render() {
        return (
            <div className={`progress ${this.state.active ? '' : 'progress_inactive'}`}>
                <div className="progress__bar"
                     style={{width: this.state.loaded / this.state.total * 100 + '%'}}/>
            </div>
        )
    }

}
