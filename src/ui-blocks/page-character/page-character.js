import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import './page-character.css';
import DefaultSkin from '../../assets/default-skin.png';

// UI-Blocks
import LayoutMain from '../layout-main/layout-main';
import Button from '../button/button';
import LayerPopup from '../layer-popup/layer-popup';
import WindowUpload from '../window-upload/window-upload';

// Requests
import getCharacter from 'minecraftshire-jsapi/src/method/character/get';
import uploadSkin from 'minecraftshire-jsapi/src/method/character/uploadSkin';

// Sitemap
import Sitemap from '../../sitemap';

// Utils
import formatDate from '../../utils/formatDate';


export default class PageCharacter extends Component {

    static contextTypes = {
        router: PropTypes.object,
        model: PropTypes.object,
    };

    static prepare(model, router, name) {
        name = name.replace('_', ' ').split('-');

        return new Promise(resolve => {
            getCharacter(name[0], name[1])
                .then(character => resolve({character}));
        });
    }

    static getUrl(character) {
        const encoded = `${character.get('firstName')}-${character.get('lastName')}`.replace(' ', '_');
        return `${Sitemap.character}/${encoded}`;
    }

    constructor(props) {
        super(props);

        this.onSkinChangeClick = this.onSkinChangeClick.bind(this);
    }

    onSkinChangeClick() {
        LayerPopup.openWindow(<WindowUpload onUpload={() => uploadSkin(this.context.model.character.get('id'))}
                                            formats={[{type: 'image/png', ext: 'PNG'}]}
                                            title="Загрузить скин"/>);
    }

    render() {
        const model = this.context.model.character;

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
                    </div>
                </div>
            </LayoutMain>
        )
    }

}
