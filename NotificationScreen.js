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
    ScrollView} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import {ListItem, Icon} from 'react-native-elements';
import MyHeader from '../components/MyHeader';
import {SwipeableFlatlist} from '../components/SwipeableFlatlist';

export default class NotificationScreen extends React.Component{
    constructor(){
        super();
        this.state={
            allNotifications:[],
            userId:firebase.auth().currentUser.email

        }
    }
    getNotifications=()=>{
      this.requestRef=db.collection("all_notifications")
      .where("notification_status","==",unread)
      .where("targeted_user_id","==", this.state.userId)
      .onSnapshot((snapshot)=>{
          var allNotifications=[]
          snapshot.docs.map((doc)=>{
              var notification=doc.data()
              notification["doc_id"]=doc.id
              allNotifications.push(notification)
              
          })
          this.setState({allNotifications:allNotifications})
      })
    }
    componentDidMount(){
        this.getNotifications()
    }
    keyExtractor=(item,index)=>index.toString()
    renderItem=({item,index})=>{
        return(
            <ListItem 
            key={item}
            leftElement={<Icon name="book" color="green"/>}
            title={item.book_name}
            subtitle={item.message}
            titleStyle={{color:"black", fontWeight:"bold"}}
            bottomDivider
            />
        )
    }
    render(){
        return(
            <View style={{flex:1}}>
                <View  style={{flex:1}}> 
                  <MyHeader title={"Notifications"} navigation={this.props.navigation}/>
                </View>
                <View style={{flex:1}}>
                   {
                       this.state.allNotification.length===0
                       ?(
                           <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
                               <Text style={{fontSize:25}}>You Have no Notifications</Text>
                           </View>
                       ):
                       (<SwipeableFlatlist allNotifications={this.state.allNotifications}/>)
                   }
                </View>
            </View>
        )
    }
}