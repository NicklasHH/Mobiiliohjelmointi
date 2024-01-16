import { StatusBar } from "expo-status-bar";
import { MyStyles } from "../styles/MyStyles.js";
import React, { useState } from "react";
import { View, Text, Alert, Keyboard } from "react-native";
import { Input, Button } from "@rneui/themed";
import DropDownPicker from "react-native-dropdown-picker";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { FIREBASE_APP } from "../config/FirebaseConfig.js";
import GetUserDetails from "../components/GetUserDetails.js";
import Return from "../components/Return.js";
import TakePicture from "../components/TakePicture.js";
const db = getFirestore(FIREBASE_APP);

export default function CreateError() {
  const email = GetUserDetails().userEmail;
  const [heading, setHeading] = useState("otsikko 1");
  const [info, setInfo] = useState("tähän infotekstiä");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [items, setItems] = useState([
    { label: "Tila 1", value: "1" },
    { label: "Tila 2", value: "2" },
    { label: "Tila 3", value: "3" },
  ]);

  const validateInput = async () => {
    if (!heading.trim() || !info.trim() || !value) {
      Alert.alert("Tarkista syötteet ja valitse tila.");
      return;
    }

    const selectedPlace = items.find((item) => item.value === value)?.label || "";

    const data = {
      heading: heading,
      info: info,
      place: selectedPlace,
      isChecked: "Korjaamatta",
      email: email,
      pictureUrl: downloadUrl,
    };
    try {
      const docRef = await addDoc(collection(db, "vikailmoitukset"), data);
      console.log("Vikailmoitus lisätty ID:llä: ", docRef.id);

      Alert.alert("Ilmoitus lähetetty");
      setHeading("");
      setInfo("");
      setValue(null);
      setDownloadUrl(null);
      Keyboard.dismiss();
    } catch (error) {
      console.error("Virhe tiedon lisäämisessä Firestoreen: ", error);
    }
  };

  return (
    <View style={MyStyles.mainContainer}>
      <StatusBar style="dark" />
      <Return />
      <View style={MyStyles.container2}>
        <Text style={MyStyles.header}>Tee vikailmoitus</Text>

        <Input
          style={MyStyles.input}
          value={heading}
          onChangeText={(text) => setHeading(text)}
          placeholder="Otsikko"
          containerStyle={{ width: 300, height: 50 }}
          inputContainerStyle={{ borderBottomWidth: 0 }}
          inputStyle={{ color: "#38220f" }}
        />

        <DropDownPicker
          placeholder="Valitse tila"
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
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

        <Input
          style={MyStyles.input}
          value={info}
          onChangeText={(text) => setInfo(text)}
          placeholder="Selite"
          containerStyle={{ width: 300 }}
          inputContainerStyle={{ borderBottomWidth: 0 }}
          inputStyle={{
            color: "#38220f",
            height: 100,
            textAlignVertical: "top",
          }}
          multiline={true}
        />

        <TakePicture onDownloadUrlChange={(newDownloadUrl) => setDownloadUrl(newDownloadUrl)} />

        <Button
          title="Lähetä"
          buttonStyle={MyStyles.buttonStyle}
          titleStyle={{ color: "#38220f", fontFamily: "Montserrat" }}
          containerStyle={{
            marginHorizontal: 50,
            marginVertical: 10,
          }}
          onPress={validateInput}
        />
      </View>
    </View>
  );
}
