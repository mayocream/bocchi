import { AuthenticationService } from '@/lib/api'
import { LoginRequest } from '@/lib/bocchi_pb'
import { Link, Stack } from 'expo-router'
import { useState } from 'react'
import { Alert } from 'react-native'
import { View, Image, Form, Input, Button, Separator } from 'tamagui'

export default function SignIn() {
  const [handle, setHandle] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async () => {
    if (!handle || !password)
      return Alert.alert('ユーザー名とパスワードを入力してください')

    setLoading(true)
    let request = new LoginRequest()
    if (handle.includes('@')) {
      request.setEmail(handle)
    } else {
      request.setUsername(handle)
    }
    request.setPassword(password)

    try {
      const response = await AuthenticationService.login(request)
      console.log(response)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View flex={1} justifyContent='center' alignItems='center'>
      <Stack.Screen
        options={{
          title: 'ログイン',
        }}
      />
      <Image
        source={require('../assets/images/logo.png')}
        width={140}
        height={140}
      />
      <Form gap={10} width={300}>
        <Input
          placeholder='メールまたはユーザー名'
          keyboardType='email-address'
          onChangeText={setHandle}
        />
        <Input
          placeholder='パスワード'
          secureTextEntry
          onChangeText={setPassword}
        />
        <Form.Trigger asChild>
          <Button onPress={onSubmit} disabled={loading}>
            ログイン
          </Button>
        </Form.Trigger>

        <Separator />

        <Link href='/sign-up' replace asChild>
          <Button variant='outlined'>新規登録</Button>
        </Link>
      </Form>
    </View>
  )
}
