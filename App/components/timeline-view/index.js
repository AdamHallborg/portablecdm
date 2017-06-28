import React, {Component} from 'react';
import {
    View ,
    Text,
    StyleSheet,
    ScrollView,
    FlatList
} from 'react-native';

import TimeLine from 'react-native-timeline-listview';

import portCDM from '../../services/backendservices';


export default class TimeLineView extends Component {
    state = {
        operations: []
    }

    constructor() {
        super();
        this.renderDetail = this.renderDetail.bind(this);
    }

    fromOperationToTimeLine(operation) {
        return {
            time: new Date(operation.startTime).toLocaleTimeString().slice(0, -3),
            operation: operation
        }
    }

    renderDetail(data, sectionId, rowIndex) {
        const { operation } = data;
        
        return (
            <Text>{operation.definitionId}</Text>
        );
    }

    _sortFunction(a, b) {
        let aStartTime = new Date(a);
        let bStartTime = new Date(b);

        // is a earlier than b?
        if(aStartTime < bStartTime) {
            return -1;
        }

        // is a later than b
        if(aStartTime > bStartTime) {
            return 1;
        }

        // Must be the same time
        return 0;
    }

    componentWillMount() {
        // const { params } = this.props.navigation.state;
        params = { portCallId:  'urn:mrn:stm:portcdm:port_call:SEGOT:111722cd-904c-4f01-b6b9-fe8a109d80b8' }

        portCDM.getPortCallOperations(params.portCallId)
            .then(result => (result.json()) )
            .then(result => result.sort(this._sortFunction))
            .then(result => (this.setState({operations: result})) )  
            .catch(error => console.log(`ERROR in fetching portcall operations!!, ERRORMESSAGE: ${error}`))
    }

    _renderOperation = ({item}) => {
        return (
            <Operation operation={item} />
        );
    }

    _operationKeyExtractor = (op, index) => op.operationId;

    render() {
        const {operations} = this.state;
        return(
            <View style={styles.container}>
                <TimeLine
                    data={operations.map(this.fromOperationToTimeLine)}
                    circleSize={0}
                    renderDetail={this.renderDetail}
                />
            </View>
        );
        // return(
        //     <View style={styles.container}>
        //         <FlatList
        //             extraData={this.state}
        //             keyExtractor={this._operationKeyExtractor}
        //             data={operations}
        //             renderItem={this._renderOperation}  
        //         />
        //     </View>
        // )
    }
}

class Operation extends Component {

    _renderItem(statement) {
        return(
            <View>
                {statement.timeType==='ACTUAL' && <Text>ACTUAL</Text>}
                {statement.timeType==='ESTIMATE' && <Text>ESTIMATE</Text>}
                <Text>{statement.stateDefinition} - {new Date(statement.time).toLocaleTimeString()}</Text>
            </View>
        );
    }

    render() {
        const { operation } = this.props;
        return(
            <View style={styles.operationContainer}>
                <Text>{operation.definitionId} : {operation.startTime}</Text>
                <FlatList style={{marginLeft: 10}}
                    data={operation.statements}
                    keyExtractor={(statement, index) => statement.messageId}
                    renderItem={({item}) => this._renderItem(item)}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40,
    },
    operationContainer: {
        backgroundColor: 'grey'
    }
});