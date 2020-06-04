import React, { useRef, useState } from 'react';
import {
  StyleProp,
  TextStyle,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
  ViewStyle,
  ScrollView,
  View,
} from 'react-native';
import styles from './WheelPicker.styles';

interface Props {
  selected: any;
  options: any[];
  onChange: (selected: any) => void;
  selectedIndicatorStyle?: StyleProp<ViewStyle>;
  itemTextStyle?: Animated.WithAnimatedValue<StyleProp<TextStyle>>;
  itemStyle?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  itemHeight?: number;
  containerStyle?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  rotationFunction?: (x: number) => number;
  opacityFunction?: (x: number) => number;
  visibleRest?: number;
}

const WheelPicker: React.FC<Props> = ({
  selected,
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
}) => {
  const [scrollY] = useState(new Animated.Value(0));
  const scrollViewRef = useRef<Animated.AnimatedComponent<ScrollView>>(null);
  const sortedOptions = options.sort((a, b) => b - a);
  const paddedOptions = (() => {
    const array = [...sortedOptions];
    for (let i = 0; i < visibleRest; i++) {
      array.unshift(undefined);
      array.push(undefined);
    }
    return array;
  })();
  const selectedIndex = paddedOptions.indexOf(selected);

  const scrollTo = (index: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current
        .getNode()
        .scrollTo({ y: (index - visibleRest) * itemHeight });
    }
  };

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    let index = Math.floor(Math.floor(offsetY) / itemHeight);
    const last = Math.floor(offsetY % itemHeight);
    if (last > itemHeight / 2) index++;

    onChange(sortedOptions[index]);
  };

  const currentScrollIndex = Animated.add(
    Animated.divide(scrollY, itemHeight),
    visibleRest,
  );
  const relativeScrollIndex = (index: number) =>
    Animated.subtract(index, currentScrollIndex);

  const rotateX = (index: number) =>
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
        for (let x = 1; x <= visibleRest + 1; x++) {
          const y = rotationFunction(x);
          range.unshift(y);
          range.push(y);
        }
        return range;
      })(),
    });

  const translateY = (index: number) =>
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
            y += itemHeight * (1 - Math.sin(Math.PI / 2 - rotationFunction(j)));
          }
          range.unshift(y);
          range.push(-y);
        }
        return range;
      })(),
    });

  const opacity = (index: number) =>
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
    });

  const containerHeight = (1 + visibleRest * 2) * itemHeight;
  const AnyScrollView: any = Animated.ScrollView;

  return (
    <View
      style={[
        styles.container,
        {
          height: containerHeight,
        },
        containerStyle,
      ]}
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
      <AnyScrollView
        style={styles.scrollView}
        scrollEventThrottle={1}
        onContentSizeChange={() => {
          scrollTo(selectedIndex);
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        snapToOffsets={[...Array(paddedOptions.length)].map((x, i) => i * itemHeight)}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
      >
        {paddedOptions.map((option, index) => (
          <Animated.View
            style={[
              styles.option,
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
            key={`option-${index}`}
          >
            <Animated.Text style={itemTextStyle}>{option}</Animated.Text>
          </Animated.View>
        ))}
      </AnyScrollView>
    </View>
  );
};

export default WheelPicker;
