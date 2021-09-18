import React from 'react'

import { NativeBaseProvider } from 'native-base'

import Peripherals from './modules/Peripherals'

const App = () => {
  return (
    <NativeBaseProvider>
      <Peripherals />
    </NativeBaseProvider>
  )
}

export default App
