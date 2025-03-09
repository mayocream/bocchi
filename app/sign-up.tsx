import { Link, Stack } from 'expo-router'
import { View, Image, Form, Input, Button, Separator } from 'tamagui'

export default function SignUp() {
  return (
    <View flex={1} justifyContent='center' alignItems='center'>
      <Stack.Screen
        options={{
          title: '新規登録',
        }}
      />
      <Image
        source={require('../assets/images/logo.png')}
        width={100}
        height={100}
      />
      <Form gap={10} width={300}>
        <Input id='email' placeholder='Email' keyboardType='email-address' />
        <Input id='password' placeholder='Password' secureTextEntry />
        <Input
          id='confirmPassword'
          placeholder='Confirm Password'
          secureTextEntry
        />
        <Form.Trigger asChild>
          <Button>新規登録</Button>
        </Form.Trigger>

        <Separator />

        <Link href='/sign-in' replace asChild>
          <Button variant='outlined'>ログイン</Button>
        </Link>
      </Form>
    </View>
  )
}
