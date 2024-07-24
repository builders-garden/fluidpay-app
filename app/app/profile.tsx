import { useMemo, useState } from "react";
import { router } from "expo-router";
import * as Clipboard from "expo-clipboard";
import * as ImagePicker from "expo-image-picker";
import { ArrowLeft, Check, Copy, Pen } from "lucide-react-native";
import { Image, Pressable, SafeAreaView, Text, View } from "react-native";
import { Appbar, TextInput } from "react-native-paper";
import { useLinkWithFarcaster, usePrivy } from "@privy-io/expo";
import Toast from "react-native-toast-message";
import { useUserStore } from "../../store";
import Avatar from "../../components/avatar";
import { shortenAddress } from "../../lib/utils";
import AppButton from "../../components/app-button";
import { updateMe, updateMyAvatar } from "../../lib/api";
import { DBUser } from "../../store/interfaces";
import { useColorScheme } from "nativewind";

const userProfile = () => {
  const { colorScheme } = useColorScheme();
  const { user: privyUser } = usePrivy();
  const { linkWithFarcaster } = useLinkWithFarcaster({
    onSuccess() {
      setIsLoading(false);
    },
    onError(error) {
      console.log("error", error);
      setIsLoading(false);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
      });
    },
  });
  const { user, setUser } = useUserStore((state) => state);
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<{
    displayName: string;
    username: string;
    avatar: string | null;
  }>({
    displayName: user?.displayName || "",
    username: user?.username || "",
    avatar: user?.avatarUrl || null,
  });

  const { displayName, username, avatar } = userDetails;

  type UserDetails = typeof userDetails;
  const handleChange = <T extends keyof UserDetails>(
    key: T,
    value: UserDetails[T]
  ) => {
    setUserDetails((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      handleChange("avatar", result.assets[0].uri);
    }
  };

  const details = useMemo(
    () =>
      getDetails(
        { ...userDetails, smartAccountAddress: user?.smartAccountAddress! },
        handleChange
      ),
    [userDetails]
  );

  const buttonDisabled = useMemo(() => {
    return (
      displayName === user?.displayName &&
      username === user?.username &&
      avatar === user?.avatarUrl
    );
  }, [avatar, displayName, username]);

  const farcasterAccount = useMemo(() => {
    const farcaster = privyUser?.linked_accounts?.find(
      (account) => account.type === "farcaster"
    );
    return farcaster?.type === "farcaster" ? farcaster : null;
  }, [privyUser]);

  const handleConnectFarcaster = async () => {
    try {
      setIsLoading(true);
      const newPrivyUser = await linkWithFarcaster({
        relyingParty: "https://plink.finance",
      });

      const farcasterUser = newPrivyUser.linked_accounts.find(
        (account) => account.type === "farcaster"
      );

      if (farcasterUser?.type === "farcaster") {
        await handleUpdateProfile({
          farcasterUsername: farcasterUser.username ?? "",
        });
      }
    } catch (error) {
      throw new Error();
    }
  };

  const handleUpdateProfile = async (
    data?:
      | { farcasterUsername: string }
      | { displayName: string; username: string }
  ) => {
    try {
      if (!data) {
        if (buttonDisabled) return;
        setIsLoading(true);

        data = {
          displayName,
          username,
        };
      }

      if (user?.token) {
        if (avatar && avatar !== user.avatarUrl) {
          await updateMyAvatar(user.token, avatar);
        }

        const res = await updateMe(user.token, data);
        setUser({ ...res, token: user.token } as DBUser);
        setIsLoading(false);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error updating profile", error);
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-absoluteWhite dark:bg-black h-full">
      <View className="flex-1 h-full">
        <Appbar.Header
          elevated={false}
          statusBarHeight={48}
          className="bg-transparent text-darkGrey dark:text-white"
        >
          <Appbar.Action
            icon={() => (
              <ArrowLeft
                size={24}
                color={colorScheme === "dark" ? "#FFF" : "#161618"}
              />
            )}
            onPress={() => {
              router.back();
            }}
            color={colorScheme === "dark" ? "#fff" : "#161618"}
            size={24}
            animated={false}
          />
          <Appbar.Content
            title=""
            color="#fff"
            titleStyle={{ fontWeight: "bold" }}
          />
        </Appbar.Header>

        <View className="flex-1 flex-col items-center px-4 bg-transparent">
          <Avatar
            name={user?.displayName?.charAt(0)?.toUpperCase() || ""}
            uri={avatar}
            size={90}
          />

          <Pressable onPress={pickImage}>
            <Text className="text-mutedGrey font-medium text-base mt-2.5 mb-3.5">
              Edit
            </Text>
          </Pressable>
          <View className="bg-white dark:bg-[#232324] p-5 rounded-2xl mb-6 space-y-6 w-full">
            {details.map((detail, index) => (
              <Detail
                key={detail.key}
                detailKey={detail.key}
                value={detail.value}
                editable={detail.editable}
                copiable={detail.copiable}
                handleTextChange={detail.handleTextChange}
                marginBottom={index === details.length - 1 ? 0 : 24}
              />
            ))}
          </View>
          {!!farcasterAccount ? (
            <View className="bg-[#855DCD4D] py-5 px-5 rounded-xl w-full">
              <View className="flex-row items-center justify-center space-x-3.5 mb-6">
                <Image
                  source={require("../../images/icons/farcaster.png")}
                  width={24}
                  height={24}
                />
                <Text className="text-[#855DCD] font-medium text-base">
                  Farcaster account
                </Text>
              </View>
              <View className="flex-row items-center space-x-6 mb-6">
                <Avatar
                  name={
                    farcasterAccount?.display_name?.charAt(0)?.toUpperCase() ||
                    ""
                  }
                  uri={farcasterAccount.profile_picture_url}
                  size={45}
                />

                <View className="mb-1">
                  <Text className="text-base text-darkGrey dark:text-white font-semibold">
                    {farcasterAccount.display_name}
                  </Text>
                  <Text className="text-base text-mutedGrey font-semibold">
                    @{farcasterAccount.username}
                  </Text>
                </View>
              </View>

              <AppButton
                onPress={() => {}}
                variant="farcaster"
                text="Disconnect Farcaster"
              />
            </View>
          ) : (
            <Pressable
              disabled={isLoading}
              onPress={handleConnectFarcaster}
              className={`bg-[#855DCD4D] py-5 px-10 rounded-xl flex-row items-center justify-center ${isLoading && "opacity-50"}`}
            >
              <Image
                source={require("../../images/icons/farcaster.png")}
                width={24}
                height={24}
                className="mr-3.5"
              />
              <Text className="text-[#855DCD] font-medium text-base">
                Connect your Farcaster account
              </Text>
            </Pressable>
          )}
        </View>
        <SafeAreaView>
          <View className="mt-auto px-4">
            <AppButton
              onPress={() => handleUpdateProfile()}
              text="Save"
              variant={buttonDisabled ? "disabled" : "primary"}
              disabled={buttonDisabled || isLoading}
              loading={isLoading}
            />
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
};

export default userProfile;

const Detail = ({
  detailKey,
  value,
  editable,
  copiable,
  marginBottom = 24,
  handleTextChange,
}: Omit<ReturnType<typeof getDetails>[number], "key"> & {
  detailKey: string;
  marginBottom?: number;
}) => {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value);

  return (
    <View
      className="flex-row justify-between items-center"
      style={{ marginBottom }}
    >
      <View>
        <Text className="text-mutedGrey text-base font-medium mb-2">
          {detailKey}
        </Text>
        {editing ? (
          <TextInput
            value={text}
            onChangeText={setText}
            autoFocus
            className="!p-0 h-6 text-primary font-medium !bg-transparent"
            textAlign="left"
            numberOfLines={1}
            style={{ paddingStart: 0, paddingEnd: 0, paddingHorizontal: 0 }}
            textColor="#FF238C"
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            cursorColor="#FF238C"
            selectionColor="#FF238C"
            theme={{ colors: { primary: "#FF238C" } }}
          />
        ) : (
          <Text className="text-primary text-base font-medium">{value}</Text>
        )}
      </View>
      {editable &&
        (editing ? (
          <Pressable
            onPress={() => {
              handleTextChange?.(text);
              setEditing(false);
            }}
          >
            <Check size={20} color={"#FF238C"} />
          </Pressable>
        ) : (
          <Pressable onPress={() => setEditing(true)}>
            <Pen size={20} color={"#FF238C"} />
          </Pressable>
        ))}

      {copiable && (
        <Pressable
          onPress={async () => {
            await Clipboard.setStringAsync(value);
            setCopied(true);
            setTimeout(() => {
              setCopied(false);
            }, 1500);
          }}
        >
          {copied ? (
            <Check size={20} color={"#FF238C"} />
          ) : (
            <Copy size={20} color={"#FF238C"} />
          )}
        </Pressable>
      )}
    </View>
  );
};

const getDetails = (
  user: {
    displayName: string;
    username: string;
    smartAccountAddress: string;
  },
  handleChange: (
    key: Exclude<keyof typeof user, "smartAccountAddress">,
    value: string
  ) => void
) => [
  {
    key: "Display Name",
    value: user?.displayName,
    editable: true,
    copiable: false,
    handleTextChange: (value: string) => handleChange("displayName", value),
  },
  {
    key: "Username",
    value: user?.username,
    editable: true,
    copiable: false,
    handleTextChange: (value: string) => handleChange("username", value),
  },
  {
    key: "Address",
    value: user?.smartAccountAddress!,
    editable: false,
    copiable: true,
  },
];
