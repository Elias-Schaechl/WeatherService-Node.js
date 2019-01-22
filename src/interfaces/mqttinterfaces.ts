
interface mqttSubscriprionData {
    topic: string
    onMessage(topic: string, message: string): void
}
