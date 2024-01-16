import { StatusBar } from "expo-status-bar";
import { MyStyles } from "../styles/MyStyles.js";
import React, { useState, useEffect } from "react";
import { View, Text, Alert } from "react-native";
import { getFirestore, collection, getDocs, doc, setDoc } from "firebase/firestore";
import { FIREBASE_APP } from "../config/FirebaseConfig.js";
const db = getFirestore(FIREBASE_APP);
import Return from "../components/Return.js";
import getUserDetails from "../components/GetUserDetails.js";

export default function Appointment() {
  const [appointments, setAppointments] = useState([]);
  const email = getUserDetails().userEmail;

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "saunavuorot"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        date: doc.data().date,
        place: doc.data().place,
        time: doc.data().time,
        bookerEmail: doc.data().bookerEmail,
        isFree: doc.data().isFree,
      }));

      data.sort((a, b) => {
        const dateA = a.date.split(".").reverse().join("-");
        const dateB = b.date.split(".").reverse().join("-");
        return new Date(dateA) - new Date(dateB);
      });
      setAppointments(data);
    } catch (error) {
      console.error("Virhe haettaessa dataa:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const varaaAika = async (id) => {
    try {
      const appointmentDoc = doc(db, "saunavuorot", id);

      await setDoc(
        appointmentDoc,
        {
          isFree: false,
          bookerEmail: email,
        },
        { merge: true }
      );

      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === id
            ? { ...appointment, isFree: false, bookerEmail: email }
            : appointment
        )
      );

      Alert.alert("Aika varattu onnistuneesti");
    } catch (error) {
      console.error("Virhe aikaa varattaessa:", error);
      Alert.alert("Ajan varaaminen epäonnistui");
    }
  };

  return (
    <View style={MyStyles.mainContainer}>
      <Return />
      <StatusBar style="dark" />
      <View style={MyStyles.container2}>
        <Text style={MyStyles.header}>Vapaat ajat</Text>

        <View style={MyStyles.headerRow}>
          <Text style={{ ...MyStyles.headerText, width: "30%", marginLeft: 15 }}>Päivämäärä</Text>
          <Text style={{ ...MyStyles.headerText, width: "20%" }}>Aika</Text>
          <Text style={{ ...MyStyles.headerText, width: "20%" }}>Tila</Text>
          <Text style={{ ...MyStyles.headerText, width: "20%" }} />
        </View>

        {appointments.map((appointment, index) =>
          appointment.isFree === true ? (
            <View key={appointment.id} style={MyStyles.row}>
              <Text style={{ ...MyStyles.textRow, width: "30%", marginLeft: 15 }}>
                {appointment.date}
              </Text>
              <Text style={{ ...MyStyles.textRow, width: "20%" }}>{appointment.time}</Text>
              <Text style={{ ...MyStyles.textRow, width: "20%" }}>{appointment.place}</Text>
              <Text
                style={{ ...MyStyles.textRow, width: "20%", color: "green" }}
                onPress={() => varaaAika(appointment.id)}
              >
                Varaa
              </Text>
            </View>
          ) : null
        )}
      </View>
    </View>
  );
}
