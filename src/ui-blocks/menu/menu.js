import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import './menu.css';

// Utils
import {trimLocation} from '../../utils/polyfills';

// Sitemap
import Sitemap from '../../sitemap';

// UI-Blocks
import {LayoutSize} from '../layout/layout';

// Services
import Status from '../../services/status';


export default class Menu extends Component {

    static contextTypes = {
        router: PropTypes.object,
        model: PropTypes.object,
    };

    static defaultProps = {
        title: '',
    };

    static countUnread(model) {
        return model && model.notifications && model.notifications.filter(n => n.is('unread')).length;
    }

    constructor(props) {
        super(props);
        this.state = {expanded: false, unreadCount: Menu.countUnread(Status.user)};

        this.onBurgerClick = this.onBurgerClick.bind(this);
        this.onStatusFetch = this.onStatusFetch.bind(this);
    }

    componentDidMount() {
        Status.$on(Status.EVT_STATUS_CHANGE, this.onStatusFetch);
    }

    componentWillUnmount() {
        Status.$off(Status.EVT_STATUS_CHANGE, this.onStatusFetch);
    }

    onStatusFetch(evt) {
        this.setState({unreadCount: Menu.countUnread(evt.details)});
    }

    toggle(expanded) {
        this.setState({expanded: expanded === void 0 ? !this.state.expanded : expanded});
    }

    onBurgerClick(evt) {
        evt.preventDefault();
        this.toggle();
    }

    renderMenuItem(link, text, icon, counter = 0, forced = false) {
        const model = this.context.model;
        const router = this.context.router;
        const location = trimLocation(router.route.location.pathname);
        const route = !link ? Sitemap.root : Sitemap[link];
        counter = counter === 0 ? null : (counter < 100 ? counter : '99+');

        let onClick = !link ? this.onBurgerClick : null;

        // Если true, перезагружаем страницу
        // Todo: найти лучший способ
        if (forced) {
            onClick = () => {
                model.forced = true;
                router.history.push(Sitemap[link]);
            }
        }

        return (
            <Link to={route} title={text}
                  className={`menu__item ${location === route ? 'menu__item_selected' : ''} ${
                        !link ? 'menu__item_grayed' : ''
                      }`}
                  onClick={onClick}>
                <div className="menu__item__icon">
                    <i className={`fa ${icon}`} aria-hidden="true"/>
                    {counter !== null && (
                        <span className="menu__item__icon__counter">{counter}</span>
                    )}
                </div>
                <div className="menu__item__text">
                    {text}
                    {counter !== null && (
                        <span className="menu__item__text__counter">{counter}</span>
                    )}
                    </div>
            </Link>
        )
    }

    renderLinks(expanded) {
        let absolute = false;
        let state = 'normal';

        if (this.props.size === LayoutSize.handheld) {
            if (expanded === void 0) {
                state = 'small';
            } else {
                state = expanded ? 'expanded' : 'collapsed';
                absolute = true;
            }
        }

        return (
            <div className={`menu__links menu__links_${state} ${absolute ? 'menu__links_absolute' : ''}`}>
                {/*state !== 'normal' && state !== 'small' && this.renderMenuItem(null, 'Скрыть', 'fa-bars')*/}
                {this.renderMenuItem('root', 'Профиль', 'fa-user')}
                {this.renderMenuItem('notifications', 'Уведомления', 'fa-bell', this.state.unreadCount)}
                {this.renderMenuItem('characters', 'Персонажи', 'fa-users', 0, true)}
                {this.renderMenuItem('root', 'Государства', 'fa-flag')}
                {this.renderMenuItem('root', 'Финансы', 'fa-usd')}
                {this.renderMenuItem('root', 'Галерея', 'fa-camera-retro')}
                {this.renderMenuItem('root', 'Лаунчер', 'fa-rocket')}
                {this.renderMenuItem('root', 'Карта', 'fa-map')}
                {this.renderMenuItem('settings', 'Настройки', 'fa-cog')}
            </div>
        )
    }

    render() {
        return (
            <div className="menu">
                <div className="menu__strip"/>

                {this.renderLinks()}
                {this.props.size === LayoutSize.handheld && this.renderLinks(this.state.expanded)}

                <div className="menu__content">
                    <div className="page menu__content__wrapper">
                        <div className="page__title">
                            {this.props.title}
                        </div>
                        <div className="page__content">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
