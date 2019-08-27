import axios from 'axios';
import { GET_ERRORS, GET_WRITEOFF, GET_WRITEOFFS, WRITEOFF_LOADING, CLEAR_CURRENT_WRITEOFF, DOWNLOAD_WRITEOFF } from '../actions/types';

// Get all Writeoffs
export const getAllWriteoffs = () => dispatch => {
    dispatch(setWriteoffLoading());
    axios
        .get('/api/writeoffs')
        .then(res =>
            dispatch({
                type: GET_WRITEOFFS,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_WRITEOFFS,
                payload: {}
            })
        );
}

// Get Writeoff to Edit
export const getWriteoff = (userData) => dispatch => {
    dispatch(setWriteoffLoading());
    axios
        .get(`/api/writeoffs/edit/${userData}`)
        .then(res => {
            dispatch({
                type: GET_WRITEOFF,
                payload: res.data,
            })
        })
        .catch(err =>
            dispatch({
                type: GET_WRITEOFF,
                payload: {}
            })
        );
}

// Writeoff Loading
export const setWriteoffLoading = () => {
    return {
        type: WRITEOFF_LOADING
    }
}

// Clear Writeoff
export const clearWriteoff = () => {
    return {
        type: CLEAR_CURRENT_WRITEOFF
    }
}

// Add Writeoff
export const addWriteoff = (userData, history) => dispatch => {
    if (userData) {
        axios
            .post('/api/writeoffs/add', userData)
            .then(res => history.push('/writeoffs'))
            .catch(err =>
                dispatch({
                    type: GET_ERRORS,
                    payload: err.response.data
                })
            );
    }
}

// Update Writeoff
export const updateWriteoff = (userData, history) => dispatch => {
    if (userData) {
        axios
            .put(`/api/writeoff/edit/${userData.writeoff_id}`, userData)
            .then(res => history.push('/writeoff'))
            .catch(err =>
                dispatch({
                    type: GET_ERRORS,
                    payload: err.response.data
                })
            );
    }
}

// Download Writeoff
export const DownloadWriteoff = () => dispatch => {
    axios
        .get('/api/writeoffs/download')
        .then(res => {
            dispatch({
                type: DOWNLOAD_WRITEOFF,
                payload: res.data,
            })
        })
        .catch(err =>
            dispatch({
                type: DOWNLOAD_WRITEOFF,
                payload: {}
            })
        );
}