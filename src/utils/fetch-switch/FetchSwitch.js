import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {matchPath} from 'react-router-dom';

// Utils
import TimeoutPromise from '../TimeoutPromise';

// Блоки
import LayerNotify from '../../ui-blocks/layer-notify/layer-notify';


export default class FetchSwitch extends Component {

    static contextTypes = {
        router: PropTypes.object,
        model: PropTypes.object,
    };

    static childContextTypes = {
        model: PropTypes.object,
    };

    static defaultProps = {
        onNavigate: () => Promise.resolve(),
    };

    constructor(props) {
        super(props);

        this.state = {currentComponent: null, model: {}};
        this.futureComponent = {props: {path: 1}};
        this.navigating = false;
    }

    getChildContext() {
        return {model: this.state.model};
    }

    navigate(models, props) {
        this.navigating = false;
        // eslint-disable-next-line
        this.state.model.forced = false;

        this.setState({
            currentComponent: React.cloneElement(this.futureComponent, props),
            model: models ? Object.assign(this.state.model, ...models) : this.state.model,
        });
    }

    getFirstPathArg() {
        let pathname = this.context.router.route.location.pathname;

        if (pathname.endsWith('/')) {
            pathname = pathname.substring(0, pathname.length - 1);
        }

        const path = pathname.split('/');
        const arg = path[path.length - 1];

        if (arg.length === 0) {
            return null;
        }

        return arg;
    }

    render() {
        const route = this.context.router.route;
        const location = this.props.location || route.location;
        let match = null;
        let child = null;

        React.Children.forEach(this.props.children, (element) => {
            if (!React.isValidElement(element)) {
                return;
            }

            const elementProps = element.props;
            const pathProp = elementProps.path;

            const exact = elementProps.exact;
            const strict = elementProps.strict;
            const from = elementProps.from;
            const path = pathProp || from;

            if (match == null) {
                child = element;
                match = path ? matchPath(location.pathname, {path, exact, strict}) : route.match;
            }
        });

        this.futureComponent = match ? child : null;

        if (!this.navigating && (!this.state.currentComponent || this.state.model.forced ||
                this.futureComponent.props.path !== this.state.currentComponent.props.path)) {
            this.navigating = true;

            const component = this.futureComponent && this.futureComponent.props.component;
            const promise = component && component.prepare &&
                component.prepare(this.state.model, this.context.router, this.getFirstPathArg());

            const promises = [this.props.onNavigate(), new TimeoutPromise(10)];

            // Если у компонента был prepare и он вернул Promise
            if (promise && promise.then) {
                promises.splice(1, 1, promise);
            }

            Promise.all(promises)
                .then(models => this.navigate(models, {location: location, computedMatch: match}))
                .catch(err => {
                    console.error(err);
                    LayerNotify.addNotify({text: 'Что-то пошло не так!'});
                });
        }

        return this.state.currentComponent;
    }

}
