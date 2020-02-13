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
  itemHeight?: number;
  containerHeight?: number;
  containerStyle?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
}

const WheelPicker: React.FC<Props> = ({
  selected,
  options,
  onChange,
  selectedIndicatorStyle = {},
  containerHeight = 180,
  containerStyle = {},
  itemTextStyle = {},
  itemHeight = 60,
}) => {
  const [scrollY] = useState(new Animated.Value(0));
  const scrollViewRef = useRef<Animated.AnimatedComponent<ScrollView>>(null);
  const sortedOptions = options.sort((a, b) => b - a);
  const paddedOptions = [undefined, ...sortedOptions, undefined];
  const selectedIndex = paddedOptions.indexOf(selected);

  const scrollTo = (index: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.getNode().scrollTo({ y: (index - 1) * itemHeight });
    }
  };

  const currentScrollIndex = Animated.add(
    Animated.divide(scrollY, itemHeight),
    1,
  );
  const relativeScrollIndex = (index: number) =>
    Animated.subtract(index, currentScrollIndex);

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    let index = Math.floor(Math.floor(offsetY) / itemHeight);
    const last = Math.floor(offsetY % itemHeight);
    if (last > itemHeight / 2) index++;

    onChange(sortedOptions[index]);
  };

  const rotateX = (index: number) =>
    Animated.multiply(relativeScrollIndex(index), 0.8);

  const abs = (value: any) =>
    value.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: [1, 0, 1],
    });

  const textOpacity = (index: number) =>
    Animated.subtract(
      1,
      Animated.multiply(abs(relativeScrollIndex(index)), 0.75),
    );

  const AnyScrollView: any = Animated.ScrollView;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.selectedIndicator,
          selectedIndicatorStyle,
          {
            top: itemHeight,
            height: itemHeight,
          },
        ]}
      />
      <AnyScrollView
        style={[
          styles.scrollView,
          containerStyle,
          {
            height: containerHeight,
          },
        ]}
        scrollEventThrottle={1}
        onContentSizeChange={() => {
          scrollTo(selectedIndex);
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        snapToInterval={itemHeight}
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
                transform: [{ rotateX: rotateX(index) }],
                opacity: textOpacity(index),
              },
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
