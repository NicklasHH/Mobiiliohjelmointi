import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import Index from "./screens/Index";
import Login from "./screens/Login";
import Reservations from "./screens/Reservations";
import Appointment from "./screens/Appointment";
import CreateError from "./screens/CreateError";
import CreateAppointments from "./screens/CreateAppointments";
import ErrorNotifications from "./screens/ErrorNotifications";
import DeleteAppointments from "./screens/DeleteAppointments";
import CreateNewUser from "./screens/CreateNewUser";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "./config/FirebaseConfig";

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();

function InsideLayout() {
  return (
    <InsideStack.Navigator screenOptions={{ headerShown: false }}>
      <InsideStack.Screen name="Index" component={Index} />
      <InsideStack.Screen name="Reservations" component={Reservations} />
      <InsideStack.Screen name="Appointment" component={Appointment} />
      <InsideStack.Screen name="CreateError" component={CreateError} />
      <InsideStack.Screen name="CreateAppointments" component={CreateAppointments} />
      <InsideStack.Screen name="ErrorNotifications" component={ErrorNotifications} />
      <InsideStack.Screen name="DeleteAppointments" component={DeleteAppointments} />
    </InsideStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    });
  }, []);
  const [fontsLoaded] = useFonts({
    Montserrat: require("./assets/fonts/Montserrat-Regular.ttf"),
    MontserratBold: require("./assets/fonts/Montserrat-SemiBold.ttf"),
  });

  if (!fontsLoaded) {
    return undefined;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="LoggedIn" component={InsideLayout} />
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="CreateNewUser" component={CreateNewUser} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
