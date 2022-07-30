import { extendTheme } from '@chakra-ui/react'

// 2. Add your color mode config
const config = {
  initialColorMode: 'light',
  //  If true, your app will change color mode based on the user's system preferences.
  useSystemColorMode: false,
}

// 3. extend the theme
const theme = extendTheme({ config })

export default theme