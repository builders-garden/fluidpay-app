import { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

type CodeTextInputProps = {
  code: `${number}` | "";
  setCode: (arg: `${number}` | "") => void;
  maxCodeLength: number;
  codeBoxHeight?: number;
  error?: boolean;
  errorCount?: number;
  hidden?: boolean;
};
const CodeTextInput = ({
  code,
  setCode,
  error,
  errorCount,
  hidden,
  maxCodeLength,
  codeBoxHeight = 62,
}: CodeTextInputProps) => {
  const [inputFocused, setInputFocused] = useState(false);

  const textInputRef = useRef<TextInput>(null);

  const offset = useSharedValue(0);
  const style = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });

  const OFFSET = 10;
  const TIME = 80;

  const animateError = () => {
    offset.value = withSequence(
      withTiming(-OFFSET, { duration: TIME / 2 }),
      withRepeat(withTiming(OFFSET, { duration: TIME / 2 }), 4, true),
      withTiming(0, { duration: TIME / 2 })
    );
  };

  useEffect(() => {
    if (!!errorCount) animateError();
  }, [errorCount]);

  const handleTextChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setCode(numericValue as `${number | ""}`);
  };

  const handleTextFocus = () => {
    setInputFocused(true);
    textInputRef.current?.focus();
  };

  return (
    <Animated.View style={style}>
      <Pressable
        onPress={handleTextFocus}
        className={`flex flex-row justify-center space-x-2.5`}
      >
        {Array(maxCodeLength)
          .fill(null)
          .map((_, index) => {
            const isCurrentDigit = index === code.length;
            const isLastDigit = index === code.length - 1;
            const isCodeFull = code.length === maxCodeLength;

            const isDigitFocused =
              isCurrentDigit || (isCodeFull && isLastDigit);
            const focused = inputFocused && isDigitFocused;
            const hiddenClass = hidden && "font-extrabold";
            return (
              <View
                key={index}
                className={
                  "flex-1 text-darkGrey dark:text-white bg-white dark:bg-[#232324] flex items-center justify-center rounded-lg" +
                  (error
                    ? " border-2 border-red-500"
                    : focused
                      ? " border-2 border-primary"
                      : "")
                }
                style={{
                  height: codeBoxHeight,
                }}
              >
                <Text
                  className={`text-4xl text-center placeholder-darkGrey dark:placeholder-white ${hiddenClass}`}
                >
                  {hidden ? (code[index] ? "*" : "") : code[index] || " "}
                </Text>
              </View>
            );
          })}
      </Pressable>

      <TextInput
        value={code}
        onChangeText={handleTextChange}
        onBlur={() => setInputFocused(false)}
        maxLength={maxCodeLength}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        ref={textInputRef}
        className="w-px h-px absolute opacity-0"
      />
    </Animated.View>
  );
};

export default CodeTextInput;
