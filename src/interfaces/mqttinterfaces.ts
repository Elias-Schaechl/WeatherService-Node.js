

interface mqttSubscriprionData{
    onMessage(topic: string, message: string): void
    topic: string
}