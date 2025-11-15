import { StyleSheet, Text, TouchableHighlight } from "react-native"

export default function StylizedButton({ onPress, title, style }) {

    if (style === 'secondary') {
        return (
            <TouchableHighlight
                onPress={onPress}
                style={styles.btnSecondary}
            >
                <Text style={styles.txtBtnSecondary}>{title}</Text>
            </TouchableHighlight>
        )
    }

    if (style === 'link') {
        return (
            <TouchableHighlight
                onPress={onPress}
                style={styles.btnLink}
            >
                <Text style={styles.txtBtnLink}>{title}</Text>
            </TouchableHighlight>
        )
    }

    return (
        <TouchableHighlight
            onPress={onPress}
            style={styles.btnPrimary}
        >
            <Text style={styles.txtBtnPrimary}>{title}</Text>
        </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
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