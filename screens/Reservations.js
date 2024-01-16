import { StatusBar } from "expo-status-bar";
import { MyStyles } from "../styles/MyStyles.js";
import React, { useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";
import getUserDetails from "../components/GetUserDetails.js";
import { FIREBASE_APP } from "../config/FirebaseConfig.js";
import { getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore";
import Return from "../components/Return.js";

const db = getFirestore(FIREBASE_APP);

export default function Reservations() {
  const email = getUserDetails().userEmail;
  const [reservations, setReservations] = useState([]);

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "saunavuorot"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        date: doc.data().date,
        place: doc.data().place,
        time: doc.data().time,
        bookerEmail: doc.data().bookerEmail,
      }));

      data.sort((a, b) => {
        const dateA = a.date.split(".").reverse().join("-");
        const dateB = b.date.split(".").reverse().join("-");
        return new Date(dateA) - new Date(dateB);
      });
      setReservations(data);
    } catch (error) {
      console.error("Virhe haettaessa dataa:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const peruutaAika = async (id) => {
    try {
      const reservationRef = doc(db, "saunavuorot", id);
      await updateDoc(reservationRef, {
        bookerEmail: "",
        isFree: true,
      });
      Alert.alert("Varaus on peruutettu");
      fetchData();
    } catch (error) {
      console.error("Virhe peruuttaessa varausta:", error);
    }
  };

  return (
    <View style={MyStyles.mainContainer}>
      <StatusBar style="dark" />
      <Return />
      <View style={MyStyles.container2}>
        <Text style={MyStyles.header}>Omat ajanvaraukset</Text>

        <View style={MyStyles.headerRow}>
          <Text style={{ ...MyStyles.headerText, width: "30%", marginLeft: 15 }}>Päivämäärä</Text>
          <Text style={{ ...MyStyles.headerText, width: "20%" }}>Aika</Text>
          <Text style={{ ...MyStyles.headerText, width: "20%" }}>Tila</Text>
          <Text style={{ ...MyStyles.headerText, width: "20%" }} />
        </View>

        {reservations.map((reservation, index) =>
          reservation.bookerEmail === email ? (
            <View key={reservation.id} style={MyStyles.row}>
              <Text style={{ ...MyStyles.textRow, width: "30%", marginLeft: 15 }}>
                {reservation.date}
              </Text>
              <Text style={{ ...MyStyles.textRow, width: "20%" }}>{reservation.time}</Text>
              <Text style={{ ...MyStyles.textRow, width: "20%" }}>{reservation.place}</Text>

              <Text
                style={{ ...MyStyles.textRow, width: "20%", color: "red" }}
                onPress={() => peruutaAika(reservation.id)}
              >
                Peruuta
              </Text>
            </View>
          ) : null
        )}
      </View>
    </View>
  );
}
