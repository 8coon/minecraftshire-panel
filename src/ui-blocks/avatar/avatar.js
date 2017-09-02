import React, {Component} from 'react';
import './avatar.css';
import NoAvatar from '../../assets/no-avatar.jpg';


export default class Avatar extends Component {

    static defaultProps = {
        url: null,
        onClick: () => {},
        height: null,
        width: null,
    };

    render() {
        return (
            <div className="avatar"
                 onClick={this.props.onClick}>
                <span className="avatar__img"
                      style={{
                          backgroundImage: `url(${this.props.url || NoAvatar})`,
                          height: this.props.height,
                          width: this.props.width,
                      }}/>
            </div>
        )
    }

}
