<TouchableNativeFeedback
  onPress={handleLogin}
  background={TouchableNativeFeedback.Ripple("#AAF", false)}
>
  <View
    style={{
      backgroundColor: "#007bff",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginBottom: 15,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Text style={{ color: "#fff", fontSize: 18 }}>Sign In</Text>
  </View>
</TouchableNativeFeedback>;
