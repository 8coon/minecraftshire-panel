import React, {Component} from 'react';
import './avatar.css';
import NoAvatar from '../../assets/no-avatar.jpg';
import DefaultSkin from '../../assets/default-skin.png';


export default class Avatar extends Component {

    static defaultProps = {
        url: null,
        onClick: () => {},
        height: null,
        width: null,
        skin: false,
    };

    render() {
        const skin = this.props.skin;

        return (
            <div className="avatar"
                 onClick={this.props.onClick}>
                <span className={`avatar__img ${skin ? 'avatar__img_skin' : ''}`}
                      ref="img"
                      style={{
                          backgroundImage: `url(${this.props.url || (skin ? DefaultSkin : NoAvatar)})`,
                          backgroundSize: skin ? `${64*9}px ${32*9}px` : null,
                          backgroundPosition: skin ? `-${8*9}px -${8*9}px` : null,
                          height: this.props.height,
                          width: this.props.width,
                      }}/>
            </div>
        )
    }

}
