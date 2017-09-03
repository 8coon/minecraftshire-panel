import React, {Component} from 'react';
import './window-avatar.css';

// UI-Blocks
import LayerPopup from '../layer-popup/layer-popup';
import LayerNotify from '../layer-notify/layer-notify';
import Progress from '../progress/progress';
import Button from '../button/button';

// Requests
import Request, {RequestEvent} from 'minecraftshire-jsapi/src/request/Request';
import uploadAvatar from 'minecraftshire-jsapi/src/method/user/uploadAvatar';
import upload from 'minecraftshire-jsapi/src/method/upload/upload';
import uploadStatus from 'minecraftshire-jsapi/src/method/upload/status';

// Utils
import retry from '../../utils/retry';


export default class WindowAvatar extends Component {

    constructor(props) {
        super(props);
        this.state = {dropping: false, uploading: false, progress: 0};

        this.onDragOver = this.onDragOver.bind(this);
        this.onDragLeave = this.onDragOver.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
        this.onUploadProgress = this.onUploadProgress.bind(this);
        this.onCancelClick = this.onCancelClick.bind(this);
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

    onUploadProgress(evt) {
        const progress = this.refs.progress;
        progress.setState({loaded: evt.details.loaded, total: evt.details.total});
    }

    onCancelClick() {
        LayerPopup.closeLastWindow();
    }

    upload(file) {
        if (!file) {
            this.setState({dropping: false});
            return;
        }

        if (!(file.type === 'image/jpeg' || file.type === 'image/png')) {
            LayerNotify.addNotify({text: 'Допустимые форматы: JPG, PNG.'});
            return;
        }

        // Проверяем, что размер файла несколько меньше, чем 1Mb
        if (file.size > 10 * 1024 * 1000) {
            LayerNotify.addNotify({text: 'Размер файла превышает 10 Мб!'});
            return;
        }

        this.setState({uploading: true, progress: 0});
        let token;

        uploadAvatar()
            .then(tok => {
                token = tok;
                Request.$on(RequestEvent.PROGRESS, this.onUploadProgress);

                return upload(token, file);
            })
            .then(() => {
                Request.$off(RequestEvent.PROGRESS, this.onUploadProgress);
                this.refs.progress.setState({active: false});

                return retry(() => new Promise(resolve => {
                    uploadStatus(token).then(result => {
                        if (result && result.status !== 'finished') {
                            window.setTimeout(() => resolve(false), result.retryAfter || 1000);
                            return;
                        }

                        resolve(result);
                    });
                }));
            })
            .then(() => {
                LayerPopup.closeLastWindow();
                window.location.reload();
            })
            .catch(err => {
                console.error(err);

                LayerPopup.closeLastWindow();
                LayerNotify.addNotify({text: 'Что-то пошло не так!'});

                Request.$off(RequestEvent.PROGRESS, this.onUploadProgress);
            });
    }

    render() {
        return (
            <div className="window-avatar">
                <h2>Загрузить аватар</h2>

                <ul>
                    <li>Максимальный размер: <strong>10 Мб</strong></li>
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
                            <div>или перетащите файл сюда</div>
                        </div>
                    )}

                    {this.state.uploading && (
                        <div>
                            <Progress ref="progress"/>
                        </div>
                    )}

                </div>

                <div className="layer-popup__window__buttons">
                    <Button text="Отмена" onClick={this.onCancelClick}/>
                </div>
            </div>
        )
    }

}

