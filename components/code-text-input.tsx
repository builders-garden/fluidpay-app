import { useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

type CodeTextInputProps = {
  code: `${number}` | "";
  setCode: (arg: `${number}` | "") => void;
  maxCodeLength: number;
  codeBoxHeight?: number;
  error?: boolean;
  hidden?: boolean;
};
const CodeTextInput = ({
  code,
  setCode,
  error,
  hidden,
  maxCodeLength,
  codeBoxHeight = 62,
}: CodeTextInputProps) => {
  const [inputFocused, setInputFocused] = useState(false);

  const textInputRef = useRef<TextInput>(null);

  const handleTextChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setCode(numericValue as `${number | ""}`);
  };

  const handleTextFocus = () => {
    setInputFocused(true);
    textInputRef.current?.focus();
  };

  return (
    <>
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
                  "flex-1 text-white bg-[#232324] flex items-center justify-center rounded-lg" +
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
                  className={`text-4xl text-center placeholder-white ${hiddenClass}`}
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
    </>
  );
};

export default CodeTextInput;
