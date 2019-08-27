import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAllWriteoffs, getWriteoff, DownloadWriteoff } from '../../../actions/writeoffActions';
import Spinner from '../../common/Spinner';
import dateFormat from 'dateformat';
import { Link } from 'react-router-dom';
import saveData from '../../../validation/saveData';

class WriteoffTable extends Component {

    componentDidMount() {
        this.props.getAllWriteoffs();
    }

    addWriteoff = () => {
        this.props.history.push('./add');
    }

    DownloadWriteoff = () => {
        this.props.DownloadWriteoff();
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.writeoffs.writeoffDownload) {
            const writeoff = nextProps.writeoffs.writeoffDownload;
            saveData(writeoff, "download.csv");
        }
    }

    render() {
        const {
            writeoffs,
            loading
        } = this.props.writeoffs;

        let writeoffContent;
        let spinner;

        if (writeoffs === null || loading) {
            spinner = < Spinner />
        } else {
            // Check if logged in user has profile data

            if (Object.keys(writeoffs).length > 0) {
                writeoffContent = writeoffs.map(writeoff =>
                    <tr key={writeoff.writeoff_id}>
                        <td> {dateFormat(writeoff.createdAt, "dd/mm/yyyy")} </td>
                        <td> {writeoff.jobnumber} </td>
                        <td> {writeoff.product} </td>
                        <td> {writeoff.qty} </td>
                        <td> {writeoff.status} </td>
                        <td>
                            <Link
                                to={`./edit/${writeoff.writeoff_id}`}
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
                <h1> Write-off Application </h1>
                <div className="btn-group mb-2" role="group" aria-label="Basic example">
                    <button type="button" className="btn btn-outline-dark btn-sm" onClick={this.DownloadWriteoff}> Download </button>
                    <button type="button" className="btn btn-outline-dark btn-sm" onClick={this.addWriteoff}> Add form </button>
                </div>

                <div className="card card-body" >
                    <h3 > Write-off History </h3>
                    <table className="table table-hover" >
                        <thead>
                            <tr>
                                <th scope="col" > Date </th>
                                <th scope="col" > Jobnumber </th>
                                <th scope="col" > Product </th>
                                <th scope="col" > Qty </th>
                                <th scope="col" > Status </th>
                                <th scope="col" > </th>
                            </tr>
                        </thead>
                        <tbody>
                            {writeoffContent ? writeoffContent : null}
                        </tbody>
                    </table > <div > {spinner ? spinner : null} </div>
                </div >
            </div>
        )
    }
}

WriteoffTable.propTypes = {
    getWriteoff: PropTypes.func.isRequired,
    getAllWriteoffs: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    writeoffs: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    writeoffs: state.writeoffs,
    auth: state.auth
})

export default connect(mapStateToProps, { getAllWriteoffs, getWriteoff, DownloadWriteoff })(WriteoffTable);