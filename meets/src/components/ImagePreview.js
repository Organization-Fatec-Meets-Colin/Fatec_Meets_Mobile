import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import FontAwesome from '@expo/vector-icons/FontAwesome';

/**
 * Componente para exibir preview das imagens selecionadas
 * Mostra as imagens em scroll horizontal com botão de remoção
 * 
 * @param {Array} imagens - Array de objetos com URI das imagens selecionadas
 * @param {Function} onRemove - Callback executado ao remover uma imagem, recebe o índice
 */
export default function ImagePreview({ imagens, onRemove }) {
    // Não renderiza nada se não houver imagens
    if (imagens.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.scroll}
            >
                {imagens.map((imagem, index) => (
                    <View key={index} style={styles.imageWrapper}>
                        {/* Imagem com preview */}
                        <Image
                            source={{ uri: imagem.uri }}
                            style={styles.image}
                            contentFit="cover"
                        />
                        {/* Botão de remover imagem */}
                        <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => onRemove(index)}
                        >
                            <FontAwesome name="times-circle" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    scroll: {
        flexDirection: 'row',
        overflow: 'visible',
    },
    imageWrapper: {
        position: 'relative',
        marginRight: 10,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 15,
        backgroundColor: '#F5F5F5',
    },
    removeButton: {
        position: 'absolute',
        paddingHorizontal: 2,
        top: -8,
        right: -8,
        backgroundColor: '#fff',
        borderRadius: 100,
    },
});
