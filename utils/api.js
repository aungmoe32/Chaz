// generate from videosdk dashboard
export const token = process.env.EXPO_PUBLIC_VIDEOSDK_TOKEN;

// API call to create meeting
export const createMeeting = async ({ token }) => {
  const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
    method: "POST",
    headers: {
      authorization: `${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // region,
      webhook: {
        endPoint: "https://chaz-firebase.vercel.app/api/videosdk-hook",
        events: ["participant-joined", "participant-left"],
      },
    }),
  });
  const { roomId } = await res.json();
  console.log("room id", roomId);
  return roomId;
};
