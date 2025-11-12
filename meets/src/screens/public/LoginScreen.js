
import { StatusBar } from "expo-status-bar";
import { useContext, useState } from "react";
import { SafeAreaViewBase, StyleSheet, Text, TextInput, TouchableHighlight, View, Alert, ActivityIndicator } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import StylizedInput from "../../components/StylizedInput";
import { AuthContext } from "../../../context/AuthContext";
import StylizedButton from "../../components/StylizedButton";

export default function LoginScreen({ navigation }) {
    const { login, authIsLoading, error } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(true);

    async function handleLogin() {
        // Validações básicas
        if (!email.trim() || !password.trim()) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos');
            return;
        }

        if (!email.includes('@')) {
            Alert.alert('Erro', 'Por favor, insira um e-mail válido');
            return;
        }

        // Fazer login usando o service
        const result = await login(email.trim(), password);

        if (result.success) {
            Alert.alert('Sucesso', `Bem-vindo, ${result.user.nome}!`);
            navigation.navigate('Home');
        } else {
            Alert.alert('Erro no Login', result.error || 'Email ou senha inválidos');
        }
    }

    return (
        <View style={styles.mainContainer}>
            <StatusBar style="light" />

            <View style={styles.formContainer}>
                <Text style={styles.title}>
                    ACESSE O SEU LOGIN
                </Text>

                <StylizedInput
                    value={email}
                    onchangeText={setEmail}
                    placeholder="E-mail"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Senha"
                        secureTextEntry={showPassword}
                        value={password}
                        onChangeText={setPassword}
                        autoCapitalize="none"
                        style={styles.input}
                    />
                    {password && (
                        <TouchableHighlight onPress={() => setShowPassword(!showPassword)} style={{ borderRadius: 100 }}>
                            <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={24} color="#979797ff" />
                        </TouchableHighlight>
                    )}
                </View>

                {error && (
                    <Text style={styles.errorText}>{error}</Text>
                )}

                <View style={styles.container}>
                    {authIsLoading ? (
                        <ActivityIndicator size="large" color="#9C2222" />
                    ) : (
                        <>
                            <StylizedButton
                                onPress={handleLogin}
                                title="Entrar"
                                disabled={authIsLoading}
                            />

                            <StylizedButton
                                onPress={() => navigation.popTo('SignIn')}
                                title="Criar Conta"
                                style="secondary"
                                disabled={authIsLoading}
                            />

                            <StylizedButton
                                onPress={() => console.log('Recuperar Senha')}
                                title="Recuperar Senha"
                                style="link"
                                disabled={authIsLoading}
                            />
                        </>
                    )}
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
    errorText: {
        color: '#FF0000',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 10
    }
})