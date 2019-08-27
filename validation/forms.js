const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateFormInput(data) {
    let errors = {};

    data.product = !isEmpty(data.product) ? data.product : '';
    data.qty = !isEmpty(data.qty) ? data.qty : '';
    // data.customer = !isEmpty(data.customer) ? data.customer: '';
    data.status = !isEmpty(data.status) ? data.status : '';
    data.jobnumber = !isEmpty(data.jobnumber) ? data.jobnumber : '';

    if (validator.isEmpty(data.product)) {
        errors.product = 'Product field is required';
    }

    if (validator.isEmpty(data.status)) {
        errors.status = 'Status field is required';
    }

    if (validator.isEmpty(data.jobnumber)) {
        errors.jobnumber = 'Jobnumber field is required';
    }

    if (validator.isEmpty(data.qty)) {
        errors.qty = 'Quantity field is invalid';
    }

    if (!validator.isInt(data.qty, { min: 1, max: 1000 })) {
        errors.qty = 'Quantity must be at least 1';
    }

    // if(validator.isEmpty(data.customer)) {
    //     errors.customer = 'Customer field is required';
    // }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};