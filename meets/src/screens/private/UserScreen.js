import { StatusBar } from 'expo-status-bar';
import React, { useContext } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { AuthContext } from '../../../context/AuthContext';
import StylizedButton from '../../components/StylizedButton';

export default function UserScreen() {
    const { logout, user } = useContext(AuthContext);

    const handleLogout = () => {
        Alert.alert(
            'Sair',
            'Deseja realmente sair da sua conta?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Sair',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.safeArea}>
            <StatusBar style="dark" />
            <ScrollView style={styles.scrollView}>
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>Perfil</Text>
                </View>

                <View style={styles.userInfo}>
                    {user && (
                        <>
                            <Text style={styles.userName}>{user.nome}</Text>
                            <Text style={styles.userEmail}>{user.email}</Text>
                        </>
                    )}
                </View>

                <View style={styles.logoutContainer}>
                    <StylizedButton
                        onPress={handleLogout}
                        title="Sair da Conta"
                        style="secondary"
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fdfdfd',
    },
    scrollView: {
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 20,
        borderBottomEndRadius: 10,
        borderBottomStartRadius: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#D88D8D',
    },
    title: {
        fontSize: 50,
        fontWeight: 'bold',
        color: '#9C2222',
    },
    userInfo: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#D88D8D',
        marginBottom: 30,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#9C2222',
        marginBottom: 8,
    },
    userEmail: {
        fontSize: 16,
        color: '#666',
    },
    logoutContainer: {
        marginTop: 20,
    },
})
