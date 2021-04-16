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
import MyHeader from '../components/MyHeader';


export default class SettingScreen extends React.Component{
    constructor(){
        super();
        this.state={
            firstName:'',
            lastName:'',
            contact:'',
            address:'',
            emailId:'',
            docId:''
        }
    }
    getUserDetails=()=>{
        var user=firebase.auth().currentUser;
        var email=user.email;
        db.collection("users").where("email_Id","==",email).get()
        .then(snapshot=>{
            snapshot.forEach(doc => {
                var data=doc.data();
                this.setState({emailId:data.email_Id, 
                firstName:data.first_name,
                lastName:data.last_name,
                address:data.address,
                contact:data.contact,
                docId:doc.id  })
            });
        })
    }
    updateUserDetails=()=>{
        db.collection("users").doc(this.state.docId).update({
            "first_name":this.state.firstName,
            "last_name":this.state.lastName,
            "address":this.state.address,
            "contact":this.state.contact
        })
        alert("Profile Update Successfully")
        console.log("Profile Update Successfully")
    }
    componentDidMount(){
        this.getUserDetails();
    }
    render(){
        return(
            <View style={styles.container}>
                <MyHeader title="Settings" navigation={this.props.navigation}/>
                <View style={styles.formContainer}>
                    <TextInput style={styles.formTextInput}
                    placeholder={"First Name"}
                    maxLength={8}
                    onChangeText={(text)=>{
                       this.setState({firstName:text})
                    }}
                    value={this.state.firstName}/>
                     <TextInput style={styles.formTextInput}
                    placeholder={"Last Name"}
                    maxLength={8}
                    onChangeText={(text)=>{
                       this.setState({lastName:text})
                    }}
                    value={this.state.lastName}/>
                    <TextInput style={styles.formTextInput}
                    placeholder={"Contact no."}
                    maxLength={10}
                    onChangeText={(text)=>{
                       this.setState({contact:text})
                    }}
                    value={this.state.contact}
                    keyboardType={"numeric"}/>
                    <TextInput style={styles.formTextInput}
                    placeholder={"Address"}
                    multiline={true}
                    onChangeText={(text)=>{
                       this.setState({address:text})
                    }}
                    value={this.state.address}/>
                    <TouchableOpacity style={styles.button} onPress={()=>{this.updateUserDetails()}}>
                        <Text style={styles.buttonText}>SAVE</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
const styles=StyleSheet.create({
    container:{
     flex:1,
     justifyContent:"center",
     alignItems:"center"
    },
    formContainer:{
        flex:1,
        width:"100%",
        alignItems:"center"
    },
    formTextInput:{
        width:"75%",
        height:35,
        alignSelf:"center",
        borderRadius:10,
        borderWidth:1,
        marginTop:20,
        padding:10
    },
    button:{
        justifyContent:"center",
        alignItems:"center",
        width:"75%",
        height:50,
        borderRadius:10,
        borderWidth:1,
        backgroundColor:"green"
    },
    buttonText:{
        fontSize:25,
        fontWeight:"bold"
    }
})