import React, {Component} from 'react';
import './character.css';

// UI-Blocks
import Avatar from '../avatar/avatar';
import LayerNotify from '../layer-notify/layer-notify';

// Models
import CharacterModel from 'minecraftshire-jsapi/src/models/Character/Character';

// Requests
import characterSet from 'minecraftshire-jsapi/src/method/character/set';


export default class Character extends Component {

    static defaultProps = {
        model: new CharacterModel(),
        editable: true,
    };

    constructor(props) {
        super(props);
        this.state = {};

        this.onFavoriteClick = this.onFavoriteClick.bind(this);
    }

    onFavoriteClick() {
        if (!this.props.editable) {
            return;
        }

        const model = this.props.model;
        const nextValue = !model.get('favorite');

        model.set('favorite', nextValue);
        this.setState({});

        characterSet(model.get('id'), {isFavorite: model.get('favorite')})
            .then(() => LayerNotify.addNotify({
                text: `${model.get('firstName')} ${model.get('lastName')} ${
                    nextValue ? 'добавлен в избранное' : 'удалён из избранного'}.`
            }))
            .catch(err => {
                console.error(err);
                LayerNotify.addNotify({text: 'Что-то пошло не так!'});
            });
    }

    render() {
        const model = this.props.model;
        const favoriteClass = model.get('favorite') ? 'character__actions__favorite_true' : '';
        const onlineClass = model.get('online') || true ? 'character__actions__online_true' : '';

        return (
            <div className="character">
                <div className="character__actions">
                    <div className={`character__actions__favorite ${favoriteClass}`}
                         onClick={this.onFavoriteClick}>
                        <i className="fa fa-star" aria-hidden="true"/>
                    </div>

                    <div className={`character__actions__online ${onlineClass}`}>
                        <i className="fa fa-circle" aria-hidden="true"/>
                    </div>
                </div>

                <div className="character__avatar">
                    <Avatar url={model.getSkinFullUrl()}/>
                </div>

                <div className="character__name">
                    {`${model.get('firstName')} ${model.get('lastName')}`}
                </div>
            </div>
        )
    }

}
