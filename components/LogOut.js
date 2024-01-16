import React from "react";
import { MyStyles } from "../styles/MyStyles.js";
import { View } from "react-native";
import { Button } from "@rneui/themed";
import { FIREBASE_AUTH } from "../config/FirebaseConfig";
import { SimpleLineIcons } from "@expo/vector-icons";

export default function LogOut() {
  return (
    <View style={MyStyles.buttonContainerLogout}>
      <Button
        title={<SimpleLineIcons name="logout" size={24} color="red" />}
        type="clear"
        onPress={() => {
          FIREBASE_AUTH.signOut();
        }}
      />
    </View>
  );
}
