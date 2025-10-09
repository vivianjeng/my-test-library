import {
  StyleSheet,
  Button,
  TextInput,
  View,
  Text,
  Platform,
  ScrollView,
} from 'react-native';

import {
  CircomProof,
  CircomProofResult,
  // Calculator,
  // type BinaryOperator,
  // SafeAddition,
  // ComputationResult,
  generateCircomProof,
  ProofLib,
  verifyCircomProof,
} from 'my-test-library';
import RNFS from 'react-native-fs';
import { useEffect, useState } from 'react';

function CircomProofComponent() {
  const [a, setA] = useState('3');
  const [b, setB] = useState('4');
  const [inputs, setInputs] = useState<string[]>([]);
  const [proof, setProof] = useState<CircomProof>({
    a: { x: '', y: '', z: '' },
    b: { x: [], y: [], z: [] },
    c: { x: '', y: '', z: '' },
    protocol: '',
    curve: '',
  });
  const [isValid, setIsValid] = useState<string>('');

  async function genProof(): Promise<void> {
    const circuitInputs = {
      a: [a],
      b: [b],
    };
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      const newFileName = 'multiplier2_final.zkey';
      const newFilePath = `${RNFS.DocumentDirectoryPath}/${newFileName}`;
      const fileExists = await RNFS.exists(newFilePath);
      if (!fileExists) {
        try {
          let sourcePath = '';

          if (Platform.OS === 'android') {
            // File bundled in android assets folder (via react-native.config.js)
            sourcePath = `custom/${newFileName}`;
            await RNFS.copyFileAssets(sourcePath, newFilePath);
          } else {
            // File bundled in iOS bundle (via react-native.config.js)
            sourcePath = `${RNFS.MainBundlePath}/${newFileName}`;
            await RNFS.copyFile(sourcePath, newFilePath);
          }
        } catch (error) {
          console.error('Error copying file:', error);
          throw error;
        }
      }

      try {
        // DO NOT change the proofLib if you don't build for rapidsnark
        const res: CircomProofResult = await generateCircomProof(
          newFilePath.replace('file://', ''),
          JSON.stringify(circuitInputs),
          ProofLib.Arkworks
        );
        setProof(res.proof);
        setInputs(res.inputs);
      } catch (error) {
        console.error('Error generating proof:', error);
      }
    }
  }

  async function verifyProof(): Promise<void> {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      const newFileName = 'multiplier2_final.zkey';
      const newFilePath = `${RNFS.DocumentDirectoryPath}/${newFileName}`;
      const fileExists = await RNFS.exists(newFilePath);
      if (!fileExists) {
        try {
          let sourcePath = '';

          if (Platform.OS === 'android') {
            // File bundled in android assets folder (via react-native.config.js)
            sourcePath = `custom/${newFileName}`;
            await RNFS.copyFileAssets(sourcePath, newFilePath);
          } else {
            // File bundled in iOS bundle (via react-native.config.js)
            sourcePath = `${RNFS.MainBundlePath}/${newFileName}`;
            await RNFS.copyFile(sourcePath, newFilePath);
          }
        } catch (error) {
          console.error('Error copying file:', error);
          throw error;
        }
      }

      try {
        const circomProofResult: CircomProofResult = {
          proof: proof,
          inputs: inputs,
        };
        // DO NOT change the proofLib if you don't build for rapidsnark
        const res: boolean = await verifyCircomProof(
          newFilePath.replace('file://', ''),
          circomProofResult,
          ProofLib.Arkworks
        );
        setIsValid(res.toString());
      } catch (error) {
        console.error('Error verifying proof:', error);
      }
    }
  }

  return (
    <View style={styles.proofContainer} testID="circom-proof-container">
      <View style={styles.inputContainer}>
        <Text style={styles.label}>a</Text>
        <TextInput
          testID="circom-input-a"
          style={styles.input}
          placeholder="Enter value for a"
          value={a}
          onChangeText={setA}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>b</Text>
        <TextInput
          testID="circom-input-b"
          style={styles.input}
          placeholder="Enter value for b"
          value={b}
          onChangeText={setB}
          keyboardType="numeric"
        />
      </View>
      <Button
        testID="circom-gen-proof-button"
        title="Generate Circom Proof"
        onPress={() => genProof()}
      />
      <Button
        testID="circom-verify-proof-button"
        title="Verify Circom Proof"
        onPress={() => verifyProof()}
      />
      <Text>Proof is Valid:</Text>
      <Text testID="circom-valid-output" style={styles.output}>
        {isValid}
      </Text>
      <Text>Public Signals:</Text>
      <ScrollView style={styles.outputScroll}>
        <Text testID="circom-inputs-output" style={styles.output}>
          {JSON.stringify(inputs)}
        </Text>
      </ScrollView>
      <Text>Proof:</Text>
      <ScrollView style={styles.outputScroll}>
        <Text testID="circom-proof-output" style={styles.output}>
          {JSON.stringify(proof)}
        </Text>
      </ScrollView>
    </View>
  );
}

export default function App() {
  return (
    <View style={styles.container}>
      <CircomProofComponent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  outputScroll: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
  },
  output: {
    fontSize: 14,
    padding: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
  },
  activeTab: {
    borderBottomColor: '#A1CEDC',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  proofContainer: {
    padding: 10,
  },
});
