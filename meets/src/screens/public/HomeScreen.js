import { Text, View, StyleSheet, TouchableHighlight } from "react-native";

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.mainContainer}>
            <Text style={styles.Title}>meets</Text>
            <Text style={styles.Subtitle}>Sua rede social de eventos acadêmicos!</Text>

            <View style={styles.container}>
                <TouchableHighlight
                    onPress={() => navigation.navigate('Login')}
                    style={styles.btnPrimary}
                >
                    <Text style={styles.txtBtnPrimary}>Fazer Login</Text>
                </TouchableHighlight>

                <TouchableHighlight
                    onPress={() => navigation.navigate('SignIn')}
                    style={styles.btnSecondary}
                >
                    <Text style={styles.txtBtnSecondary}>Criar Contar</Text>
                </TouchableHighlight>

                <TouchableHighlight
                    onPress={() => console.log('Recuperar Senha')}
                    style={styles.btnLink}
                >
                    <Text style={styles.txtBtnLink}>Recuperar Senha</Text>
                </TouchableHighlight>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9C2222',
        paddingHorizontal: 20,
    },
    Title: {
        fontSize: 80,
        fontWeight: 'bold',
        color: '#FDFDFD',
    },
    Subtitle: {
        marginTop: -15,
        fontSize: 15,
        textAlign: 'center',
        color: '#FDFDFD',
    },
    container: {
        width: '100%',
        gap: 10,
        marginTop: 100,
        alignItems: 'center'
    },

    btnPrimary: {
        backgroundColor: '#FDFDFD',
        borderRadius: 100,
        paddingVertical: 12,
        paddingHorizontal: 20,
        width: '100%',
    },

    txtBtnPrimary: {
        color: '#9C2222',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    btnSecondary: {
        borderColor: '#FDFDFD',
        borderWidth: 1,
        borderRadius: 100,
        paddingVertical: 12,
        paddingHorizontal: 20,
        width: '100%',
    },
    txtBtnSecondary: {
        color: '#FDFDFD',
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
        color: '#FDFDFD',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    },
})