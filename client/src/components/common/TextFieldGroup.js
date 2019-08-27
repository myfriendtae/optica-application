import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const TextFieldGroup = ({
    id,
    name,
    placeholder,
    value,
    label, 
    error,
    info,
    type,
    onChange,
    disabled,
    defaultValue
}) => {
    return (
        <div className="form-group">
            <label>{label}</label>
            <input 
                type={type} 
                name={name} 
                value={value} 
                onChange={onChange} 
                disabled={disabled} 
                placeholder={placeholder}
                id={id}
                defaultValue={defaultValue}
                className={classnames('form-control', {'is-invalid': error})}
            />
            {info && <small className="form-text text-muted">{info}</small>}
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    );
};

TextFieldGroup.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired,
    info: PropTypes.string,
    error: PropTypes.string,
    type: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.string,
    label: PropTypes.string,
    defaultValue: PropTypes.string
}

TextFieldGroup.defaultProps = {
    type: 'text'
}

export default TextFieldGroup;