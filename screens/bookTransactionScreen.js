import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Alert,
  ToastAndroid,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";
import db from "../config";
import * as firebase from "firebase";

export default class TransactionScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      hasCameraPermissions: null,
      scanned: false,
      scannedBookID: "",
      scannedStudentID: "",
      buttonState: "normal",
    };
  }
  getCameraPermission = async (Id) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermissions: status === "granted",
      buttonState: Id,
      scanned: false,
    });
  };
  handleBarCodeScanned = async ({ type, data }) => {
    const { buttonState } = this.state;
    if (buttonState === "BookID") {
      this.setState({
        scanned: true,
        scannedBookID: data,
        buttonState: "normal",
      });
    } else if (buttonState === "StudentID") {
      this.setState({
        scanned: true,
        scannedStudentID: data,
        buttonState: "normal",
      });
    }
  };

  handleTransaction = async () => {
    db.collection("books")
      .doc(this.state.scannedBookID)
      .get()
      .then((doc) => {
        var book = doc.data();
        if (book.bookAvailability) {
          this.initiateBookIssue();
        } else {
          this.initiateBookReturn();
        }
      });
  };

  initiateBookIssue = async () => {
    db.collection("transactions").add({
      studentId: this.state.scannedStudentID,
      bookId: this.state.scannedBookID,
      date: firebase.firestore.Timestamp.now().toDate(),
      transactionType: "Issue",
    });
    db.collection("books").doc(this.state.scannedBookID).update({
      bookAvailability: false,
    });
    db.collection("students")
      .doc(this.state.scannedStudentID)
      .update({
        numberOfBooksIssued: firebase.firestore.FieldValue.increment(1),
      });

    //Alert.alert("Book issued sucessfully.");
    ToastAndroid.show("Book issued sucessfully.", ToastAndroid.LONG);
    this.setState({
      scannedBookID: "",
      scannedStudentID: "",
    });
  };

  initiateBookReturn = async () => {
    db.collection("transactions").add({
      studentId: this.state.scannedStudentID,
      bookId: this.state.scannedBookID,
      date: firebase.firestore.Timestamp.now().toDate(),
      transactionType: "Return",
    });
    db.collection("books").doc(this.state.scannedBookID).update({
      bookAvailability: true,
    });
    db.collection("students")
      .doc(this.state.scannedStudentID)
      .update({
        numberOfBooksIssued: firebase.firestore.FieldValue.increment(-1),
      });

    // Alert.alert("Book returned sucessfully.");
    ToastAndroid.show("Book returned sucessfully.", ToastAndroid.LONG);
    this.setState({
      scannedBookID: "",
      scannedStudentID: "",
    });
  };

  render() {
    const hasCameraPermissions = this.state.hasCameraPermissions;
    const scanned = this.state.scannedData;
    const buttonState = this.state.buttonState;
    if (buttonState !== "normal" && hasCameraPermissions) {
      return (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      );
    } else if (buttonState === "normal") {
      return (
        <View style={styles.container}>
          <View>
            <Image
              source={require("../assets/booklogo.jpg")}
              style={{ width: 200, height: 200 }}
            />
            <Text style={{ textAlign: "center", fontSize: 30 }}>Wily</Text>
          </View>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              style={styles.container}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              enabled
            >
              <View style={styles.inputView}>
                <TextInput
                  style={styles.inputBox}
                  placeholder="Book ID"
                  value={this.state.scannedBookID}
                  onChangeText={(text) => {
                    this.setState({ scannedBookID: text });
                  }}
                />
                <TouchableOpacity
                  style={styles.scanButton}
                  onPress={() => {
                    this.getCameraPermission("BookID");
                  }}
                >
                  <Text style={styles.buttonText}>Scan</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputView}>
                <TextInput
                  style={styles.inputBox}
                  placeholder="Student ID"
                  value={this.state.scannedStudentID}
                  onChangeText={(text) => {
                    this.setState({
                      scannedStudentID: text,
                    });
                  }}
                />
                <TouchableOpacity
                  style={styles.scanButton}
                  onPress={() => {
                    this.getCameraPermission("StudentID");
                  }}
                >
                  <Text style={styles.buttonText}>Scan</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
                  this.handleTransaction();
                }}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  displayText: {
    fontSize: 15,
    textDecorationLine: "underline",
  },
  scanButton: {
    backgroundColor: "green",
    width: 50,
    borderWidth: 1.5,
    borderLeftWidth: 0,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 15,
    marginTop: 10,
  },
  inputView: {
    flexDirection: "row",
    margin: 20,
  },
  inputBox: {
    width: 200,
    height: 40,
    borderWidth: 1.5,
    borderRightWidth: 0,
    fontSize: 20,
  },
  submitButton: {
    backgroundColor: "red",
    width: 100,
    height: 50,
  },

  submitButtonText: {
    padding: 10,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});
