import React from 'react'
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'

import { Colors } from 'react-native/Libraries/NewAppScreen'

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
})

const Section: React.FC<{
  title: string
}> = ({ children, title }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, Colors.white]}>{title}</Text>
      <Text style={[styles.sectionDescription, Colors.light]}>{children}</Text>
    </View>
  )
}

const App = () => {
  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Section title="Test" />
      </ScrollView>
    </SafeAreaView>
  )
}

export default App
