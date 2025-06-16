import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from '@react-pdf/renderer'
import { Message } from '../store/chatStore'

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  message: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  userMessage: {
    backgroundColor: '#E3F2FD',
  },
  botMessage: {
    backgroundColor: '#F5F5F5',
  },
  timestamp: {
    fontSize: 10,
    color: '#666',
    marginTop: 5,
  },
})

interface ChatPDFProps {
  messages: Message[]
  title: string
}

const ChatPDF = ({ messages, title }: ChatPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>{title}</Text>
      {messages.map((message) => (
        <View
          key={message.id}
          style={[
            styles.message,
            message.sender === 'user' ? styles.userMessage : styles.botMessage,
          ]}
        >
          <Text>{message.text}</Text>
          <Text style={styles.timestamp}>
            {new Date(message.timestamp).toLocaleString()}
          </Text>
        </View>
      ))}
    </Page>
  </Document>
)

interface PDFExportButtonProps {
  messages: Message[]
  title: string
}

const PDFExportButton: React.FC<PDFExportButtonProps> = ({ messages, title }) => {
  if (messages.length === 0) return null

  return (
    <PDFDownloadLink
      document={<ChatPDF messages={messages} title={title} />}
      fileName={`chat-${title}-${new Date().toISOString().split('T')[0]}.pdf`}
      className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
    >
      {({ loading }) =>
        loading ? 'Preparing PDF...' : 'Download Chat History (PDF)'
      }
    </PDFDownloadLink>
  )
}

export default PDFExportButton