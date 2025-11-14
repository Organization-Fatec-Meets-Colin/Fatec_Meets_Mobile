import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

/**
 * Componente de botões de ação para adicionar conteúdo ao post
 * Inclui botões para fotos e eventos
 * 
 * @param {Number} imagensCount - Quantidade de imagens selecionadas (máximo 5)
 * @param {Function} onPickImage - Callback para abrir seletor de imagens
 * @param {Boolean} isEvento - Indica se o post é um evento
 * @param {Function} onToggleEvento - Callback para ativar/desativar modo evento
 */
export default function PostActions({ imagensCount, onPickImage, isEvento, onToggleEvento }) {
    // Verifica se atingiu limite de imagens
    const canAddImage = imagensCount < 5;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Adicionar ao seu post</Text>

            <View style={styles.buttonsRow}>
                {/* Botão de Foto */}
                <TouchableOpacity
                    style={[
                        styles.button,
                        canAddImage && styles.buttonActive
                    ]}
                    onPress={onPickImage}
                    disabled={!canAddImage}
                >
                    <FontAwesome
                        name="image"
                        size={24}
                        color={canAddImage ? "#9C2222" : "#ccc"}
                    />
                    <Text style={[
                        styles.label,
                        canAddImage && styles.labelActive
                    ]}>
                        Foto {imagensCount > 0 && `(${imagensCount}/5)`}
                    </Text>
                </TouchableOpacity>

                {/* Botão de Evento */}
                <TouchableOpacity
                    style={[
                        styles.button,
                        !isEvento && styles.buttonActive
                    ]}
                    onPress={onToggleEvento}
                >
                    <FontAwesome
                        name="calendar"
                        size={24}
                        color={isEvento ? "#666" : "#9C2222"}
                    />
                    <Text style={[
                        styles.label,
                        !isEvento && styles.labelActive
                    ]}>
                        Evento
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 15,
    },
    buttonsRow: {
        flexDirection: 'row',
        gap: 15,
    },
    button: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    buttonActive: {
        backgroundColor: '#FFE8E8',
    },
    label: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    labelActive: {
        color: '#9C2222',
    },
});
