# react-native-wheely

[![CircleCI](https://circleci.com/gh/erksch/react-native-wheely.svg?style=svg)](https://circleci.com/gh/erksch/react-native-wheely)
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
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <WheelPicker
      selectedIndex={selectedIndex}
      options={['Berlin', 'London', 'Amsterdam']}
      onChange={(index) => setSelectedIndex(index)}
    />
  );
}
```

## Props

| Name                     | Type                      | Description                                                                                                                                                                                                                                                                 |
| ------------------------ | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `options`                | `string[]`                | Options to be displayed in the wheel picker. Options are rendered from top to bottom, meaning the first item in the options will be at the top and the last at the bottom.                                                                                                  |
| `selectedIndex`          | `number`                  | Index of the currently selected option.                                                                                                                                                                                                                                     |
| `onChange`               | `(index: number) => void` | Handler that is called when the selected option changes.                                                                                                                                                                                                                    |
| `visibleRest`            | `number`                  | Amount of additional options that are visible in each direction. Default is 2, resulting in 5 visible options.                                                                                                                                                              |
| `itemHeight`             | `number`                  | Height of each option in the picker. Default is 40.                                                                                                                                                                                                                         |
| `itemStyle`              | `StyleProp<ViewStyle>`    | Style for the option's container.                                                                                                                                                                                                                                           |
| `itemTextStyle`          | `StyleProp<TextStyle>`    | Style for the option's text.                                                                                                                                                                                                                                                |
| `containerStyle`         | `StyleProp<ViewStyle>`    | Style of the picker.                                                                                                                                                                                                                                                        |
| `selectedIndicatorStyle` | `StyleProp<ViewStyle>`    | Style of overlaying selected-indicator in the middle of the picker.                                                                                                                                                                                                         |
| `rotationFunction`       | `(x: number) => number `  | Function to determine the x rotation of items based on their current distance to the center (which is x). Default is ![rotation equation](https://latex.codecogs.com/gif.latex?%5Csmall%20f%28x%29%20%3D%201%20-%20%5Cleft%20%28%201%5Cover2%20%5Cright%20%29%20%5E%7Bx%7D) |
| `scaleFunction`          | `(x: number) => number `  | Function to determine the scale of items based on their current distance to the center (which is x). Default is ![scale quation](<https://latex.codecogs.com/gif.image?%5Cinline%20%5Cdpi%7B110%7Df(x)%20=%201>)                                                            |
| `opacityFunction`        | `(x: number) => number`   | Function to determine the opacity of items based on their current distance to the center (which is x). Default is ![opacity equation](https://latex.codecogs.com/gif.latex?%5Csmall%20f%28x%29%20%3D%20%5Cleft%20%28%201%5Cover3%20%5Cright%20%29%20%5E%7Bx%7D)             |
| `decelerationRate`       | "normal", "fast", number  | How quickly the underlying scroll view decelerates after the user lifts their finger. See the [ScrollView docs](https://facebook.github.io/react-native/docs/scrollview.html#decelerationrate). Default is "fast".                                                          |
| `containerProps`         | `ViewProps`               | Props that are applied to the container which wraps the `FlatList` and the selected indicator.                                                                                                                                                                              |
| `flatListProps`          | `FlatListProps`           | Props that are applied to the `FlatList`.                                                                                                                                                                                                                                   |

## Memoization

The individual items in the picker (`<WheelPickerItem />`) are [strictly memoized](https://github.com/erksch/react-native-wheely/blob/master/src/WheelPickerItem.tsx#L109-L114), meaning that they will not rerender after the initial render. Rerendering the picker items uncontrollably would lead to bad performance with large number of options. Item styles, animation functions and other parameters of items therefore must be static and changes to them after the initial render will have no effect.
