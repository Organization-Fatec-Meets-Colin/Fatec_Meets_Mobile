import { StyleSheet, Text, TextInput, Touchable, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { useContext } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import { VarelaRound_400Regular } from '@expo-google-fonts/varela-round';
import PublicRoutes from './src/screens/routes/PublicRoutes';
import { AuthContext, AuthContextProvider } from './context/AuthContext';
import PrivateRoutes from './src/screens/routes/PrivateRoutes';
// import * as SplashScreen from 'expo-splash-screen';
// import { useEffect, useCallback } from 'react';


export default function App() {

  const [fontsLoaded] = useFonts({
    'Varela': VarelaRound_400Regular,
  });

  return (
    <AuthContextProvider>
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
    </AuthContextProvider>

  );
}

function Routes() {
  const { token } = useContext(AuthContext);

  return token ? <PrivateRoutes /> : <PublicRoutes />;
}


