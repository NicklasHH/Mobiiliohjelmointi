import { StatusBar } from "expo-status-bar";
import { MyStyles } from "../styles/MyStyles.js";
import React, { useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Icon, Input, Button } from "@rneui/themed";
import "firebase/auth";
import { FIREBASE_AUTH } from "../config/FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("admin@moi.moi");
  const [password, setPassword] = useState("moimoi");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log(error);
      if (error.code === "auth/invalid-login-credentials") {
        setErrorMessage("Väärä sähköposti tai salasana.");
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
        <Text style={MyStyles.header}>Kirjaudu sisään</Text>

        <Input
          style={MyStyles.roundedInput}
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholder="Sähköposti"
          autoCapitalize="none"
          containerStyle={{ width: 300, marginVertical: 10 }}
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

        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <>
            <Button
              title="Kirjaudu"
              onPress={() => signIn()}
              buttonStyle={MyStyles.roundedButtonStyle}
              titleStyle={{ color: "#38220f", fontFamily: "Montserrat" }}
              containerStyle={{
                marginBottom: 20,
              }}
            />

            <Button
              type="clear"
              title="Jos sinulla ei ole tunnusta, voit luoda sen tästä."
              onPress={() => navigation.navigate("CreateNewUser")}
              titleStyle={{ color: "#38220f", fontFamily: "Montserrat", fontSize: 17 }}
              containerStyle={{
                width: 250,
              }}
            />
          </>
        )}
      </View>
      {errorMessage && <Text style={MyStyles.errorText}>{errorMessage}</Text>}
    </View>
  );
}
