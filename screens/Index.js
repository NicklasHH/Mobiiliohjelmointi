import { StatusBar } from "expo-status-bar";
import { MyStyles } from "../styles/MyStyles.js";
import React from "react";
import { View, Text } from "react-native";
import { Button } from "@rneui/themed";
import UserDetails from "../components/UserDetails";
import LogOut from "../components/LogOut";
import getUserDetails from "../components/GetUserDetails";

export default function Index({ navigation }) {
  const userRole = getUserDetails().userRole;
  return (
    <View style={MyStyles.mainContainer}>
      <StatusBar style="dark" />
      <View style={MyStyles.container2}>
        <Text style={MyStyles.header}>Etusivu</Text>
        <Button
          title="Ajanvaraukset"
          buttonStyle={MyStyles.buttonStyle}
          titleStyle={{ color: "#38220f", fontFamily: "Montserrat" }}
          containerStyle={{
            marginVertical: 10,
          }}
          onPress={() => {
            navigation.navigate("Reservations");
          }}
        />
        <Button
          title="Varaa aika"
          buttonStyle={MyStyles.buttonStyle}
          titleStyle={{ color: "#38220f", fontFamily: "Montserrat" }}
          containerStyle={{
            marginVertical: 10,
          }}
          onPress={() => {
            navigation.navigate("Appointment");
          }}
        />

        <Button
          title="Tee vikailmoitus"
          buttonStyle={MyStyles.buttonStyle}
          titleStyle={{ color: "#38220f", fontFamily: "Montserrat" }}
          containerStyle={{
            marginVertical: 10,
          }}
          onPress={() => {
            navigation.navigate("CreateError");
          }}
        />

        {userRole === "admin" && (
          <>
            <Button
              title="Lisää vapaita aikoja"
              buttonStyle={MyStyles.buttonStyle}
              titleStyle={{ color: "#38220f", fontFamily: "Montserrat" }}
              containerStyle={{
                marginVertical: 10,
              }}
              onPress={() => {
                navigation.navigate("CreateAppointments");
              }}
            />

            <Button
              title="Vikailmoitukset"
              buttonStyle={MyStyles.buttonStyle}
              titleStyle={{ color: "#38220f", fontFamily: "Montserrat" }}
              containerStyle={{
                marginVertical: 10,
              }}
              onPress={() => {
                navigation.navigate("ErrorNotifications");
              }}
            />

            <Button
              title="Poista saunavuoroja"
              buttonStyle={MyStyles.buttonStyle}
              titleStyle={{ color: "#38220f", fontFamily: "Montserrat" }}
              containerStyle={{
                marginVertical: 10,
              }}
              onPress={() => {
                navigation.navigate("DeleteAppointments");
              }}
            />
          </>
        )}
      </View>
      <LogOut />
      <UserDetails />
    </View>
  );
}
