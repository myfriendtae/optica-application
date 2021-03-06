import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { addWriteoff } from '../../../actions/writeoffActions';
import axios from 'axios';
import TextFieldGroup from '../../common/TextFieldGroup';
import SelectFieldGroup from '../../common/SelectFieldGroup';
import classnames from 'classnames';
import Downshift from 'downshift';

class WriteoffForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
        if (this.props.isAuthenticated) {
            this.props.history.push('/writeoffs/add');
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({ errors: nextProps.errors });
        }
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
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
            product: this.state.product,
            qty: this.state.qty,
            customer: this.state.customer,
            status: this.state.status,
            jobnumber: this.state.jobnumber,
            comment: this.state.comment
        }
        this.props.addWriteoff(newWriteoff, this.props.history);
    }

    downshiftOnChange = (suggesion) => {
        this.setState({ product: suggesion.product })
    }

    render() {

        const { errors } = this.state;

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
                        <h3 className="text-center">Write-off Form</h3>
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
                                                onChange: this.onSearch
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

                            <button type="submit" className="btn btn-dark">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

WriteoffForm.propTypes = {
    addWriteoff: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(mapStateToProps, { addWriteoff })(withRouter(WriteoffForm));