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
      FlatList} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import {ListItem, Card, Icon} from 'react-native-elements';
import MyHeader from '../components/MyHeader';



export default class MyDonationScreen extends Component{
    constructor(){
        super();
        this.state={
            userId:firebase.auth().currentUser.email,
            allDonations:[],
            donorName:''
        }
        this.requestRef=null
    }
    getAllDonations=()=>{
        this.requestRef=db.collection("all_donations").where("donor_Id","==", this.state.userId)
        .onSnapshot((snapshot)=>{
            var allDonations=snapshot.doc.map(document=>document.data())
            this.setState({allDonations:allDonations})
        })
        
    }
    keyExtractor=(item,index)=>index.toString()
    renderItem=({item,i})=>(
        <ListItem key={i}
        title={item.book_Name}
        subTitle={"Requested By :" + item.requested_By+"\nStatus :" + item.request_Status}
        leftElement={<Icon name="book" color="red"/>}
        titleStyle={{color:"black", fontWeight:"bold"}}
        rightElement={
            <TouchableOpacity style={[styles.button,{backgroundColor:item.request_Status==="Book Sent"?"green":"grey"}]}
                             onPress={()=>{this.sendBook(item)}}>
                  <Text style={{color:"white"}}>
                      {item.request_Status==="Book Sent"?"Book Sent":"Send Book"}
                  </Text>
            </TouchableOpacity>
        }
        bottomDivider
        />
       
    )
    sendNotification=(bookDetails,requestStatus)=>{
        var requestId=bookDetails.request_Id
        var donorId=bookDetails.donor_Id
        db.collection("all_notifications")
        .where("request_Id","==",requestId)
        .where("donor_Id","==",donorId)
        .get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                var message=''
                if(requestStatus==="Book Sent"){
                    message=this.state.donorName+" Sent You Book"
                }else{
                    message=this.state.donorName+" Has shown Interest in Donating the Book"
                }
                db.collection("all_notifications").doc(doc.Id).update({
                    "message":message,
                    "notification_Status":"unread",
                    "date":firebase.firestore.FieldValue.serverTimestamp(),
                })
            })
        })
    }
    sendBook=(bookDetails)=>{
        if(bookDetails.request_Status==="Book Sent"){
            var requestStatus="Donor Interested"
            db.collection("all_donations").doc(bookDetails.doc_Id).update({
                "request_Status":"Donor Interested"
            })
            this.sendNotification(bookDetails,requestStatus)
        }else{
            var requestStatus="Book Sent"
            db.collection("all_donations").doc(bookDetails.doc_Id).update({
                "request_Status":"Book Sent"
            })
            this.sendNotification(bookDetails,requestStatus)
        }
    }
    render(){
        return(
            <View style={{flex:1}}>
                <MyHeader navigation={this.props.navigation} title="My Donations"/>
              <View style={{flex:1}}>
                 {
                     this.state.allDonations.length===0
                     ?(
                         <View>
                             <Text> List of all book Donations </Text>
                         </View>
                     ):(
                         <FlatList keyExtractor={this.keyExtractor}
                         data={this.state.allDonations}
                         renderItem={this.renderItem}/>
                     )
                 }
              </View>
            </View>
        );
    }
}