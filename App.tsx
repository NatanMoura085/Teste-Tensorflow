import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity,StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import { cameraWithTensors} from '@tensorflow/tfjs-react-native';

export default function PoseDetectionScreen() {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  
  const [model, setModel] = useState(null);
  const TensorCamera = cameraWithTensors<any>(Camera);
  useEffect(() => {
  
    (async () => {

      requestPermission()
    })();

    (async () => {
      await tf.ready();
      const model = poseDetection.SupportedModels.MoveNet;
       const detector = await poseDetection.createDetector(model );
      setModel(detector as any);
    })();
  }, []);


  const handlePoseDetection = async () => {
    if (model) {
     
      const image = tf.browser.fromPixels(await TensorCamera());
      const poses = await detector.estimatePoses(image);
    
      console.log(poses);
      image.dispose();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TensorCamera style={{ flex: 1 }}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handlePoseDetection}>
            <Text style={styles.text}>Detectar Pose</Text>
          </TouchableOpacity>
        </View>
      </TensorCamera>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});
