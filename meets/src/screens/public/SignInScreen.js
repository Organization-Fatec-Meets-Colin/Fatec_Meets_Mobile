
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { SafeAreaViewBase, StyleSheet, Text, TextInput, TouchableHighlight, View } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import StylizedInput from "../../components/StylizedInput";
import StylizedButton from "../../components/StylizedButton";

export default function SignInScreen({ navigation }) {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(true);

    return (
        <View style={styles.mainContainer}>
            <StatusBar style="light" />

            <View style={styles.formContainer}>
                <Text style={styles.title}>
                    FAÇA SEU CADASTRO
                </Text>

                <StylizedInput
                    value={name}
                    onchangeText={setName}
                    placeholder="Nome de Usuário"
                    keyboardType="default"
                    autoCorrect={false}
                />

                <StylizedInput
                    value={email}
                    onchangeText={setEmail}
                    placeholder="E-mail"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                <StylizedInput
                    value={password}
                    onchangeText={setPassword}
                    placeholder="Senha"
                    keyboardType="default"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={showPassword}
                    icon={showPassword ? "visibility" : "visibility-off"}
                    isPassword={true}
                    onPressIcon={() => setShowPassword(!showPassword)}
                />

                <StylizedInput
                    value={confirmPassword}
                    onchangeText={setConfirmPassword}
                    placeholder="Confirmar Senha"
                    keyboardType="default"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={showPassword}
                    icon={showPassword ? "visibility" : "visibility-off"}
                    isPassword={true}
                    onPressIcon={() => setShowPassword(!showPassword)}
                />

                <View style={styles.container}>
                    <StylizedButton
                        onPress={() => console.log('Criar Conta')}
                        title="Criar Conta"
                    />

                    <StylizedButton
                        onPress={() => navigation.popTo('Login')}
                        title="Fazer Login"
                        style="secondary"
                    />

                    <StylizedButton
                        onPress={() => console.log('Recuperar Senha')}
                        title="Recuperar Senha"
                        style="link"
                    />

                </View>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    formContainer: {
        width: '80%',
        alignItems: 'center',
        gap: 20
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#9C2222',
        marginBottom: 20
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#979797ff',
    },

    input: {
        height: 50,
        width: '85%',
    },

    container: {
        width: '100%',
        gap: 10,
        marginTop: 10,
        alignItems: 'center'
    },

    btnPrimary: {
        backgroundColor: '#9C2222',
        borderRadius: 100,
        paddingVertical: 12,
        paddingHorizontal: 20,
        width: '100%',
    },

    txtBtnPrimary: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    btnSecondary: {
        borderColor: '#9C2222',
        borderWidth: 1,
        borderRadius: 100,
        paddingVertical: 12,
        paddingHorizontal: 20,
        width: '100%',
    },
    txtBtnSecondary: {
        color: '#9C2222',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    btnLink: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        width: '100%',
    },
    txtBtnLink: {
        color: '#9C2222',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    },
})