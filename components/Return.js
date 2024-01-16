import React from "react";
import { MyStyles } from "../styles/MyStyles.js";
import { View } from "react-native";
import { Button, Text } from "@rneui/themed";
import { SimpleLineIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Return() {
  const navigation = useNavigation();
  return (
    <View style={MyStyles.buttonContainerReturn}>
      <Button type="clear" onPress={() => navigation.goBack()}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <SimpleLineIcons name="arrow-left-circle" size={24} color="#38220f" />
          <Text
            style={{ marginLeft: 10, color: "#38220f", fontSize: 20, fontFamily: "Montserrat" }}
          >
            Etusivu
          </Text>
        </View>
      </Button>
    </View>
  );
}
