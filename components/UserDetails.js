import React from "react";
import { MyStyles } from "../styles/MyStyles.js";
import { View, Text } from "react-native";
import GetUserDetails from "../components/GetUserDetails";

export default function UserDetails() {
  const getDetails = GetUserDetails();
  const userRole = getDetails.userRole;
  const userEmail = getDetails.userEmail;
  return (
    <View style={MyStyles.userContainer}>
      <Text style={MyStyles.textSignedIn}>Rooli: {userRole}</Text>
      <Text style={MyStyles.textSignedIn}>Tunnus: {userEmail}</Text>
    </View>
  );
}
