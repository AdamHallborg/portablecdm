import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';

import {
  List,
  ListItem,
  Icon,
  Badge
} from 'react-native-elements';

import Collapsible from 'react-native-collapsible';

import {getTimeDifferenceString, getTimeString, getDateString} from '../../../util/timeservices'
import colorScheme from '../../../config/colors';

class OperationView extends Component {

  constructor(props) {
    super(props);

    const { operation } = this.props;
    const { reportedStates } = operation;

    this.state = {
      operation: operation,
      reportedStates: reportedStates,
      isCollapsed: operation.endTimeType === 'ACTUAL',

    }

    this._toggleCollapsed = this._toggleCollapsed.bind(this);

  }
  
  _toggleCollapsed() {
    this.setState({isCollapsed: !this.state.isCollapsed})
  }

  render() {
    const { operation, reportedStates, isCollapsed } = this.state;
    const { rowNumber, navigation, getStateDefinition } = this.props;

    // Decide what dot to display
    let dotStyle = [styles.innerDot, styles.innerFutureDot];
    if(operation.endTimeType === 'ACTUAL') dotStyle = [styles.innerDot, styles.innerCompleteDot];

    let startTimeDisplayStyle;
    if (operation.startTimeType === 'ACTUAL'){
      startTimeDisplayStyle = styles.timeDisplayActual;
    }
    else if (operation.startTimeType === 'ESTIMATED'){
      startTimeDisplayStyle = styles.timeDisplayEstimate;
    }
    else {
      startTimeDisplayStyle = styles.timeDisplay;
    }

    let endTimeDisplayStyle;
    if (operation.endTimeType === 'ACTUAL'){
      endTimeDisplayStyle = styles.timeDisplayActual;
    }
    else if (operation.endTimeType === 'ESTIMATED'){
      endTimeDisplayStyle = styles.timeDisplayEstimate;
    }
    else if (!operation.endTimeType) {
      endTimeDisplayStyle = styles.timeDisplayWarning;
    }
    else {
      endTimeDisplayStyle = styles.timeDisplay;
    }



    return (
      <View style={styles.container}>
        
        {/* Time Display */}
        <View style={styles.timeContainer}>
          {/*Start Time*/}
          <View style={styles.timeDisplayContainer}>
            <Text style={styles.dateDisplay}>{getDateString(new Date(operation.startTime))}</Text>
            <Text style={startTimeDisplayStyle}>{getTimeString(new Date(operation.startTime))}</Text>
          </View>
          {/*End Time*/}
          <View style={[styles.timeDisplayContainer, {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colorScheme.tertiaryColor}]}>
            <Text style={styles.dateDisplay}>{getDateString(new Date(operation.endTime))}</Text>
            <Text style={endTimeDisplayStyle }>{getTimeString(new Date(operation.endTime))}</Text>
          </View>
        </View>

        {/* Line and dots */}
        <View style={styles.timeline}>
          <View style={styles.line}>
            <View style={styles.bottomLine} />
          </View>
          <View style={styles.outerDot}>
            <View style={dotStyle} />
          </View>
          
        </View>

        {/*Everything to the right of the line*/}
        <View
          style={{flex: 1, flexDirection: 'column', marginTop: 0, paddingTop: 0, paddingLeft: 15}}>
          
          {/*Clickable header to expand information*/}
          <TouchableWithoutFeedback
            onPress={this._toggleCollapsed}>
            <View>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.operationHeader}>{operation.definitionId.replace('_', ' ')} - {operation.reliability}%</Text>
                {operation.warnings.length > 0 && <Icon name='warning' color={colorScheme.warningColor}/>}
              </View>
              {operation.fromLocation && <Text style={styles.operationInfo}><Text style={{fontWeight: 'bold'}}>FROM</Text> {operation.fromLocation.name}</Text>}
              {operation.toLocation && <Text style={styles.operationInfo}><Text style={{fontWeight: 'bold'}}>TO</Text> {operation.toLocation.name}</Text>}
              {operation.atLocation && <Text style={styles.operationInfo}><Text style={{fontWeight: 'bold'}}>AT</Text> {operation.atLocation.name}</Text>}
            </View>
          </TouchableWithoutFeedback>

          {/*The information, displayed in a list*/}
          <Collapsible
            collapsed = {isCollapsed}
          >
            {/* Render warnings */}
            {operation.warnings.map((warning, index) => {
              return (
                <View style={{flexDirection: 'row', alignItems: 'center', paddingTop: 10,}} key={index}>
                  <Icon name='warning' color={colorScheme.warningColor} size={14} paddingRight={10} />
                  <Text style={{fontSize: 8, paddingLeft: 0, maxWidth: Dimensions.get('window').width/1.4 }}>{warning.message}</Text>
                </View>
              );
            })}

            <List style={{borderTopWidth: 0}}>    
              {
                Object.keys(reportedStates)
                  .map((stateDef) => this.findMostRelevantStatement(reportedStates[stateDef]))
                  .sort((a, b) => {
                    const aTime = new Date(a.time);
                    const bTime = new Date(b.time);

                    if(aTime < bTime) return -1;
                    if(aTime > bTime) return 1;
                    else return 0;

                  }) 
                  .map((mostRelevantStatement) => this.renderStateRow(operation, 
                                                        mostRelevantStatement, 
                                                        reportedStates[mostRelevantStatement.stateDefinition],
                                                        this.props.navigation.navigate,
                                                        getStateDefinition(mostRelevantStatement.stateDefinition)
                                                      ))
              }
            </List>
          </Collapsible>
        </View>
        
      </View>
    );
  }

  renderStateRow(operation, mostRelevantStatement, allOfTheseStatements, navigate, stateDef) {
    const { warnings } = allOfTheseStatements;
    const stateToDisplay = mostRelevantStatement;
    const reportedTimeAgo = getTimeDifferenceString(new Date(stateToDisplay.reportedAt));
   // const stateCount = allOfTheseStatements.length;
    let stateCount = 0;
    if (stateToDisplay.timeType === 'ACTUAL') {
      stateCount = allOfTheseStatements.filter((statement)=> statement.timeType === 'ACTUAL').length;
    }
    else if (stateToDisplay.timeType === 'ESTIMATED') {
      stateCount = allOfTheseStatements.filter((statement)=> statement.timeType === 'ESTIMATED').length;
    }
    else {
      stateCount = allOfTheseStatements.length;
    }
    

    return (
      <ListItem
        containerStyle = {{
          borderTopWidth: 0,
          borderBottomWidth: 0,
        }}
        key={stateToDisplay.messageId}
        rightIcon = { <Icon
                        color = {colorScheme.primaryColor}
                        name='add-circle'
                        size={35}
                        onPress={() => navigate('SendPortCall', {stateId: stateToDisplay.stateDefinition, fromLocation: operation.fromLocation, toLocation: operation.toLocation, atLocation: operation.atLocation})} />
        }
        title = {
            <TouchableWithoutFeedback 
                style={{flexDirection:'column'}}
                onPress={ () => navigate('StateDetails', {operation: operation, statements: allOfTheseStatements} ) }
            >
              <View>  
                  <View style={{flexDirection: 'row'}}>
                    {!stateDef && <Text style={styles.stateDisplayTitle} >{stateToDisplay.stateDefinition}</Text>}
                    {stateDef && <Text style={styles.stateDisplayTitle} >{stateDef.Name}</Text>}

                    {!!warnings && <Icon name='warning' color={colorScheme.warningColor} size={16} />} 
                  </View>
                  <View style= {{flexDirection: 'row'}} >
                      <Text style = {{color: colorScheme.tertiaryColor, fontWeight: 'bold'}} >{new Date(stateToDisplay.time).toTimeString().slice(0, 5)} </Text>
                      {stateToDisplay.timeType === 'ACTUAL' && <View style={styles.actualContainer}>
                                                                    <Text style={styles.actualText}>A</Text>
                                                               </View>
                      }
                      {stateToDisplay.timeType === 'ESTIMATED' && <View style={styles.estimateContainer}>
                                                                      <Text style={styles.estimateText}>E</Text>
                                                                  </View>
                      }
                  </View>
              </View>
            </TouchableWithoutFeedback>
        }
        subtitle = {
            <View style={{flexDirection: 'column'}} >
                {operation.atLocation && <Text style={{fontSize: 9}}>
                  <Text style = {styles.stateDisplaySubTitle}>AT: </Text>{operation.atLocation.name}</Text>}
                {operation.fromLocation && <Text style={{fontSize: 9}}>
                  <Text style = {styles.stateDisplaySubTitle} >FROM: </Text>{operation.fromLocation.name}</Text>}
                {operation.toLocation && <Text style={{fontSize: 9}}>
                  <Text style = {styles.stateDisplaySubTitle}>TO: </Text>{operation.toLocation.name}</Text>}
                <Text style={{fontSize: 9}}>
                  <Text style= {styles.stateDisplaySubTitle}>REPORTED BY: </Text>{stateToDisplay.reportedBy.replace('urn:mrn:legacy:user:', '')} 
                  <Text style= {{color: colorScheme.tertiaryColor}} > {reportedTimeAgo} ago</Text> </Text>
                {stateToDisplay.reliability && <Text style={{fontSize: 9}}>
                  <Text style = {styles.stateDisplaySubTitle}>RELIABILITY: </Text>{stateToDisplay.reliability}%</Text> }
            </View>
        }
        badge = {
          {value: stateCount, textStyle: {color: 'black', fontSize: 10, fontWeight: 'bold'}, 
          containerStyle: {backgroundColor: colorScheme.backgroundColor} , // 30
          wrapperStyle: {justifyContent: 'center'},
          }
        }
      />
    );
  }

  

  /**
   * Finds the most relevant statement, i.e the latest Estimate or the latest Actual. 
   * Actuals always overwrites estimates
   * 
   * @param {[Statement]} statements 
   *   an array of statements, all with the same statedefinition
   */
  findMostRelevantStatement(statements) {
      // sort statements based on reportedAt, latest reported first
      // TODO(johan) Kolla upp om listan av statements redan är sorterad efter reportedAt
      statements.sort((a, b) => {
          let aTime = new Date(a.reportedAt);
          let bTime = new Date(b.reportedAt);

          if(aTime > bTime) return -1;
          if(aTime < bTime) return 1;
          else return 0;
      });
      
      // find the first actual
      for(let i = 0; i < statements.length; i++) {
          if(statements[i].timeType === 'ACTUAL') {
              return statements[i];
          }
      }

      // if no actuals exist, take the first element
      return statements[0];
  }
}

function mapStateToProps(state) {
  return {
    getStateDefinition: state.states.stateById
  }
}

export default connect(mapStateToProps)(OperationView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colorScheme.primaryContainerColor,
    paddingTop: 5,
  },
  timeContainer: {
    width: 70,
    paddingRight: 5,
    justifyContent: 'space-between',
  },
  timeDisplayContainer: {
    // backgroundColor: colorScheme.secondaryContainerColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  operationHeader: {
    fontWeight: 'bold', 
    fontSize: 23,
    color: colorScheme.quaternaryTextColor, // Snyggare med EmeraldBlue(queaternaryColor)
  },
  operationInfo: {
    fontSize: 10,
    color: colorScheme.quaternaryTextColor
  },
  stateDisplayTitle: {
    fontWeight: 'bold', 
    color: colorScheme.quaternaryTextColor,
  },
  stateDisplaySubTitle: {
    fontWeight: 'bold',
    color: colorScheme.quaternaryTextColor,
    fontSize: 9,
  },




  timeline: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 60,
    width: 16,
    alignItems: 'center',
  },
  line: {
    position: 'absolute',
    top: 0,
    left: 6,
    width: 4,
    bottom: 0,
  },
  topLine: {
    flex: 1,
    width: 4,
    backgroundColor: colorScheme.primaryColor,
  },
  bottomLine: {
    flex: 1,
    width: 4,
    backgroundColor: colorScheme.primaryColor,
  },
  hiddenLine: {
    width: 0,
  },
  outerDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colorScheme.primaryColor,
    marginTop: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerDot: {
    width: 10,
    height: 10,
    borderRadius: 6,
  },
  innerCompleteDot: {
    backgroundColor: colorScheme.primaryColor,
  },
  innerActiveDot: {
    backgroundColor: colorScheme.secondaryColor,
  },
  innerFutureDot: {
    backgroundColor: colorScheme.primaryContainerColor,
  },
  dateDisplay: {
    fontSize: 9,
    color: colorScheme.quaternaryTextColor
  },
  timeDisplay: {
    color: colorScheme.tertiaryColor,
  },
  timeDisplayActual: {
    color: colorScheme.actualColor,
  },
  timeDisplayEstimate: {
    color: colorScheme.estimateColor,
  },
  timeDisplayWarning: {
    color: colorScheme.warningColor,
  },


  actualText: {
    color: colorScheme.primaryTextColor,
    textAlign: 'center',
    fontWeight: 'bold',
  },

    actualContainer: {
    backgroundColor: colorScheme.actualColor,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    overflow: 'hidden',
    alignItems: 'center',
  },

  estimateText: {
    color: colorScheme.primaryTextColor,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  estimateContainer: {
    backgroundColor: colorScheme.estimateColor,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    overflow: 'hidden',
    alignItems: 'center',
  },  

});




{/*<Icon 
  name='font-download' 
  color={colorScheme.tertiaryColor
  } />*/}

  // <Icon 
  //     name='access-time' 
  //     color={colorScheme.tertiaryColor
  //   } />
