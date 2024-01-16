import { StatusBar } from "expo-status-bar";
import { MyStyles } from "../styles/MyStyles.js";
import React, { useState, useEffect } from "react";
import { View, Text, Alert, ScrollView } from "react-native";
import { TouchableOpacity } from "react-native";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { FIREBASE_APP } from "../config/FirebaseConfig";
const db = getFirestore(FIREBASE_APP);
import Return from "../components/Return";

export default function DeleteAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

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

  const deleteAppointment = async (id) => {
    try {
      const isFree = appointments.find((appointment) => appointment.id === id).isFree;

      if (isFree) {
        await deleteDoc(doc(db, "saunavuorot", id));
        const updatedAppointments = appointments.filter((appointment) => appointment.id !== id);
        setAppointments(updatedAppointments);
        console.log("Aika poistettu ID:llä: ", id);
      } else {
        const result = await new Promise((resolve) => {
          Alert.alert(
            "Aika on varattu",
            "Haluatko varmasti poistaa tämän ajan?",
            [
              {
                text: "Peruuta",
                onPress: () => resolve(false),
                style: "cancel",
              },
              {
                text: "OK",
                onPress: () => resolve(true),
              },
            ],
            { cancelable: false }
          );
        });

        if (result) {
          await deleteDoc(doc(db, "saunavuorot", id));

          const updatedAppointments = appointments.filter((appointment) => appointment.id !== id);
          setAppointments(updatedAppointments);

          console.log("Aika poistettu ID:llä: ", id);
        } else {
          console.log("Ajan poistaminen peruutettu");
          console.log(id);
        }
      }
    } catch (error) {
      console.error("Virhe aikaa poistettaessa:", error);
      Alert.alert("Ajan poistaminen epäonnistui");
    }
  };

  return (
    <View style={MyStyles.mainContainer}>
      <StatusBar style="dark" />
      <Return />
      <View style={MyStyles.container2}>
        <Text style={MyStyles.header}>Ajat</Text>

        <View style={MyStyles.headerRow}>
          <Text style={{ ...MyStyles.headerText, width: "30%", marginLeft: 15 }}>Päivämäärä</Text>
          <Text style={{ ...MyStyles.headerText, width: "20%" }}>Aika</Text>
          <Text style={{ ...MyStyles.headerText, width: "20%" }}>Tila</Text>
          <Text style={{ ...MyStyles.headerText, width: "20%" }} />
        </View>
        <ScrollView style={{ height: "85%" }}>
          {appointments.map((appointment, index) => (
            <TouchableOpacity
              key={appointment.id}
              style={[
                MyStyles.row,
                selectedRowIndex === index ? { backgroundColor: "#dbc1ac" } : {},
                { borderBottomWidth: 1, borderBottomColor: "#38220f" },
              ]}
              onPress={() => {
                if (appointment.isFree == false) {
                  setSelectedInfo(`Varattu: ${appointment.bookerEmail}`);
                } else {
                  setSelectedInfo(null);
                }
                setSelectedRowIndex(index);
              }}
            >
              <Text style={{ ...MyStyles.textRow, width: "30%", marginLeft: 15 }}>
                {appointment.date}
              </Text>
              <Text style={{ ...MyStyles.textRow, width: "20%" }}>{appointment.time}</Text>
              <Text style={{ ...MyStyles.textRow, width: "20%" }}>{appointment.place}</Text>
              <Text
                style={{ ...MyStyles.textRow, width: "20%", color: "red" }}
                onPress={() => deleteAppointment(appointment.id)}
              >
                Poista
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {selectedInfo && (
        <View style={MyStyles.infoBox}>
          <Text style={MyStyles.infoText}>{selectedInfo}</Text>
        </View>
      )}
    </View>
  );
}
