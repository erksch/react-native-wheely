import React, { useRef, useState } from 'react';
import {
  StyleProp,
  TextStyle,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
  ViewStyle,
  ScrollView,
} from 'react-native';
import {
  Container,
  SelectedIndicator,
  StyledAnimatedScrollView,
  Option,
} from './WheelPicker.styled';

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

  return (
    <Container>
      <SelectedIndicator height={itemHeight} style={selectedIndicatorStyle} />
      <StyledAnimatedScrollView
        height={containerHeight}
        style={containerStyle}
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
          <Option
            height={itemHeight}
            style={{
              transform: [{ rotateX: rotateX(index) }],
              opacity: textOpacity(index),
            }}
            key={`option-${index}`}
          >
            <Animated.Text style={itemTextStyle}>{option}</Animated.Text>
          </Option>
        ))}
      </StyledAnimatedScrollView>
    </Container>
  );
};

export default WheelPicker;
