import styled from 'styled-components/native';
import { Animated } from 'react-native';

export const Container = styled.View`
  position: relative;
`;

export const SelectedIndicator = styled.View`
  position: absolute;
  top: ${(props: { height: number }) => props.height};
  height: ${(props: { height: number }) => props.height};
  width: 100%;
  background-color: hsl(200, 8%, 94%);
  border-radius: 5;
`;

export const StyledAnimatedScrollView: any = styled(Animated.ScrollView)`
  height: ${(props: { height: number }) => props.height};
  overflow: hidden;
`;

export const Option = styled(Animated.View)`
  align-items: center;
  justify-content: center;
  height: ${(props: { height: number }) => props.height};
  padding: 0 16;
  z-index: 100;
`;