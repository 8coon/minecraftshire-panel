import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './page-characters.css';

// UI-Blocks
import LayoutMain from '../layout-main/layout-main';
import Character from '../character/character';

// Requests
import profile from 'minecraftshire-jsapi/src/method/user/profile';

// Services
import Status from '../../services/status';


export default class PageCharacters extends Component {

    static contextTypes = {
        router: PropTypes.object,
        model: PropTypes.object,
    };

    static prepare(model, router) {
        const path = router.route.location.pathname;
        let username = path.split('/')[2] || '';

        if (username.length === 0) {
            username = null;
        }

        return new Promise(resolve => {
            Status.reload()
                .then(user => profile(username || user.get('username')))
                .then(profile => resolve({profile}));
        });
    }

    renderCharacters() {
        const characters = this.context.model.profile.characters;

        return characters.map(character => {
            return <Character model={character} key={character.get('id')}/>
        });
    }

    render() {
        const profile = this.context.model.profile;
        const user = this.context.model.user;
        const nameEqual = user.get('username') === profile.get('username');

        return (
            <LayoutMain title={nameEqual ? 'Мои персонажи' : `Персонажи игрока ${profile.get('username')}`}
                        className="page-characters">
                {this.renderCharacters()}
            </LayoutMain>
        )
    }

}
