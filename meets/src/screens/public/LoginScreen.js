import { SafeAreaViewBase, StyleSheet, Text, TextInput, Touchable, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import StylizedInput from '../../components/StylizedInput';

export default function LoginScreen({navigation}) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(true);

  return(
    <View style={styles.mainContainer}>
        <StatusBar style="light" />

        <View style={styles.formContainer}>
            <Text style={styles.loginTitle}>
                ACESSE SEU PERFIL
            </Text>

            <StylizedInput/>

            <View style={styles.inputContainer}>
                <Text style={styles.inputText}>
                    Senha:
                </Text>
                <View style={styles.subContainerInput}>
                    <TextInput
                        style={styles.input}
                        placeholder='Password'
                        secureTextEntry={showPassword}
                        value={password}
                        onChangeText={setPassword}
                    />
                    {password && (
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={24} color="#979797ff"/>
                        </TouchableOpacity>
                    )}
                </View>
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
        // justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        padding: 0,
    },

    // Container Geral
    formContainer:{
        marginTop: 50,
        alignItems: 'center',
        width: '80%',
        gap: 20,
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
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },

    inputText:{
        marginBottom: 20,
        fontSize: 20,
    },

    subContainerInput:{
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#979797ff',
        borderRadius: 50,
        width: '100%',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },

    input:{
        width: '85%',
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
        width: 170,
        height: 45,
    },

    btnEntrarText:{
        color: '#FFF',
        fontFamily: 'Varela',
        fontWeight: 'bold',
        fontSize: 23,
    },


    // Links de Recuperar Senha e Cadastrar
    links:{
        color: '#9C2222',
        textDecorationLine: 'underline',
        fontWeight: 'bold',
        fontSize: 20,
        margin: 10,
    },

    linkArea:{
        alignItems: 'center', 
    }
})