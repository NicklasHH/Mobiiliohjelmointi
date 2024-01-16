import { StatusBar } from "expo-status-bar";
import { MyStyles } from "../styles/MyStyles.js";
import React, { useState } from "react";
import { View, Text, Alert, Keyboard } from "react-native";
import { Input, Button } from "@rneui/themed";
import DropDownPicker from "react-native-dropdown-picker";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { FIREBASE_APP } from "../config/FirebaseConfig.js";
import Return from "../components/Return.js";

const db = getFirestore(FIREBASE_APP);
const addLeadingZero = (number) => {
  return number < 10 ? `0${number}` : `${number}`;
};

export default function MoreAppointments() {
  const [date, setDate] = useState("20.1.2024");
  const [time, setTime] = useState("20.20");
  const [isValid, setIsValid] = useState(true);
  const [added, setAdded] = useState("");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [place, setPlace] = useState([
    { label: "Tila 1", value: "Tila 1" },
    { label: "Tila 2", value: "Tila 2" },
    { label: "Tila 3", value: "Tila 3" },
  ]);

  const validateInput = async () => {
    const dateRegex = /^([1-9]|0[1-9]|1[0-9]|2[0-9]|3[01])\.([1-9]|0[1-9]|1[0-2])\.\d{4}$/;

    const timeRegex = /^(0[0-9]|1[0-9]|2[0-3])\.[0-5][0-9]$/;

    if (dateRegex.test(date) && timeRegex.test(time) && value !== null) {
      setIsValid(true);

      const formattedDate = date
        .split(".")
        .map((part) => addLeadingZero(parseInt(part)))
        .join(".");

      const formattedTime = time
        .split(".")
        .map((part) => addLeadingZero(parseInt(part)))
        .join(".");

      const data = {
        date: formattedDate,
        time: formattedTime,
        place: value,
        isFree: true,
        bookerEmail: "",
      };

      try {
        const docRef = await addDoc(collection(db, "saunavuorot"), data);
        console.log("Aikavuoro lisätty ID:llä: ", docRef.id);
        setAdded("Lisätty uusi aika");
        setTimeout(() => {
          setAdded("");
        }, 5000);
        setDate("");
        setTime("");
        setValue(null);
        Keyboard.dismiss();
      } catch (error) {
        console.error("Virhe tiedon lisäämisessä Firestoreen: ", error);
      }
    } else {
      setIsValid(false);
      Alert.alert("Tarkista syötteet ja valitse tila.");
    }
  };

  return (
    <View style={MyStyles.mainContainer}>
      <StatusBar style="dark" />
      <Return />
      <View style={MyStyles.container2}>
        <Text style={MyStyles.header}>Lisää vapaita aikoja</Text>

        <Text style={MyStyles.headerText}>Päivämäärä:</Text>
        <Input
          value={date}
          onChangeText={(text) => setDate(text)}
          style={MyStyles.input}
          placeholder="Päivämäärä"
          containerStyle={{ width: 300, height: 50 }}
          inputContainerStyle={{ borderBottomWidth: 0 }}
          inputStyle={{ color: "#38220f" }}
          keyboardType="numeric"
        />

        <Text style={MyStyles.headerText}>Aika:</Text>
        <Input
          value={time}
          onChangeText={(text) => setTime(text)}
          style={MyStyles.input}
          placeholder="Aika"
          containerStyle={{ width: 300, height: 50 }}
          inputContainerStyle={{ borderBottomWidth: 0 }}
          inputStyle={{ color: "#38220f" }}
          keyboardType="numeric"
        />

        <Text style={MyStyles.headerText}>Tila:</Text>
        <DropDownPicker
          placeholder="Valitse tila"
          open={open}
          value={value}
          items={place}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setPlace}
          style={MyStyles.picker}
          containerStyle={{ width: 280, marginBottom: 10 }}
          textStyle={{
            fontFamily: "Montserrat",
            color: "#38220f",
            fontSize: 16,
          }}
          dropDownContainerStyle={{
            backgroundColor: "#dbc1ac",
            color: "#38220f",
            fontFamily: "Montserrat",
            borderColor: "#38220f",
            arrowColor: "#38220f",
          }}
          arrowIconStyle={{
            tintColor: "#38220f",
          }}
          tickIconStyle={{
            tintColor: "#38220f",
          }}
        />

        <Button
          title="Lisää aika"
          buttonStyle={MyStyles.buttonStyle}
          titleStyle={{ color: "#38220f", fontFamily: "Montserrat" }}
          containerStyle={{
            marginHorizontal: 50,
            marginVertical: 10,
          }}
          onPress={validateInput}
        />
      </View>
      <View style={MyStyles.container2}>
        <Text style={MyStyles.headerText}> {added} </Text>
      </View>
    </View>
  );
}
