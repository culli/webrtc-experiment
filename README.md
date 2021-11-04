# webrtc-experiment

webrtc experiment

currently not working in Firefox, but does work in Chrome

combines ideas from:

- https://dev.to/nilmadhabmondal/let-s-build-a-video-chat-app-with-javascript-and-webrtc-27l3 (https://github.com/webtutsplus/videoChat-WebFrontend)
- https://github.com/webrtc/samples/blob/gh-pages/src/content/devices/input-output/js/main.js

## To run (tested with node 16.10.0)

create an account on a TURN/STUN service, for example Xirsys:

- create static TURN credentials
- using the provided `iceservers` config, create `public/js/config.js` which looks like

```
turnConfig = {
  iceServers: [
    { urls: ["stun:ws-turn4.xirsys.com"] },
    {
      username:
        "",
      credential: "",
      urls: [
        "turn:ws-turn1.xirsys.com:80?transport=udp",
        ...
      ],
    },
  ],
};
```

node index.js
