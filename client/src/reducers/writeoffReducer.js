import { GET_WRITEOFF, GET_WRITEOFFS, WRITEOFF_LOADING, CLEAR_CURRENT_WRITEOFF, DOWNLOAD_WRITEOFF } from '../actions/types';

const initialState = {
    writeoff: null,
    writeoffs: null,
    writeoffDownload: null,
    loading: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case WRITEOFF_LOADING:
            return {
                ...state,
                writeoffDownload: null,
                loading: true
            };
        case GET_WRITEOFF:
            return {
                ...state,
                writeoff: action.payload,
                writeoffDownload: null,
                loading: false
            };
        case GET_WRITEOFFS:
            return {
                ...state,
                writeoffs: action.payload,
                writeoffDownload: null,
                loading: false
            };
        case CLEAR_CURRENT_WRITEOFF:
            return {
                ...state,
                writeoffs: null,
                writeoff: null,
                writeoffDownload: null
            };
        case DOWNLOAD_WRITEOFF:
            return {
                ...state,
                writeoffDownload: action.payload,
                loading: false
            }
        default:
            return state;
    }
}
