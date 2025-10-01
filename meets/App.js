import { StyleSheet, Text, TextInput, Touchable, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/public/LoginScreen';

export default function App(){

return(

  <NavigationContainer>
    <RootStack/>
  </NavigationContainer>

);}

const Stack = createNativeStackNavigator();
function RootStack() {
  return(
    <Stack.Navigator 
    initialRouteName='Login'
    screenOptions={{
      title: 'meets',
      headerStyle: {backgroundColor: '#9C2222'},
      headerTintColor: '#FFF',
      headerTitleStyle: { 
        fontWeight: 'bold',
        fontSize: 40,
       },
      headerTitleAlign: 'center',
    }}>
      <Stack.Screen name="Login" component={LoginScreen} 
      options={{
        
      }}/>
    </Stack.Navigator>
  )
}
