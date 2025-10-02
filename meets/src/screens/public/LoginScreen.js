import { SafeAreaViewBase, StyleSheet, Text, TextInput, Touchable, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen({navigation}) {

  return(
    <View style={styles.mainContainer}>
        <StatusBar style="light" />

        <View style={styles.formContainer}>
            <Text style={styles.loginTitle}>
                ACESSE SEU PERFIL
            </Text>

            <View style={styles.inputContainer}>
                <Text>
                    E-mail:
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder='exemplo@escola.com'
                />
            </View>

            <View style={styles.inputContainer}>
                <Text>
                    Senha:
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder='Password'
                    secureTextEntry={true}
                />
            </View>

            <TouchableOpacity>
                <View style={styles.btnEntrar}>
                    <Text style={styles.btnEntrarText}>Entrar</Text>
                </View>
            </TouchableOpacity>

            <View style={styles.linkArea}>
                <TouchableOpacity>
                    <Text style={styles.links}>RECUPERAR SENHA</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.links}>CADASTRAR</Text>
                </TouchableOpacity>
            </View>

        </View>
    </View>
  )
}

const styles=StyleSheet.create({
    mainContainer: {
        flex: 1,
        margin: 0,
        padding: 0,
    },

    // Container Geral
    formContainer:{
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 50,
        marginBottom: 200,
    },

    // Titulo form
    loginTitle:{
        color: '#9C2222',
        fontSize: 25,
        fontWeight: 'bold',
        fontFamily: 'Varela',
    },

    // Parte de Inserir
    inputContainer:{
        // justifyContent: 'center',
        // alignItems: 'center',
    },

    input:{
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 50,
        width: 300,
        height: 50,
    },

    // Botão de entrar
    btnEntrar:{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9C2222',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 10,
        width: 125,
        height: 45,
    },

    btnEntrarText:{
        color: '#FFF',
        fontFamily: 'Varela',
        fontWeight: 'bold',
        fontSize: 15,
    },


    // Links de Recuperar Senha e Cadastrar
    links:{
        color: '#9C2222',
        textDecorationLine: 'underline',
        fontWeight: 'bold',
        fontSize: 20,
        margin: 10,
    },
})