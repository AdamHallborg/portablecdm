import * as types from './types';
import { checkResponse, catchError } from '../util/httpResultUtils';
import { createTokenHeaders, createLegacyHeaders, getCert } from '../util/portcdmUtils';
import pinch from 'react-native-pinch';

export const fetchLocations = (locationType) => {
    return (dispatch, getState) => {
        dispatch({type: types.FETCH_LOCATIONS});
        let connection = getState().settings.connection;
        console.log('Connection: ' + JSON.stringify(connection));
        const token = getState().settings.token;
        console.log('Requesting locations...');
        return pinch.fetch(`${connection.host}:${connection.port}/location-registry/locations`,
            {
                method: 'GET',
                headers: !!connection.username ? createLegacyHeaders(connection) : createTokenHeaders(token, connection.host),
                sslPinning: getCert(connection),
            })
            .then(result => {
                let err = checkResponse(result);
                if(!err)
                    return JSON.parse(result.bodyString);
                
                dispatch({type: types.SET_ERROR, payload: err});
                throw new Error(types.ERR_DISPATCHED);
            })
            .then(locations => {
                // Need to add locations for logical locations
                ['ANCHORING_AREA', 
                    'BERTH', 
                    'ETUG_ZONE', 
                    'LOC', 
                    'PILOT_BOARDING_AREA', 
                    'RENDEZV_AREA', 
                    'TRAFFIC_AREA', 
                    'VTS_AREA', 
                    'TUG_ZONE', 
                    'VESSEL', 
                    'PORT', 
                    'HOME_BASE', 
                    'BOUY'
                ].forEach(locationType => {
                    const name = locationType.replace(/_/g, ' ');
                    locations.push(createLocation(connection.unlocode, locationType, name, name ))
                })
                return locations;
            })
            .then(locations => {
                console.log('Actually got locations this time');
                dispatch({type: types.FETCH_LOCATIONS_SUCCESS, payload: locations});
            }).catch(err => {
                console.log('********LOCATION FETCH ERROR********');
                if (err.message === tpyes.ERR_DISPATCHED) return;
                console.log(err);
                dispatch({type: types.SET_ERROR, payload: {
                    title: 'Unable to fetch locations!', 
                    description: 
                      !err.description ? 'Please check your internet connection.' 
                                        : err.description}});
            });
    }
}

function createLocation(unlocode, locationType, name, shortName) {
    return {
        name: name,
        shortName: name,
        aliases: [],
        area: null,
        position: null,
        locationType: locationType,
        URN: `urn:mrn:stm:location:${unlocode}:${locationType}`
    }
}

/** Selects location to be either atLocation, fromLocation or toLocation
 *  when sending in a portcall message
 * 
 * @param {string} locationSort 
 *  "atLocation" | "fromLocation" | "toLocation"
 * @param {location data structure} location 
 *  the Location data structure retreived from /location-registry
 */
export const selectLocation = (locationSort, location) => {
    return {
        type: types.SEND_PORTCALL_SELECT_LOCATION,
        payload: {
            locationType: locationSort,
            location: location,
        }
    }
}


// Helper functions