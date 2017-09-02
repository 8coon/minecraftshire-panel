import React, {Component} from 'react';
import './window-avatar.css';


export default class WindowAvatar extends Component {

    constructor(props) {
        super(props);
        this.state = {dropping: false, uploading: false, progress: 0};

        this.onDragOver = this.onDragOver.bind(this);
        this.onDragLeave = this.onDragOver.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
    }

    onDragOver(evt) {
        evt.preventDefault();
        this.setState({dropping: true});
    }

    onDragLeave(evt) {
        evt.preventDefault();
        this.setState({dropping: false});
    }

    onDrop(evt) {
        evt.preventDefault();
        this.setState({dropping: false});
        this.upload(evt.dataTransfer.files[0]);
    }

    onFileChange() {
        this.upload(this.refs.file.files[0]);
    }

    upload(file) {
        this.setState({uploading: true, progress: 0});
    }

    render() {
        return (
            <div className="window-avatar">
                <h2>Загрузить аватар</h2>

                <ul>
                    <li>Максимальный размер: <strong>7 Мб</strong></li>
                    <li>Поддерживаемые форматы: <strong>JPG, PNG</strong></li>
                </ul>

                {this.state.uploading && (
                    <div></div>
                )}

                <div className={`window-avatar__upload ${this.state.dropping ? 'window-avatar__upload_dropping' : ''}`}
                     draggable="true"
                     onDragOver={this.onDragOver}
                     onDragLeave={this.onDragLeave}
                     onDrop={this.onDrop}>

                    {!this.state.uploading && (
                        <div>
                            <input type="file" ref="file" onChange={this.onFileChange}/>
                            <div>или перетащите файлы сюда</div>
                        </div>
                    )}

                    {this.state.uploading && (
                        <div>
                        </div>
                    )}

                </div>
            </div>
        )
    }

}

