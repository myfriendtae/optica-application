import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getSample, UpdateSample } from '../../actions/sampleActions';
import { withRouter } from 'react-router-dom';

import Spinner from '../common/Spinner';
import classnames from 'classnames';
import dateFormat from 'dateformat';

import TextFieldGroup from '../common/TextFieldGroup';
import SelectFieldGroup from '../common/SelectFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';

import axios from 'axios';
import Downshift from 'downshift';

import isEmpty from '../../validation/is-empty';

class SampleEdit extends Component {
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
            rdate: '',
            comment: '',
            errors: {}
        };
    }

    componentDidMount() {
        this.props.getSample(this.props.match.params.sample_id);
    }
    
    componentWillReceiveProps(nextProps) {
        if(nextProps.errors) {
            this.setState({errors: nextProps.errors});
        }
        
        if(nextProps.samples.sample) {
            const sample = nextProps.samples.sample;
            
            // Bring Sample info arrary back to CSV
            //const sampleCSV = sample.join(',');
            
            sample.product  =!isEmpty(sample.product) ? sample.product : '';
            sample.qty  =!isEmpty(sample.qty) ? sample.qty : 0;
            sample.customer  =!isEmpty(sample.customer) ? sample.customer : '';
            sample.status  =!isEmpty(sample.status) ? sample.status : '';
            sample.rdate  =!isEmpty(sample.rdate) ? sample.rdate : '';
            sample.comment  =!isEmpty(sample.comment) ? sample.comment : '';

            // Set component fields state
            this.setState({
                sample_id: sample.sample_id,
                product: sample.product,
                qty: sample.qty.toString(),
                customer: sample.customer,
                status: sample.status,
                rdate: dateFormat(sample.rdate, "yyyy-mm-dd"),
                comment: sample.comment
            });
        }
    }

    onSearch = (e) => {
        this.setState({[e.target.name]: e.target.value });

        if(e.target.value.length >= 2) {
            axios
            .get(`/api/products/${e.target.value}`)
            .then(res => {
                this.setState({suggesion: res.data})
            });
        }  
    }

    onSubmit = (e) => {
        e.preventDefault();
        const newSample = {
            sample_id: this.state.sample_id,
            product: this.state.product,
            qty: this.state.qty,
            customer: this.state.customer,
            status: this.state.status,
            rdate: this.state.rdate,
            comment: this.state.comment
        }

        this.props.UpdateSample(newSample, this.props.history);
    }  

    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value });
    }

    downshiftOnChange = (suggesion) => {
        this.setState({product: suggesion.product})
    }

    render() {

        const {loading} = this.props.samples;
        const {errors} = this.state;

        let spinner;

        if (loading) {spinner = < Spinner />}

        const options = [
            {label: "Request", value: "Request"},
            {label: "Picked", value: "Picked" },
            {label: "Already Taken", value: "Already Taken" },
            {label: "Completed", value: "Completed" },
            {label: "Cancelled", value: "Cancelled" }
        ];

        return ( 
            <div className="row">
                <div className="col-md-6 mx-auto">
                    <div className="card card-body">
                        <h3 className="text-center">Edit Sample</h3>
                        {spinner? spinner : null}
                        <form onSubmit={this.onSubmit} method="post">

                            <Downshift onChange={this.downshiftOnChange} itemToString={item => (item ? item.product : '')}>
                            
                            {({ selectedItem, getInputProps, getItemProps, highlightedIndex, isOpen, inputValue, getLabelProps }) => (
                            <div className="form-group">
                                
                                <label style={{marginTop: '1rem', display: 'block' }} {...getLabelProps()}>Product Code</label> 
                                
                                <input 
                                className={classnames('form-control', {'is-invalid': errors.product})}
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
                            value={`${this.state.qty}`}
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
                            options = {options}
                            />   

                            <TextFieldGroup
                            label="Request Date"
                            placeholder="Request Date"
                            name="rdate"
                            type="date"
                            value={this.state.rdate}
                            onChange={this.onChange}
                            error={errors.rdate}
                            />   

                            <TextAreaFieldGroup
                            label="Comment"
                            placeholder="Comment"
                            name="comment"
                            value={this.state.comment}
                            onChange={this.onChange}
                            error={errors.comment}
                            />   

                        <button type="submit" className="btn btn-dark">Update</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

SampleEdit.propTypes = {
    UpdateSample: PropTypes.func.isRequired,
    getSample: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    samples: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired 
}


const mapStateToProps = state => ({
    samples: state.samples,
    auth: state.auth,
    errors: state.errors
})

export default connect(mapStateToProps, {getSample, UpdateSample})(withRouter(SampleEdit));