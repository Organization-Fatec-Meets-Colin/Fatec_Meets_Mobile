import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../public/LoginScreen";
import SignInScreen from "../public/SignInScreen";
import HomeScreen from "../public/HomeScreen";

const Stack = createNativeStackNavigator();

export default function PublicRoutes() {

    return (
        <Stack.Navigator
            initialRouteName='Home'
            screenOptions={{
                title: 'meets',
                headerStyle: { backgroundColor: '#9C2222' },
                headerTintColor: '#FFF',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 40,
                },
                headerTitleAlign: 'center',
            }}>

            <Stack.Screen
                name="Login"
                component={LoginScreen}
            />
            <Stack.Screen
                name="SignIn"
                component={SignInScreen}
            />
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    headerShown: false,
                }}
            />

        </Stack.Navigator>
    )
}
