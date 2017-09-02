import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './page-settings.css';

// User-Agent parser
import {UAParser} from 'ua-parser-js';

// UI-Blocks
import LayerNotify from '../../ui-blocks/layer-notify/layer-notify';
import LayoutMain from '../layout-main/layout-main';
import FormField, {FormFieldTypes, FormFieldModes} from '../form-field/form-field';
import Delimiter from '../delimiter/delimiter';

// Form
import Form from '../../form/form';

// Utils
import Validators from '../../utils/validators/validators';
import formatDate from '../../utils/formatDate';

// Requests
import emailChange from 'minecraftshire-jsapi/src/method/user/emailChange';
import passwordChange from 'minecraftshire-jsapi/src/method/user/passwordChange';
import profile from 'minecraftshire-jsapi/src/method/user/profile';

// Services
import Status from '../../services/status';


export default class PageSettings extends Component {

    emailForm = new Form();
    passwordForm = new Form();
    avatarForm = new Form();

    static contextTypes = {
        router: PropTypes.object,
        model: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.state = {emailValidated: false, sessionsExpanded: false, tokensExpanded: false};

        this.onSessionsExpand = this.onSessionsExpand.bind(this);
        this.onTokensExpand = this.onTokensExpand.bind(this);
        this.onEmailSubmit = this.onEmailSubmit.bind(this);
        this.onEmailFocus = this.onEmailFocus.bind(this);
        this.onEmailBlur = this.onEmailBlur.bind(this);
        this.onPasswordSubmit = this.onPasswordSubmit.bind(this);
        this.onPasswordFocus = this.onPasswordFocus.bind(this);
        this.onPasswordBlur = this.onPasswordBlur.bind(this);
    }

    static prepare(model) {
        return new Promise(resolve => {
            Status.reload()
                .then(user => profile(user.get('username')))
                .then(profile => resolve({profile}));
        });
    }

    onSessionsExpand() {
        this.setState({sessionsExpanded: true});
    }

    onTokensExpand() {
        this.setState({tokensExpanded: true});
    }

    onEmailSubmit() {
        this.setState({emailValidated: true});
        if (!this.emailForm.validate()) return;

        const username = this.context.model.user.get('username');
        const email = this.emailForm.fields['email'];

        emailChange(username, email.getText())
            .then((err) => LayerNotify.addNotify({text: 'На новый Email было отправлено подтверждение.'}))
            .catch(err => {
                if (err.body && err.body.cause === 'same_email') {
                    email.validate('Укажите другой Email.');
                    email.toggleTooltip(true);

                    return;
                }

                LayerNotify.addNotify({text: 'Что-то пошло не так!'});
            });
    }

    onEmailFocus() {
        this.emailForm.toggleTooltip(false);
    }

    onEmailBlur() {
        if (this.state.emailValidated) {
            this.emailForm.validate();
        }
    }

    onPasswordSubmit() {
        this.setState({passwordValidated: true});
        if (!this.passwordForm.validate()) return;

        const oldPassword = this.passwordForm.fields['old_password'];
        const newPassword = this.passwordForm.fields['new_password'];

        passwordChange(oldPassword.getText(), newPassword.getText())
            .then(() => LayerNotify.addNotify({text: 'Ваш пароль успешно изменён!'}))
            .catch(err => {
                if (err.body && err.body.cause === 'password') {
                    oldPassword.validate('Неправильный пароль!');
                    oldPassword.toggleTooltip(true);
                    return;
                }

                if (err.body && err.body.cause === 'same password') {
                    newPassword.validate('Пароли должны отличаться!');
                    newPassword.toggleTooltip(true);
                    return;
                }

                console.error(err);
                LayerNotify.addNotify({text: 'Что-то пошло не так!'});
            });
    }

    onPasswordFocus() {
        this.passwordForm.toggleTooltip(false);
    }

    onPasswordBlur() {
        if (this.state.passwordValidated) {
            this.passwordForm.validate();
        }
    }


    renderSessions() {
        return this.context.model.profile.sessions.map((session, i) => {
            return (
                <div className="session" key={i}>
                    <div>
                        <div className="session__title">
                            IP {session.ip}
                        </div>

                        Откуда: {session.location}
                    </div>
                    <div className="session__date">
                        {formatDate(session.getIssuedAt())}
                    </div>
                </div>
            )
        });
    }

    renderTokens() {
        const parseUA = ua => {
            const parsed = UAParser(ua);

            const browser = `${parsed.browser.name} ${parsed.browser.version}`;
            const device = parsed.device.vendor ? `${parsed.device.vendor} ${parsed.device.model}` : '';
            const os = `${parsed.os.name} ${parsed.os.version}`;

            return `${browser} ${device ? 'на ' : ''}${device} под ${os}`;
        };

        return this.context.model.profile.tokens.map((token, i) => {
            return (
                <div className="session" key={i}>
                    <div>
                        <div className="session__title">
                            Вход выполнен с IP {token.ip}
                        </div>

                        Откуда: {token.location}<br/>
                        Устройство: {parseUA(token.appToken)}
                    </div>
                    <div className="session__date">
                        {formatDate(token.getTime())}
                    </div>
                </div>
            )
        });
    }

    renderExpand(collection, handler) {
        const length = collection.length;
        const lastDigit = `${length}`.substr(-1, 1);
        let word = 'записей';

        if (length === 0) {
            return null;
        }

        if (lastDigit === '1') {
            word = 'запись';
        }

        if (lastDigit >= 2 && lastDigit < 5) {
            word = 'записи';
        }

        return (
            <div className="sessions__expand" onClick={handler}>
                Показать {length} {word}
            </div>
        );
    }


    render() {
        const profile = this.context.model.profile;
        const email = profile.get('email');
        const password = '*'.repeat(profile.get('passwordLength'));
        const sessions = this.context.model.profile.get('sessions');
        const tokens = this.context.model.profile.get('tokens');

        // Auto-expand if not enough items
        if (sessions.length < 5) {
            this.setState({sessionsExpanded: true});
        }

        if (tokens.length < 5) {
            this.setState({tokensExpanded: true});
        }

        return (
            <LayoutMain title="Настройки" className="page-settings">
                <Delimiter text="Смена адреса электронной почты"/>

                <div className="big-form">
                    <div className="big-form__field">
                        <span className="big-form__field__title">Email:</span>
                        <FormField
                            ref={this.emailForm.add('email')}
                            type={FormFieldTypes.INPUT}
                            placeholder="Email"
                            text={email}
                            mode={FormFieldModes.FLEXIBLE}
                            validator={Validators.email}
                            onFocus={this.onEmailFocus}
                            onBlur={this.onEmailBlur}/>
                    </div>

                    <div className="big-form__field">
                        <span className="big-form__field__title"/>
                        <FormField
                            type={FormFieldTypes.BUTTON}
                            mode={FormFieldModes.FLEXIBLE}
                            onAction={this.onEmailSubmit}
                            text="Поменять"/>
                    </div>
                </div>

                <Delimiter text="Смена пароля"/>

                <div className="big-form">
                    <div className="big-form__field">
                        <span className="big-form__field__title">Старый пароль:</span>
                        <FormField
                            ref={this.passwordForm.add('old_password')}
                            type={FormFieldTypes.INPUT}
                            placeholder="Старый пароль"
                            password
                            text={password}
                            mode={FormFieldModes.FLEXIBLE}
                            onFocus={this.onPasswordFocus}
                            onBlur={this.onPasswordBlur}/>
                    </div>

                    <div className="big-form__field">
                        <span className="big-form__field__title">Новый пароль:</span>
                        <FormField
                            ref={this.passwordForm.add('new_password')}
                            type={FormFieldTypes.INPUT}
                            placeholder="Новый пароль"
                            password
                            text={password}
                            mode={FormFieldModes.FLEXIBLE}
                            validator={Validators.password}
                            onFocus={this.onPasswordFocus}
                            onBlur={this.onPasswordBlur}/>
                    </div>

                    <div className="big-form__field">
                        <span className="big-form__field__title"/>
                        <FormField
                            type={FormFieldTypes.BUTTON}
                            mode={FormFieldModes.FLEXIBLE}
                            onAction={this.onPasswordSubmit}
                            text="Поменять"/>
                    </div>
                </div>

                <Delimiter text="Смена аватара"/>
                <div className="big-form">
                    <div className="big-form__field">
                        <span className="big-form__field__title"/>
                        <FormField
                            type={FormFieldTypes.BUTTON}
                            mode={FormFieldModes.FLEXIBLE}
                            text="Поменять"/>
                    </div>
                </div>

                <Delimiter text="Активные сессии"/>
                <div className={`sessions ${this.state.sessionsExpanded ? '' : 'sessions_short'}`}>
                    <div className="sessions__shadow"/>
                    <div className="sessions__list">
                        {this.renderSessions()}
                    </div>
                    {this.renderExpand(sessions, this.onSessionsExpand)}
                </div>

                <Delimiter text="История входов"/>
                <div className={`sessions ${this.state.tokensExpanded ? '' : 'sessions_short'}`}>
                    <div className="sessions__shadow"/>
                    <div className="sessions__list">
                        {this.renderTokens()}
                    </div>
                    {this.renderExpand(tokens, this.onTokensExpand)}
                </div>
            </LayoutMain>
        );
    }

}
