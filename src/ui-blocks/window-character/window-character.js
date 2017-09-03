import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './window-character.css';

// UI-Blocks
import LayerPopup from '../layer-popup/layer-popup';
import LayerNotify from '../layer-notify/layer-notify';
import Button from '../button/button';
import FormField, {FormFieldTypes, FormFieldModes} from '../form-field/form-field';

// Form
import Form from '../../form/form';

// Utils
import Validators from '../../utils/validators/validators';


export default class WindowCharacter extends Component {

    static contextTypes = {
        router: PropTypes.object,
        model: PropTypes.object,
    };

    form = new Form();

    constructor(props) {
        super(props);
        this.state = {validated: false};

        this.onCancel = this.onCancel.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onCancel() {
        LayerPopup.closeLastWindow();
    }

    onFocus() {
        this.form.toggleTooltip(false);
    }

    onBlur() {
        if (this.state.validated) {
            this.form.validate();
        }
    }

    onSubmit() {
        this.setState({validated: true});
        if (!this.form.validate()) return;
    }

    render() {
        return (
            <div className="window-character">
                <h2>Создать персонажа</h2>

                <div className="big-form">
                    <div className="big-form__field">
                        <span className="big-form__field__title">Имя:</span>
                        <FormField
                            ref={this.form.add('firstName')}
                            type={FormFieldTypes.INPUT}
                            placeholder="Имя"
                            mode={FormFieldModes.FLEXIBLE}
                            validator={Validators.name}
                            onFocus={this.onFocus}
                            onBlur={this.onBlur}/>
                    </div>

                    <div className="big-form__field">
                        <span className="big-form__field__title">Фамилия:</span>
                        <FormField
                            ref={this.form.add('lastName')}
                            type={FormFieldTypes.INPUT}
                            placeholder="Фамилия"
                            mode={FormFieldModes.FLEXIBLE}
                            validator={Validators.name}
                            onFocus={this.onFocus}
                            onBlur={this.onBlur}/>
                    </div>
                </div>

                <div className="layer-popup__window__buttons">
                    <Button text="Отмена" onClick={this.onCancel}/>
                    <Button text="Создать" onClick={this.onSubmit}/>
                </div>
            </div>
        )
    }

}

