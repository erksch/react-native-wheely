import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  StyleProp,
  TextStyle,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
  ViewStyle,
  View,
  ViewProps,
  FlatListProps,
  FlatList,
} from 'react-native';
import styles from './WheelPicker.styles';
import WheelPickerItem from './WheelPickerItem';

interface Props {
  selectedIndex: number;
  options: string[];
  onChange: (index: number) => void;
  selectedIndicatorStyle?: StyleProp<ViewStyle>;
  itemTextStyle?: TextStyle;
  itemStyle?: ViewStyle;
  itemHeight?: number;
  containerStyle?: ViewStyle;
  containerProps?: Omit<ViewProps, 'style'>;
  rotationFunction?: (x: number) => number;
  opacityFunction?: (x: number) => number;
  visibleRest?: number;
  decelerationRate?: 'normal' | 'fast' | number;
  flatListProps?: Omit<FlatListProps<string | null>, 'data' | 'renderItem'>;
}

const WheelPicker: React.FC<Props> = ({
  selectedIndex,
  options,
  onChange,
  selectedIndicatorStyle = {},
  containerStyle = {},
  itemStyle = {},
  itemTextStyle = {},
  itemHeight = 40,
  rotationFunction = (x: number) => 1 - Math.pow(1 / 2, x),
  opacityFunction = (x: number) => Math.pow(1 / 3, x),
  visibleRest = 2,
  decelerationRate = 'fast',
  containerProps = {},
  flatListProps = {},
}) => {
  const flatListRef = useRef<FlatList>(null);
  const [scrollY] = useState(new Animated.Value(0));

  const containerHeight = (1 + visibleRest * 2) * itemHeight;
  const paddedOptions = useMemo(() => {
    const array: (string | null)[] = [...options];
    for (let i = 0; i < visibleRest; i++) {
      array.unshift(null);
      array.push(null);
    }
    return array;
  }, [options, visibleRest]);

  const offsets = useMemo(
    () => [...Array(paddedOptions.length)].map((x, i) => i * itemHeight),
    [paddedOptions, itemHeight],
  );

  const currentScrollIndex = useMemo(
    () => Animated.add(Animated.divide(scrollY, itemHeight), visibleRest),
    [visibleRest, scrollY, itemHeight],
  );

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    let index = Math.floor(Math.floor(offsetY) / itemHeight);
    const last = Math.floor(offsetY % itemHeight);
    if (last > itemHeight / 2) index++;

    if (index !== selectedIndex) {
      onChange(index);
    }
  };

  /**
   * If selectedIndex is changed from outside (not via onChange) we need to scroll to the specified index.
   * This ensures that what the user sees as selected in the picker always corresponds to the value state.
   */
  useEffect(() => {
    flatListRef.current?.scrollToIndex({
      index: selectedIndex,
      animated: false,
    });
  }, [selectedIndex]);

  return (
    <View
      style={[styles.container, { height: containerHeight }, containerStyle]}
      {...containerProps}
    >
      <View
        style={[
          styles.selectedIndicator,
          selectedIndicatorStyle,
          {
            transform: [{ translateY: -itemHeight / 2 }],
            height: itemHeight,
          },
        ]}
      />
      <Animated.FlatList<string | null>
        {...flatListProps}
        ref={flatListRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        snapToOffsets={offsets}
        decelerationRate={decelerationRate}
        initialScrollIndex={selectedIndex}
        getItemLayout={(data, index) => ({
          length: itemHeight,
          offset: itemHeight * index,
          index,
        })}
        data={paddedOptions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item: option, index }) => (
          <WheelPickerItem
            key={`option-${index}`}
            index={index}
            option={option}
            style={itemStyle}
            textStyle={itemTextStyle}
            height={itemHeight}
            currentScrollIndex={currentScrollIndex}
            rotationFunction={rotationFunction}
            opacityFunction={opacityFunction}
            visibleRest={visibleRest}
          />
        )}
      />
    </View>
  );
};

export default WheelPicker;
