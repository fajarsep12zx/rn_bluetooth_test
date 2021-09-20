import React from 'react'

import { isEmpty } from 'lodash'
import {
  Badge,
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  List,
  Modal,
  ScrollView,
  Text,
  VStack,
} from 'native-base'

import useCustom from './hooks'

function Peripherals() {
  const { data, methods } = useCustom()

  const renderPeripherals = (
    <>
      <Box my={3}>
        <Button onPress={methods.handleStartScan} isLoading={data.isScanning}>
          Scan Bluetooth
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
                    <Text>{item.name}</Text>
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
    </>
  )

  const renderConnectedDevice = (
    <Box display="flex" flexDirection="column">
      <Box my={3}>
        <Button
          onPress={() => methods.handleDisconnect(data?.connectedDevice?.id)}
        >
          Disconnect
        </Button>
      </Box>
      <Box my={3}>
        <Text>{data?.connectedDevice?.name}</Text>
        <Text>{data?.connectedDevice?.id}</Text>
        <Text>RSSI: {data?.connectedDevice?.rssi}</Text>
      </Box>
      <Box my={3}>
        <Heading> Services </Heading>
        <Box>
          {data?.connectedDevice?.services?.map(({ uuid }: any) => (
            <React.Fragment key={uuid}>
              <List.Item
                _pressed={{
                  backgroundColor: '#f3f3f3',
                }}
              >
                <VStack>
                  <Text>UUID: {uuid}</Text>
                </VStack>
              </List.Item>
              <Divider />
            </React.Fragment>
          ))}
        </Box>
      </Box>
      <Box my={3}>
        <Heading> Characteristics </Heading>
        <Box>
          {data?.connectedDevice?.characteristics?.map(
            ({ characteristic, service, properties }: any) => (
              <React.Fragment key={characteristic}>
                <List.Item
                  _pressed={{
                    backgroundColor: '#f3f3f3',
                  }}
                >
                  <VStack>
                    <Text>characteristic: {characteristic}</Text>
                    <Text>service: {service}</Text>
                    <HStack space={3} mr={3}>
                      {properties?.Write && <Badge>{properties?.Write}</Badge>}
                      {properties?.Read && <Badge>{properties?.Read}</Badge>}
                      {properties?.Notify && (
                        <Badge>{properties?.Notify}</Badge>
                      )}
                    </HStack>
                  </VStack>
                </List.Item>
                <Divider />
              </React.Fragment>
            )
          )}
        </Box>
      </Box>
    </Box>
  )

  return (
    <ScrollView>
      <Box m={3} flex={1}>
        <Heading>
          Bluetooth connection test
          <Heading color="emerald.400"> React Native </Heading>
        </Heading>
        <Modal isOpen={data.connecting}>
          <Modal.Content>
            <Modal.Body>
              <Text>Connecting...</Text>
            </Modal.Body>
          </Modal.Content>
        </Modal>
        {isEmpty(data.connectedDevice)
          ? renderPeripherals
          : renderConnectedDevice}
      </Box>
    </ScrollView>
  )
}

export default Peripherals
