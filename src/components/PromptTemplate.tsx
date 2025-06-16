import React from 'react'

interface PromptTemplateProps {
  onSelect: (text: string) => void
}

const templates = [
  'Tell me more about...',
  'How can I improve...',
  'Explain the concept of...',
  'What are the best practices for...'
]

const PromptTemplate: React.FC<PromptTemplateProps> = ({ onSelect }) => {
  return (
    <div className="flex gap-2 mb-4 overflow-x-auto py-2">
      {templates.map((template, index) => (
        <button
          key={index}
          onClick={() => onSelect(template)}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-sm whitespace-nowrap hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          {template}
        </button>
      ))}
    </div>
  )
}

export default PromptTemplate