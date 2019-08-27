import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const SelectFieldGroup = ({
    name,
    label, 
    error,
    info,
    onChange,
    options,
    value,
}) => {
    const selectOptions = options.map(option => (
        <option key={option.label} value={option.value}>
         {option.label}
        </option>
    ));

    return (
        <div multiple className="form-group">
            <label>{label}</label>
            <select
                name={name} 
                onChange={onChange}
                value={value}
                className={classnames('form-control', {'is-invalid': error})}
            > 
                <option hidden>Please select</option>
                {selectOptions}
            </select>
            {info && <small className="form-text text-muted">{info}</small>}
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    );
};

SelectFieldGroup.propTypes = {
    name: PropTypes.string.isRequired,
    info: PropTypes.string,
    error: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string,
    options: PropTypes.array.isRequired,
}

export default SelectFieldGroup;