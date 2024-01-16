import { MyStyles } from "../styles/MyStyles.js";
import React from "react";
import { Button } from "@rneui/themed";
import { View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const uploadToFirebase = async (uri, name, onProgress) => {
  try {
    const fetchResponse = await fetch(uri);
    const theBlob = await fetchResponse.blob();
    const imageRef = ref(getStorage(), `images/${name}`);
    const uploadTask = uploadBytesResumable(imageRef, theBlob);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress && onProgress(progress);
        },
        (error) => {
          console.log(error);
          reject(error);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            downloadUrl,
            metadata: uploadTask.snapshot.metadata,
          });
        }
      );
    });
  } catch (error) {
    throw new Error("Error uploading image: " + error.message);
  }
};

const TakePicture = ({ onDownloadUrlChange }) => {
  const [permission, requestPermission] = ImagePicker.useCameraPermissions();

  const takePhoto = async () => {
    try {
      const cameraResponse = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
      });

      if (!cameraResponse.canceled) {
        const { uri } = cameraResponse.assets[0];
        const fileName = uri.split("/").pop();
        const uploadResponse = await uploadToFirebase(uri, fileName);

        onDownloadUrlChange(uploadResponse.downloadUrl);
      }
    } catch (error) {
      Alert.alert("Error Uploading Image: " + error.message);
    }
  };

  if (permission?.status !== ImagePicker.PermissionStatus.GRANTED) {
    return (
      <View>
        <Button
          title="Anna kameralle lupa"
          buttonStyle={MyStyles.buttonStyleCamera}
          titleStyle={{ color: "red", fontFamily: "Montserrat" }}
          containerStyle={{
            marginHorizontal: 50,
            marginVertical: 10,
          }}
          onPress={requestPermission}
        />
      </View>
    );
  }

  return (
    <Button
      title="Ota kuva"
      buttonStyle={MyStyles.buttonStyle}
      titleStyle={{ color: "#38220f", fontFamily: "Montserrat" }}
      containerStyle={{
        marginHorizontal: 50,
        marginVertical: 10,
      }}
      onPress={() => takePhoto()}
    />
  );
};
export default TakePicture;
