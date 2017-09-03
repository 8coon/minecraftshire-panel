import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import './page-character.css';
import DefaultSkin from '../../assets/default-skin.png';

// UI-Blocks
import LayoutMain from '../layout-main/layout-main';
import Button from '../button/button';
import LayerPopup from '../layer-popup/layer-popup';
import LayerNotify from '../layer-notify/layer-notify';
import WindowUpload from '../window-upload/window-upload';

// Requests
import getCharacter from 'minecraftshire-jsapi/src/method/character/get';
import uploadSkin from 'minecraftshire-jsapi/src/method/character/uploadSkin';
import deleteCharacter from 'minecraftshire-jsapi/src/method/character/delete';
import restoreCharacter from 'minecraftshire-jsapi/src/method/character/restore';

// Sitemap
import Sitemap from '../../sitemap';

// Utils
import formatDate from '../../utils/formatDate';

// Services
import Status from '../../services/status';


export default class PageCharacter extends Component {

    static contextTypes = {
        router: PropTypes.object,
        model: PropTypes.object,
    };

    static prepare(model, router, name) {
        name = name.replace('_', ' ').split('+');

        return new Promise(resolve => {
            Status.reload()
                .then(() => getCharacter(name[0], name[1]))
                .then(character => resolve({character}));
        });
    }

    static getUrl(character) {
        const encoded = `${character.get('firstName')}+${character.get('lastName')}`.replace(' ', '_');
        return `${Sitemap.character}/${encoded}`;
    }

    constructor(props) {
        super(props);

        this.onSkinChangeClick = this.onSkinChangeClick.bind(this);
        this.onDeleteClick = this.onDeleteClick.bind(this);
    }

    onSkinChangeClick() {
        LayerPopup.openWindow(<WindowUpload onUpload={() => uploadSkin(this.context.model.character.get('id'))}
                                            formats={[{type: 'image/png', ext: 'PNG'}]}
                                            title="Загрузить скин"/>);
    }

    onDeleteClick() {
        const id = this.context.model.character.get('id');

        deleteCharacter(id)
            .then(() => {
                this.context.router.history.push(Sitemap.characters);

                window.setTimeout(() => LayerNotify.addNotify({
                    text: 'Персонаж успешно удалён.',
                    actionText: 'Восстановить',
                    action: () => {
                        restoreCharacter(id)
                            .then(() => {
                                this.context.model.forced = true;
                                this.context.router.history.push(Sitemap.characters);

                                window.setTimeout(() => LayerNotify.addNotify({text: 'Персонаж восстановлен.'}), 200);
                            })
                            .catch(err => {
                                console.error(err);

                                LayerNotify.addNotify({text: 'Что-то пошло не так!'});
                            });
                        return true;
                    },
                }), 200);
            })
            .catch(err => {
                console.error(err);
                LayerNotify.addNotify({text: 'Что-то пошло не так!'});
            });
    }

    render() {
        const model = this.context.model.character;
        const sameOwner = model.get('owner') === this.context.model.user.get('username');

        return (
            <LayoutMain title={`Персонаж ${model.get('firstName')} ${model.get('lastName')}`}
                        className="page-character">
                <div className="character-details">
                    <div className="character-details__skin">
                        <img alt="Скин персонажа" src={model.getSkinFullUrl() || DefaultSkin}/>
                        <Button text="Сменить"
                                onClick={this.onSkinChangeClick}/>
                    </div>

                    <div className="character-details__info">
                        <div>
                            Игрок: <strong><Link to={Sitemap.root}>{model.get('owner')}</Link></strong>
                        </div>
                        <div>
                            Создан: <strong>{formatDate(model.getCreatedAt())}</strong>
                        </div>

                        {sameOwner && (
                            <div>
                                <a href="#delete" onClick={this.onDeleteClick}>Удалить</a>
                            </div>
                        )}
                    </div>
                </div>
            </LayoutMain>
        )
    }

}
