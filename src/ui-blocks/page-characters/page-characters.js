import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import './page-characters.css';

// UI-Blocks
import LayoutMain from '../layout-main/layout-main';
import Character from '../character/character';
import Filters from '../filters/filters';
import LayerPopup from '../layer-popup/layer-popup';
import WindowCharacter from '../window-character/window-character';
import PageCharacter from '../page-character/page-character';

// Requests
import profile from 'minecraftshire-jsapi/src/method/user/profile';

// Services
import Status from '../../services/status';

// Sitemap
import Sitemap from '../../sitemap';


export default class PageCharacters extends Component {

    static contextTypes = {
        router: PropTypes.object,
        model: PropTypes.object,
    };

    static prepare(model, router, username) {
        if (username === 'characters') {
            username = null;
        }

        return new Promise(resolve => {
            Status.reload()
                .then(user => profile(username || user.get('username')))
                .then(profile => resolve({profile}));
        });
    }

    constructor(props) {
        super(props);
        this.state = {filters: {favorite: false, online: false, query: ''}};

        this.onFiltersChange = this.onFiltersChange.bind(this);
        this.onAddClick = this.onAddClick.bind(this);
    }

    onFiltersChange(filters) {
        this.setState({filters});
    }

    onAddClick() {
        LayerPopup.openWindow(<WindowCharacter/>);
    }

    renderCharacters() {
        const filters = this.state.filters;

        const characters = this.context.model.profile.characters
            .filter(char => {
                if (filters.favorite && !char.get('isFavorite')) {
                    return false;
                }

                if (filters.online && !char.get('isOnline')) {
                    return false;
                }

                const query = filters.query.toLowerCase();
                const name = `${char.get('firstName')} ${char.get('lastName')}`.toLowerCase();

                return !(query && query.length > 0 && !name.includes(query));
            })
            .sorted((char1, char2) => {
                const name1 = `${char1.get('firstName')} ${char1.get('lastName')}`;
                const name2 = `${char2.get('firstName')} ${char2.get('lastName')}`;

                return name1.localeCompare(name2);
            });

        return characters.map(character => {
            return (
                <Link to={PageCharacter.getUrl(character)}
                      key={character.get('id')}>
                    <Character model={character}
                               key={character.get('id')}
                               query={filters.query}/>
                </Link>
            );
        });
    }

    render() {
        const profile = this.context.model.profile;
        const user = this.context.model.user;
        const nameEqual = user.get('username') === profile.get('username');

        return (
            <LayoutMain title={nameEqual ? 'Мои персонажи' : `Персонажи игрока ${profile.get('username')}`}
                        className="page-characters">
                <Filters filters={this.state.filters}
                         onChange={this.onFiltersChange}/>

                <div className="page-characters__list">
                    {nameEqual && (
                        <Character onClick={this.onAddClick} add/>
                    )}

                    {this.renderCharacters()}
                </div>
            </LayoutMain>
        )
    }

}
