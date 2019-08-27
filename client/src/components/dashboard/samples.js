import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAllSamples, getSample, DownloadSample } from '../../actions/sampleActions';
import Spinner from '../common/Spinner';
import dateFormat from 'dateformat';
import { Link } from 'react-router-dom';
import capitalise from '../../validation/capitalise';
import saveData from '../../validation/saveData';

class SampleTable extends Component {

    componentDidMount() {
        this.props.getAllSamples();
    }

    addSample = () => {
        this.props.history.push('./add');
    }

    DownloadSample = () => {
        this.props.DownloadSample();
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.samples.sampleDownload) {
            const sample = nextProps.samples.sampleDownload;
            saveData(sample, "download.csv");
        }
    }

    render() {
        const {
            samples,
            loading
        } = this.props.samples;

        let sampleContent;
        let spinner;

        if (samples === null || loading) {
            spinner = < Spinner />
        } else {
            // Check if logged in user has profile data

            if (Object.keys(samples).length > 0) {
                sampleContent = samples.map(sample =>
                    <tr key={sample.sample_id}>
                        <td> {dateFormat(sample.rdate, "dd/mm/yyyy")} </td>
                        <td> {capitalise(sample.name)} </td>
                        <td> {sample.product} </td>
                        <td> {sample.qty} </td>
                        <td> {sample.status} </td>
                        <td>
                            <Link
                                to={`./edit/${sample.sample_id}`}
                                className="btn btn-dark">
                                Edit
                            </Link>
                        </td>
                    </tr>
                )
            }
        }

        return (
            <div >
                <h1> Sample Application </h1>
                <div className="btn-group mb-2" role="group" aria-label="Basic example">
                    <button type="button" className="btn btn-outline-dark btn-sm" onClick={this.DownloadSample}> Download </button>
                    <button type="button" className="btn btn-outline-dark btn-sm" onClick={this.addSample}> Add form </button>
                </div>

                <div className="card card-body" >
                    <h3 > Sample History </h3>
                    <table className="table table-hover" >
                        <thead>
                            <tr>
                                <th scope="col" > Required Date </th>
                                <th scope="col" > Owner </th>
                                <th scope="col" > Product </th>
                                <th scope="col" > Qty </th>
                                <th scope="col" > Status </th>
                                <th scope="col" > </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sampleContent ? sampleContent : null}
                        </tbody>
                    </table > <div > {spinner ? spinner : null} </div>
                </div >
            </div>
        )
    }
}

SampleTable.propTypes = {
    getSample: PropTypes.func.isRequired,
    getAllSamples: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    samples: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    samples: state.samples,
    auth: state.auth
})

export default connect(mapStateToProps, { getAllSamples, getSample, DownloadSample })(SampleTable);