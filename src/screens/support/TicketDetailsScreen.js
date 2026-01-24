import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import useSupportStore from '../../store/supportStore';

const TicketDetailsScreen = ({ route, navigation }) => {
  const { ticketId } = route.params;
  const { tickets, addMessage, rateTicket, closeTicket } = useSupportStore();
  
  const [message, setMessage] = useState('');
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingFeedback, setRatingFeedback] = useState('');
  const scrollViewRef = useRef();

  const ticket = tickets.find(t => t.id === ticketId);

  useEffect(() => {
    if (!ticket) {
      Alert.alert('Erro', 'Ticket não encontrado', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }
  }, [ticket]);

  if (!ticket) return null;

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const result = await addMessage(ticketId, message);
    
    if (result.success) {
      setMessage('');
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } else {
      Alert.alert('Erro', 'Não foi possível enviar a mensagem');
    }
  };

  const handleCloseTicket = () => {
    Alert.alert(
      'Fechar Ticket',
      'Deseja realmente fechar este ticket? Você poderá abrir um novo se precisar.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Fechar',
          style: 'destructive',
          onPress: async () => {
            const result = await closeTicket(ticketId);
            if (result.success) {
              setShowRating(true);
            }
          },
        },
      ]
    );
  };

  const handleSubmitRating = async () => {
    if (rating === 0) {
      Alert.alert('Atenção', 'Por favor, selecione uma avaliação');
      return;
    }

    const result = await rateTicket(ticketId, rating, ratingFeedback);
    
    if (result.success) {
      Alert.alert(
        'Obrigado! ⭐',
        'Sua avaliação foi registrada com sucesso.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      open: { label: 'Aberto', color: '#4CAF50', icon: '🟢' },
      in_progress: { label: 'Em Andamento', color: '#FF9800', icon: '🟡' },
      resolved: { label: 'Resolvido', color: '#2196F3', icon: '🔵' },
      closed: { label: 'Fechado', color: '#9E9E9E', icon: '⚪' },
    };
    return statusMap[status] || statusMap.open;
  };

  const statusInfo = getStatusInfo(ticket.status);
  const canSendMessage = ticket.status !== 'closed';

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      {/* Header do Ticket */}
      <View style={styles.ticketHeader}>
        <View style={styles.ticketInfo}>
          <Text style={styles.ticketSubject}>{ticket.subject}</Text>
          <Text style={styles.ticketCategory}>📁 {ticket.category}</Text>
          <View style={styles.ticketMeta}>
            <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
              <Text style={styles.statusText}>
                {statusInfo.icon} {statusInfo.label}
              </Text>
            </View>
            <Text style={styles.ticketDate}>
              {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
            </Text>
          </View>
        </View>
        
        {canSendMessage && (
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCloseTicket}
          >
            <Text style={styles.closeButtonText}>Fechar Ticket</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Mensagens */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {ticket.messages.map((msg, index) => (
          <View
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.sender === 'user' ? styles.userMessage : styles.supportMessage
            ]}
          >
            <Text style={styles.messageSender}>{msg.senderName}</Text>
            <Text style={styles.messageText}>{msg.text}</Text>
            <Text style={styles.messageTime}>
              {new Date(msg.timestamp).toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        ))}

        {ticket.status === 'closed' && !showRating && !ticket.rating && (
          <TouchableOpacity
            style={styles.ratingPrompt}
            onPress={() => setShowRating(true)}
          >
            <Text style={styles.ratingPromptText}>
              ⭐ Avalie nosso atendimento
            </Text>
          </TouchableOpacity>
        )}

        {showRating && (
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingTitle}>Como foi nosso atendimento?</Text>
            
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map(star => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                >
                  <Text style={styles.star}>
                    {star <= rating ? '⭐' : '☆'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.feedbackInput}
              placeholder="Comentário (opcional)"
              value={ratingFeedback}
              onChangeText={setRatingFeedback}
              multiline
              numberOfLines={3}
              placeholderTextColor="#999"
            />

            <TouchableOpacity
              style={styles.submitRatingButton}
              onPress={handleSubmitRating}
            >
              <Text style={styles.submitRatingText}>Enviar Avaliação</Text>
            </TouchableOpacity>
          </View>
        )}

        {ticket.rating && (
          <View style={styles.ratedContainer}>
            <Text style={styles.ratedText}>
              Você avaliou: {Array(ticket.rating).fill('⭐').join('')}
            </Text>
            {ticket.ratingFeedback && (
              <Text style={styles.ratedFeedback}>"{ticket.ratingFeedback}"</Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* Input de Mensagem */}
      {canSendMessage && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Digite sua mensagem..."
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!message.trim()}
          >
            <Text style={styles.sendButtonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  ticketHeader: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  ticketInfo: {
    marginBottom: 15,
  },
  ticketSubject: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  ticketCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  ticketMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  ticketDate: {
    fontSize: 12,
    color: '#999',
  },
  closeButton: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 15,
    paddingBottom: 20,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 15,
    marginBottom: 10,
  },
  userMessage: {
    backgroundColor: '#E3F2FD',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
  },
  supportMessage: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  messageSender: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    textAlign: 'right',
  },
  ratingPrompt: {
    backgroundColor: '#FFF3E0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  ratingPromptText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E65100',
  },
  ratingContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 15,
  },
  star: {
    fontSize: 36,
  },
  feedbackInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    marginBottom: 15,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitRatingButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
    submitRatingText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  ratedContainer: {
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  ratedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 5,
  },
  ratedFeedback: {
    fontSize: 13,
    color: '#388E3C',
    fontStyle: 'italic',
  },
  inputContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'flex-end',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 15,
    color: '#333',
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
export default TicketDetailsScreen;