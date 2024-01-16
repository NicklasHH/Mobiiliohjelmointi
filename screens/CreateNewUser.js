import { StatusBar } from "expo-status-bar";
import { MyStyles } from "../styles/MyStyles.js";
import React, { useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Icon, Input, Button } from "@rneui/themed";
import DropDownPicker from "react-native-dropdown-picker";
import "firebase/auth";
import { FIREBASE_AUTH } from "../config/FirebaseConfig.js";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import Return from "../components/Return";

export default function SignUp() {
  const [email, setEmail] = useState("testi@moi.moi");
  const [password, setPassword] = useState("moimoi");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const auth = FIREBASE_AUTH;
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [items, setItems] = useState([
    { label: "user", value: "1" },
    { label: "admin", value: "2" },
  ]);

  const signUp = async () => {
    const selectedRole = value ? items.find((item) => item.value === value)?.label : "user";

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const role = selectedRole;

      await updateProfile(user, { displayName: role });
      console.log(user);
    } catch (error) {
      console.log(error);
      if (error.code === "auth/email-already-in-use") {
        setErrorMessage("Sähköposti on jo käytössä.");
      }
    } finally {
      setLoading(false);
    }
  };

  function toggleShowPassword() {
    setShowPassword(!showPassword);
  }

  return (
    <View style={MyStyles.mainContainer}>
      <StatusBar style="dark" />
      <View style={MyStyles.container2}>
        <Text style={MyStyles.header}>Luo tunnus</Text>

        <Input
          style={MyStyles.roundedInput}
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholder="Sähköposti"
          autoCapitalize="none"
          containerStyle={{ width: 300 }}
          inputContainerStyle={{ borderBottomWidth: 0 }}
          inputStyle={{ color: "#38220f" }}
        />

        <Input
          style={MyStyles.roundedInput}
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholder="Salasana"
          autoCapitalize="none"
          containerStyle={{ width: 340, marginLeft: 40, marginTop: -20 }}
          inputContainerStyle={{ borderBottomWidth: 0 }}
          inputStyle={{ color: "#38220f" }}
          rightIcon={
            <Icon
              color="#38220f"
              iconStyle={{ marginLeft: 10 }}
              type="feather"
              name={showPassword ? "eye" : "eye-off"}
              onPress={toggleShowPassword}
            />
          }
          secureTextEntry={!showPassword}
        />

        <DropDownPicker
          placeholder="Valitse rooli"
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          style={MyStyles.roundedButtonStyle}
          containerStyle={{ width: 200, marginBottom: 30, marginTop: -20 }}
          textStyle={{
            fontFamily: "Montserrat",
            color: "#38220f",
            textAlign: "center",
            fontSize: 16,
          }}
          dropDownContainerStyle={{
            backgroundColor: "#dbc1ac",
            color: "#38220f",
            fontFamily: "Montserrat",
            borderColor: "#38220f",
            borderRadius: 50,
          }}
          arrowIconStyle={{
            tintColor: "#38220f",
          }}
          tickIconStyle={{
            tintColor: "#38220f",
          }}
        />

        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <Button
            title="Luo tunnus"
            onPress={() => signUp()}
            buttonStyle={MyStyles.roundedButtonStyle}
            titleStyle={{ color: "#38220f", fontFamily: "Montserrat" }}
          />
        )}
      </View>
      {errorMessage && <Text style={MyStyles.errorText}>{errorMessage}</Text>}

      <Return />
    </View>
  );
}
