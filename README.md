# react-native-wheely

[![npm package](https://badge.fury.io/js/react-native-wheely.svg)](https://www.npmjs.com/package/react-native-wheely)
[![npm downloads](https://img.shields.io/npm/dm/react-native-wheely.svg)](https://www.npmjs.com/package/react-native-wheely)

An all JavaScript, highly customizable wheel picker for react native.

## Installation 

Install with npm

```
npm install --save react-native-wheely
```

Install with yarn

```
yarn add react-native-wheely
```

## Usage

```jsx
import React, { useState } from 'react';
import WheelPicker from 'react-native-wheely';

function CityPicker() {
  const [selected, setSelected] = useState('Berlin');
  
  return (
    <WheelPicker 
      options={['Berlin', 'London', 'Amsterdam']}
      selected={selected}
      onChange={(city) => setSelected(city)}
    />
  );
}
``` 

## Props

| Name        | Type                    | Description   |
|-------------|-------------------------|----------------------------------|
|options  | any[]  | Options to be displayed be the wheel picker. |
|selected    | any  | Currently selected option. |
|onChange     | (selected: any) => void           | Handler that is called when the selected option changes. |
|itemHeight        | number                  | Height of each option in the picker. |
|itemStyle | StyleProp\<ViewStyle\>         | Style for the option's container. |
|itemTextStyle| StyleProp\<TextStyle\>    | Style for the option's text. |
|containerHeight| number | Height of the whole picker. |
|containerStyle| StyleProp\<ViewStyle\> | Style of the picker. |
|decelerationRate| "normal", "fast", number | How quickly the underlying scroll view decelerates after the user lifts their finger. See the [ScrollView docs](https://facebook.github.io/react-native/docs/scrollview.html#decelerationrate). Default is "fast". |