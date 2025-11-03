import { TextInput, TouchableHighlight, View, StyleSheet } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function StylizedInput({ value, onchangeText, placeholder, secureTextEntry, icon, onPressIcon, isPassword, ...rest }) {
    return (
        <View style={styles.inputContainer}>
            <TextInput
                placeholder={placeholder}
                value={value}
                onChangeText={onchangeText}
                secureTextEntry={secureTextEntry}
                style={styles.input}
                {...rest}
            />
            {isPassword && value && (
                <TouchableHighlight onPress={onPressIcon} style={{ borderRadius: 100 }}>
                    <MaterialIcons name={icon} size={24} color="#979797ff" />
                </TouchableHighlight>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
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
})