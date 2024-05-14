import React from "react";
import { KeyboardAvoidingView, Keyboard, View, Pressable } from "react-native";

type ComponentType<P = {}> = React.ComponentType<P>;

type PropsWithChildren<P> = P & { children?: React.ReactNode };

const DismissKeyboardHOC = (
  Component: ComponentType<any>,
  withPadding = true
): React.FC<PropsWithChildren<any>> => {
  return ({ children, ...props }) => (
    <KeyboardAvoidingView className="w-full flex-1" behavior="padding">
      <Pressable
        onPress={Keyboard.dismiss}
        accessible={false}
        className={`flex-1 bg-absoluteWhite dark:bg-black ${withPadding ? "!pb-5" : ""}`}
      >
        <View className="flex-1">
          <Component {...props} />
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
};

export default DismissKeyboardHOC;
