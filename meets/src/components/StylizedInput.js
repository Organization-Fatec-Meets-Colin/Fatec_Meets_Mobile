import { SafeAreaViewBase, StyleSheet, Text, TextInput, Touchable, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function StylizedInput({ value, onChangeText, placeholder, securityTextEntry, icon, onPress}) {
    return (
        <View style={styles.inputContainer}>
            <Text style={styles.inputText}>
                E-mail:
            </Text>
            <View style={styles.subContainerInput}>
                <TextInput
                    placeholder="placeholder"
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={securityTextEntry}
                    style={styles.input}
                    {...rest}
                />
                {value && (
                    <TouchableOpacity onPress={onPress}>
                        <MaterialIcons name={icon} size={24} color="#979797ff" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
}

const style = StyleSheet.create({
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
})