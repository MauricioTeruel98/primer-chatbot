'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function Chatbot() {
    const [role, setRole] = useState('')
    const [messages, setMessages] = useState([])
    const [inputMessage, setInputMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!inputMessage.trim() || !role.trim()) return

        setIsLoading(true)
        const userMessage = { role: 'user', content: inputMessage }
        setMessages(prevMessages => [...prevMessages, userMessage])

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    role,
                    messages: [...messages, userMessage],
                }),
            })
            console.log(response);
            if (!response.ok) {
                throw new Error('Failed to get response from API')
            }

            const data = await response.json()
            const assistantMessage = { role: 'assistant', content: data.result }
            setMessages(prevMessages => [...prevMessages, assistantMessage])
        } catch (error) {
            console.error('Error:', error)
            // Puedes manejar el error aquí, por ejemplo, mostrando un mensaje al usuario
        } finally {
            setIsLoading(false)
            setInputMessage('')
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Chatbot Inteligente</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Rol del Asistente</label>
                        <Input
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            placeholder="Ej: Asistente de ventas"
                            className="mt-1"
                        />
                    </div>
                    <ScrollArea className="h-[400px] border rounded-md p-4">
                        {messages.map((message, index) => (
                            <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                                <span className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                    {message.content}
                                </span>
                            </div>
                        ))}
                    </ScrollArea>
                </div>
            </CardContent>
            <CardFooter>
                <form onSubmit={handleSendMessage} className="w-full space-y-2">
                    <Textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Escribe tu mensaje aquí..."
                        className="w-full"
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Enviando...' : 'Enviar'}
                    </Button>
                </form>
            </CardFooter>
        </Card>
    )
}