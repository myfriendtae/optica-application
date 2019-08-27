import axios from 'axios';
import { GET_ERRORS, GET_SAMPLE, GET_SAMPLES, SAMPLE_LOADING, DOWNLOAD_SAMPLE, CLEAR_CURRENT_SAMPLE } from './types';

// Get all Samples
export const getAllSamples = () => dispatch => {
    dispatch(setSampleLoading());
    axios
        .get('/api/samples')
        .then(res =>
            dispatch({
                type: GET_SAMPLES,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_SAMPLES,
                payload: {}
            })
        );
}

// Get Sample to Edit
export const getSample = (userData) => dispatch => {
    dispatch(setSampleLoading());
    axios
        .get(`/api/samples/edit/${userData}`)
        .then(res => {
            dispatch({
                type: GET_SAMPLE,
                payload: res.data,
            })
        })
        .catch(err =>
            dispatch({
                type: GET_SAMPLE,
                payload: {}
            })
        );
}

// Samples Loading
export const setSampleLoading = () => {
    return {
        type: SAMPLE_LOADING
    }
}

// Clear Samples
export const clearSample = () => {
    return {
        type: CLEAR_CURRENT_SAMPLE
    }
}

// Add Sample
export const addSample = (userData, history) => dispatch => {
    if (userData) {
        axios
            .post('/api/samples/add', userData)
            .then(res => history.push('/samples'))
            .catch(err =>
                dispatch({
                    type: GET_ERRORS,
                    payload: err.response.data
                })
            );
    }
}

// Update Sample
export const UpdateSample = (userData, history) => dispatch => {
    if (userData) {
        axios
            .put(`/api/samples/edit/${userData.sample_id}`, userData)
            .then(res => history.push('/samples'))
            .catch(err =>
                dispatch({
                    type: GET_ERRORS,
                    payload: err.response.data
                })
            );
    }
}

export const DownloadSample = () => dispatch => {
    axios
        .get('/api/samples/download')
        .then(res => {
            dispatch({
                type: DOWNLOAD_SAMPLE,
                payload: res.data,
            })
        })
        .catch(err =>
            dispatch({
                type: DOWNLOAD_SAMPLE,
                payload: {}
            })
        );
}