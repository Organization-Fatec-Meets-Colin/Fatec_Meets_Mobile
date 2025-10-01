import { SafeAreaViewBase, StyleSheet, Text, TextInput, Touchable, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen({navigation}) {

  return(
    <View style={styles.mainContainer}>
        <StatusBar style="light" />

        <View style={styles.formContainer}>
            <Text style={styles.loginTitle}>
                Acesse seu Login
            </Text>

            <View style={styles.inputContainer}>
                <Text>
                    E-mail:
                </Text>
                <TextInput
                    placeholder='exemplo@escola.com'
                    style={styles.input}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text>
                    Senha:
                </Text>
                <TextInput
                    placeholder='Password'
                    secureTextEntry={true}
                    style={styles.input}
                />
            </View>

        </View>
    </View>
  )
}

const styles=StyleSheet.create({
    mainConteiner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        padding: 0,
    },

    formContainer:{
        alignItems: 'center',
        justifyContent: 'center',
    },

    loginTitle:{
        fontSize: 25,
        fontWeight: 'bold',
        fontFamily: ,
    },

    inputContainer:{

    },

    input:{

    }
})