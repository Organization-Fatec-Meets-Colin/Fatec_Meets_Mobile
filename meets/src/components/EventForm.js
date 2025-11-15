import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import StylizedInput from './StylizedInput';

/**
 * Componente de formulário para criação de eventos
 * Gerencia todos os campos necessários para criar um evento vinculado a uma postagem
 * 
 * @param {Object} eventoData - Objeto contendo todos os dados do evento
 * @param {Function} setEventoData - Função para atualizar os dados do evento
 * @param {Boolean} showDatePicker - Controla visibilidade do seletor de data
 * @param {Function} setShowDatePicker - Função para mostrar/ocultar seletor de data
 * @param {Boolean} showTimeInicioPicker - Controla visibilidade do seletor de horário inicial
 * @param {Function} setShowTimeInicioPicker - Função para mostrar/ocultar seletor de horário inicial
 * @param {Boolean} showTimeFimPicker - Controla visibilidade do seletor de horário final
 * @param {Function} setShowTimeFimPicker - Função para mostrar/ocultar seletor de horário final
 */
export default function EventForm({
    eventoData,
    setEventoData,
    showDatePicker,
    setShowDatePicker,
    showTimeInicioPicker,
    setShowTimeInicioPicker,
    showTimeFimPicker,
    setShowTimeFimPicker
}) {
    return (
        <View style={styles.eventoContainer}>
            {/* Cabeçalho do formulário de evento */}
            <View style={styles.eventoHeader}>
                <FontAwesome name="calendar" size={20} color="#fff" />
                <Text style={styles.eventoHeaderText}>Detalhes do Evento</Text>
            </View>

            {/* Campo de Data do Evento */}
            <View style={styles.eventoRow}>
                <View style={styles.eventoInputWrapper}>
                    <Text style={styles.eventoLabel}>Data *</Text>
                    <TouchableOpacity
                        style={styles.datePickerButton}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <FontAwesome name="calendar" size={16} color="#666" />
                        <Text style={styles.datePickerText}>
                            {eventoData.dataEvento.toLocaleDateString('pt-BR')}
                        </Text>
                    </TouchableOpacity>
                    {/* DateTimePicker nativo para seleção de data */}
                    {showDatePicker && (
                        <DateTimePicker
                            value={eventoData.dataEvento}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={(event, selectedDate) => {
                                // No iOS, mantém o picker aberto; no Android, fecha automaticamente
                                setShowDatePicker(Platform.OS === 'ios');
                                if (selectedDate) {
                                    setEventoData({ ...eventoData, dataEvento: selectedDate });
                                }
                            }}
                            minimumDate={new Date()} // Não permite selecionar datas passadas
                        />
                    )}
                </View>
            </View>

            {/* Campos de Horário (Início e Fim) lado a lado */}
            <View style={styles.eventoRow}>
                {/* Horário de Início */}
                <View style={[styles.eventoInputWrapper, { flex: 1, marginRight: 10 }]}>
                    <Text style={styles.eventoLabel}>Início *</Text>
                    <TouchableOpacity
                        style={styles.datePickerButton}
                        onPress={() => setShowTimeInicioPicker(true)}
                    >
                        <FontAwesome name="clock-o" size={16} color="#666" />
                        <Text style={styles.datePickerText}>
                            {eventoData.horarioInicio.toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </Text>
                    </TouchableOpacity>
                    {/* DateTimePicker para horário de início */}
                    {showTimeInicioPicker && (
                        <DateTimePicker
                            value={eventoData.horarioInicio}
                            mode="time"
                            is24Hour={true} // Formato 24 horas
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={(event, selectedTime) => {
                                setShowTimeInicioPicker(Platform.OS === 'ios');
                                if (selectedTime) {
                                    setEventoData({ ...eventoData, horarioInicio: selectedTime });
                                }
                            }}
                        />
                    )}
                </View>

                {/* Horário de Fim */}
                <View style={[styles.eventoInputWrapper, { flex: 1 }]}>
                    <Text style={styles.eventoLabel}>Fim</Text>
                    <TouchableOpacity
                        style={styles.datePickerButton}
                        onPress={() => setShowTimeFimPicker(true)}
                    >
                        <FontAwesome name="clock-o" size={16} color="#666" />
                        <Text style={styles.datePickerText}>
                            {eventoData.horarioFim.toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </Text>
                    </TouchableOpacity>
                    {/* DateTimePicker para horário de fim */}
                    {showTimeFimPicker && (
                        <DateTimePicker
                            value={eventoData.horarioFim}
                            mode="time"
                            is24Hour={true}
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={(event, selectedTime) => {
                                setShowTimeFimPicker(Platform.OS === 'ios');
                                if (selectedTime) {
                                    setEventoData({ ...eventoData, horarioFim: selectedTime });
                                }
                            }}
                        />
                    )}
                </View>
            </View>

            {/* Campo de Local (obrigatório) */}
            <View style={styles.eventoInputWrapper}>
                <Text style={styles.eventoLabel}>Local *</Text>
                <StylizedInput
                    placeholder="Ex: Auditório Principal"
                    value={eventoData.local}
                    onchangeText={(text) => setEventoData({ ...eventoData, local: text })}
                    maxLength={300}
                />
            </View>

            {/* Campo de Endereço (opcional) */}
            <View style={styles.eventoInputWrapper}>
                <Text style={styles.eventoLabel}>Endereço</Text>
                <StylizedInput
                    placeholder="Endereço completo"
                    value={eventoData.endereco}
                    onchangeText={(text) => setEventoData({ ...eventoData, endereco: text })}
                    maxLength={500}
                />
            </View>

            {/* Campo de Capacidade Máxima (opcional) */}
            <View style={styles.eventoInputWrapper}>
                <Text style={styles.eventoLabel}>Capacidade Máxima</Text>
                <StylizedInput
                    placeholder="Número de vagas"
                    value={eventoData.capacidadeMaxima}
                    onchangeText={(text) => setEventoData({ 
                        ...eventoData, 
                        capacidadeMaxima: text.replace(/[^0-9]/g, '') // Aceita apenas números
                    })}
                    keyboardType="numeric"
                    maxLength={4}
                />
            </View>

            {/* Legenda de campos obrigatórios */}
            <Text style={styles.eventoObrigatorio}>* Campos obrigatórios</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    eventoContainer: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 15,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#9C2222',
        overflow: 'hidden',
    },
    eventoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        padding: 20,
        gap: 10,
        backgroundColor: '#9C2222',
    },
    eventoHeaderText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    eventoRow: {
        flexDirection: 'row',
        marginBottom: 15,
        paddingHorizontal: 5,
    },
    eventoInputWrapper: {
        marginBottom: 15,
        paddingHorizontal: 20,
        flex: 1,
    },
    eventoLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 8,
    },
    eventoObrigatorio: {
        fontSize: 12,
        color: '#999',
        fontStyle: 'italic',
        marginTop: 5,
        marginBottom: 15,
        paddingHorizontal: 20,
    },
    datePickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#979797ff',
        padding: 12,
        gap: 10,
    },
    datePickerText: {
        fontSize: 15,
        color: '#333',
        flex: 1,
    },
});
