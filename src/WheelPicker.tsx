import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  StyleProp,
  TextStyle,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
  ViewStyle,
  View,
  Text,
} from 'react-native';
import styles from './WheelPicker.styles';

interface Props {
  selectedIndex: number;
  options: any[];
  onChange: (index: number) => void;
  selectedIndicatorStyle?: StyleProp<ViewStyle>;
  itemTextStyle?: TextStyle;
  itemStyle?: ViewStyle;
  itemHeight?: number;
  containerStyle?: ViewStyle;
  rotationFunction?: (x: number) => number;
  opacityFunction?: (x: number) => number;
  visibleRest?: number;
  decelerationRate?: 'normal' | 'fast' | number;
  scrollEventThrottle?: number;
  maxToRenderPerBatch?: number;
  updateCellsBatchingPeriod?: number;
  initialNumToRender?: number;
  removeClippedSubviews?: boolean;
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
  scrollEventThrottle = 1,
  updateCellsBatchingPeriod = 50,
  maxToRenderPerBatch = 10,
  initialNumToRender = 10,
  removeClippedSubviews = false,
}) => {
  const [scrollY] = useState(new Animated.Value(0));
  const containerHeight = (1 + visibleRest * 2) * itemHeight;
  const paddedOptions = useMemo(() => {
    const array = [...options];
    for (let i = 0; i < visibleRest; i++) {
      array.unshift(undefined);
      array.push(undefined);
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
    onChange(index);
  };

  const relativeScrollIndex = useCallback(
    (index: number) => Animated.subtract(index, currentScrollIndex),
    [currentScrollIndex],
  );

  const rotateX = useCallback(
    (index: number) =>
      relativeScrollIndex(index).interpolate({
        inputRange: (() => {
          const range = [0];
          for (let i = 1; i <= visibleRest + 1; i++) {
            range.unshift(-i);
            range.push(i);
          }
          return range;
        })(),
        outputRange: (() => {
          const range = ['0deg'];
          for (let x = 1; x <= visibleRest + 1; x++) {
            const y = rotationFunction(x);
            range.unshift(`${y}deg`);
            range.push(`${y}deg`);
          }
          return range;
        })(),
      }),
    [relativeScrollIndex, rotationFunction, visibleRest],
  );

  const translateY = useCallback(
    (index: number) =>
      relativeScrollIndex(index).interpolate({
        inputRange: (() => {
          const range = [0];
          for (let i = 1; i <= visibleRest + 1; i++) {
            range.unshift(-i);
            range.push(i);
          }
          return range;
        })(),
        outputRange: (() => {
          const range = [0];
          for (let i = 1; i <= visibleRest + 1; i++) {
            let y =
              (itemHeight / 2) *
              (1 - Math.sin(Math.PI / 2 - rotationFunction(i)));
            for (let j = 1; j < i; j++) {
              y +=
                itemHeight * (1 - Math.sin(Math.PI / 2 - rotationFunction(j)));
            }
            range.unshift(y);
            range.push(-y);
          }
          return range;
        })(),
      }),
    [relativeScrollIndex, visibleRest, itemHeight, rotationFunction],
  );

  const opacity = useCallback(
    (index: number) =>
      relativeScrollIndex(index).interpolate({
        inputRange: (() => {
          const range = [0];
          for (let i = 1; i <= visibleRest + 1; i++) {
            range.unshift(-i);
            range.push(i);
          }
          return range;
        })(),
        outputRange: (() => {
          const range = [1];
          for (let x = 1; x <= visibleRest + 1; x++) {
            const y = opacityFunction(x);
            range.unshift(y);
            range.push(y);
          }
          return range;
        })(),
      }),
    [opacityFunction, relativeScrollIndex, visibleRest],
  );

  const renderItem = useCallback(
    ({ item: option, index }: any) => (
      <MemoizedWheelPickerItem
        key={`option-${index}`}
        option={option}
        style={[
          {
            height: itemHeight,
            transform: [
              { rotateX: rotateX(index) },
              { translateY: translateY(index) },
            ],
            opacity: opacity(index),
          },
          itemStyle,
        ]}
        textStyle={itemTextStyle}
      />
    ),
    [itemHeight, rotateX, translateY, opacity, itemStyle, itemTextStyle],
  );

  const getItemLayout = useCallback(
    (data: any, index: number) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index,
    }),
    [itemHeight],
  );

  const keyExtractor = useCallback(
    (item: any, index: number) => index.toString(),
    [],
  );

  return (
    <View
      style={[styles.container, { height: containerHeight }, containerStyle]}
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
      <Animated.FlatList
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={scrollEventThrottle}
        updateCellsBatchingPeriod={updateCellsBatchingPeriod}
        maxToRenderPerBatch={maxToRenderPerBatch}
        initialNumToRender={initialNumToRender}
        removeClippedSubviews={removeClippedSubviews}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        snapToOffsets={offsets}
        decelerationRate={decelerationRate}
        initialScrollIndex={selectedIndex}
        getItemLayout={getItemLayout}
        data={paddedOptions}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
    </View>
  );
};

interface ItemProps {
  style: any;
  textStyle: StyleProp<TextStyle>;
  option: string;
}

const WheelPickerItem: React.FC<ItemProps> = ({ style, textStyle, option }) => {
  return (
    <Animated.View style={[styles.option, style]}>
      <Text style={textStyle}>{option}</Text>
    </Animated.View>
  );
};

const MemoizedWheelPickerItem = memo(WheelPickerItem);

export default WheelPicker;
