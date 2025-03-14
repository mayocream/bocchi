import { AuthenticationClient, HealthClient } from "./BocchiServiceClientPb"

const server = process.env.EXPO_PUBLIC_API_URL!

console.info(`Connecting to server: ${server}`)

export const healthService = new HealthClient(server)
export const AuthenticationService = new AuthenticationClient(server)
