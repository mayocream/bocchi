import { Link, Stack } from 'expo-router'
import { View, Image, Form, Input, Button, Separator } from 'tamagui'

export default function SignIn() {
  return (
    <View flex={1} justifyContent='center' alignItems='center'>
      <Stack.Screen
        options={{
          title: 'Sign In',
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
        <Form.Trigger asChild>
          <Button>Submit</Button>
        </Form.Trigger>

        <Separator />

        <Link href='/sign-up' asChild>
          <Button variant='outlined'>Sign Up</Button>
        </Link>
      </Form>
    </View>
  )
}
