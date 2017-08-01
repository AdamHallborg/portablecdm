import * as types from '../actions/types';

const INITIAL_STATE = { 
  foundPortCalls: [],
  selectedPortCall: null,
  vessel: null,
  selectedPortCallOperations: [],
  portCallsAreLoading: false,
  selectedPortCallIsLoading: false,
  portCallStructureIsLoading: false,
  portCallStructure: null,
}

/*
  Operation data structure:
  operation = {
    operationId: string (urn),
    definitionId: string (ex: PORT_VISIT),
    portCallId: string (urn),
    startTime: string (time),
    startTimeType: string (ACTUAL | ESTIMATED)
    endTime: string (time),
    endTimeType: string (ACTUAL | ESTIMATED),
    from: string (urn),
    fromLocation: {
      name: string,
      aliases: [string],
      area: {
        coordinates: [ {longitude, latitude} ]
      },
      position: {longitude, latitude},
      locationType: string (ex: BERTH),
      urn: string (urn)
    }
    to: string (urn),
    toLocation: SEE fromLocation
    at: string (urn),
    atLocation: SEE fromLocation,
    isExpired: boolean,
    status: (WARNING | CRITICAL | OK) ...tror jag, inte säker på vilka alternativ som finns
    warnings: [string] (array with warnings that isn't tied to a specific state)
    reportedStates: {
      Arrival_Vessel_Berth: [all reported statements of this state]. also has a member .warnings, that is an array of warnings, as above but they are tied to this state (ex: op.reportedStates.Arrival_Vessel_Berth.warnings)
    }
  }
*/

const portCallReducer = (state = INITIAL_STATE, action) => {

  switch(action.type) {
    case types.SELECT_PORTCALL:
      const {vessel, ...portCall} = action.payload;
      return { ... state, vessel: vessel, selectedPortCall: portCall }
    case types.CLEAR_PORTCALL_SELECTION:
      return { ... state, vessel: {}, selectedPortCall: {}}
    case types.FETCH_PORTCALLS:
      return { ... state, portCallsAreLoading: true, foundPortCalls: []};
    case types.FETCH_PORTCALLS_SUCCESS:
      return { ...state, foundPortCalls: action.payload, portCallsAreLoading: false };
    case types.FETCH_PORTCALL_OPERATIONS:
      return { ...state, selectedPortCallIsLoading: true};
    case types.FETCH_PORTCALL_OPERATIONS_SUCCESS:
      return { ...state, selectedPortCallOperations: action.payload, selectedPortCallIsLoading: false};
    case types.FETCH_PORTCALL_STRUCTURE:
      return { ...state, portCallStructureIsLoading: true}
    case types.FETCH_PORTCALL_STRUCTURE_SUCCESS:
      return { ...state, portCallStructureIsLoading: false, portCallStructure: action.payload }
    default:
      return state;
  }
}

export default portCallReducer;