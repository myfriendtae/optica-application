import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const TextAreaFieldGroup = ({
    id,
    name,
    placeholder,
    value,
    label, 
    error,
    info,
    onChange
}) => {
    return (
        <div className="form-group">
            <label>{label}</label>
            <textarea 
                name={name} 
                value={value} 
                onChange={onChange} 
                placeholder={placeholder}
                id={id}
                className={classnames('form-control', {'is-invalid': error})}
            />
            {info && <small className="form-text text-muted">{info}</small>}
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    );
};

TextAreaFieldGroup.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired,
    info: PropTypes.string,
    error: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string,
}

export default TextAreaFieldGroup;