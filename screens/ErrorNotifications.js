import { StatusBar } from "expo-status-bar";
import { MyStyles } from "../styles/MyStyles.js";
import React, { useState, useEffect, useMemo } from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { Button } from "@rneui/themed";
import { TouchableOpacity } from "react-native";
import { FIREBASE_APP } from "../config/FirebaseConfig";
import { getFirestore, collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import Return from "../components/Return";
import BottomSheet from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
const db = getFirestore(FIREBASE_APP);

export default function ErrorNotifications() {
  const [errorNotifications, setErrorNotifications] = useState([]);
  const [selectedErrorInfo, setSelectedErrorInfo] = useState(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const snapPoints = useMemo(() => ["6%", "40%", "90%"], []);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "vikailmoitukset"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        heading: doc.data().heading,
        info: doc.data().info,
        place: doc.data().place,
        email: doc.data().email,
        isChecked: doc.data().isChecked,
        pictureUrl: doc.data().pictureUrl,
      }));
      setErrorNotifications(data);
      if (data.length > 0) {
        setImageUrl(data[0].pictureUrl);
      }
    } catch (error) {
      console.error("Virhe haettaessa dataa:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const markAsFixed = async (id) => {
    try {
      const docRef = doc(db, "vikailmoitukset", id);
      await updateDoc(docRef, {
        isChecked: "Korjattu",
      });
      setErrorNotifications((prevState) =>
        prevState.map((notification) =>
          notification.id === id ? { ...notification, isChecked: "Korjattu" } : notification
        )
      );
    } catch (error) {
      console.error("Virhe merkitessä korjatuksi:", error);
    }
  };

  const deleteError = async (id) => {
    try {
      const docRef = doc(db, "vikailmoitukset", id);
      await deleteDoc(docRef);
      setErrorNotifications((prevState) =>
        prevState.filter((notification) => notification.id !== id)
      );
      setSelectedErrorInfo(null);
    } catch (error) {
      console.error("Virhe poistettaessa tietoa:", error);
    }
  };

  return (
    <View style={MyStyles.mainContainer}>
      <StatusBar style="dark" />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Return />

        <View style={MyStyles.container2}>
          <Text style={MyStyles.header}>Vikailmoitukset</Text>

          <View style={MyStyles.headerRow}>
            <Text style={{ ...MyStyles.headerText, width: "50%", marginLeft: 15 }}>Otsikko</Text>
            <Text style={{ ...MyStyles.headerText, width: "13%" }}>Tila</Text>
            <Text style={{ ...MyStyles.headerText, width: "30%" }}>Vikatilanne</Text>
          </View>
          <ScrollView style={{ height: "30%" }}>
            {errorNotifications.map((errorNotification, index) => (
              <TouchableOpacity
                key={errorNotification.id}
                style={[
                  MyStyles.row,
                  selectedRowIndex === index ? { backgroundColor: "#dbc1ac" } : {},
                  { borderBottomWidth: 1, borderBottomColor: "#38220f" },
                ]}
                onPress={() => {
                  const cleanedInfo = errorNotification.info.trim();
                  setSelectedErrorInfo(
                    `Ilmoittaja: ${errorNotification.email}\n\nInfo: ${cleanedInfo}`
                  );
                  setSelectedRowIndex(index);
                  setImageUrl(errorNotification.pictureUrl);
                }}
              >
                <Text style={{ ...MyStyles.textRow, width: "50%", marginLeft: 15 }}>
                  {errorNotification.heading}
                </Text>
                <Text style={{ ...MyStyles.textRow, width: "13%" }}>{errorNotification.place}</Text>
                <Text
                  style={{
                    ...MyStyles.textRow,
                    width: "30%",
                    color: errorNotification.isChecked === "Korjattu" ? "green" : "red",
                  }}
                >
                  {errorNotification.isChecked}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={{ ...MyStyles.container2, marginTop: 20 }}>
          <Button
            buttonStyle={MyStyles.buttonStyle}
            titleStyle={{ color: "#38220f", fontFamily: "Montserrat" }}
            onPress={() => {
              if (selectedErrorInfo) {
                if (selectedRowIndex !== null) {
                  const selectedErrorId = errorNotifications[selectedRowIndex].id;
                  markAsFixed(selectedErrorId);
                }
              }
            }}
          >
            Merkitse korjatuksi
          </Button>
          <Button
            buttonStyle={{ ...MyStyles.buttonStyle }}
            titleStyle={{ color: "#38220f", fontFamily: "Montserrat" }}
            containerStyle={{
              marginTop: 20,
            }}
            onPress={() => {
              if (selectedErrorInfo) {
                if (selectedRowIndex !== null) {
                  const selectedErrorId = errorNotifications[selectedRowIndex].id;
                  deleteError(selectedErrorId);
                }
              }
            }}
          >
            Poista
          </Button>
        </View>

        <BottomSheet
          key={imageUrl}
          snapPoints={snapPoints}
          handleIndicatorStyle={{ backgroundColor: "#38220f", height: 5, width: 100 }}
          backgroundStyle={{ backgroundColor: "#dbc1ac", borderWidth: 1, borderColor: "#634832" }}
        >
          <View style={MyStyles.bottomView}>
            <Text style={MyStyles.bottomSheetText}>{selectedErrorInfo}</Text>
          </View>

          <View style={MyStyles.bottomViewPicture}>
            <TouchableOpacity onPress={togglePopup}>
              <Image source={{ uri: imageUrl }} style={{ width: 150, height: 150 }} />
            </TouchableOpacity>
          </View>
        </BottomSheet>
      </GestureHandlerRootView>

      {isPopupVisible && (
        <View style={MyStyles.popup}>
          <TouchableOpacity onPress={togglePopup}>
            <Image source={{ uri: imageUrl }} style={{ width: 400, height: 400 }} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
