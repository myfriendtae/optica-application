import { GET_SAMPLE, GET_SAMPLES, SAMPLE_LOADING, CLEAR_CURRENT_SAMPLE, DOWNLOAD_SAMPLE } from '../actions/types';

const initialState = {
    sample: null,
    samples: null,
    sampleDownload: null,
    loading: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SAMPLE_LOADING:
            return {
                ...state,
                sampleDownload: null,
                loading: true
            };
        case GET_SAMPLE:
            return {
                ...state,
                sample: action.payload,
                sampleDownload: null,
                loading: false
            };
        case GET_SAMPLES:
            return {
                ...state,
                samples: action.payload,
                sampleDownload: null,
                loading: false
            };
        case CLEAR_CURRENT_SAMPLE:
            return {
                ...state,
                samples: null,
                sample: null,
                sampleDownload: null
            };
        case DOWNLOAD_SAMPLE:
            return {
                ...state,
                sampleDownload: action.payload,
                loading: false
            }
        default:
            return state;
    }
}
