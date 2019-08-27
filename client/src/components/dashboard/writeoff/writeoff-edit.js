import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getWriteoff, updateWriteoff } from '../../../actions/writeoffActions';
import { withRouter } from 'react-router-dom';

import Spinner from '../../common/Spinner';
import classnames from 'classnames';

import TextFieldGroup from '../../common/TextFieldGroup';
import SelectFieldGroup from '../../common/SelectFieldGroup';

import axios from 'axios';
import Downshift from 'downshift';

import isEmpty from '../../../validation/is-empty';

class WriteoffEdit extends Component {
    constructor() {
        super();
        this.state = {
            user: '',
            person: '',
            suggesion: [],
            product: '',
            qty: '',
            customer: '',
            status: '',
            jobnumber: '',
            comment: '',
            errors: {}
        };
    }

    componentDidMount() {
        this.props.getWriteoff(this.props.match.params.writeoff_id);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({ errors: nextProps.errors });
        }

        if (nextProps.writeoffs.writeoff) {
            const writeoff = nextProps.writeoffs.writeoff;

            // Bring writeoff info arrary back to CSV
            //const writeoffCSV = writeoff.join(',');

            writeoff.product = !isEmpty(writeoff.product) ? writeoff.product : '';
            writeoff.qty = !isEmpty(writeoff.qty) ? writeoff.qty : 0;
            writeoff.customer = !isEmpty(writeoff.customer) ? writeoff.customer : '';
            writeoff.status = !isEmpty(writeoff.status) ? writeoff.status : '';
            writeoff.jobnumber = !isEmpty(writeoff.jobnumber) ? writeoff.jobnumber : '';
            writeoff.comment = !isEmpty(writeoff.comment) ? writeoff.comment : '';

            // Set component fields state
            this.setState({
                writeoff_id: writeoff.writeoff_id,
                product: writeoff.product,
                qty: writeoff.qty.toString(),
                customer: writeoff.customer,
                status: writeoff.status,
                jobnumber: writeoff.jobnumber,
                comment: writeoff.comment
            });
        }
    }

    onSearch = (e) => {
        this.setState({ [e.target.name]: e.target.value });

        if (e.target.value.length >= 2) {
            axios
                .get(`/api/products/${e.target.value}`)
                .then(res => {
                    this.setState({ suggesion: res.data })
                });
        }
    }

    onSubmit = (e) => {
        e.preventDefault();
        const newWriteoff = {
            writeoff_id: this.state.writeoff_id,
            product: this.state.product,
            qty: this.state.qty,
            customer: this.state.customer,
            status: this.state.status,
            jobnumber: this.state.jobnumber,
            comment: this.state.comment
        }

        this.props.updateWriteoff(newWriteoff, this.props.history);
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    downshiftOnChange = (suggesion) => {
        this.setState({ product: suggesion.product })
    }

    render() {

        const { loading } = this.props.writeoffs;
        const { errors } = this.state;

        let spinner;

        if (loading) { spinner = < Spinner /> }

        // Select options for status
        const options = [
            { label: "Entered", value: "Enetered" },
            { label: "Located", value: "Located" },
            { label: "Returned", value: "Returned" },
            { label: "Written-off", value: "Written-off" },
            { label: "Cancelled", value: "Cancelled" }
        ];

        const options2 = [
            { label: "Damaged", value: "Damaged" },
            { label: "Faulty", value: "Faulty" },
            { label: "Maybe", value: "Maybe" },
            { label: "Spoilt", value: "Spoilt" },
            { label: "Cancelled", value: "Cancelled" }
        ];

        return (
            <div className="row">
                <div className="col-md-6 mx-auto">
                    <div className="card card-body">
                        <h3 className="text-center">Update Write-off</h3>
                        {spinner ? spinner : null}
                        <form onSubmit={this.onSubmit} method="post">

                            <TextFieldGroup
                                label="Jobnumber"
                                placeholder="Jobnumber"
                                name="jobnumber"
                                type="jobnumber"
                                value={this.state.jobnumber}
                                onChange={this.onChange}
                                error={errors.jobnumber}
                            />

                            <Downshift onChange={this.downshiftOnChange} itemToString={item => (item ? item.product : '')}>

                                {({ selectedItem, getInputProps, getItemProps, highlightedIndex, isOpen, inputValue, getLabelProps }) => (
                                    <div className="form-group">

                                        <label style={{ marginTop: '1rem', display: 'block' }} {...getLabelProps()}>Product Code</label>

                                        <input
                                            className={classnames('form-control', { 'is-invalid': errors.product })}
                                            name='product'
                                            type='product'
                                            value={this.state.product}
                                            {...getInputProps({
                                                placeholder: "Search Product Code",
                                                onChange: this.onSearch,
                                                value: this.state.product
                                            })} />

                                        {isOpen ? (
                                            <div className="downshift-dropdown">
                                                {
                                                    this.state.suggesion
                                                        .map((item, index) => (
                                                            <div
                                                                className="dropdown-item"
                                                                {...getItemProps({ key: item.product, index, item })}
                                                                style={{
                                                                    backgroundColor: highlightedIndex === index ? 'lightgray' : 'white',
                                                                    fontWeight: selectedItem === item ? 'bold' : 'normal',
                                                                }}>
                                                                {item.product}: {item.description}
                                                            </div>
                                                        ))
                                                }
                                            </div>
                                        ) : null}
                                        {errors.product && <div className="invalid-feedback">{errors.product}</div>}
                                    </div>
                                )}
                            </Downshift>

                            <TextFieldGroup
                                label="Quantity"
                                placeholder="Quantity"
                                name="qty"
                                type="number"
                                value={this.state.qty}
                                onChange={this.onChange}
                                error={errors.qty}
                            />

                            <TextFieldGroup
                                label="Customer"
                                placeholder="Customer"
                                name="customer"
                                type="customer"
                                value={this.state.customer}
                                onChange={this.onChange}
                                error={errors.customer}
                            />


                            <SelectFieldGroup
                                label="Status"
                                name="status"
                                value={this.state.status}
                                onChange={this.onChange}
                                error={errors.status}
                                options={options}
                            />

                            <SelectFieldGroup
                                label="Reason"
                                name="comment"
                                value={this.state.comment}
                                onChange={this.onChange}
                                error={errors.comment}
                                options={options2}
                            />

                            <button type="submit" className="btn btn-dark">Update</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

WriteoffEdit.propTypes = {
    updateWriteoff: PropTypes.func.isRequired,
    getWriteoff: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    writeoffs: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}


const mapStateToProps = state => ({
    writeoffs: state.writeoffs,
    auth: state.auth,
    errors: state.errors
})

export default connect(mapStateToProps, { getWriteoff, updateWriteoff })(withRouter(WriteoffEdit));