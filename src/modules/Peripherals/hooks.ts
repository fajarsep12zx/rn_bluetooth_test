/* eslint-disable no-console */
import { useCallback, useEffect, useState } from 'react'
import {
  NativeEventEmitter,
  NativeModules,
  PermissionsAndroid,
  Platform,
} from 'react-native'

import BleManager, { Peripheral } from 'react-native-ble-manager'

const BleManagerModule = NativeModules.BleManager
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule)

const useCustom = () => {
  const [isScanning, setIsScanning] = useState(false)
  const [list, setList] = useState<Peripheral[]>([])
  const [peripherals, setPeripherals] = useState(new Map())
  const [connectedDevice, setConnectedDevice] = useState<any>()
  const [connecting, setConnecting] = useState(false)

  const platformPermissionRequest = useCallback(() => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    ).then((result) => {
      if (result) {
        console.log('User accept')
      } else {
        console.log('User refuse')
      }
    })
  }, [])

  const platformPermissionCheck = useCallback(() => {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      ).then((result) => {
        if (result) console.log('Permission is OK')
        else {
          platformPermissionRequest()
        }
      })
    }
  }, [])

  const initializeBleConnection = useCallback(() => {
    BleManager.start({ showAlert: false })
    platformPermissionCheck()
  }, [])

  // Whenever we scanning, it will trigger BleManagerDiscoverPeripheral.
  const handleStartScan = useCallback(() => {
    // If we want to directly connect to spesific device just fill
    // array parameter.
    BleManager.scan([], 3, true)
      .then((results) => {
        console.log('Scanning...', results)
        setIsScanning(true)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [])

  const handleStopScan = () => {
    console.log('Scan is stopped')
    setIsScanning(false)
  }

  // After scanning we will get peripherals info.
  const handleDiscoverPeripheral = useCallback(
    (peripheral: Peripheral) => {
      console.log('Got ble peripheral', peripheral)
      if (!peripheral.name) {
        // eslint-disable-next-line no-param-reassign
        peripheral.name = 'unknown'
      }

      console.log('peripheral', peripheral)

      setPeripherals(peripherals.set(peripheral.id, peripheral))
      setList(Array.from(peripherals.values()))
    },
    [peripherals]
  )

  const handleDisconnectedPeripheral = (data: { peripheral: Peripheral }) => {
    const peripheral = peripherals.get(data.peripheral)
    if (peripheral) {
      setPeripherals(peripherals.set(peripheral.id, peripheral))
      setList(Array.from(peripherals.values()))
    }
    console.log(`Disconnected from ${data.peripheral}`)
  }

  const handleUpdateValueForCharacteristic = useCallback(
    (data: {
      peripheral: Peripheral
      characteristic: string
      value: string
    }) => {
      console.log(
        `Received data from ${data.peripheral} characteristic ${data.characteristic}`,
        data.value
      )
    },
    []
  )

  const handleDisconnect = useCallback((peripheralId) => {
    BleManager.disconnect(peripheralId).then(() => {
      setConnectedDevice({})
    })
  }, [])

  const handleTestPeripheral = useCallback(
    (peripheral: Peripheral) => () => {
      console.log('connect')
      if (peripheral) {
        setConnecting(true)
        BleManager.connect(peripheral.id)
          .then(() => {
            const connectedPeripheral = peripherals.get(peripheral.id)
            if (connectedPeripheral) {
              setPeripherals(
                peripherals.set(peripheral.id, connectedPeripheral)
              )
              setList(Array.from(peripherals.values()))
            }
            console.log(`Connected to ${peripheral.id}`)

            setTimeout(() => {
              /* Test read current RSSI value */
              BleManager.retrieveServices(peripheral.id).then(
                (peripheralData) => {
                  console.log('Retrieved peripheral services', peripheralData)

                  setConnectedDevice(peripheralData)

                  BleManager.readRSSI(peripheral.id).then((rssi) => {
                    console.log('Retrieved actual RSSI value', rssi)

                    const peripheralRSSI = peripherals.get(peripheral.id)
                    if (peripheralRSSI) {
                      peripheralRSSI.rssi = rssi
                      setPeripherals(
                        peripherals.set(peripheralRSSI.id, peripheralRSSI)
                      )
                      setList(Array.from(peripherals.values()))
                      setConnecting(false)
                    }
                  })
                }
              )
            }, 900)
          })
          .catch((error) => {
            console.log('Connection error', error)
          })
      }
    },
    [peripherals]
  )

  useEffect(() => {
    // Initialize BleManager
    initializeBleConnection()

    const bleManagerDiscoverPeripheralListener = bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      handleDiscoverPeripheral
    )
    const bleManagerStopScanListener = bleManagerEmitter.addListener(
      'BleManagerStopScan',
      handleStopScan
    )
    const bleManagerDisconnectPeripheralListener =
      bleManagerEmitter.addListener(
        'BleManagerDisconnectPeripheral',
        handleDisconnectedPeripheral
      )
    const bleManagerDidUpdateValueForCharacteristicListener =
      bleManagerEmitter.addListener(
        'BleManagerDidUpdateValueForCharacteristic',
        handleUpdateValueForCharacteristic
      )

    return () => {
      // Unmount
      // use .remove() instead of removeListed
      // removelistenerr is deprecated
      bleManagerDiscoverPeripheralListener.remove()
      bleManagerStopScanListener.remove()
      bleManagerDisconnectPeripheralListener.remove()
      bleManagerDidUpdateValueForCharacteristicListener.remove()
    }
  }, [])

  return {
    data: {
      connecting,
      connectedDevice,
      isScanning,
      list,
    },
    methods: {
      handleDisconnect,
      handleStartScan,
      handleStopScan,
      handleTestPeripheral,
    },
  }
}

export default useCustom
