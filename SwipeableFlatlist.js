import React,{Component}from 'react';
import {
    View,
    Text,
    TextInput,
    Modal,
    KeyboardAvoidingView,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView,
    Dimensions} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import {SwipeListView} from 'react-native-swipe-list-view';
import {ListItem,Icon} from "react-native-elements"

export default class SwipeableFlatlist extends React.Component{
    constructor(props){
        super(props);
        this.state={
            allNotifications:this.props.allNotifications,
        }
    }
    onSwipeValueChange=swipeData=>{
        var allNotifications=this.state.allNotifications
        const {key,value}=swipeData
         if(value<-Dimensions.get("Window").width){
             const newData=[...allNotifications]
             this.updateMarkAsRead(allNotifications[key])
             newData.splice(key,1)
             this.setState({allNotifications:newData})
         }
    }
    renderItem=data=>{
         <ListItem 
         leftElement={<Icon name="book" type="font:awesome color=yellow"/>}
         title={data.item.book_name}
         titleStyle={{color:"black", fontWeight:"bold"}}
         subtitle={data.item.message}
         bottomDivider
         />
    }
    renderHiddenItem=()=>{
        <View style={styles.rowBack}>
            <View style={[styles.backRightButton, styles.backRightButtonRight]}>
            <Text style={styles.backTextWhite}>
                Mark as Read
            </Text>
            </View>
            </View>
    }
    updateMarkAsRead=(notification)=>{
        db.collection("all_notifications")
        .doc(notification.doc_id)
        .update({notification_status:"read"})
    }
  render(){
      return(
          <SwipeListView disableRightSwipe
          data={this.state.allNotifications}
          renderItem={this.renderItem}
          renderHiddenItem={this.renderHiddenItem}
          rightOpenValue={-Dimensions.get("window").width}
          previewRowKey={"0"}
          previewOpenValue={"-40"}
          onSwipeValueChange={this.onSwipeValueChange}
          previewOpenDelay={3000}
          keyExtractor={(item,index)=>index.toString()}/>
      )
  }

}
const styles = StyleSheet.create({
    container: {
      backgroundColor: "white",
      flex: 1
    },
    backTextWhite: {
      color: "#FFF",
      fontWeight: "bold",
      fontSize: 15,
      textAlign: "center",
      alignSelf: "flex-start"
    },
    rowBack: {
      alignItems: "center",
      backgroundColor: "#29b6f6",
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      paddingLeft: 15
    },
    backRightButton: {
      alignItems: "center",
      bottom: 0,
      justifyContent: "center",
      position: "absolute",
      top: 0,
      width: 100
    },
    backRightButtonRight: {
      backgroundColor: "#29b6f6",
      right: 0
    }
  });