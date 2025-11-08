import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import FeedScreen from "../private/FeedScreen";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PostScreen from "../private/PostScreen";

const Tabs = createBottomTabNavigator();
const Stacks = createNativeStackNavigator();

export default function PrivateRoutes() {
    return (
        <GestureHandlerRootView>
            <RootTabs />
        </GestureHandlerRootView>
    )
}

function RootTabs() {
    return (
        <Tabs.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => {
                let iconName;

                if (route.name === 'Home') {
                    iconName = 'home';
                }

                return {
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name={iconName} size={32} color={color} />
                    ),
                    tabBarActiveTintColor: '#fdfdfd',
                    tabBarInactiveTintColor: 'gray',
                    tabBarStyle: {
                        height: 60,
                        paddingBottom: 5,
                        paddingTop: 5,
                        backgroundColor: '#9C2222',
                    },
                    title: '',
                };
            }}
        >
            <Tabs.Screen
                name="Home"
                component={FeedStack}
                options={{
                    headerShown: false,
                }}
            />
        </Tabs.Navigator>
    )
}

function FeedStack() {
    return(
        <Stacks.Navigator
            initialRouteName="Feed">
            <Stacks.Screen
                name="Feed"
                component={FeedScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stacks.Screen
                name="PostDetails"
                component={PostScreen}
                options={{
                    headerShown: true,
                    title: null,
                    headerBackTitleVisible: false,
                    headerTintColor: '#9C2222',
                    headerTransparent: true,
                }}
            />
        </Stacks.Navigator>
    )
}