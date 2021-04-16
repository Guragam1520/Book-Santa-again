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
import {Card} from 'react-native-elements';

export default class RecieverDetailsScreen extends React.Component{
    constructor(props){
        super(props);
        this.state={
            userId:firebase.auth().currentUser.email,
            reciverId:this.props.navigation.getParam("details")["user_Id"],
            requestId:this.props.navigation.getParam("details")["request_Id"],
            bookName:this.props.navigation.getParam("details")["book_Name"],
            reasonToRequest:this.props.navigation.getParam("details")["reason_To_Request"],
            recieverName:'',
            recieverContact:'',
             recieverAddress:'',
            reciverRequestDocId:'',
            userName:''
        }
    }
    getReciverDetails=()=>{
        db.collection("users").where("email_Id","==",this.state.reciverId).get()
        .then((snapshot)=>{
            snapshot.forEach(doc=>{
                this.setState({
                    reciverName:doc.data().first_Name,
                    recieverContact:doc.data().contact,
                    recieverAddress:doc.data().address,
                })
            })
        })
        db.collection("requested_books").where("request_Id", "==", this.state.requestId).get()
        .then((snapshot)=>{
            snapshot.forEach(doc=>{
                this.setState({
                  reciverRequestDocId:doc.Id
                })
            })
        })
    }
    getUserDetails=(userId)=>{
      db.collection("users").where("email_Id","==",userId).get()
      .then((snapshot)=>{
        snapshot.forEach(doc=>{
            this.setState({
                userName:doc.data().first_Name+" "+doc.data().last_Name
            })
        })
    })
    }
    componentDidMount(){
        this.getReciverDetails();
        this.getUserDetails(this.state.userId);
    } 
    updateBookStatus=()=>{
        db.collection("all_donations").add({
            book_Name:this.state.bookName,
            request_Id:this.state.requestId,
            requested_By:this.state.reciverName,
            donor_Id:this.state.userId,
            request_Status:"Donor Interested"
        })
    }
     addNotification=()=>{
         var message=this.state.userName+" Has Shown Interest in Donating the Book"
         db.collection("all_notifications").add({
             "targeted_user_id":this.state.reciverId,
             "donor_id":this.state.userId,
             "request_id":this.state.requestId,
             "book_name":this.state.bookName,
             "date":firebase.firestore.FieldValue.serverTimestamp(),
             "notification_status":"unread",
             "message":message
         })
     }
    render(){
        return(
            <View>
                <View>
                  <Card title={"book information"} titleStyle={{fontSize:20}}>
                     <Card>
                         <Text style={{fontWeight:"bold"}}>name:{this.state.bookName}</Text>
                     </Card>
                     <Card>
                         <Text style={{fontWeight:"bold"}}> reason:{this.state.reasonToRequest}</Text>
                     </Card>
                 </Card>
                </View>
                <View>
                  <Card title={"reciver information"} titleStyle={{fontSize:20}}>
                      <Card>
                         <Text style={{fontWeight:"bold"}}>name:{this.state.reciverName}</Text>
                     </Card>
                     <Card>
                         <Text style={{fontWeight:"bold"}}> contact:{this.state.contact}</Text>
                     </Card>
                     <Card>
                         <Text style={{fontWeight:"bold"}}> address:{this.state.address}</Text>
                     </Card>
                   </Card> 
                </View>                
                  <View>

                    {
                        this.state.reciverId!==this.state.userId
                        ?(
                            <TouchableOpacity style={styles.button} onPress={()=>{
                                this.updateBookStatus()
                                this.addNotification()
                                this.props.navigation.navigate("MyDonations")
                            }}>
                                <Text>I want to Donate</Text>
                            </TouchableOpacity>
                        ):null
                    }
                </View>
            </View>
        );
    }
}