import React from 'react'

import {
  Box,
  Button,
  Divider,
  Heading,
  List,
  ScrollView,
  Text,
  VStack,
} from 'native-base'

import useCustom from './hooks'

function Peripherals() {
  const { data, methods } = useCustom()
  return (
    <ScrollView>
      <Box m={3} flex={1}>
        <Heading>
          Bluetooth connection test
          <Heading color="emerald.400"> React Native </Heading>
        </Heading>
        <Box my={3}>
          <Button onPress={methods.handleStartScan} isLoading={data.isScanning}>
            Scan Bluetooth
          </Button>
        </Box>
        <Box>
          <Button onPress={() => methods.handleRetrieveConnected()}>
            Retrieve connected peripherals
          </Button>
        </Box>
        <Box width="100%">
          {data.list.length === 0 ? (
            <Text> No Peripheral Found! </Text>
          ) : (
            <List border="none" space={2} my={2}>
              {data.list.map((item) => (
                <React.Fragment key={item.id}>
                  <List.Item
                    _pressed={{
                      backgroundColor: '#f3f3f3',
                    }}
                    onPress={methods.handleTestPeripheral(item)}
                  >
                    <VStack>
                      <Text>
                        {item.name} {item.connected ? '- Connected' : ''}
                      </Text>
                      <Text>{item.id}</Text>
                      <Text>RSSI: {item.rssi}</Text>
                    </VStack>
                  </List.Item>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Box>
    </ScrollView>
  )
}

export default Peripherals
