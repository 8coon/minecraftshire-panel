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
        query: '',
        add: false,
        onClick: () => {},
    };

    constructor(props) {
        super(props);
        this.state = {};

        this.onFavoriteClick = this.onFavoriteClick.bind(this);
    }

    onFavoriteClick(evt) {
        if (!this.props.editable) {
            return;
        }

        evt.preventDefault();
        const model = this.props.model;
        const nextValue = !model.get('isFavorite');

        model.set('isFavorite', nextValue);
        this.setState({});

        characterSet(model.get('id'), {isFavorite: model.get('isFavorite')})
            .then(() => LayerNotify.addNotify({
                text: `${model.get('firstName')} ${model.get('lastName')} ${
                    nextValue ? 'добавлен в избранное' : 'удалён из избранного'}.`
            }))
            .catch(err => {
                console.error(err);
                LayerNotify.addNotify({text: 'Что-то пошло не так!'});
            });
    }

    renderName() {
        if (this.props.add) {
            return 'Добавить персонажа';
        }

        const model = this.props.model;
        const query = this.props.query.toLowerCase();
        const name = `${model.get('firstName')} ${model.get('lastName')}`;
        const lowerName = name.toLowerCase();
        let displayName = name.replace('<', '').replace('>', '');

        if (query.length) {
            let lastIndex = 0;
            let lenDiff = 0;
            let index;

            // eslint-disable-next-line
            while ((index = lowerName.indexOf(query, lastIndex)) !== -1) {
                lastIndex = index + 1;

                const start = displayName.substring(0, index + lenDiff);
                const mid = displayName.substring(index + lenDiff, index + query.length + lenDiff);
                const end = displayName.substring(index + query.length + lenDiff);

                displayName = `${start}<span class="character__name__highlight">${mid}</span>${end}`;
                lenDiff = displayName.length - lowerName.length;
            }
        }

        return (
            <div className="character__name"
                 dangerouslySetInnerHTML={{__html: displayName}}/>
        )
    }

    render() {
        const add = this.props.add;
        const model = this.props.model;
        const favoriteClass = model.get('isFavorite') ? 'character__actions__favorite_true' : '';
        const onlineClass = model.get('isOnline') ? 'character__actions__online_true' : '';

        return (
            <div className={`character ${add ? 'character_add' : ''}`}
                 onClick={this.props.onClick}>
                <div className="character__actions">
                    <div className={`character__actions__favorite ${favoriteClass}`}
                         onClick={this.onFavoriteClick}
                         style={{display: add ? 'none' : null}}>
                        <i className="fa fa-star" aria-hidden="true"/>
                    </div>

                    <div className={`character__actions__online ${onlineClass}`}>
                        <i className="fa fa-circle" aria-hidden="true"/>
                    </div>
                </div>

                {this.props.add && (
                    <div className="character__avatar">
                        <div className="avatar">
                            <div>
                                <i className="fa fa-plus" aria-hidden="true"/>
                            </div>
                        </div>
                    </div>
                )}

                {!this.props.add && (
                    <div className="character__avatar">
                        <Avatar url={model.getSkinFullUrl()} skin/>
                    </div>
                )}

                <div className="character__name">
                    {this.renderName()}
                </div>
            </div>
        )
    }

}
