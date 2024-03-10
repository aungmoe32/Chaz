export const getRoomId = (userId1, userId2) => {
  const sortedIds = [userId1, userId2].sort();
  const roomId = sortedIds.join("-");
  return roomId;
};

export const sendNotifications = (msgId, roomId) => {
  // console.log(msgId, roomId);
  fetch(
    `https://chaz-firebase.vercel.app/api/send?roomId=${roomId}&msgId=${msgId}`
  )
    .then((res) => res.json())
    .then((data) => {
      // console.log("sent ", data);
    })
    .catch((error) => {
      console.log("ee ", error);
    });
};

// export const sendCallNoti = (roomId) => {
//   fetch(`https://chaz-firebase.vercel.app/api/callnoti?roomId=${roomId}`)
//     .then((res) => res.json())
//     .then((data) => {
//       console.log("sent ", data);
//     })
//     .catch((error) => {
//       console.log("Call Noti", error);
//     });
// };
