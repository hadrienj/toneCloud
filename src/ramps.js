// ES6 module
// Ramp functions used to modulate sound amplitude

export function cosSquared({direction, min=0, max} = {}) {
  /*
    This function is used to calculate the sound envelop of the
    consine-squared on/off ramps of a sound.

    Input:
    - direction of the ramp and modify the phase used to calculate the
    y values.
    - The gain maximum.

    The cycle of the cosine-squared function is pi and half a cycle 3pi/2.
        - Phase of 0 corresponds to an ascending curve
        - Phase of (3*Math.PI)/2 corresponds to a descending curve

    The output is an typed array (float32) with the y values of a cosine-squared
    function.

    Note: to have a single direction curve, the portion of the function
    have to be equal to half a cycle (that is to say pi/2).
  */
  var duration = (Math.PI)/2;
  var valueCount = 100;
  // max is the upper born of the values.
  // It should be between 0 and 1.
  // Initialize the array containing the y values of the cos2 function
  // It need to be a Float32Array to be used in Web Audio API
  var waveArray = new Float32Array(valueCount);
  if (direction === 'ascending') {
    // The sampling rate is 0.01 and the portion of the function is pi/2
    for (var i = 0; i < valueCount; i++) {
      var percent = (i / valueCount) * duration;
      // To have the ascending portion of the curve the phase of the
      // cosine-squared function have to be 3pi/2.
      waveArray[i] = Math.pow(Math.cos(percent+(3*Math.PI)/2), 2)*max;
      if (i === valueCount - 1) {
        waveArray[i] = max;
      }
    }
  } else if (direction === 'descending') {
    // The sampling rate is 0.01 and the portion of the function is pi/2
    for (var i = 0; i < valueCount; i++) {
      var percent = (i / valueCount) * duration;
      // Without specifing the phase the squared cos function is a
      // descending curve
      waveArray[i] = Math.pow(Math.cos(percent), 2)*max;
      if (i === valueCount - 1) {
        waveArray[i] = 0;
      }
    }
  } else {
    // Throw error
    throw new Error("Error in cosSquaredRamp: provide a correct direction "
      + "parameter ('ascending' or 'descending'. Provided: '"
        + direction + "').");
  }
  var waveArrayFloat = new Float32Array(waveArray);
  return waveArrayFloat;
}

export function linear(fs, min, max) {
	// linear ramp function
	// direction change if min is greater than max

	// input:
	//   - min: first value of the output array
	//   - max: last value of the output array
	// output:
	//   - typed array of values (float32) from min to max
	var valNumber = 4096;
	var waveArray = new Float32Array(valNumber);

  // The sampling rate is 0.01 and the portion of the function is pi/2
  for (var i = 0; i < valNumber; i++) {
    // Without specifing the phase the squared cos function is a
    // descending curve
    waveArray[i] = ((max - min)/valNumber)*i + min;
    if (i === valNumber - 1) {
      waveArray[i] = max;
    }
  }
  var waveArrayFloat = new Float32Array(waveArray);
  // Return the array containing all the y values
  return waveArrayFloat;
}
